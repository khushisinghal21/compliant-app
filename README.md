# Complaint Management System

A modern web application for managing and tracking complaints, built with Next.js, React, Material-UI, MongoDB, and JWT authentication.

## Features

### ✅ Advanced JWT Authentication System
- **User Registration**: Secure account creation with email validation
- **User Login**: JWT-based authentication with access and refresh tokens
- **Refresh Token System**: Automatic token refresh with Redis storage
- **Token Blacklisting**: Secure logout with token revocation
- **Role-Based Access Control**: User and Admin roles with different permissions
- **Protected Routes**: Authentication required for all complaint operations
- **Secure Token Storage**: Short-lived access tokens (15min) + long-lived refresh tokens (7 days)
- **Password Security**: bcrypt hashing with salt rounds
- **Auto-Refresh**: Seamless token renewal without user intervention

### ✅ User Interface - Complaint Submission
- **Authentication Required**: Users must login to submit complaints
- **Complaint Title**: Text input field for complaint title
- **Description**: Text area for detailed complaint description
- **Category**: Dropdown selection with predefined options:
  - Product, Service, Support, Technical, Billing
- **Priority**: Dropdown selection with options:
  - Low, Medium, High
- **File Attachments**: Advanced file upload system with:
  - Drag & drop interface
  - Multiple file support (up to 5 files)
  - File type validation (images, PDFs, documents, text)
  - File size limits (5MB per file)
  - Image processing and thumbnails
  - Progress tracking
- **Submit Button**: Submits complaint to backend with validation
- **Success/Error Notifications**: User feedback on submission
- **User Attribution**: Complaints are linked to the submitting user

### ✅ Admin Interface - Complaint Management
- **Admin Authentication**: Only admin users can access the dashboard
- **Complaint Table**: Displays all complaints with columns:
  - Complaint Title
  - Category
  - Priority (color-coded)
  - Status (Pending, In Progress, Resolved)
  - Submitted By (user name and email)
  - Attachments (file count indicator)
  - Date Submitted
- **Admin Actions**:
  - View complaint details in modal with file attachments
  - Update complaint status via dropdown
  - Delete complaints with confirmation
  - Filter complaints by status and priority
  - Real-time search and sorting
  - Download/view attached files

### ✅ Backend & Database
- **MongoDB Schemas**: Complete complaint and user structures with file attachments
- **JWT Authentication**: Secure token-based authentication
- **File Upload System**: Advanced file handling with:
  - Multer middleware for file processing
  - Sharp for image optimization and thumbnails
  - File validation and security
  - UUID-based unique filenames
  - Local file storage with organized structure
- **CRUD Operations**:
  - Users: Create complaints with attachments (POST) - requires authentication
  - Admins: Read complaints (GET), Update complaints (PUT), Delete complaints (DELETE) - requires admin role
- **API Endpoints**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `POST /api/upload` - File upload endpoint (authenticated)
  - `DELETE /api/upload` - File deletion endpoint (authenticated)
  - `POST /api/complaints` - Create new complaints with attachments (authenticated)
  - `GET /api/complaints` - Retrieve all complaints (admin only)
  - `PUT /api/complaints/[id]` - Update complaint status/details (admin only)
  - `DELETE /api/complaints/[id]` - Delete complaints (admin only)

### ✅ Email Notification System
- **NodeMailer Integration**: Professional email service
- **New Complaint Notifications**: Admin receives email when complaint is submitted
  - Includes: Title, Category, Priority, Description, Date, Submitter info
- **Status Update Notifications**: Admin receives email when status changes
  - Includes: Title, Old Status, New Status, Date Updated
- **HTML Email Templates**: Professional, responsive email design

