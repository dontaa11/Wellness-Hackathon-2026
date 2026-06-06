# FitEthio

A personalized Ethiopian-focused wellness web app covering nutrition, fitness, skincare, sleep, and mental wellness.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **AI:** Groq API (llama3-70b-8192)
- **Database + Auth:** Supabase (PostgreSQL + Auth)
- **i18n:** next-intl (English + Amharic)
- **Charts:** Recharts
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

**[📖 Full Setup Guide →](./SETUP.md)**

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

## Documentation

- **[SETUP.md](./SETUP.md)** — Detailed setup instructions with step-by-step guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** — Common issues and solutions
- **[TESTING.md](./TESTING.md)** — Testing guide and best practices

## Project Structure

```
/app
  /auth          → Authentication routes
  /dashboard     → Main hub + morning check-in
  /mode1         → Food → Workout
  /mode2         → Workout → Food
  /mode3         → Skincare & Wellness
  /progress      → Charts, streaks, weekly report
  /community     → Leaderboard (opt-in)
  /mind          → Mental wellness
  /onboarding    → 7-step profile setup
  /api/groq      → AI API endpoints

/components      → Reusable UI components
/lib             → Utilities (Groq, Supabase, foods)
/locales         → i18n translations (en.json, am.json)
/supabase        → Database schema & seed data
/types           → TypeScript type definitions
/__tests__       → Unit and integration tests
```

## Features

### Core Features
- ✅ Multi-step onboarding with BMI analysis
- ✅ AI-powered meal/workout recommendations (Mode 1 & 2)
- ✅ Personalized skincare & wellness (Mode 3)
- ✅ Water intake tracker with streak tracking
- ✅ Morning & evening check-ins
- ✅ Progress charts and weekly AI reports
- ✅ Ethiopian Orthodox fasting mode
- ✅ Community leaderboard (opt-in)
- ✅ Mental wellness exercises (breathing exercises)
- ✅ Bilingual support (English / Amharic)
- ✅ Dark mode support
- ✅ Mobile-first bottom navigation

### Coming Soon
- 🔄 Social features (friend requests, challenges)
- 🔄 Push notifications
- 🔄 Offline mode
- 🔄 Recipe sharing

## Testing

### Run tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test:watch
```

### View coverage
```bash
npm test -- --coverage
```

**[📖 Testing Guide →](./TESTING.md)**

## Development

### Available Scripts

```bash
npm run dev        # Start dev server on :3000
npm run build      # Build for production
npm start          # Start production server
npm test           # Run tests
npm test:watch     # Run tests in watch mode
npm run lint       # Run ESLint
```

### Database

View and manage data in [Supabase dashboard](https://supabase.com)

#### Tables
- `profiles` — User profiles (age, weight, goals, etc.)
- `daily_logs` — Food, workout, water, mood, sleep logs
- `progress_entries` — Daily progress (weight, water, mood, sleep)
- `ethiopian_foods` — Seed data of Ethiopian foods
- `weekly_reports` — AI-generated weekly reports
- `leaderboard_entries` — Community leaderboard

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

**[📖 Full Deployment Guide →](./SETUP.md#deployment-to-vercel)**

## API Endpoints

### Groq AI Endpoints

- `POST /api/groq/mode1` — Get workout recommendation based on meal
- `POST /api/groq/mode2` — Get recovery meals based on workout
- `POST /api/groq/mode3` — Get skincare & wellness recommendation
- `POST /api/groq/sleep` — Get sleep improvement tips
- `POST /api/groq/mind` — Get mental wellness exercises
- `POST /api/groq/weekly-report` — Generate weekly progress report

## Troubleshooting

**Having issues?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for:
- Authentication issues
- Database connection problems
- Groq API errors
- Build and deployment issues
- Performance optimization tips

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lighthouse Score:** Target 90+
- **First Contentful Paint:** < 2s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

## Security

- ✅ Row-level security (RLS) on all Supabase tables
- ✅ OAuth authentication (Google, email)
- ✅ Environment variables for sensitive data
- ✅ Input validation on all forms
- ✅ Protected API routes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Support

- 📧 Email: support@fitethio.com
- 💬 Issues: [GitHub Issues](https://github.com/your-org/fitethio/issues)
- 📱 Social: [@fitethio](https://twitter.com/fitethio)

---

Made with ❤️ by the FitEthio team
