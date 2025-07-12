# VukaLink - Deployment Setup Guide

## 🚀 Quick Start for Production Deployment

This guide will help you deploy VukaLink with proper Supabase configuration.

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Deployment Platform**: Vercel, Netlify, or any other hosting platform
3. **Git Repository**: Your VukaLink code repository

## 🔧 Step 1: Supabase Setup

### 1.1 Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and fill in project details:
   - **Name**: `vukalink-production` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be ready (2-3 minutes)

### 1.2 Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.3 Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the complete schema from `DATABASE.md`
3. Run the SQL to create all tables and policies

## 🌐 Step 2: Deployment Platform Setup

### For Vercel Deployment

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Select the VukaLink repository

2. **Configure Environment Variables**:
   - In Vercel dashboard, go to your project
   - Navigate to **Settings → Environment Variables**
   - Add the following variables:

   ```
   Name: VITE_SUPABASE_URL
   Value: https://your-project-id.supabase.co
   
   Name: VITE_SUPABASE_ANON_KEY  
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

### For Netlify Deployment

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Set Environment Variables**:
   - Go to **Site settings → Environment variables**
   - Add the same variables as above

4. **Deploy**:
   - Click "Deploy site"

## 🔐 Step 3: Security Setup

### 3.1 Configure RLS Policies

The `DATABASE.md` file includes comprehensive Row Level Security policies. Ensure these are applied to your Supabase project.

### 3.2 Set Up Storage Buckets

1. In Supabase, go to **Storage**
2. Create these buckets:
   - `resumes` (for user resume uploads)
   - `company_logos` (for company logo uploads)
3. Set appropriate access policies for each bucket

## 📱 Step 4: Features Configuration

### 4.1 Authentication Setup

- Email/Password authentication is enabled by default
- For social logins, configure providers in Supabase **Authentication → Providers**

### 4.2 File Upload Configuration

- Maximum file size: 5MB (configured in application)
- Allowed types: PDF, DOC, DOCX for resumes
- Storage: Supabase Storage buckets

## ✅ Step 5: Verification

### 5.1 Check Deployment Status

1. Visit your deployed URL
2. Verify the demo mode banner is **NOT** visible
3. Test user registration and login
4. Test basic functionality like viewing opportunities

### 5.2 Common Issues and Solutions

**Issue**: Demo mode banner still shows
- **Solution**: Verify environment variables are correctly set and redeploy

**Issue**: "Failed to fetch" errors
- **Solution**: Check Supabase URL and ensure project is active

**Issue**: Authentication not working
- **Solution**: Verify anon key is correct and RLS policies are applied

## 🔄 Step 6: Ongoing Maintenance

### Database Backups
- Supabase automatically backs up your database
- For critical data, set up additional backup schedules

### Monitoring
- Monitor application performance in your deployment platform
- Check Supabase dashboard for API usage and errors

### Updates
- To update the application, push changes to your connected Git repository
- The deployment platform will automatically rebuild and deploy

## 📞 Support

If you encounter issues:

1. **Check Logs**: View deployment logs in your platform dashboard
2. **Supabase Dashboard**: Check for database errors in Supabase logs
3. **Environment Variables**: Verify all variables are correctly set
4. **Browser Console**: Check for JavaScript errors in browser dev tools

## 🎯 Production Checklist

- [ ] Supabase project created and configured
- [ ] Database schema applied from `DATABASE.md`
- [ ] Environment variables set in deployment platform
- [ ] Application deployed successfully
- [ ] Demo mode banner not visible
- [ ] User registration/login working
- [ ] File uploads functioning
- [ ] All features accessible

---

**🎉 Congratulations!** Your VukaLink platform is now ready for production use!

For additional customization and features, refer to the main `README.md` and code documentation.