# FitEthio Local Testing Guide

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- npm installed
- `.env.local` file configured with valid credentials
- Supabase database set up (schema and seed data loaded)

## Step 1: Start the Development Server

```bash
# Navigate to project directory
cd c:\Users\Student\projects\fitethio

# Install dependencies (if not done already)
npm install

# Start the dev server
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

Open your browser and navigate to: **http://localhost:3000**

---

## Step 2: Test Authentication & Onboarding

### 2.1 Sign Up with Email

1. Click **"Sign Up"** button
2. Enter:
   - **Email:** `testuser@fitethio.com`
   - **Password:** `TestPassword123!`
3. Click **"Sign Up"**
4. Check browser console for errors (F12 → Console tab)

**Expected:** Redirected to onboarding page

### 2.2 Complete 7-Step Onboarding

**Step 1 - Welcome Screen:**
- Click **"Let's build your profile"**

**Step 2 - Basic Info:**
- Name: `Abebe Bekele`
- Age: `28`
- Gender: `Male`
- Weight: `75` kg
- Height: `180` cm
- Click **Next**

**Step 3 - Goal:**
- Select: `Build muscle`
- Click **Next**

**Step 4 - Activity Level:**
- Select: `Moderate` (3-5 days/week)
- Click **Next**

**Step 5 - Skin Type:**
- Select: `Normal`
- Click **Next**

**Step 6 - Fasting Mode:**
- Select: `Yes`
- Check: `Tsome (Wed/Fri)` and `Hudade / Abiy Tsome`
- Click **Next**

**Step 7 - Body Analysis:**
- Review BMI, calories, protein targets
- Click **"Start my journey"**

**Expected:** Redirected to dashboard with your profile data

---

## Step 3: Test Dashboard Features

### 3.1 Check Dashboard Components

1. **Greeting Message:** Should say "Good [morning/afternoon/evening], Abebe!"
2. **Stats Cards:**
   - Calories today: Should show 0 (no logs yet)
   - Water today: Should show 0
   - Workout streak: Should show 0
   - Today's mood: Should be empty

### 3.2 Test Water Tracker

1. Click **"Add 250ml"** button multiple times
2. Should increment water count
3. **Expected:** Counter increases (8 glasses = 2L)

### 3.3 Test Language Toggle

1. Click **language icon** (top right)
2. Select **Amharic (አ)**
3. **Expected:** All text switches to Amharic
4. Switch back to **English** to continue

### 3.4 Test Dark Mode

1. Click **moon/sun icon** (top right)
2. **Expected:** Background and colors change to dark theme
3. Toggle back to light mode

### 3.5 Test Morning Check-in

1. Click **"Morning Check-in"** card
2. Fill in:
   - Mood: Select a rating (1-5 stars)
   - First Meal: Select from dropdown
   - Sleep: Enter hours (e.g., 7)
3. Click **"Save check-in"**
4. **Expected:** Data saved, modal closes

### 3.6 Test Fasting Banner

1. Fasting banner should appear if today is Wed/Fri
2. **Expected:** Shows "Fasting: Tsome (Wed/Fri) — X days remaining"

---

## Step 4: Test Mode 1 (Food → Workout)

### 4.1 Navigate to Mode 1

1. From dashboard, click **"Mode 1: Food → Workout"** card
2. Or use bottom navigation: Click **"Food"** tab

### 4.2 Log a Meal

1. **Option A - Pick from database:**
   - Click **"Pick from database"**
   - Select a food (e.g., "Injera with Doro Wot")
   - Click **"Select"**

2. **Option B - Custom meal:**
   - Type meal description in text input
   - Example: "2 plates of injera with split peas and egg"
   - Click **"Analyze & Plan Workout"**

### 4.3 AI Analysis & Workout Recommendation

1. **Expected:** Page shows:
   - Meal analysis (calories, protein, carbs, fat)
   - Recommended workout (type, duration, exercises)
   - Water recommendation
   - Loading spinner briefly appears

2. **If error occurs:**
   - Check console for error message
   - Verify `GROQ_API_KEY` in `.env.local`
   - Check Groq API quota

### 4.4 Verify Data Saved

1. Go to **Dashboard** → **Progress**
2. **Expected:** Today's calories should update

---

## Step 5: Test Mode 2 (Workout → Food)

### 5.1 Navigate to Mode 2

1. From dashboard, click **"Mode 2: Workout → Food"** card
2. Or use bottom navigation

### 5.2 Log a Workout

1. Fill in workout details:
   - Workout type: Select (e.g., "Cardio")
   - Duration: `45` minutes
   - Click **"Get Meal Plan"**

### 5.3 AI Recovery Meal Recommendation

1. **Expected:** Page shows:
   - Calories burned estimate
   - Recommended recovery meals
   - Foods to avoid
   - Water recommendation

2. System analyzes based on workout and your profile

---

## Step 6: Test Mode 3 (Skincare & Wellness)

### 6.1 Navigate to Mode 3

1. From dashboard, click **"Mode 3: Skincare & Wellness"** card

### 6.2 Get Skincare Recommendation

1. Click **"Analyze"** or **"Regenerate"**
2. **Expected:** Page shows:
   - Morning skincare routine
   - Evening skincare routine
   - Supplement recommendations
   - Natural options
   - Foods to avoid

---

## Step 7: Test Progress Page

### 7.1 View Progress Charts

1. From dashboard, click **"Progress"** tab
2. Or use bottom navigation

### 7.2 Log Weight

1. Click **"Log weight"** button
2. Enter weight: `74` kg
3. Click **"Save"**
4. **Expected:** Chart updates with new data point

### 7.3 Check Streaks

1. View **"Workout streak"** section
2. Should show: Current streak (increments daily if you log)
3. Longest streak (historical max)

### 7.4 Generate Weekly Report

1. Click **"Generate report"** button
2. **Expected:** Page shows:
   - Summary of the week
   - What you did well
   - Areas to improve
   - Goals for next week
   - AI-generated based on your logs

---

## Step 8: Test NEW Features

### 8.1 Community/Leaderboard Page

1. **Navigate to Community:**
   - Bottom navigation → Click **"Community"** tab
   - Or go to: `http://localhost:3000/community`

