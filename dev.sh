#!/bin/bash

# OpenJud Development Start Script
# Starts backend and frontend for local development

set -e

echo "🚀 Starting OpenJud Development Environment"
echo "==========================================="
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "🔧 Starting services..."
echo ""

# Start backend in background
echo "Starting backend on http://localhost:3001"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Start frontend in background
echo "Starting frontend on http://localhost:5173"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both services started!"
echo ""
echo "📊 Service PIDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 To stop, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
