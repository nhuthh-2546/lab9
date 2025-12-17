#!/bin/bash
set -e

# =============================================================================
# After Install Hook
# Set up application environment and pull Docker image
# =============================================================================

echo "=========================================="
echo "CodeDeploy: After Install"
echo "=========================================="

# Get instance metadata
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)

echo "Region: $REGION"
echo "Instance ID: $INSTANCE_ID"

# Create application directory
mkdir -p /app/current
mkdir -p /app/log

# Set ownership
chown -R ec2-user:ec2-user /app

# Move deployment files
cp -r /app/* /app/current/ 2>/dev/null || true

# Refresh secrets from AWS Secrets Manager
echo "Refreshing secrets..."
/usr/local/bin/fetch-secrets.sh

# Login to ECR
echo "Logging into ECR..."
ECR_REGISTRY=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.${REGION}.amazonaws.com
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Get image URI from deployment
if [ -f "/app/current/imagedefinitions.json" ]; then
    IMAGE_URI=$(cat /app/current/imagedefinitions.json | jq -r '.[0].imageUri')
    echo "Pulling image: $IMAGE_URI"
    docker pull $IMAGE_URI
    
    # Tag as latest for local reference
    docker tag $IMAGE_URI caro-game-api:latest
else
    echo "Warning: imagedefinitions.json not found"
    # Fallback to latest tag
    ECR_REPO="${ECR_REGISTRY}/caro-game-backend:latest"
    docker pull $ECR_REPO
    docker tag $ECR_REPO caro-game-api:latest
fi

echo "After install completed successfully"
