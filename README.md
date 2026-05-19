# 🚀 Smart Leads Dashboard

A professional **Lead Management Dashboard** built with the **MERN stack + TypeScript**. Track, analyze, and convert leads with a modern, responsive interface.

[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/new)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

**[⚡ Quick Start](./QUICKSTART.md) • [📖 Full Docs](./README.md) • [🚀 Deploy Guide](./DEPLOYMENT.md) • [🔧 GitHub Setup](./GITHUB_SETUP.md)**

---

## Features

✨ **Dashboard & Analytics**
- Real-time lead metrics and KPIs
- Conversion rate tracking
- Monthly trends visualization
- Pipeline health overview

👥 **Lead Management**
- Create, read, update, delete leads
- Advanced filtering (status, source)
- Full-text search
- Export to CSV

🔐 **Security & Access**
- JWT authentication
- Role-based access control (Admin/Sales)
- Password hashing with bcrypt
- Rate limiting & CORS protection

🎨 **User Experience**
- Modern dark-mode UI
- Responsive design (mobile, tablet, desktop)
- Smooth animations
- Intuitive navigation

🏗️ **Development**
- Full TypeScript (frontend & backend)
- Docker containerization
- GitHub Actions CI/CD
- MongoDB with Mongoose ODM

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| DevOps | Docker + Docker Compose + Vercel |

---

## 🚀 Quick Start

### With Docker (Easiest)

```bash
git clone https://github.com/yourname/smart-leads-dashboard
cd smart-leads-dashboard

# Copy env
cp backend/.env.example backend/.env
# Edit backend/.env and set JWT_SECRET

# Run everything
docker compose up --build
```

- Frontend → http://localhost:5173
- Backend API → http://localhost:5000
- MongoDB → localhost:27017

---

## Manual Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- pnpm (frontend) / npm (backend)

---

### Backend

```bash
cd backend
npm install

# Create .env from template
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET

# Development
npm run dev

# Production build
npm run build
npm start
```

---

### Frontend

```bash
cd frontend
pnpm install

# Development
pnpm dev

# Production build
pnpm build
pnpm preview
```

---

## Environment Variables

Create `backend/.env` based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## Demo Accounts (Frontend Mock Mode)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartleads.io | password123 |
| Sales | sales@smartleads.io | password123 |

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alex Rivera",
  "email": "alex@company.io",
  "password": "password123",
  "role": "Admin"   // "Admin" | "Sales"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex@company.io",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": { "id": "...", "name": "Alex Rivera", "email": "...", "role": "Admin" }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Leads Endpoints

All require `Authorization: Bearer <token>`.

#### List Leads (with filtering & pagination)
```http
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1&limit=10
```

Query params:
| Param | Values | Default |
|-------|--------|---------|
| status | New, Contacted, Qualified, Lost, All | All |
| source | Website, Instagram, Referral, All | All |
| search | string (name or email) | — |
| sort | latest, oldest | latest |
| page | number | 1 |
| limit | 1–100 | 10 |

**Response:**
```json
{
  "success": true,
  "data": [...leads],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Create Lead
```http
POST /api/leads
Authorization: Bearer <token>

{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "status": "New",
  "source": "Instagram",
  "phone": "+91 9876543210",
  "notes": "Interested in premium plan"
}
```

#### Get Lead by ID
```http
GET /api/leads/:id
```

#### Update Lead
```http
PUT /api/leads/:id

{
  "status": "Qualified",
  "notes": "Scheduled demo call"
}
```

#### Delete Lead (Admin only)
```http
DELETE /api/leads/:id
```

#### Get Stats
```http
GET /api/leads/stats
```

#### Export CSV (Admin only)
```http
GET /api/leads/export
```
Returns a downloadable `.csv` file.

---

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error description"
}
```

---

## Deployment

### Prerequisites
- GitHub repository
- Vercel account
- MongoDB Atlas account (free tier available)

### Deploy to Vercel (Recommended)

#### 1. **Frontend Deployment**

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
vercel link

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-api-url
# VITE_APP_NAME=SmartLeads

# Deploy
vercel --prod
```

#### 2. **Backend Deployment (API)**

Backend can be deployed to:
- **Vercel Serverless Functions** (recommended)
- **Railway** (simple & free-tier friendly)
- **Render** or **Heroku**

**For Vercel:**
```bash
vercel --prod --env MONGO_URI=mongodb+srv://... JWT_SECRET=...
```

**For Railway:**
```bash
railway up --environment=production
```

#### 3. **MongoDB Atlas Setup**

```
1. Create cluster at mongodb.com/atlas
2. Get connection string: mongodb+srv://<user>:<password>@cluster.mongodb.net/smart-leads
3. Add to backend environment variables
```

### GitHub Actions CI/CD

The `.github/workflows/deploy.yml` automatically:
- ✅ Runs tests on PR to `main`
- ✅ Builds frontend
- ✅ Deploys to Vercel on merge to `main`

**Setup:**
1. Create `.env.production` with production variables
2. Add Vercel secrets in GitHub:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

### Environment Variables

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=SmartLeads
```

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-leads
JWT_SECRET=your_32_character_minimum_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.com
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## Role-Based Access Control

| Action | Admin | Sales |
|--------|-------|-------|
| View own leads | ✅ | ✅ |
| View all leads | ✅ | ❌ |
| Create lead | ✅ | ✅ |
| Update own lead | ✅ | ✅ |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ❌ |
| Analytics | ✅ | ✅ |

---

## Project Structure

```
smart-leads/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Login, Register pages
│   │   │   ├── dashboard/       # Stats cards, home
│   │   │   ├── leads/           # Table, form modal, detail panel
│   │   │   ├── analytics/       # Charts, KPIs
│   │   │   └── layout/          # Sidebar
│   │   ├── contexts/            # Auth, Leads, Theme contexts
│   │   ├── hooks/               # useDebounce
│   │   ├── lib/                 # CSV export, formatters
│   │   ├── types/               # TypeScript interfaces
│   │   └── data/                # Mock data (50 leads)
│   └── dist/                    # Production build
│
└── backend/                     # Express + TypeScript
    ├── src/
    │   ├── config/              # Database connection
    │   ├── controllers/         # Auth, Leads controllers
    │   ├── middleware/          # Auth, validation, error handler
    │   ├── models/              # User, Lead Mongoose models
    │   ├── routes/              # Auth, Leads routes
    │   ├── types/               # TypeScript interfaces
    │   └── utils/               # JWT, response helpers
    ├── .env.example
    ├── Dockerfile
    └── docker-compose.yml
```

---

## Features Implemented

- ✅ JWT Authentication (Register / Login / Protected Routes)
- ✅ Password hashing with bcrypt (salt rounds: 12)
- ✅ Role-based access control (Admin / Sales)
- ✅ Full CRUD for Leads
- ✅ Multi-filter: Status + Source + Search (combined)
- ✅ Debounced search (350ms)
- ✅ Backend pagination (skip + limit)
- ✅ CSV Export
- ✅ Dark mode support
- ✅ Responsive design (mobile + desktop)
- ✅ Loading states, empty states, error handling UI
- ✅ TypeScript throughout (no `any`)
- ✅ Docker setup
- ✅ Analytics dashboard with charts
"# Smart-Leads" 