2. **Test Opt-in:**
   - Click **"Opt In"** button
   - **Expected:** Button changes to "Opted In" (green)
   - Your name appears in leaderboard (if streak > 0)

3. **View Leaderboard:**
   - **Expected:** Table shows:
     - Rank (1, 2, 3...)
     - User names
     - Current streak days
     - Ranked by highest streak

4. **Opt-out:**
   - Click button again to toggle off
   - **Expected:** Name disappears from leaderboard

### 8.2 Error Pages

1. **Test 404 Page:**
   - Visit: `http://localhost:3000/invalid-route`
   - **Expected:** Shows 404 page with:
     - Search icon
     - "Page Not Found" message
     - "Go Home" and "Dashboard" buttons
   - Click buttons to navigate back

2. **Test Error Boundary:**
   - Open browser DevTools Console (F12)
   - Run: `throw new Error('Test error')`
   - **Expected:** Error boundary catches it gracefully

### 8.3 Mind & Wellness

1. **Navigate to Mind:**
   - From dashboard, click **"Mind"** tab
   - Or bottom navigation

2. **Test Breathing Exercise:**
   - Click **"Breathing Exercise"** card
   - **Expected:** Shows 4-7-8 breathing technique
   - Visual guide with timing (inhale 4s, hold 7s, exhale 8s)

3. **View Wellness Tips:**
   - Check wellness tips section below

---

## Step 9: Test Navigation

### 9.1 Bottom Navigation

All pages should have bottom navigation showing:
- Home (Dashboard)
- Food (Mode 1)
- Workout (Mode 2)
- Wellness (Mode 3)
- Mind
- Community
- Progress

**Test:** Click each tab - should navigate smoothly

### 9.2 Header Navigation

- **FitEthio Logo:** Clicking should go to home/dashboard
- **Language Toggle:** Switches between English/Amharic
- **Dark Mode Toggle:** Switches theme
- **User Menu:** Clicking profile should show logout option

---

## Step 10: Test Responsive Design

### 10.1 Mobile View

1. Open DevTools (F12)
2. Click **"Toggle device toolbar"** (Ctrl+Shift+M)
3. Select **iPhone 12** or **Galaxy S20**

**Test on mobile:**
- Bottom navigation should be visible
- Components should stack vertically
- Text should be readable
- Buttons should be tappable (44px+ size)

### 10.2 Tablet View

1. Select **iPad** in device toolbar
2. **Expected:** Layout adjusts nicely for tablet size

### 10.3 Desktop View

1. Disable device toolbar (Ctrl+Shift+M)
2. **Expected:** Full desktop layout with proper spacing

---

## Step 11: Test Data Persistence

### 11.1 Refresh Page

1. Log some data (meal, workout, weight)
2. Refresh browser (F5)
3. **Expected:** All data persists
4. Data should come from Supabase database

### 11.2 Sign Out & Sign In

1. Click profile menu → **"Log out"**
2. **Expected:** Redirected to login page
3. Sign back in with same credentials
4. **Expected:** All your data is there
5. Dashboard shows your saved information

### 11.3 Check Database

1. Go to **Supabase Dashboard** → **Table Editor**
2. Check tables:
   - `profiles` → Your user record
   - `daily_logs` → Your food/workout logs
   - `progress_entries` → Weight and mood data
3. **Expected:** All your activity is logged

---

## Step 12: Test API Integration

### 12.1 Monitor API Calls

1. Open DevTools (F12) → **Network** tab
2. Log a meal in Mode 1
3. **Expected:** Network request appears:
   - **URL:** `/api/groq/mode1`
   - **Method:** POST
   - **Status:** 200
   - **Response:** Contains meal analysis and workout plan

