#!/bin/bash
# Usage:
#   ./deploy.sh           -> full deploy (git, frontend build, backend, restart, status)
#   ./deploy.sh front     -> frontend only (build + pm2 restart)
#   ./deploy.sh back      -> backend only (git + migrate + restart)
#   ./deploy.sh restart   -> restart everything without building
#   ./deploy.sh status    -> show status only (safe, changes nothing)

set -euo pipefail

PROJECT_ROOT="/var/www/consultation"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_VENV="$BACKEND_DIR/.venv"

GUNICORN_SERVICE="serenity-gunicorn"
CELERY_SERVICE="serenity-celery"
CELERYBEAT_SERVICE="serenity-celerybeat"
PM2_APP="serenity-next"
DOMAIN="serenityambassadors.org"

SUDO=""; [ "$(id -u)" -ne 0 ] && SUDO="sudo"

svc_exists() {
    systemctl list-unit-files --type=service --no-legend | awk '{print $1}' | grep -qx "$1.service"
}

# ---------------------------------------------------------
git_update() {
    echo ">>> Updating source code (git)..."
    cd "$PROJECT_ROOT"
    if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
        echo "!!! Uncommitted changes found; refusing to run 'git reset --hard':"
        git status --short --untracked-files=no
        echo "Commit/push them first, or run with FORCE_RESET=1 to discard them."
        [ "${FORCE_RESET:-0}" = "1" ] || exit 1
    fi
    git fetch origin main
    git reset --hard origin/main
}

back_update() {
    echo ">>> Backend: dependencies, migrations, static files..."
    cd "$BACKEND_DIR"
    [ -f "$BACKEND_VENV/bin/activate" ] || { echo "ERROR: virtualenv not found: $BACKEND_VENV"; exit 1; }
    source "$BACKEND_VENV/bin/activate"
    pip install -r req.txt --quiet
    python manage.py migrate --noinput
    python manage.py collectstatic --noinput
    deactivate
}

restart_back() {
    echo ">>> Restarting backend services..."
    for s in "$GUNICORN_SERVICE" "$CELERY_SERVICE" "$CELERYBEAT_SERVICE"; do
        if svc_exists "$s"; then
            $SUDO systemctl restart "$s"
        else
            echo "    (skipped: $s does not exist)"
        fi
    done
}

build_front() {
    echo ">>> Building frontend..."
    cd "$FRONTEND_DIR"
    # Run npm ci only if node_modules is missing or package-lock.json is newer
    if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
        npm ci
    fi
    rm -rf .next.bak
    [ -d .next ] && cp -a .next .next.bak
    if NODE_OPTIONS="--max-old-space-size=2048" npm run build; then
        rm -rf .next.bak
        echo "    Build OK"
    else
        echo "!!! Build FAILED. Restoring the previous build; PM2 will NOT be restarted."
        rm -rf .next
        [ -d .next.bak ] && mv .next.bak .next
        return 1
    fi
}

restart_front() {
    echo ">>> Restarting PM2 app..."
    if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
        pm2 restart "$PM2_APP" --update-env
    else
        echo "ERROR: PM2 app '$PM2_APP' not found. Current apps:"
        pm2 list
        exit 1
    fi
    pm2 save >/dev/null
}

reload_nginx() {
    echo ">>> Testing and reloading Nginx..."
    $SUDO nginx -t && $SUDO systemctl reload nginx
}

# Prints only the HTTP status code (000 means no response)
code() { curl -sk -m 10 -o /dev/null -w '%{http_code}' "$@" || true; }

status() {
    echo; echo "=============== SERVICES ==============="
    for s in nginx postgresql redis-server "$GUNICORN_SERVICE" "$CELERY_SERVICE" "$CELERYBEAT_SERVICE"; do
        if svc_exists "$s"; then
            printf "%-24s %s\n" "$s" "$(systemctl is-active "$s" || true)"
        fi
    done

    echo; echo "=============== PM2 ==============="
    pm2 ls

    echo; echo "=============== LISTENING PORTS ==============="
    ss -tlnp | grep -E ':80 |:443 |:3001|:8001|:5432|:6379' | awk '{print $4}' | sort -u | tr '\n' ' ' || true
    echo

    echo; echo "=============== HTTP CHECKS ==============="
    printf "next   127.0.0.1:3001  : %s\n" "$(code http://127.0.0.1:3001/)"
    printf "django 127.0.0.1:8001  : %s\n" "$(code -H "Host: $DOMAIN" -H 'X-Forwarded-Proto: https' http://127.0.0.1:8001/api/)"
    printf "nginx  /      (local)  : %s\n" "$(code --resolve $DOMAIN:443:127.0.0.1 https://$DOMAIN/)"
    printf "nginx  /api/  (local)  : %s\n" "$(code --resolve $DOMAIN:443:127.0.0.1 https://$DOMAIN/api/)"
    printf "public /               : %s\n" "$(code https://$DOMAIN/)"
    printf "public /api/           : %s\n" "$(code https://$DOMAIN/api/)"

    echo; echo "=============== RECENT ERRORS ==============="
    journalctl -u "$GUNICORN_SERVICE" -n 3 --no-pager 2>/dev/null || true
    pm2 logs "$PM2_APP" --lines 3 --nostream --err 2>/dev/null | tail -5 || true

    echo
    cd "$PROJECT_ROOT" && echo "Current commit: $(git log -1 --oneline)"
}

case "${1:-all}" in
    all)
        git_update
        build_front        # build first: if it fails, nothing gets restarted
        back_update
        restart_back
        restart_front
        reload_nginx
        status
        echo; echo "=============== DEPLOY FINISHED ===============" ;;
    front)   build_front && restart_front; status ;;
    back)    git_update; back_update; restart_back; status ;;
    restart) restart_back; restart_front; reload_nginx; status ;;
    status)  status ;;
    *) echo "Usage: $0 {all|front|back|restart|status}"; exit 1 ;;
esac

