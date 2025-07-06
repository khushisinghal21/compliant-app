# Setup Guide - Complaint Management System

This guide will help you set up the Complaint Management System with JWT authentication on your local machine.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB database (local or cloud)
- Email service (Gmail, SendGrid, etc.)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd internship

# Install dependencies
npm install
```

## Step 2: MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB Community Edition on your machine
2. Start MongoDB service
3. Create a database named `complaint-system`

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string

## Step 3: Email Configuration

### Gmail Setup (Recommended for testing)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use this app password in your environment variables

### Alternative Email Services
- **SendGrid**: Use SMTP settings from SendGrid dashboard
- **Mailgun**: Use SMTP settings from Mailgun dashboard
- **Outlook**: Use Outlook SMTP settings

## Step 4: JWT Secret Generation

Generate a secure JWT secret for authentication:

```bash
# Method 1: Random hex string (recommended)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Method 2: bcrypt hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-base-string', 12).then(hash => console.log('JWT_SECRET=' + hash));"

# Method 3: Random base64 string
node -e "console.log(require('crypto').randomBytes(48).toString('base64'));"
```

## Step 5: Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/complaint-system
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/complaint-system

# Email Configuration (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@example.com

# JWT Configuration
JWT_SECRET=your-generated-jwt-secret-here
```

## Step 6: Run the Application

```bash
# Start the development server
npm run dev
```

The application will be available at:
- **Authentication Page**: http://localhost:3000/auth
- **User Portal**: http://localhost:3000 (requires login)
- **Admin Dashboard**: http://localhost:3000/admin (requires admin login)

## Step 7: Test the System

1. **Register a User**:
   - Go to http://localhost:3000/auth
   - Click "Register here"
   - Fill out the registration form
   - Choose "user" or "admin" role

2. **Login**:
   - Use your registered email and password
   - You'll be redirected based on your role

3. **Submit a Complaint** (User):
   - Login as a user
   - Fill out the complaint form
   - Submit the complaint

4. **Check Admin Dashboard** (Admin):
   - Login as an admin
   - Go to Admin Dashboard
   - Verify the complaint appears in the table
   - Test filtering and status updates
   - Check that user information is displayed

5. **Check Email Notifications**:
   - Verify you receive an email when a complaint is submitted
   - Update a complaint status and check for notification email

## Authentication Features

### User Roles
- **User**: Can submit complaints and view their own submissions
- **Admin**: Can view all complaints, update status, delete complaints

### Security Features
- **JWT Tokens**: 7-day expiration with automatic refresh
- **Password Hashing**: bcrypt with 12 salt rounds
- **Protected Routes**: Authentication required for all operations
- **Role-Based Access**: Different permissions for users and admins

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string
- Verify network connectivity (for cloud databases)

### Email Issues
- Check SMTP credentials
- Ensure 2FA is enabled for Gmail
- Verify app password is correct
- Check firewall/network settings

### Authentication Issues
- Verify JWT_SECRET is set correctly
- Check that bcryptjs and jsonwebtoken are installed
- Ensure environment variables are loaded
- Clear browser localStorage if tokens are corrupted

### API Errors
- Check browser console for errors
- Verify environment variables are set
- Ensure all dependencies are installed
- Check that authentication headers are being sent

## Production Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
SMTP_HOST=your-production-smtp-host
SMTP_PORT=587
SMTP_USER=your-production-email
SMTP_PASS=your-production-password
ADMIN_EMAIL=your-admin-email
JWT_SECRET=your-production-jwt-secret
```

### Security Considerations for Production
- Use a strong, unique JWT_SECRET
- Enable HTTPS in production
- Set up proper CORS policies
- Use environment-specific MongoDB databases
- Implement rate limiting for authentication endpoints
- Consider using refresh tokens for better security

## Dependencies

The following key dependencies are required:

```json
{
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "@types/jsonwebtoken": "^9.0.0",
  "mongoose": "^7.0.0",
  "nodemailer": "^6.9.0",
  "@mui/material": "^5.0.0",
  "@emotion/react": "^11.0.0",
  "@emotion/styled": "^11.0.0"
}
```

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB and email services are properly configured
4. Check that JWT authentication is working properly
5. Verify user roles and permissions
6. Check the README.md for additional information 