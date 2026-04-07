#!/bin/bash

# OpenJud Deployment Script
# This script builds and pushes Docker images to the registry

set -e

echo "🚀 OpenJud Deployment Script"
echo "=============================="

# Configuration
REGISTRY="rafaelschuh"
PROJECT_NAME="openjud"
VERSION="${1:-latest}"
TAG="${REGISTRY}/${PROJECT_NAME}:${VERSION}"

echo "📦 Building Docker images..."
echo "Registry: $REGISTRY"
echo "Project: $PROJECT_NAME"
echo "Version: $VERSION"
echo ""

# Build backend
echo "🔨 Building backend..."
docker build -t "${REGISTRY}/${PROJECT_NAME}-backend:${VERSION}" ./backend

# Build frontend
echo "🔨 Building frontend..."
docker build -f ./frontend/Dockerfile -t "${REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}" ./frontend

# Multi-arch image (optional, requires buildx)
# docker buildx build --push --platform linux/amd64,linux/arm64 -t ${TAG} .

echo ""
echo "✅ Build complete!"
echo ""
echo "📤 Images ready for deployment:"
echo "   - ${REGISTRY}/${PROJECT_NAME}-backend:${VERSION}"
echo "   - ${REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}"
echo ""
echo "To push to Docker Hub, run:"
echo "  docker push ${REGISTRY}/${PROJECT_NAME}-backend:${VERSION}"
echo "  docker push ${REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}"
