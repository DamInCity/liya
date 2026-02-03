#!/bin/bash

echo "🚀 Starting Production Server..."
echo ""

# Build frontend if dist doesn't exist or is outdated
if [ ! -d "dist" ] || [ "src" -nt "dist" ]; then
    echo "📦 Building frontend..."
    npm run build
    echo ""
fi

# Check if backend dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && npm install && cd ..
    echo ""
fi

# Start backend in production mode
echo "🔧 Starting backend server on port 5000..."
cd server
NODE_ENV=production npm start &
BACKEND_PID=$!
cd ..

echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""
echo "📍 Backend:  http://localhost:5000"
echo "📍 Frontend: Served by nginx"
echo ""
echo "To complete setup:"
echo "1. Copy nginx config: sudo cp nginx.conf /etc/nginx/sites-available/portfolio"
echo "2. Enable site: sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/"
echo "3. Test config: sudo nginx -t"
echo "4. Reload nginx: sudo systemctl reload nginx"
echo ""
echo "Press Ctrl+C to stop backend"

# Wait for Ctrl+C
trap "kill $BACKEND_PID 2>/dev/null; echo ''; echo '👋 Backend stopped'; exit" INT
wait
