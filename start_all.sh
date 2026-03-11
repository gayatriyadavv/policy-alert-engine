#!/bin/bash

# ==========================================
# Policy Alert Engine - Universal Start Script
# ==========================================
# This script boots both the FastAPI backend and 
# the Next.js frontend concurrently.
# Pressing Ctrl+C will cleanly terminate both.
# ==========================================

echo "🚀 Booting Policy Alert Engine..."
echo ""

# 1. Start the FastAPI Backend
echo "Starting FastAPI Backend (Port 8000)..."
cd api || exit
source ../venv/bin/activate
uvicorn app:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait briefly to ensure the API is listening
sleep 2 
echo "✅ Backend API is live."

# 2. Start the Next.js Frontend
echo "Starting Next.js Frontend (Port 3000)..."
cd policy_alert_frontend || exit
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Frontend is live."
echo ""
echo "=========================================="
echo "🎯 ALL SYSTEMS GO"
echo "👉 Dashboard: http://localhost:3000"
echo "👉 API Server: http://localhost:8000"
echo "=========================================="
echo "(Press Ctrl+C to terminate both servers)"

# 3. Trap graceful shutdown for both processes
trap "echo ''; echo 'Shutting down servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Keep the script running to hold the trap
wait $BACKEND_PID $FRONTEND_PID
