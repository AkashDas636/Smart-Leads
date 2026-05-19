# GitHub Repository Setup Guide

This guide helps you set up your GitHub repository and prepare for Vercel deployment.

## Prerequisites

- GitHub account
- Git installed locally
- Code repository ready to push

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `smart-leads-dashboard`
3. **Description:** Professional Lead Management Dashboard with Analytics
4. **Visibility:** Public (recommended for portfolio) or Private
5. **Initialize repository:** No (you'll push existing code)
6. Click "Create repository"

## Step 2: Push Local Repository to GitHub

```bash
# Navigate to project root
cd smart-leads-fullstack

# Initialize git (if not already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initial commit - Smart Leads Dashboard MVP

- Full-stack lead management application
- React + TypeScript frontend
- Express + Node.js backend
- MongoDB database integration
- Docker setup for development
- Role-based access control
- Real-time analytics and charts"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/smart-leads-dashboard

# Rename to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Add Topics to Repository

On GitHub repository page:
1. Click "About" (⚙️) button
2. Add topics:
   - `react`
   - `nodejs`
   - `express`
   - `mongodb`
   - `typescript`
   - `crm`
   - `dashboard`
   - `analytics`

## Step 4: Add Repository Description

**About section:**
```
Professional Lead Management Dashboard with Analytics

A full-stack application for managing and analyzing sales leads. 
Built with React, TypeScript, Express, and MongoDB.

Features:
- Real-time lead tracking
- Advanced analytics & insights
- Role-based access control
- Responsive dark-mode UI
- Docker containerization
```

## Step 5: Configure Branch Protection

1. Go to Settings → Branches
2. Click "Add rule"
3. **Branch name pattern:** `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals
   - ✅ Require status checks to pass (GitHub Actions)
   - ✅ Require branches to be up to date
5. Save

## Step 6: Add GitHub Secrets for CI/CD

Go to Settings → Secrets and variables → Actions

Add these secrets:

### Vercel Secrets
```
VERCEL_TOKEN = (get from https://vercel.com/account/tokens)
VERCEL_ORG_ID = (from Vercel dashboard)
VERCEL_PROJECT_ID = (from Vercel project settings)
```

### MongoDB Secrets (Optional)
```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/smart-leads
```

### API Secrets
```
JWT_SECRET = your_super_secret_key_min_32_characters
```

## Step 7: Add README Badge

Add this to your README.md at the top:

```markdown
# 🚀 Smart Leads Dashboard

[![GitHub Actions](https://github.com/YOUR_USERNAME/smart-leads-dashboard/workflows/Deploy%20to%20Vercel/badge.svg)](https://github.com/YOUR_USERNAME/smart-leads-dashboard/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
```

## Step 8: Create Release

1. Go to Releases → Create a new release
2. **Tag version:** `v1.0.0`
3. **Release title:** Version 1.0.0 - Initial Release
4. **Description:**
```markdown
## Features
- Lead management system
- Real-time analytics
- Role-based access control
- Responsive design

## Installation
See [README.md](https://github.com/YOUR_USERNAME/smart-leads-dashboard/blob/main/README.md) for setup instructions.

## Deployment
Deployed to Vercel. See [DEPLOYMENT.md](https://github.com/YOUR_USERNAME/smart-leads-dashboard/blob/main/DEPLOYMENT.md).
```
5. Click "Publish release"

## Step 9: Add Collaborators

1. Go to Settings → Collaborators
2. Click "Add people"
3. Search for usernames and assign roles

## Step 10: Enable GitHub Pages (Optional)

For documentation site:
1. Go to Settings → Pages
2. **Source:** Deploy from a branch
3. **Branch:** `main`, folder `/docs` (if you have docs)
4. Click Save

## File Checklist

Verify these files exist in repository:

```
✅ README.md                    - Main documentation
✅ DEPLOYMENT.md                - Deployment guide
✅ CONTRIBUTING.md              - Contributing guidelines
✅ .github/workflows/deploy.yml - CI/CD pipeline
✅ .gitignore                   - Git ignore rules
✅ .npmrc                        - pnpm configuration
✅ .prettierrc.json             - Code formatting
✅ .env.example                 - Environment template
✅ docker-compose.yml           - Local development
✅ package.json                 - Root dependencies
✅ frontend/                    - React application
✅ backend/                     - Express API
```

## Useful GitHub Links

- **Your Repository:** https://github.com/YOUR_USERNAME/smart-leads-dashboard
- **Actions:** https://github.com/YOUR_USERNAME/smart-leads-dashboard/actions
- **Issues:** https://github.com/YOUR_USERNAME/smart-leads-dashboard/issues
- **Pull Requests:** https://github.com/YOUR_USERNAME/smart-leads-dashboard/pulls
- **Settings:** https://github.com/YOUR_USERNAME/smart-leads-dashboard/settings

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Configure branch protection
3. ✅ Add GitHub secrets
4. 🔄 Deploy to Vercel (see DEPLOYMENT.md)
5. 📝 Monitor GitHub Actions workflows

## Common Commands

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/smart-leads-dashboard

# Create a feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: description"
git push origin feature/your-feature

# Create pull request on GitHub
# → Then merge when approved

# Delete branch after merge
git branch -d feature/your-feature
```

## Troubleshooting

### Push Fails
```bash
# Update credentials
git remote set-url origin https://github.com/YOUR_USERNAME/smart-leads-dashboard
git push -u origin main
```

### Large Files Error
```bash
# If you accidentally committed large files:
git rm --cached large-file.bin
echo "large-file.bin" >> .gitignore
git commit -m "remove large file"
git push
```

## Support

- 📖 [GitHub Docs](https://docs.github.com)
- 🚀 [Vercel Docs](https://vercel.com/docs)
- 💬 Check GitHub Issues for solutions

---

For more deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md).
