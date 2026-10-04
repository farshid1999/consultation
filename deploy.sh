#!/bin/bash
set -e

PROJECT_ROOT="/var/www/consultation"

echo ">>> [1/8] Pulling latest code..."
cd "$PROJECT_ROOT"
git pull origin main

echo ">>> [2/8] Updating backend dependencies..."
cd "$PROJECT_ROOT/backend"
source venv/bin/activate
pip install -r req.txt --quiet

echo ">>> [3/8] Running migrations..."
python manage.py migrate --noinput

echo ">>> [4/8] Collecting static files..."
python manage.py collectstatic --noinput
deactivate

echo ">>> [5/8] Restarting backend services (gunicorn only for now)..."
sudo systemctl restart gunicorn

echo ">>> [6/8] Freeing RAM: stopping celery/celerybeat temporarily..."
sudo systemctl stop celery celerybeat

cd "$PROJECT_ROOT/frontend"

if git diff --name-only HEAD@{1} HEAD 2>/dev/null | grep -q "frontend/package.json\|frontend/package-lock.json"; then
    echo "    package.json changed -> running npm install..."
    npm install
else
    echo "    package.json unchanged -> skipping npm install"
fi

echo ">>> [7/8] Building frontend (using .next/cache if available)..."
NODE_OPTIONS="--max-old-space-size=700" npm run build

echo ">>> Restoring celery/celerybeat..."
sudo systemctl start celery celerybeat

echo ">>> [8/8] Restarting frontend (PM2)..."
if pm2 describe serenity-frontend > /dev/null 2>&1; then
    pm2 restart serenity-frontend
else
    echo "    serenity-frontend not found in PM2 list, starting fresh..."
    pm2 start npm --name serenity-frontend -- start
fi
pm2 save

sudo nginx -t && sudo systemctl reload nginx

echo ">>> Deploy finished successfully!"
curl -sI http://serenityambassadors.org | head -1
curl -sI http://api.serenityambassadors.org/admin/ | head -1