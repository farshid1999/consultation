#!/bin/bash
#
# Usage:
#   ./deploy.sh           -> full deploy
#   ./deploy.sh front     -> frontend build + PM2 restart
#   ./deploy.sh back      -> git update + backend update + restart
#   ./deploy.sh restart   -> restart services without building
#   ./deploy.sh status    -> show status only
#

set -Eeuo pipefail

PROJECT_ROOT="/var/www/consultation"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_VENV="$BACKEND_DIR/.venv"

GUNICORN_SERVICE="serenity-gunicorn"
CELERY_SERVICE="serenity-celery"
CELERYBEAT_SERVICE="serenity-celerybeat"

PM2_APP="serenity-next"
DOMAIN="serenityambassadors.org"

SUDO=()
if [[ "$(id -u)" -ne 0 ]]; then
    SUDO=(sudo)
fi

# ---------------------------------------------------------
# Check whether a systemd service unit exists.
# Accepts both "service-name" and "service-name.service".
# ---------------------------------------------------------
svc_exists() {
    local service="$1"

    [[ "$service" == *.service ]] || service="${service}.service"

    local load_state
    load_state="$("${SUDO[@]}" systemctl show "$service" \
        --property=LoadState \
        --value 2>/dev/null || true)"

    [[ "$load_state" == "loaded" ]]
}

# ---------------------------------------------------------
# Update source code
# ---------------------------------------------------------
git_update() {
    echo ">>> Updating source code (git)..."

    cd "$PROJECT_ROOT"

    if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
        echo "ERROR: Uncommitted tracked changes found."
        git status --short --untracked-files=no
        echo "Commit/push changes first, or use FORCE_RESET=1 to discard them."

        if [[ "${FORCE_RESET:-0}" != "1" ]]; then
            return 1
        fi
    fi

    git fetch origin main
    git reset --hard origin/main

    echo "    Source updated to:"
    git log -1 --oneline
}

# ---------------------------------------------------------
# Backend dependencies, migrations and static files
# ---------------------------------------------------------
back_update() {
    echo ">>> Backend: dependencies, migrations, static files..."

    cd "$BACKEND_DIR"

    if [[ ! -f "$BACKEND_VENV/bin/activate" ]]; then
        echo "ERROR: Virtualenv not found: $BACKEND_VENV"
        return 1
    fi

    # Run backend commands inside the project virtualenv.
    source "$BACKEND_VENV/bin/activate"

    if ! pip install -r req.txt --quiet; then
        echo "ERROR: pip install failed."
        deactivate || true
        return 1
    fi

    if ! python manage.py migrate --noinput; then
        echo "ERROR: Django migrations failed."
        deactivate || true
        return 1
    fi

    if ! python manage.py collectstatic --noinput; then
        echo "ERROR: collectstatic failed."
        deactivate || true
        return 1
    fi

    deactivate
    echo "    Backend update completed."
}

# ---------------------------------------------------------
# Restart and verify backend services
# ---------------------------------------------------------
restart_back() {
    echo ">>> Restarting backend services..."

    local service

    for service in \
        "$GUNICORN_SERVICE" \
        "$CELERY_SERVICE" \
        "$CELERYBEAT_SERVICE"; do

        if ! svc_exists "$service"; then
            echo "ERROR: systemd service not found: $service"
            return 1
        fi

        echo "    Restarting $service..."

        if ! "${SUDO[@]}" systemctl restart "$service"; then
            echo "ERROR: Failed to restart $service"
            "${SUDO[@]}" systemctl status "$service" --no-pager || true
            return 1
        fi

        if ! "${SUDO[@]}" systemctl is-active --quiet "$service"; then
            echo "ERROR: $service is not active after restart."
            "${SUDO[@]}" systemctl status "$service" --no-pager || true
            return 1
        fi

        echo "    $service is active."
    done
}

# ---------------------------------------------------------
# Build Next.js frontend
# ---------------------------------------------------------
build_front() {
    echo ">>> Building frontend..."

    cd "$FRONTEND_DIR"

    if [[ ! -f package.json ]]; then
        echo "ERROR: package.json not found in $FRONTEND_DIR"
        return 1
    fi

    if [[ ! -d node_modules ]] ||
       [[ package-lock.json -nt node_modules ]]; then
        echo "    Installing frontend dependencies..."
        npm ci
    fi

    rm -rf .next.bak

    if [[ -d .next ]]; then
        cp -a .next .next.bak
    fi

    if NODE_OPTIONS="--max-old-space-size=2048" npm run build; then
        rm -rf .next.bak
        echo "    Build OK"
    else
        echo "ERROR: Frontend build failed."
        echo "Restoring the previous build; PM2 will not be restarted."

        rm -rf .next

        if [[ -d .next.bak ]]; then
            mv .next.bak .next
        fi

        return 1
    fi
}

