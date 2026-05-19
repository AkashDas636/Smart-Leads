# ============================================================================
# VERCEL DEPLOYMENT (.vercel.json and env setup)
# ============================================================================
# 1. Push to GitHub
# 2. Go to vercel.com/new and import the repo
# 3. Set these environment variables in Vercel Dashboard:

VERCEL_FRONTEND_ENV_VARS:
  VITE_API_URL=https://your-backend.herokuapp.com
  # or if using Vercel Functions for backend:
  # VITE_API_URL=https://your-project.vercel.app/api

# 4. Build command in Vercel: (auto-detected from package.json)
# 5. Deploy → Vercel automatically redeploys on git push

# ============================================================================
# RAILWAY DEPLOYMENT
# ============================================================================
# 1. Go to railway.app
# 2. New Project → From GitHub repo
# 3. Configure services:

RAILWAY_BACKEND_VARS:
  NODE_ENV=production
  PORT=5000
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-leads
  JWT_SECRET=your-secret-key-32-chars-min
  CLIENT_URL=https://your-frontend-domain.vercel.app
  # or if frontend on Railway:
  # CLIENT_URL=https://your-frontend-railway.app

RAILWAY_FRONTEND_VARS:
  VITE_API_URL=https://your-backend-railway.app

# Start command: npm run build && npm start

# ============================================================================
# RENDER.COM DEPLOYMENT
# ============================================================================
# 1. Go to render.com
# 2. New Web Service → Connect GitHub
# 3. Configure Backend:

RENDER_BACKEND_ENV:
  NODE_ENV=production
  PORT=5000
  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-leads
  JWT_SECRET=secure-random-string
  CLIENT_URL=https://your-frontend.vercel.app

# Build command: npm ci && npm run build
# Start command: npm start

# 4. Configure Frontend (static site):
# Build command: pnpm install && pnpm run build
# Publish directory: dist

RENDER_FRONTEND_ENV:
  VITE_API_URL=https://your-backend-render.onrender.com

# ============================================================================
# HEROKU DEPLOYMENT (if using Heroku)
# ============================================================================
# 1. Install Heroku CLI
# 2. Create app: heroku create smart-leads-backend
# 3. Set env vars: heroku config:set KEY=VALUE
# 4. Deploy: git push heroku main

HEROKU_BACKEND_ENV:
  NODE_ENV=production
  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-leads
  JWT_SECRET=your-secret-32-chars
  CLIENT_URL=https://your-frontend.vercel.app

# ============================================================================
# AWS DEPLOYMENT (EC2/ECS/Lambda)
# ============================================================================
# Using Docker images

DOCKER_ENV:
  NODE_ENV=production
  PORT=5000
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-leads
  JWT_SECRET=strong-secret-key
  CLIENT_URL=https://frontend-domain

# Push to ECR:
# aws ecr get-login-password --region us-east-1 | docker login
# docker build -t smart-leads-backend backend/
# docker tag smart-leads-backend:latest <YOUR_ECR_URL>/smart-leads-backend:latest
# docker push <YOUR_ECR_URL>/smart-leads-backend:latest

# ============================================================================
# LOCAL DEVELOPMENT
# ============================================================================
# 1. Install MongoDB locally or use Atlas:
#    - Local: mongod --dbpath ./data/db
#    - Atlas: mongodb+srv://user:pass@cluster.mongodb.net/smart-leads

# 2. Backend:
#    cd backend
#    cp .env.example .env
#    npm ci
#    npm run dev    # dev mode with hot reload
#    npm start      # production mode (after npm run build)

# 3. Frontend:
#    cd frontend
#    pnpm install
#    pnpm run dev   # dev mode at http://localhost:5173
#    pnpm run build # production build

# ============================================================================
# DOCKER COMPOSE (Local or Self-Hosted)
# ============================================================================
# 1. Create backend/.env.docker:

DOCKER_COMPOSE_BACKEND:
  NODE_ENV=production
  PORT=5000
  MONGO_URI=mongodb://mongo:27017/smart-leads
  JWT_SECRET=change-this-in-production
  CLIENT_URL=http://localhost

# 2. Run: docker-compose up --build

# ============================================================================
# ENVIRONMENT VARIABLE REFERENCE
# ============================================================================

BACKEND_VARIABLES:
  NODE_ENV:
    - production (for deployment)
    - development (for local dev)
  
  PORT:
    - 5000 (default)
    - Set by platform if required
  
  MONGO_URI:
    - Local: mongodb://localhost:27017/smart-leads
    - Atlas: mongodb+srv://user:pass@cluster.mongodb.net/smart-leads
    - Docker: mongodb://mongo:27017/smart-leads
  
  JWT_SECRET:
    - REQUIRED for production
    - Generate: openssl rand -base64 32
    - Min 32 characters
  
  JWT_EXPIRES_IN:
    - 7d (default)
    - Token expiration time
  
  CLIENT_URL:
    - Frontend domain (CORS origin)
    - Development: http://localhost:5173
    - Production: https://your-frontend-domain.com
  
  RATE_LIMIT_WINDOW_MS:
    - 900000 (default, 15 min)
  
  RATE_LIMIT_MAX:
    - 100 (default requests per window)

FRONTEND_VARIABLES:
  VITE_API_URL:
    - Development: http://localhost:5000/api
    - Production: https://your-backend-domain.com/api
  
  VITE_APP_NAME:
    - SmartLeads (default)

# ============================================================================
# MONGODB ATLAS SETUP
# ============================================================================
# 1. Create account at mongodb.com/atlas
# 2. Create cluster (free tier available)
# 3. Add database user (username/password)
# 4. Whitelist IP: 0.0.0.0/0 (allow all, or specific IPs)
# 5. Get connection string:
#    mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/smart-leads

# ============================================================================
# QUICK START CHECKLIST
# ============================================================================
# [ ] Generate JWT_SECRET: openssl rand -base64 32
# [ ] Create MongoDB database (local or Atlas)
# [ ] Copy .env.example → .env in backend/
# [ ] Fill in MONGO_URI and JWT_SECRET
# [ ] Fill in CLIENT_URL (frontend domain)
# [ ] Test locally: npm run dev
# [ ] Commit and push to GitHub
# [ ] Choose deployment platform (see sections above)
# [ ] Set environment variables on platform
# [ ] Deploy and verify health check: /health
