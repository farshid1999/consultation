#!/bin/bash

set -e

PROJECT_ROOT="/var/www/consultation"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

BACKEND_VENV="$BACKEND_DIR/.venv"

GUNICORN_SERVICE="serenity-gunicorn"
CELERY_SERVICE="serenity-celery"
CELERYBEAT_SERVICE="serenity-celerybeat"
PM2_APP="serenity-next"

echo "========================================"
echo " Starting deployment"
echo "========================================"


# --------------------------------------------------
# 1. Git
# --------------------------------------------------

echo ""
echo ">>> [1/8] Updating source code..."

cd "$PROJECT_ROOT"

git fetch origin main
git reset --hard origin/main

echo "    Git updated successfully."


# --------------------------------------------------
# 2. Backend dependencies
# --------------------------------------------------

echo ""
echo ">>> [2/8] Updating backend dependencies..."

cd "$BACKEND_DIR"

if [ ! -f "$BACKEND_VENV/bin/activate" ]; then
    echo "ERROR: Backend virtualenv not found:"
    echo "$BACKEND_VENV"
    exit 1
fi

source "$BACKEND_VENV/bin/activate"

python --version

pip install -r req.txt --quiet

echo "    Backend dependencies updated."


# --------------------------------------------------
# 3. Database migrations
# --------------------------------------------------

echo ""
echo ">>> [3/8] Running migrations..."

python manage.py migrate --noinput

echo "    Migrations completed."


# --------------------------------------------------
# 4. Static files
# --------------------------------------------------

echo ""
echo ">>> [4/8] Collecting static files..."

python manage.py collectstatic --noinput

deactivate

echo "    Static files collected."


# --------------------------------------------------
# 5. Gunicorn
# --------------------------------------------------

echo ""
echo ">>> [5/8] Restarting Gunicorn..."

sudo systemctl restart "$GUNICORN_SERVICE"

sudo systemctl is-active --quiet "$GUNICORN_SERVICE"

echo "    Gunicorn restarted."


# --------------------------------------------------
# 6. Celery
# --------------------------------------------------

echo ""
echo ">>> [6/8] Restarting Celery services..."

sudo systemctl restart "$CELERY_SERVICE"
sudo systemctl restart "$CELERYBEAT_SERVICE"

sudo systemctl is-active --quiet "$CELERY_SERVICE"
sudo systemctl is-active --quiet "$CELERYBEAT_SERVICE"

echo "    Celery services restarted."


# --------------------------------------------------
# 7. Frontend
# --------------------------------------------------

echo ""
echo ">>> [7/8] Building frontend..."

cd "$FRONTEND_DIR"

npm ci

NODE_OPTIONS="--max-old-space-size=700" npm run build

echo "    Frontend build completed."


# --------------------------------------------------
# 8. PM2 + Nginx
# --------------------------------------------------

echo ""
echo ">>> [8/8] Restarting frontend and Nginx..."

if pm2 describe "$PM2_APP" > /dev/null 2>&1; then

    pm2 restart "$PM2_APP"

else

    echo "ERROR: PM2 application '$PM2_APP' not found."

    echo "Current PM2 applications:"
    pm2 list

    exit 1

fi

pm2 save

sudo nginx -t

sudo systemctl reload nginx

echo "    Frontend and Nginx restarted."


# --------------------------------------------------
# Health checks
# --------------------------------------------------

echo ""
echo ">>> Running health checks..."

echo ""
echo "Website:"
curl -fsSI --max-time 10 \
    https://serenityambassadors.org \
    | head -1

echo ""
echo "API:"
curl -fsSI --max-time 10 \
    https://api.serenityambassadors.org/admin/ \
    | head -1


# --------------------------------------------------
# Final status
# --------------------------------------------------

echo ""
echo "========================================"
echo " DEPLOY FINISHED SUCCESSFULLY"
echo "========================================"

echo ""
echo "Current commit:"
cd "$PROJECT_ROOT"
git log -1 --oneline

echo ""
echo "Services:"

echo -n "Gunicorn: "
sudo systemctl is-active "$GUNICORN_SERVICE"

echo -n "Celery: "
sudo systemctl is-active "$CELERY_SERVICE"

echo -n "Celery Beat: "
sudo systemctl is-active "$CELERYBEAT_SERVICE"

echo ""
echo "PM2:"
pm2 status "$PM2_APP"