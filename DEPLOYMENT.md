# Deployment Guide

Complete guide to deploy Smart Leads Dashboard to production.

## Architecture

```
┌─────────────────────────────────────┐
│      User Browser (Vercel CDN)      │
├─────────────────────────────────────┤
│   React Frontend (Vercel Hosting)   │
├─────────────────────────────────────┤
│    API Backend (Vercel Functions)   │
├─────────────────────────────────────┤
│   Database (MongoDB Atlas)          │
└─────────────────────────────────────┘
```

## Prerequisites

1. **GitHub Account** - For source control
2. **Vercel Account** - For hosting (free tier available)
3. **MongoDB Atlas Account** - For database (free tier with 512MB)
4. **Node.js 18+** - Local development

## Step 1: Prepare MongoDB

### Create MongoDB Atlas Cluster

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Add IP whitelist: `0.0.0.0/0` (allow all)
5. Create database user with username and password
6. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-leads
   ```

### Test Connection Locally

```bash
cd backend
echo "MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-leads" >> .env
npm run dev
# Should connect successfully
```

## Step 2: Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: Smart Leads Dashboard"

# Create new repo on GitHub (don't add README)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/smart-leads-dashboard
git branch -M main
git push -u origin main
```

## Step 3: Deploy Frontend to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd frontend
vercel link

# Deploy
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select `frontend` as root directory
4. Add environment variables:
   ```
   VITE_API_URL = https://your-api-domain.com
   VITE_APP_NAME = SmartLeads
   ```
5. Deploy

## Step 4: Deploy Backend API

### Option A: Vercel Functions (Recommended)

```bash
# Install Vercel CLI (if not done)
npm i -g vercel

# Create vercel.json (already in root)
# Deploy backend
cd backend
vercel --prod --env MONGO_URI=mongodb+srv://... JWT_SECRET=your_secret
```

### Option B: Railway.app (Easier)

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect your repository
5. Create environment variables:
   ```
   NODE_ENV = production
   MONGO_URI = mongodb+srv://...
   JWT_SECRET = your_super_secret_key
   CLIENT_URL = https://your-frontend-vercel-url.vercel.app
   CORS_ORIGIN = https://your-frontend-vercel-url.vercel.app
   PORT = 5000
   ```
6. Deploy

### Get Backend URL

- **Vercel:** https://your-project.vercel.app/api
- **Railway:** https://your-backend-railway-app.railway.app

## Step 5: Update Frontend API URL

Once backend is deployed:

1. Go to Vercel Dashboard
2. Select your frontend project
3. Settings → Environment Variables
4. Update `VITE_API_URL`:
   ```
   VITE_API_URL = https://your-backend-domain.com
   ```
5. Redeploy frontend: Click "Deployments" → Latest → "Redeploy"

## Step 6: Setup CI/CD with GitHub Actions

The `.github/workflows/deploy.yml` file handles auto-deployment.

### Setup Secrets in GitHub

1. Go to Settings → Secrets and variables → Actions
2. Add:
   ```
   VERCEL_TOKEN = (from https://vercel.com/account/tokens)
   VERCEL_ORG_ID = (from Vercel dashboard)
   VERCEL_PROJECT_ID = (from Vercel project settings)
   ```

Now on every `git push origin main`:
- ✅ Tests run
- ✅ Frontend builds
- ✅ Auto-deploys to Vercel

## Verification

### Test Frontend
```bash
curl https://your-frontend.vercel.app
# Should return HTML
```

### Test Backend
```bash
curl https://your-api-domain.com/health
# Should return JSON
```

### Test API Connection
1. Visit frontend URL
2. Try logging in
3. Check Network tab in DevTools
4. Requests should go to API URL

## Troubleshooting

### API Connection Error

**Problem:** Frontend can't reach API

**Solution:**
1. Verify `VITE_API_URL` is correct
2. Check CORS settings in backend
3. Ensure backend `.env` has correct `CLIENT_URL`
4. Redeploy frontend after changing env vars

### Build Failures

**Problem:** Vercel build fails

**Solution:**
```bash
# Test build locally
cd frontend && pnpm build
cd backend && npm run build

# Check for TS errors
pnpm lint
npm run lint
```

### MongoDB Connection Error

**Problem:** Can't connect to MongoDB

**Solution:**
1. Check `MONGO_URI` is correct
2. Verify IP whitelist includes `0.0.0.0/0`
3. Test locally: `npm run dev`
4. Check MongoDB Atlas dashboard for connection logs

### Environment Variables Not Loading

**Problem:** Variables are undefined in frontend

**Solution:**
1. Variables must start with `VITE_` in frontend
2. Restart dev server after changing env
3. Redeploy after updating on Vercel

## Production Checklist

- ✅ MongoDB Atlas cluster created
- ✅ Environment variables set (both services)
- ✅ Backend deployed and accessible
- ✅ Frontend deployed with correct API URL
- ✅ CORS configured correctly
- ✅ JWT_SECRET is strong (32+ characters)
- ✅ GitHub Actions secrets configured
- ✅ Domain setup complete
- ✅ SSL/HTTPS enabled
- ✅ Tested login flow end-to-end

## Monitoring

### View Logs

**Vercel:**
```bash
vercel logs frontend-project
vercel logs backend-project
```

**Railway:**
- Dashboard → Project → Logs

### Check Status

- [Vercel Status](https://www.vercelstatus.com)
- [MongoDB Status](https://status.mongodb.com)

## Next Steps

1. **Custom Domain** - Configure your domain in Vercel
2. **Email Notifications** - Add service for notifications
3. **Analytics** - Integrate analytics (Plausible, Umami)
4. **Backups** - Enable MongoDB backups
5. **Monitoring** - Setup uptime monitoring (UptimeRobot)

---

For more help: Check [README.md](../README.md) or open an issue on GitHub.