### ✅ Frontend Features
- **React Components**: Modular, reusable components
- **Material-UI Design**: Modern, professional interface
- **Authentication Context**: Global state management for user sessions
- **Protected Routes**: Automatic redirects based on authentication status
- **Responsive Layout**: Works seamlessly on mobile and desktop
- **Real-time Updates**: Instant feedback and data synchronization
- **Form Validation**: Client-side and server-side validation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Cache/Storage**: Redis for token management
- **Authentication**: JWT with bcryptjs + Refresh Token System
- **Email**: Nodemailer
- **Styling**: Material-UI with custom theme

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database (local or cloud)
- Redis server (for token management)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internship
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/complaint-system
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-in-production
   
   # Redis Configuration (for refresh tokens)
   REDIS_URL=redis://localhost:6379
   
   # Email Configuration (Gmail SMTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```
   
   **Note**: 
   - For Gmail, you'll need to use an App Password instead of your regular password. Enable 2-factor authentication and generate an App Password in your Google Account settings.
   - Generate secure secrets using: `node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex')); console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'));"`
   - Start Redis: `brew services start redis` (macOS) or `sudo systemctl start redis` (Linux)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # User complaint submission page (protected)
│   ├── auth/
│   │   └── page.tsx          # Authentication page (login/register)
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard page (admin only)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts  # User registration
│   │   │   └── login/
│   │   │       └── route.ts  # User login
│   │   └── complaints/
│   │       ├── route.ts      # GET/POST complaints (authenticated)
│   │       └── [id]/
│   │           └── route.ts  # PUT/DELETE individual complaints (admin)
│   ├── layout.tsx            # Root layout with Material-UI theme and AuthProvider
│   └── globals.css           # Global styles
├── components/
│   ├── ComplaintForm.tsx     # Complaint submission form (authenticated)
│   ├── ComplaintTable.tsx    # Admin complaint table with user info
│   ├── FilterBar.tsx         # Filtering component with authentication
│   ├── Navigation.tsx        # Navigation bar with user menu
│   ├── LoginForm.tsx         # User login form
│   ├── RegisterForm.tsx      # User registration form
│   └── ThemeRegistry.tsx     # Material-UI theme provider
├── contexts/
│   └── AuthContext.tsx       # Authentication context and state management
├── lib/
│   ├── mongodb.ts            # MongoDB connection utility
│   ├── email.ts              # Email notification functions
│   ├── jwt.ts                # JWT token utilities
│   └── auth.ts               # Authentication middleware
└── models/
    ├── Complaint.ts          # Mongoose complaint schema
    └── User.ts               # Mongoose user schema
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and revoke tokens

### Complaints (Protected)
- `POST /api/complaints` - Create new complaint (requires authentication)
- `GET /api/complaints` - Get all complaints (requires admin role)
- `PUT /api/complaints/[id]` - Update complaint status (requires admin role)
- `DELETE /api/complaints/[id]` - Delete complaint (requires admin role)

## Authentication Flow

1. **Registration**: Users can register with email, password, and role
2. **Login**: Users authenticate with email and password, receive access + refresh tokens
3. **Token Management**: 
   - Access tokens (15min) stored in memory
   - Refresh tokens (7 days) stored in localStorage
   - Refresh tokens stored in Redis for server-side validation
4. **Auto-Refresh**: Access tokens automatically refreshed every 14 minutes
5. **Token Blacklisting**: Logout revokes tokens on server-side
6. **Route Protection**: Automatic redirects based on authentication status
7. **Role-Based Access**: Different permissions for users and admins

## Email Notifications

- **New Complaint**: Admin receives email when complaint is submitted
- **Status Update**: Admin receives email when complaint status changes

## Live Demo

🚀 **Live Application**: [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/complaint-management-system)

### Demo Credentials
- **User Portal**: Register/login to submit complaints
- **Admin Dashboard**: Admin users can manage all complaints

## Deployment

### Vercel Deployment (Recommended)
1. **Push to GitHub**: Upload your code to a public repository
2. **Connect to Vercel**: 
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically deploy your application

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-atlas-uri
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@yourdomain.com
JWT_SECRET=your-production-jwt-secret
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: User and admin permissions
- **Protected Routes**: Authentication required for all operations
- **Secure Headers**: JWT tokens in Authorization headers
- **Input Validation**: Server-side validation for all inputs

## Next Steps

1. **Testing**:
   - Test user registration and login
   - Test complaint submission with authentication
   - Test admin dashboard functionality
   - Test email notifications

2. **Production Deployment**:
   - Deploy to Vercel/Heroku
   - Set up production MongoDB Atlas
   - Configure production email service
   - Use strong JWT secrets

3. **Additional Features** (Optional):
   - Password reset functionality
   - Email verification
   - User profile management
   - Advanced filtering and search

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