### 12.2 Check Response Time

1. Note API response time in Network tab
2. **Expected:** Should be < 5 seconds
3. If slower, check internet connection or Groq API quota

### 12.3 Test Error Handling

1. **Temporarily disconnect internet**
2. Try to log a meal
3. **Expected:** Error message displays
4. **Reconnect internet** and retry

---

## Step 13: Run Test Suite

### 13.1 Run Unit Tests

```bash
npm test
```

**Expected output:**
```
 PASS  __tests__/components/ErrorBoundary.test.tsx
  ErrorBoundary
    ✓ renders children when there is no error
    ✓ displays error UI when child component throws
    ✓ shows retry button

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

### 13.2 Run Tests in Watch Mode

```bash
npm test:watch
```

**Expected:** Tests rerun whenever files change

### 13.3 View Coverage

```bash
npm test -- --coverage
```

**Expected:** Shows coverage report for components

---

## Step 14: Check Browser Console for Errors

### 14.1 Open DevTools

1. Press **F12** to open DevTools
2. Click **Console** tab

### 14.2 Look for Errors

**Should NOT see:**
- Red error messages
- 404 errors for resources
- TypeError or ReferenceError

**Expected:** 
- Clean console or only warnings
- Network requests showing 200 status

### 14.3 Check Network Requests

1. Click **Network** tab
2. Reload page
3. **Expected:** All requests show status 200
4. No red text (which indicates 4xx or 5xx errors)

---

## Step 15: Performance Testing

### 15.1 Check Page Load Time

1. Open DevTools → **Network** tab
2. Reload page
3. **Expected:** 
   - DOMContentLoaded: < 2 seconds
   - Load time: < 3 seconds

### 15.2 Lighthouse Audit

1. DevTools → **Lighthouse** tab (may need to install)
2. Click **Analyze page load**
3. **Expected:**
   - Performance: > 70
   - Accessibility: > 80
   - Best Practices: > 80

### 15.3 Monitor Performance

1. DevTools → **Performance** tab
2. Click record, perform actions, stop recording
3. **Expected:** Frames per second > 30 (smooth scrolling)

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Failed to load leaderboard" | Check Supabase connection, verify credentials |
| Groq API returns error | Check API key in `.env.local`, verify quota |
| Page shows blank | Check browser console for errors (F12) |
| Dark mode not working | Clear browser cache, try different browser |
| Water tracker not saving | Check Supabase `daily_logs` table RLS policies |
| Language toggle not working | Verify translation keys in `locales/*.json` |
| Mobile layout broken | Clear DevTools cache, hard refresh (Ctrl+Shift+R) |

---

## Testing Checklist

Use this checklist to track your testing progress:

### Authentication
- [ ] Sign up with email works
- [ ] Sign in with email works
- [ ] Sign out works
- [ ] Data persists after logout/login

### Onboarding
- [ ] All 7 steps complete successfully
- [ ] Data saves to database
- [ ] BMI calculation correct
- [ ] Fasting periods save correctly

### Dashboard
- [ ] Water tracker increments
- [ ] Language toggle works (EN/AM)
- [ ] Dark mode toggle works
- [ ] Morning check-in saves
- [ ] Fasting banner shows (if applicable)

### Mode 1 (Food → Workout)
- [ ] Can select food from database
- [ ] Can enter custom meal
- [ ] AI recommendation generates (Groq API)
- [ ] Meal analysis shows calories/macros
- [ ] Workout plan displays

### Mode 2 (Workout → Food)
- [ ] Can log workout details
- [ ] AI recommendation generates
- [ ] Recovery meals display
- [ ] Foods to avoid listed

### Mode 3 (Skincare)
- [ ] Skincare routine displays
- [ ] Morning/evening routines show
- [ ] Supplements recommended

### Progress
- [ ] Weight logging works
- [ ] Charts update with new data
- [ ] Streak tracking works
- [ ] Weekly report generates

### Community (NEW)
- [ ] Can navigate to community page
- [ ] Opt-in button works
- [ ] Leaderboard displays
- [ ] Rankings show correctly

### Error Handling (NEW)
- [ ] 404 page displays for invalid routes
- [ ] Error page shows on crashes
- [ ] Error boundary component works

### UI/UX
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] No console errors
- [ ] All images load
- [ ] Navigation smooth

### Performance
- [ ] Page loads < 3 seconds
- [ ] API responses < 5 seconds
- [ ] No lag in interactions
- [ ] Smooth scrolling

---

## Quick Test Commands

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Testing Complete!

Once you've completed all tests and checked off the checklist, your FitEthio application is ready for further development or deployment! 

**Next steps:**
1. Deploy to Vercel
2. Gather user feedback
3. Fix any bugs discovered
4. Add more features
5. Monitor performance in production
