# FitEthio Troubleshooting Guide

## Common Issues & Solutions

### 1. Authentication Issues

#### "Invalid API Key" Error

**Symptoms:** Getting 401 errors or "Invalid credentials"

**Solutions:**
- Verify your Supabase credentials are correct in `.env.local`
- Check if your anon key has NOT expired in Supabase settings
- Clear browser cookies and cache, then try again
- Make sure you're using the **anon public key**, not the service key

#### "Redirect URL Mismatch" Error

**Symptoms:** OAuth redirect fails after sign-in

**Solutions:**
- For local development, make sure OAuth is configured for `http://localhost:3000/auth/callback`
- For production, add your Vercel domain to Supabase URL Configuration
- In Supabase → Authentication → URL Configuration, add:
  - `http://localhost:3000`
  - `https://your-vercel-domain.vercel.app`

---

### 2. Database Issues

#### "No Database Connection" / "relation does not exist"

**Symptoms:** App loads but crashes when trying to load data

**Solutions:**
- Verify you ran `supabase/schema.sql` in the SQL Editor
- Verify you ran `supabase/seed.sql` to populate Ethiopian foods
- Check Row Level Security (RLS) policies are enabled:
  - Go to Supabase → SQL Editor
  - Run: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
  - All tables should show up

#### "Permission Denied" Error

**Symptoms:** "new row violates row level security policy"

**Solutions:**
- Ensure RLS policies were created correctly (check schema.sql was fully run)
- Clear browser cache and re-login
- Check your Supabase user is authenticated: Go to Authentication → Users and verify your user exists

---

### 3. Groq API Issues

#### "Invalid Groq API Key"

**Symptoms:** Getting 401 or 403 errors from `/api/groq/*` routes

