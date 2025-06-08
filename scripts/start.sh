#!/bin/bash

# AXIVAI Platform Startup Script

echo "🚀 Starting AXIVAI Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please update .env with your API keys and configuration."
fi

# Create necessary directories
mkdir -p data/postgres data/redis

# Pull latest images
echo "📦 Pulling Docker images..."
docker-compose pull

# Start services
echo "🔧 Starting services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker-compose exec postgres pg_isready -U axivai_user -d axivai; do
    sleep 2
done

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec backend python database.py

# Start all services
echo "🌟 Starting all services..."
docker-compose up -d

# Wait for services to be healthy
sleep 10

echo "✅ AXIVAI Platform is now running!"
echo ""
echo "📋 Services:"
echo "   🌐 Frontend:  http://localhost:3000"
echo "   🔧 Backend:   http://localhost:8000"
echo "   📊 Docs:      http://localhost:8000/docs"
echo ""
echo "🔑 Demo credentials:"
echo "   Email:    test@example.com"
echo "   Password: testpassword"
echo ""
echo "📖 View logs with: docker-compose logs -f"
echo "🛑 Stop with:      docker-compose down"