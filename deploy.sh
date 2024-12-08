#!/bin/bash

# Set variables
VERSION=$1
REGISTRY="your-registry.com"
APP_NAME="your-app"

# Check if version is provided
if [ -z "$VERSION" ]; then
    echo "Please provide a version number"
    exit 1
fi

# Build images
echo "Building images..."
docker compose -f compose.prod.yaml build

# Tag images
echo "Tagging images with version ${VERSION}..."
docker tag ${REGISTRY}/${APP_NAME}/frontend:latest ${REGISTRY}/${APP_NAME}/frontend:${VERSION}
docker tag ${REGISTRY}/${APP_NAME}/backend:latest ${REGISTRY}/${APP_NAME}/backend:${VERSION}

# Push images
echo "Pushing images..."
docker push ${REGISTRY}/${APP_NAME}/frontend:latest
docker push ${REGISTRY}/${APP_NAME}/frontend:${VERSION}
docker push ${REGISTRY}/${APP_NAME}/backend:latest
docker push ${REGISTRY}/${APP_NAME}/backend:${VERSION}

echo "Deployment build complete!"