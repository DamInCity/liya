#!/bin/bash

echo "🚀 Starting Portfolio CMS..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start backend
echo "🔧 Starting backend server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo ""
echo "📍 Frontend: http://localhost:5174"
echo "📍 Backend:  http://localhost:5000"
echo "📍 Admin:    http://localhost:5174/admin/login"
echo ""
echo "Default credentials: admin / admin123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '👋 Servers stopped'; exit" INT
wait
