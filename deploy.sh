#!/bin/bash

# Crowdbank Deployment Script
# Run this on your VPS after cloning the repository

set -e

echo "🚀 Starting Crowdbank deployment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.production to .env and update the values:"
    echo "  cp .env.production .env"
    echo "  nano .env"
    exit 1
fi

# Create ssl directory if it doesn't exist
mkdir -p nginx/ssl

# Build and start containers
echo "📦 Building Docker containers..."
docker compose build

echo "🚀 Starting services..."
docker compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
echo "🔄 Running migrations..."
docker compose exec -T backend python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
docker compose exec -T backend python manage.py collectstatic --noinput

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Create a superuser: docker compose exec backend python manage.py createsuperuser"
echo "  2. Check logs: docker compose logs -f"
echo "  3. Access your app at: http://YOUR_SERVER_IP"
echo ""