**Solutions:**
- Verify your Groq API key is correct in `.env.local`
- Get a new key from [https://console.groq.com/keys](https://console.groq.com/keys)
- Make sure you DON'T have extra spaces around the key

#### "Rate Limit Exceeded"

**Symptoms:** "429 Too Many Requests" after several API calls

**Solutions:**
- Groq's free tier has rate limits (check console.groq.com for your tier)
- Wait a few minutes before retrying
- Upgrade to a paid plan if needed

#### AI Recommendations Not Generating

**Symptoms:** Clicking "Get Recommendation" shows loading but never completes

**Solutions:**
- Check your browser's Network tab in DevTools to see the API response
- Verify Groq API is working: `curl -H "Authorization: Bearer YOUR_KEY" https://api.groq.com/openai/v1/models`
- Check your internet connection
- Try refreshing the page

---

### 4. Frontend Issues

#### "npm install" Fails

**Symptoms:** Various dependency errors during `npm install`

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### "npm run dev" Port Already in Use

**Symptoms:** "Error: listen EADDRINUSE: address already in use :::3000"

**Solutions:**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

#### Styles Not Loading / Tailwind Not Working

**Symptoms:** Pages look unstyled, missing colors/margins

**Solutions:**
- Delete `.next` folder and rebuild:
  ```bash
  rm -rf .next
  npm run dev
  ```
- Verify `tailwind.config.ts` includes all template paths
- Clear browser cache (Ctrl+Shift+Delete)

#### "Module not found" Errors

**Symptoms:** "Cannot find module '@/components/...'"

**Solutions:**
- Verify the file exists in that path
- Check the path uses correct case (Windows is case-insensitive, but git isn't)
- Run `npm install` again

---

### 5. Build Issues

#### "npm run build" Fails

**Symptoms:** Build fails with TypeScript or build errors

**Solutions:**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clear Next.js cache and rebuild
rm -rf .next
npm run build

# Check for unused dependencies
npm audit
```

#### Type Errors in IDE

**Symptoms:** Red squiggles in VS Code, but `npm run build` works

**Solutions:**
- Reload TypeScript: Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows) → "TypeScript: Restart TS Server"
- Delete `.next` folder
- Reinstall dependencies: `npm install`

---

### 6. Data Issues

#### Water Tracker Not Saving

**Symptoms:** Water intake updates but doesn't persist on reload

**Solutions:**
- Check browser DevTools Network tab for failed requests
- Verify you're logged in and your profile exists
- Check that `daily_logs` table has entries

#### Charts Show No Data

**Symptoms:** Progress page loads but charts are empty

**Solutions:**
- Make sure you've logged water intake and workouts
- Check database: Go to Supabase → Table Editor → `daily_logs`
- Verify entries are created for today's date

#### Progress Not Calculating Streak

**Symptoms:** Streak days always show 0

**Solutions:**
- Manually log data for consecutive days
- Check `progress_entries` table has `streak_days` populated
- Verify your timezone is set correctly

---

### 7. Language/Localization Issues

#### Wrong Language Displaying

**Symptoms:** Language toggle not working or wrong text showing

**Solutions:**
- Check browser localStorage: Open DevTools → Application → localStorage
- Look for `NEXT_INTL_LOCALE` and verify it's `en` or `am`
- Clear localStorage and try again:
  ```javascript
  // In DevTools Console
  localStorage.clear()
  location.reload()
  ```

#### Amharic Text Not Displaying

**Symptoms:** Amharic text shows as boxes or mojibake

**Solutions:**
- Make sure your system has Amharic font support
- Add fallback fonts to `globals.css`:
  ```css
  body {
    font-family: 'Arial', 'Helvetica Neue', sans-serif, 'Noto Sans Ethiopic';
  }
  ```

---

### 8. Mobile/Responsive Issues

#### App Not Responsive on Mobile

**Symptoms:** Content overflows or buttons don't work on phone

**Solutions:**
- Check viewport meta tag in `app/layout.tsx`
- Test in Chrome DevTools Mobile view (F12 → Toggle device toolbar)
- Verify Tailwind responsive classes are used: `sm:`, `md:`, `lg:`

#### Bottom Navigation Not Appearing

**Symptoms:** BottomNav component not visible on mobile

**Solutions:**
- Verify `BottomNav` is included in `AppLayout`
- Check z-index issues: Set `z-50` on BottomNav
- Clear browser cache

---

### 9. Deployment Issues (Vercel)

#### Vercel Build Fails

**Symptoms:** "Build failed" message after pushing to GitHub

**Solutions:**
- Check build logs on Vercel dashboard
- Make sure all environment variables are set
- Run `npm run build` locally to reproduce
- Check for hardcoded URLs that need to be environment variables

#### 404 on Vercel but Works Locally

**Symptoms:** Routes work on localhost but show 404 on Vercel

**Solutions:**
- Check file names match case-sensitivity (e.g., `page.tsx` not `Page.tsx`)
- Verify `next.config.mjs` doesn't have conflicting settings
- Clear Vercel cache: Vercel dashboard → Project Settings → Advanced → "Clear cache" → Redeploy

#### Environment Variables Not Available on Vercel

**Symptoms:** App crashes saying env vars are undefined

**Solutions:**
- In Vercel dashboard, go to Settings → Environment Variables
- Verify all three vars are set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`
- Redeploy after adding vars (don't just push code)

---

### 10. Performance Issues

#### App Loading Slowly

**Symptoms:** Takes >3 seconds to load pages

**Solutions:**
- Check Network tab in DevTools to see which requests are slow
- Optimize images: Consider using `next/image` component
- Check if Groq API is responding slowly
- Monitor Supabase performance

#### High Memory Usage / Crashes

**Symptoms:** Browser tab becomes unresponsive

**Solutions:**
- Check if you're logging large objects to console
- Verify charts aren't rendering too much data
- Clear browser cache and restart
- Check for memory leaks in components

---

## How to Get Help

If none of these solutions work:

1. **Check error logs:**
   - Browser Console: F12 → Console tab
   - Supabase Logs: Supabase dashboard → Logs
   - Vercel Logs: Vercel dashboard → Deployments → View logs

2. **Gather debugging info:**
   - Browser version and OS
   - Error message (full stack trace)
   - Steps to reproduce
   - Your environment variables (remove secrets)

3. **Contact Support:**
   - Supabase: https://supabase.com/support
   - Groq: https://console.groq.com
   - Next.js: https://github.com/vercel/next.js/discussions
