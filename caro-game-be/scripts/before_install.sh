#!/bin/bash
set -e

# =============================================================================
# Before Install Hook
# Stop existing application and clean up
# =============================================================================

echo "=========================================="
echo "CodeDeploy: Before Install"
echo "=========================================="

# Stop existing Docker container if running
echo "Stopping existing application..."
docker stop caro-game-api 2>/dev/null || true
docker rm caro-game-api 2>/dev/null || true

# Clean up old deployment artifacts
echo "Cleaning up old deployments..."
rm -rf /app/previous 2>/dev/null || true

# Backup current deployment
if [ -d "/app/current" ]; then
    echo "Backing up current deployment..."
    mv /app/current /app/previous
fi

# Clean up unused Docker images (keep last 3)
echo "Cleaning up old Docker images..."
docker image prune -af --filter "until=168h" 2>/dev/null || true

echo "Before install completed successfully"
