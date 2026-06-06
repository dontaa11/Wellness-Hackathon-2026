export type Gender = 'male' | 'female' | 'other';
export type Goal = 'lose_weight' | 'build_muscle' | 'stay_fit' | 'eat_healthy';
export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';
export type LogType = 'food' | 'workout' | 'water' | 'mood' | 'sleep';
export type FoodCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type FastingPeriod = 'tsome' | 'hudade' | 'apostolat' | 'fillseta' | 'none';
export type Locale = 'en' | 'am';

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  weight_kg: number;
  height_cm: number;
  goal: Goal;
  skin_type: SkinType;
  activity_level: ActivityLevel;
  fasting_mode: boolean;
  fasting_periods?: FastingPeriod[] | string[];
  language?: Locale;
  created_at?: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  log_type: LogType;
  content: Record<string, unknown>;
  created_at?: string;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  date: string;
  weight_kg?: number | null;
  water_ml: number;
  mood_score?: number | null;
  sleep_hours?: number | null;
  streak_days: number;
}

export interface EthiopianFood {
  id: string;
  name_en: string;
  name_am: string;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  serving_description: string;
  is_fasting_friendly: boolean;
  category: FoodCategory;
  image_url?: string | null;
}

export interface OnboardingData {
  name: string;
  age: number;
  gender: Gender;
  weight_kg: number;
  height_cm: number;
  goal: Goal;
  activity_level: ActivityLevel;
  skin_type: SkinType;
  fasting_mode: boolean;
  fasting_periods: FastingPeriod[];
}

export interface MealAnalysis {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  notes?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  muscle_group?: string;
  type?: 'bodyweight' | 'gym' | 'cardio' | 'flexibility';
}

export interface Mode1Response {
  meal_analysis: MealAnalysis;
  workout: {
    type: string;
    duration_min: number;
    exercises: Exercise[];
    best_time: string;
    water_glasses: number;
  };
}

export interface MealRecommendation {
  name_en: string;
  name_am: string;
  portion: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  reasoning: string;
}

export interface Mode2Response {
  calories_burned: number;
  meals: {
    breakfast: MealRecommendation;
    lunch: MealRecommendation;
    dinner: MealRecommendation;
  };
  water_liters: number;
  avoid: string[];
}

export interface Mode3Response {
  skincare: {
    morning: string[];
    evening: string[];
  };
  supplements: { name: string; reason: string }[];
  natural_options: { name: string; benefit: string; usage: string }[];
  avoid: string[];
}

export interface WeeklyReport {
  summary: string;
  highlight: string;
  improve: string;
  goals: string[];
}

export interface SleepRecommendation {
  ideal_duration_hours: number;
  bedtime_routine: string[];
  wake_up_time: string;
  tips: string[];
}

export interface MindWellnessResponse {
  tips: string[];
  encouragement: string;
}
