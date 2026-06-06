# FitEthio

A personalized Ethiopian-focused wellness web app covering nutrition, fitness, skincare, sleep, and mental wellness.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **AI:** Groq API (llama3-70b-8192)
- **Database + Auth:** Supabase (PostgreSQL + Auth)
- **i18n:** next-intl (English + Amharic)
- **Charts:** Recharts
- **Deployment:** Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### 3. Set up Supabase

1. Create a new Supabase project
2. Run `supabase/schema.sql` in the SQL Editor
3. Run `supabase/seed.sql` to seed Ethiopian foods
4. Enable Google OAuth in Authentication → Providers (optional)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app
  /onboarding    → 7-step profile setup
  /dashboard     → Main hub + morning check-in
  /mode1         → Food → Workout
  /mode2         → Workout → Food
  /mode3         → Skincare & Wellness
  /progress      → Charts, streaks, weekly report
  /community     → Leaderboard (opt-in)
  /mind          → Mental wellness
/components      → UI components
/lib             → Groq, Supabase, foods, utils
/locales         → en.json, am.json
/supabase        → schema.sql, seed.sql
/types           → TypeScript types
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Features

- Multi-step onboarding with BMI analysis
- AI-powered meal/workout recommendations (Mode 1 & 2)
- Personalized skincare & wellness (Mode 3)
- Water intake tracker
- Morning & evening check-ins
- Progress charts and weekly AI reports
- Ethiopian Orthodox fasting mode
- English / Amharic language toggle
- Dark mode support
- Mobile-first bottom navigation
