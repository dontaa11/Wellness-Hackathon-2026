-- FitEthio Supabase Schema
-- Run this in your Supabase SQL Editor

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  weight_kg NUMERIC NOT NULL,
  height_cm NUMERIC NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('lose_weight', 'build_muscle', 'stay_fit', 'eat_healthy')),
  skin_type TEXT NOT NULL CHECK (skin_type IN ('oily', 'dry', 'combination', 'normal', 'sensitive')),
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active')),
  fasting_mode BOOLEAN DEFAULT FALSE,
  fasting_periods JSONB DEFAULT '[]'::jsonb,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'am')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  log_type TEXT NOT NULL CHECK (log_type IN ('food', 'workout', 'water', 'mood', 'sleep')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress entries table
CREATE TABLE IF NOT EXISTS progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC,
  water_ml INT DEFAULT 0,
  mood_score INT CHECK (mood_score >= 1 AND mood_score <= 5),
  sleep_hours NUMERIC,
  streak_days INT DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Ethiopian foods table (public read)
CREATE TABLE IF NOT EXISTS ethiopian_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_am TEXT NOT NULL,
  calories_per_serving INT NOT NULL,
  protein_g NUMERIC NOT NULL,
  carbs_g NUMERIC NOT NULL,
  fat_g NUMERIC NOT NULL,
  serving_description TEXT NOT NULL,
  is_fasting_friendly BOOLEAN DEFAULT FALSE,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  image_url TEXT
);

-- Weekly reports table
CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  report JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community leaderboard (opt-in)
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  streak_days INT DEFAULT 0,
  week_start DATE NOT NULL,
  opted_in BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, week_start)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Daily logs policies
CREATE POLICY "Users can view own logs" ON daily_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON daily_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON daily_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON daily_logs FOR DELETE USING (auth.uid() = user_id);

-- Progress entries policies
CREATE POLICY "Users can view own progress" ON progress_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON progress_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON progress_entries FOR UPDATE USING (auth.uid() = user_id);

-- Weekly reports policies
CREATE POLICY "Users can view own reports" ON weekly_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON weekly_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard policies
CREATE POLICY "Users can view opted-in leaderboard" ON leaderboard_entries FOR SELECT USING (opted_in = true OR auth.uid() = user_id);
CREATE POLICY "Users can manage own leaderboard entry" ON leaderboard_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leaderboard entry" ON leaderboard_entries FOR UPDATE USING (auth.uid() = user_id);

-- Ethiopian foods: public read
ALTER TABLE ethiopian_foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read foods" ON ethiopian_foods FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_date ON progress_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_ethiopian_foods_category ON ethiopian_foods(category);
