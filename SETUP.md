# FitEthio Setup Guide

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier available at https://supabase.com)
- A Groq API account (free tier available at https://console.groq.com)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd fitethio
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose a name (e.g., "fitethio"), select a region, and set a secure password
4. Wait for the project to be created (5-10 minutes)

### 2.2 Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy your **Project URL** and **anon public key**
3. Save these for `.env.local`

### 2.3 Set Up Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy-paste the entire contents of `supabase/schema.sql`
4. Click **"Run"**
5. Copy-paste the entire contents of `supabase/seed.sql`
6. Click **"Run"** to seed Ethiopian foods

### 2.4 Enable Authentication (Optional)

For OAuth with Google:

1. In Supabase, go to **Authentication → Providers**
2. Enable **Google**
3. Add your Google OAuth credentials (get from [Google Cloud Console](https://console.cloud.google.com))

## Step 3: Set Up Groq API

### 3.1 Get Your Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up/login with your account
3. Go to **API Keys**
4. Create a new API key
5. Copy and save it for `.env.local`

## Step 4: Configure Environment Variables

1. In the project root, create `.env.local` (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and fill in your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
GROQ_API_KEY=gsk_your_groq_key_here
```

## Step 5: Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 6: Test the App

1. **Sign up** with email or Google OAuth
2. Complete the **onboarding** (7 steps)
3. Explore the **dashboard** and features
4. Test **AI recommendations** (Mode 1 & 2)
5. Try **progress tracking** and charts

## Deployment to Vercel

### Before Deploying

1. Make sure all features work locally
2. Run `npm run build` to check for errors
3. Push your code to GitHub

### Deploy Steps

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** and select your repository
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
4. Click **Deploy**

### Post-Deployment

1. Update Supabase authentication redirect URLs:
   - Go to **Authentication → URL Configuration**
   - Add your Vercel domain to allowed redirect URLs
2. Test all features on the deployed version

## Database Backup

Supabase provides automatic daily backups. To manually export:

1. In Supabase, go to **Settings → Backups**
2. Click **"Download"** to export your data

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.
