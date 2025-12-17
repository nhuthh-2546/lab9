#!/bin/bash
set -e

# =============================================================================
# Application Start Hook
# Start the new application version
# =============================================================================

echo "=========================================="
echo "CodeDeploy: Application Start"
echo "=========================================="

# Get image URI
if [ -f "/app/current/imagedefinitions.json" ]; then
    IMAGE_URI=$(cat /app/current/imagedefinitions.json | jq -r '.[0].imageUri')
else
    # Fallback
    IMAGE_URI="caro-game-api:latest"
fi

echo "Starting application with image: $IMAGE_URI"

# Run database migrations
echo "Running database migrations..."
docker run --rm \
    --env-file /app/.env \
    --network host \
    $IMAGE_URI \
    rails db:migrate 2>&1 || {
        echo "Warning: Migration failed or no migrations to run"
    }

# Stop any existing container
docker stop caro-game-api 2>/dev/null || true
docker rm caro-game-api 2>/dev/null || true

# Start the application
echo "Starting Docker container..."
docker run -d \
    --name caro-game-api \
    --restart unless-stopped \
    --env-file /app/.env \
    --network host \
    -v /app/log:/app/log \
    --health-cmd="curl -f http://localhost:3000/health || exit 1" \
    --health-interval=30s \
    --health-timeout=10s \
    --health-retries=3 \
    --health-start-period=60s \
    $IMAGE_URI

# Wait for container to be healthy
echo "Waiting for application to be healthy..."
TIMEOUT=120
ELAPSED=0

while [ $ELAPSED -lt $TIMEOUT ]; do
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' caro-game-api 2>/dev/null || echo "starting")
    
    if [ "$HEALTH" == "healthy" ]; then
        echo "Application is healthy!"
        break
    fi
    
    echo "Health status: $HEALTH (waiting...)"
    sleep 5
    ELAPSED=$((ELAPSED + 5))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "Warning: Health check timeout, but continuing..."
fi

# Show container status
docker ps -a --filter name=caro-game-api

echo "Application start completed"
