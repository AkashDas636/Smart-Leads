#!/bin/bash

# Setup Script for Smart Leads Dashboard Development

echo "🚀 Setting up Smart Leads Dashboard..."

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm@latest
fi

echo "✓ pnpm installed"

# Install root dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Frontend setup
echo ""
echo "🎨 Setting up frontend..."
cd frontend
pnpm install --frozen-lockfile

# Create .env if doesn't exist
if [ ! -f ".env" ]; then
  echo "VITE_API_URL=http://localhost:5000" > .env
  echo "✓ Created frontend/.env"
fi

cd ..

# Backend setup
echo ""
echo "🔧 Setting up backend..."
cd backend
npm install

# Create .env if doesn't exist
if [ ! -f ".env" ]; then
  cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=dev_secret_key_min_32_characters_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
EOF
  echo "✓ Created backend/.env"
fi

cd ..

echo ""
echo "✅ Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Run: npm run dev (to start both frontend and backend)"
echo ""
echo "For more info, see README.md"
