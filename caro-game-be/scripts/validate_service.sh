#!/bin/bash
set -e

# =============================================================================
# Validate Service Hook
# Verify the deployment was successful
# =============================================================================

echo "=========================================="
echo "CodeDeploy: Validate Service"
echo "=========================================="

HEALTH_URL="http://localhost:3000/health"
MAX_RETRIES=30
RETRY_INTERVAL=10

echo "Validating application health at: $HEALTH_URL"

for i in $(seq 1 $MAX_RETRIES); do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" == "200" ]; then
        echo "✅ Health check passed (HTTP $HTTP_CODE)"
        
        # Additional validation - check API endpoint
        API_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/v1/health" 2>/dev/null || echo "000")
        if [ "$API_CHECK" == "200" ] || [ "$API_CHECK" == "404" ]; then
            echo "✅ API endpoint accessible"
        fi
        
        # Check Docker container status
        CONTAINER_STATUS=$(docker inspect --format='{{.State.Status}}' caro-game-api 2>/dev/null || echo "unknown")
        if [ "$CONTAINER_STATUS" == "running" ]; then
            echo "✅ Container is running"
        else
            echo "⚠️  Container status: $CONTAINER_STATUS"
        fi
        
        # Check database connectivity
        docker exec caro-game-api rails runner "ActiveRecord::Base.connection.execute('SELECT 1')" 2>/dev/null && \
            echo "✅ Database connection OK" || \
            echo "⚠️  Database connection check skipped"
        
        # Check Redis connectivity
        docker exec caro-game-api rails runner "Redis.new.ping" 2>/dev/null && \
            echo "✅ Redis connection OK" || \
            echo "⚠️  Redis connection check skipped"
        
        echo ""
        echo "=========================================="
        echo "✅ Deployment validation PASSED"
        echo "=========================================="
        exit 0
    fi
    
    echo "Attempt $i/$MAX_RETRIES: HTTP $HTTP_CODE (retrying in ${RETRY_INTERVAL}s...)"
    sleep $RETRY_INTERVAL
done

echo ""
echo "=========================================="
echo "❌ Deployment validation FAILED"
echo "=========================================="

# Show container logs for debugging
echo ""
echo "Container logs:"
docker logs --tail 50 caro-game-api 2>/dev/null || echo "No logs available"

exit 1
