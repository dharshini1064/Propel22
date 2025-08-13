# Propel22 Deployment Guide

## Quick Deploy to Render.com (FREE)

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy: Ready for production deployment"
git push origin main
```

### 2. Deploy on Render.com
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository: `dharshini1064/Propel22`
5. Click "Connect"
6. Render will automatically deploy using the `render.yaml` configuration

### 3. Environment Variables (Auto-configured)
- `DATABASE_URL`: Auto-generated from PostgreSQL
- `JWT_SECRET`: Auto-generated secure token
- `REACT_APP_API_URL`: Auto-configured to API URL

### 4. Access Your App
- **Frontend**: `https://propel22-client.onrender.com`
- **API**: `https://propel22-api.onrender.com`

## Alternative Deployment Options

### Vercel + Railway
1. **Frontend on Vercel**: Connect GitHub repo, deploy client folder
2. **Backend on Railway**: Deploy server folder with PostgreSQL

### Netlify + Heroku
1. **Frontend on Netlify**: Deploy client build folder
2. **Backend on Heroku**: Deploy with Heroku PostgreSQL addon

## Local Development
```bash
npm run install-all
npm run dev
```

## Production Build
```bash
npm run build
npm start
```