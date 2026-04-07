#!/bin/bash

# OpenJud Production Deployment Script
# Pulls images from registry and starts containers

set -e

REGISTRY="${1:-rafaelschuh}"
PROJECT_NAME="openjud"
VERSION="${2:-latest}"

echo "🚀 Starting OpenJud Deployment"
echo "=============================="
echo "Registry: $REGISTRY"
echo "Version: $VERSION"
echo ""

# Create production docker-compose file
cat > docker-compose.prod.yml << EOF
version: '3.9'

services:
  backend:
    image: ${REGISTRY}/${PROJECT_NAME}-backend:${VERSION}
    container_name: openjud-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - LOG_LEVEL=info
      - DATAJUD_API_BASE_URL=https://api-publica.datajud.cnj.jus.br/
      - DATAJUD_API_TIMEOUT=30000
      - CORS_ORIGIN=*
    networks:
      - openjud-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    image: ${REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}
    container_name: openjud-frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://backend:3001
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - openjud-network
    restart: unless-stopped

networks:
  openjud-network:
    driver: bridge

volumes: {}
EOF

echo "📝 Starting containers with docker compose..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3001"
echo ""
echo "📊 Monitor logs:"
echo "   docker compose -f docker-compose.prod.yml logs -f backend"
echo "   docker compose -f docker-compose.prod.yml logs -f frontend"
echo ""
echo "🛑 Stop containers:"
echo "   docker compose -f docker-compose.prod.yml down"
