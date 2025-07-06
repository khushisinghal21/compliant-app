# 🚀 Deployment Guide - Complaint Management System

## Deploying to Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- MongoDB Atlas account (free tier available)
- Redis Cloud account (free tier available)
- Email service (Gmail, SendGrid, etc.)

### Step 1: Prepare Environment Variables

You'll need to set up these environment variables in Vercel:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/complaints
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
REDIS_URL=redis://username:password@host:port
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Step 3: Set Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each environment variable from Step 1

### Step 4: Configure Domains (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain if desired

## 🎉 Your app will be live at: `https://your-project.vercel.app` 