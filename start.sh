#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Installing dependencies..."
npm install
echo ""
echo "Starting dev server..."
echo "Opening http://localhost:5173 in your browser in 3 seconds..."
(sleep 3 && open "http://localhost:5173" 2>/dev/null) &
npm run dev
