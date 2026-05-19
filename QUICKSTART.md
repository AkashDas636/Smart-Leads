# Quick Start Guide

Get the Smart Leads Dashboard running in 5 minutes.

## Option 1: With Docker (Easiest)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/smart-leads-dashboard
cd smart-leads-dashboard

# Copy environment template
cp backend/.env.example backend/.env

# Start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# MongoDB:  localhost:27017
```

**Stop services:**
```bash
docker-compose down
```

---

## Option 2: Manual Setup

### Prerequisites
- Node.js 18+
- pnpm (or npm)
- MongoDB (local or Atlas connection string)

### 1. Install Dependencies

```bash
cd smart-leads-fullstack

# Install pnpm globally (optional but recommended)
npm install -g pnpm

# Run setup script
pnpm install

# Or manually:
cd frontend && pnpm install && cd ../backend && npm install && cd ..
```

### 2. Configure Environment

**Backend:**
```bash
cd backend
cp .env.example .env

# Edit .env and add:
# MONGO_URI=mongodb://localhost:27017/smart-leads
# JWT_SECRET=your_secret_key_here
```

**Frontend:**
```bash
cd frontend
cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=SmartLeads
EOF
```

### 3. Start Development Servers

**Option A: Both at once**
```bash
npm run dev
```

**Option B: Separately**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && pnpm dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017

---

## First Steps

1. **Create an account** or login with demo credentials:
   - Email: `admin@smartleads.io`
   - Password: `password123`

2. **Explore the dashboard:**
   - View stats and metrics
   - Check leads table
   - Review analytics

3. **Create a lead:**
   - Click "Create Lead" button
   - Fill in lead details
   - Submit form

4. **Test features:**
   - Filter by status/source
   - Export to CSV
   - Update lead status

---

## File Structure

```
smart-leads-fullstack/
├── frontend/              # React app
├── backend/               # Express API
├── docker-compose.yml     # Docker setup
├── README.md              # Main documentation
├── DEPLOYMENT.md          # Deployment guide
├── GITHUB_SETUP.md        # GitHub setup
├── DEPLOYMENT_CHECKLIST.md
└── package.json           # Root scripts
```

---

## Common Issues

### Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173

# Kill it
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# If using local MongoDB:
mongod

# If using MongoDB Atlas, check:
# 1. Connection string in .env
# 2. IP whitelist in MongoDB dashboard
# 3. Database user password
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
pnpm install
```

### Build Errors
```bash
# Clear build outputs
rm -rf dist
rm -rf backend/dist

# Rebuild
npm run build
```

---

## Next Steps

After setup, check these guides:

1. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production (Vercel)
2. **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** - Push to GitHub
3. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contributing guidelines
4. **[README.md](./README.md)** - Full documentation

---

## Support

- 📖 Read the [README.md](./README.md)
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- 💬 Check [GitHub Issues](https://github.com/YOUR_USERNAME/smart-leads-dashboard/issues)
- 📧 Contact via GitHub Discussions

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartleads.io | password123 |
| Sales | sales@smartleads.io | password123 |

---

**Happy coding! 🚀**