# ---------------------------------------------------------
# Restart PM2 frontend
# ---------------------------------------------------------
restart_front() {
    echo ">>> Restarting PM2 app..."

    if ! command -v pm2 >/dev/null 2>&1; then
        echo "ERROR: pm2 command not found."
        return 1
    fi

    if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
        pm2 restart "$PM2_APP" --update-env
    else
        echo "ERROR: PM2 app '$PM2_APP' not found."
        pm2 list
        return 1
    fi

    pm2 save >/dev/null
    echo "    PM2 restart completed."
}

# ---------------------------------------------------------
# Test and reload Nginx
# ---------------------------------------------------------
reload_nginx() {
    echo ">>> Testing and reloading Nginx..."

    "${SUDO[@]}" nginx -t
    "${SUDO[@]}" systemctl reload nginx

    echo "    Nginx reloaded."
}

# ---------------------------------------------------------
# HTTP status helper: 000 means no response
# ---------------------------------------------------------
code() {
    curl -sk -m 10 -o /dev/null -w '%{http_code}' "$@" || true
}

# ---------------------------------------------------------
# Show application status
# ---------------------------------------------------------
status() {
    echo
    echo "=============== SERVICES ==============="

    local service
    local state

    for service in \
        nginx \
        postgresql \
        redis-server \
        "$GUNICORN_SERVICE" \
        "$CELERY_SERVICE" \
        "$CELERYBEAT_SERVICE"; do

        if svc_exists "$service"; then
            state="$("${SUDO[@]}" systemctl is-active "$service" 2>/dev/null || true)"
            printf "%-28s %s\n" "$service" "${state:-unknown}"
        else
            printf "%-28s %s\n" "$service" "NOT FOUND"
        fi
    done

    echo
    echo "=============== PM2 ==============="

    if command -v pm2 >/dev/null 2>&1; then
        pm2 ls
    else
        echo "pm2 command not found."
    fi

    echo
    echo "=============== LISTENING PORTS ==============="

    ss -tlnp 2>/dev/null |
        grep -E ':80 |:443 |:3001|:8001|:5432|:6379' |
        awk '{print $4}' |
        sort -u |
        tr '\n' ' ' || true

    echo

    echo
    echo "=============== HTTP CHECKS ==============="

    printf "Next   127.0.0.1:3001  : %s\n" \
        "$(code http://127.0.0.1:3001/)"

    printf "Django 127.0.0.1:8001  : %s\n" \
        "$(code -H "Host: $DOMAIN" \
            -H 'X-Forwarded-Proto: https' \
            http://127.0.0.1:8001/api/)"

    printf "Nginx  /      (local)  : %s\n" \
        "$(code --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/")"

    printf "Nginx  /api/  (local)  : %s\n" \
        "$(code --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/api/")"

    printf "Public /               : %s\n" \
        "$(code "https://$DOMAIN/")"

    printf "Public /api/           : %s\n" \
        "$(code "https://$DOMAIN/api/")"

    echo
    echo "=============== RECENT ERRORS ==============="

    "${SUDO[@]}" journalctl \
        -u "$GUNICORN_SERVICE" \
        -n 5 --no-pager 2>/dev/null || true

    if command -v pm2 >/dev/null 2>&1; then
        pm2 logs "$PM2_APP" --lines 5 --nostream --err 2>/dev/null |
            tail -10 || true
    fi

    echo
    cd "$PROJECT_ROOT"
    echo "Current commit: $(git log -1 --oneline)"
}

# ---------------------------------------------------------
# Main
# ---------------------------------------------------------
case "${1:-all}" in
    all)
        git_update
        build_front
        back_update
        restart_back
        restart_front
        reload_nginx
        status
        echo
        echo "=============== DEPLOY FINISHED ==============="
        ;;

    front)
        build_front
        restart_front
        status
        ;;

    back)
        git_update
        back_update
        restart_back
        status
        ;;

    restart)
        restart_back
        restart_front
        reload_nginx
        status
        ;;

    status)
        status
        ;;

    *)
        echo "Usage: $0 {all|front|back|restart|status}"
        exit 1
        ;;
esac
