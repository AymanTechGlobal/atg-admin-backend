# Backend Setup Guide

## Environment Variables

Create a `.env` file in the `api` directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/atg-admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for password reset links)
FRONTEND_URL=https://atgadmin.vercel.app

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Email Setup for Password Reset

1. Use a Gmail account for sending emails
2. Enable 2-factor authentication on your Gmail account
3. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
   - Use this password in the `EMAIL_PASS` variable

## Deployment on Render

1. Set the environment variables in your Render dashboard
2. Make sure to set `NODE_ENV=production`
3. Set the `FRONTEND_URL` to your Vercel deployment URL
4. Use a production MongoDB URI

## Features Added

- ✅ Remember Me functionality
- ✅ Show/Hide password icons
- ✅ Password reset via email
- ✅ Enhanced security with token expiration
- ✅ Improved error handling
- ✅ Session and persistent storage support
