#!/usr/bin/env bash
# ==============================================================================
# AgroPlant Full-Stack Automated Production Deployment Script
# Supports: Ubuntu 20.04 / 22.04 / 24.04 LTS VPS
# ==============================================================================

set -e

echo "🚀 [AgroPlant] Starting automated deployment..."

# 1. Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing Docker & Docker Compose..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "✅ Docker successfully installed."
fi

# 2. Pull latest code from repositories
echo "📥 [1/4] Pulling latest updates from Git..."
if [ -d "../AgroPlant-React" ]; then
    echo "Pulling frontend (AgroPlant-React)..."
    (cd ../AgroPlant-React && git pull origin modification)
fi

echo "Pulling backend (AgroPlant)..."
git pull origin develop

# 3. Check environment file
if [ ! -f ".env" ]; then
    echo "⚠️ Warning: .env file missing in AgroPlant. Creating production template..."
    cat <<EOT >> .env
PORT=3006
NODE_ENV=production
MONGO_URL=mongodb+srv://user:pass@cluster0.quqkbut.mongodb.net/AgroPlant?retryWrites=true&w=majority
SESSION_SECRET=agroplant_super_secure_session_key_2026
EOT
    echo "Please verify credentials inside .env before proceeding."
fi

# 4. Build and run containers
echo "🐳 [2/4] Building and launching Docker containers..."
docker compose down || true
docker compose build --no-cache
docker compose up -d

# 5. Clean unused images
echo "🧹 [3/4] Cleaning dangling images to save VPS storage..."
docker image prune -f

# 6. Health verification
echo "🩺 [4/4] Verifying health status..."
sleep 5
docker compose ps

echo "🎉 [AgroPlant] Deployment completed successfully!"
echo "🌐 Frontend running at: http://<YOUR_VPS_IP>/"
echo "⚙️ Backend API running at: http://<YOUR_VPS_IP>:3006/"
