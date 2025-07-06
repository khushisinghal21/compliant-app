# GitHub Repository Setup Guide

This guide will help you set up your GitHub repository and prepare your Complaint Management System for deployment.

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Create New Repository**:
   - Click "New repository"
   - Repository name: `complaint-management-system`
   - Description: "A full-stack complaint management system built with Next.js, React, MongoDB, and email notifications"
   - Make it **Public** (required for free deployment)
   - Don't initialize with README (we already have one)

## Step 2: Push Your Code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complaint Management System

- Complete frontend with React + Material-UI
- Backend API with Next.js and MongoDB
- Email notification system
- Admin dashboard with filtering
- Responsive design for mobile and desktop"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/complaint-management-system.git

# Push to GitHub
git push -u origin main
```

## Step 3: Repository Structure

Your repository should have the following structure:

```
complaint-management-system/
├── src/
│   ├── app/
│   │   ├── page.tsx              # User complaint form
│   │   ├── admin/page.tsx        # Admin dashboard
│   │   ├── api/complaints/       # API routes
│   │   └── layout.tsx            # App layout
│   ├── components/               # React components
│   ├── lib/                      # Utilities
│   └── models/                   # Database schemas
├── public/                       # Static assets
├── package.json                  # Dependencies
├── README.md                     # Project documentation
├── SETUP.md                      # Setup instructions
└── .gitignore                    # Git ignore rules
```

## Step 4: Repository Settings

### Add Repository Topics
Add these topics to your repository for better discoverability:
- `nextjs`
- `react`
- `mongodb`
- `typescript`
- `material-ui`
- `complaint-management`
- `full-stack`
- `email-notifications`

### Repository Description
```
A modern complaint management system built with Next.js, React, and MongoDB. Features include user complaint submission, admin dashboard, email notifications, and responsive design.
```

## Step 5: Prepare for Deployment

### Update README.md
1. Replace `yourusername` in the deployment link with your actual GitHub username
2. Add your live demo link once deployed

### Environment Variables
Make sure your `.env.local` file is in `.gitignore` and create a `.env.example` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/complaint-system

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@example.com
```

## Step 6: Deployment Preparation

### Vercel Deployment
1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Add environment variables in Vercel dashboard
6. Deploy

### Environment Variables in Vercel
Add these in your Vercel project settings:
- `MONGODB_URI`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `ADMIN_EMAIL`

## Step 7: Final Repository Checklist

- [ ] Code pushed to GitHub
- [ ] README.md updated with deployment link
- [ ] Repository is public
- [ ] Topics added to repository
- [ ] Environment variables documented
- [ ] Live demo link working
- [ ] All features tested and working

## Step 8: Share Your Project

Once deployed, you can share your project:

1. **GitHub Repository**: Link to your public repository
2. **Live Demo**: Link to your deployed application
3. **Documentation**: README.md with setup instructions
4. **Screenshots**: Add screenshots of your application

Your Complaint Management System is now ready for the world! 🚀 