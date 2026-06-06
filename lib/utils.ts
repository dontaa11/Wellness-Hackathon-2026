import type { ActivityLevel, Goal, Profile } from '@/types';

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

export function calculateDailyCalories(profile: Pick<Profile, 'weight_kg' | 'height_cm' | 'age' | 'gender' | 'activity_level' | 'goal'>): number {
  const { weight_kg, height_cm, age, gender, activity_level, goal } = profile;
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
  let tdee = bmr * ACTIVITY_MULTIPLIERS[activity_level];
  switch (goal) {
    case 'lose_weight':
      tdee -= 500;
      break;
    case 'build_muscle':
      tdee += 300;
      break;
    case 'eat_healthy':
      tdee += 0;
      break;
    default:
      break;
  }
  return Math.round(tdee);
}

export function calculateProteinTarget(weightKg: number, goal: Goal): number {
  const multiplier = goal === 'build_muscle' ? 2.0 : goal === 'lose_weight' ? 1.6 : 1.4;
  return Math.round(weightKg * multiplier);
}

export function calculateWaterTarget(weightKg: number): number {
  return Math.round(weightKg * 0.033 * 10) / 10;
}

export function getWaterTargetMl(weightKg: number): number {
  return Math.round(weightKg * 33);
}

export function getYouTubeSearchUrl(exerciseName: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' exercise form tutorial')}`;
}

export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function isEvening(): boolean {
  return new Date().getHours() >= 20;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export interface FastingPeriodInfo {
  name: string;
  nameAm: string;
  active: boolean;
  daysRemaining: number;
}

export function getActiveFastingPeriod(periods: string[] = []): FastingPeriodInfo | null {
  const now = new Date();
  const day = now.getDay();

  if (periods.includes('tsome') && (day === 3 || day === 5)) {
    return { name: 'Tsome', nameAm: 'ጾም', active: true, daysRemaining: 1 };
  }

  const month = now.getMonth();
  const date = now.getDate();
  // Hudade approx: 55 days before Easter (roughly Feb-Mar)
  if (periods.includes('hudade') && month >= 1 && month <= 3) {
    const easterApprox = new Date(now.getFullYear(), 3, 20);
    const diff = Math.ceil((easterApprox.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0 && diff <= 55) {
      return { name: 'Hudade / Abiy Tsome', nameAm: 'ሁዳዴ / አብይ ጾም', active: true, daysRemaining: diff };
    }
  }

  if (periods.includes('apostolat') && month >= 5 && month <= 6) {
    return { name: 'Tsome Apostolat', nameAm: 'ጾም አፖስቶላት', active: true, daysRemaining: 14 };
  }

  if (periods.includes('fillseta') && month === 7) {
    return { name: 'Tsome Fillseta', nameAm: 'ጾም ፍልሰታ', active: true, daysRemaining: 14 };
  }

  return null;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
