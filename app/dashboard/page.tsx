'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { WaterTracker } from '@/components/WaterTracker';
import { FastingBanner } from '@/components/FastingBanner';
import { MorningCheckIn } from '@/components/MorningCheckIn';
import { createClient } from '@/lib/supabase/client';
import { EveningCheckIn } from '@/components/EveningCheckIn';
import { formatDate, getGreeting, getWaterTargetMl, isEvening } from '@/lib/utils';
import type { Profile } from '@/types';
import { Utensils, Dumbbell, Sparkles, BarChart3, Brain, Flame, Droplets, Heart } from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [waterMl, setWaterMl] = useState(0);
  const [calories, setCalories] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (prof) setProfile(prof as Profile);

      const today = formatDate();
      const { data: progress } = await supabase
        .from('progress_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (progress) {
        setWaterMl(progress.water_ml || 0);
        setMood(progress.mood_score);
        setStreak(progress.streak_days || 0);
      }

      const { data: foodLogs } = await supabase
        .from('daily_logs')
        .select('content')
        .eq('user_id', user.id)
        .eq('date', today)
        .eq('log_type', 'food');

      const totalCals = (foodLogs || []).reduce((sum, log) => {
        const c = log.content as { calories?: number };
        return sum + (c.calories || 0);
      }, 0);
      setCalories(totalCals);

      const checkinDate = localStorage.getItem('checkin_date');
      if (checkinDate !== today) {
        setShowCheckIn(true);
      }
    };
    load();
  }, []);

  if (!profile) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4">
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-32 w-full" />
        </div>
      </AppLayout>
    );
  }

  const greeting = getGreeting();
  const waterTarget = getWaterTargetMl(profile.weight_kg);

  return (
    <AppLayout>
      <h1 className="font-serif text-2xl font-bold mb-2">
        {t('greeting', { time: t(greeting), name: profile.name })}
      </h1>

      {profile.fasting_mode && (
        <div className="mb-4">
          <FastingBanner periods={(profile.fasting_periods as string[]) || []} />
        </div>
      )}

      <Link href="/mode1" className="card block mb-4 bg-primary text-white hover:bg-primary-dark transition-colors">
        <p className="font-medium text-lg">{t('checkIn')}</p>
        <p className="text-white/80 text-sm mt-1">→ {t('mode1')}</p>
      </Link>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="stat-card">
          <Flame className="w-5 h-5 text-accent mb-1" />
          <p className="text-2xl font-bold">{calories}</p>
          <p className="text-xs text-gray-500">{t('caloriesToday')}</p>
        </div>
        <div className="stat-card">
          <Droplets className="w-5 h-5 text-primary mb-1" />
          <p className="text-2xl font-bold">{waterMl}</p>
          <p className="text-xs text-gray-500">{t('waterToday')}</p>
        </div>
        <div className="stat-card">
          <Dumbbell className="w-5 h-5 text-primary mb-1" />
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-xs text-gray-500">{t('workoutStreak')}</p>
        </div>
        <div className="stat-card">
          <Heart className="w-5 h-5 text-red-400 mb-1" />
          <p className="text-2xl font-bold">{mood ? `${mood}/5` : '—'}</p>
          <p className="text-xs text-gray-500">{t('moodToday')}</p>
        </div>
      </div>

      <div className="mb-4">
        <WaterTracker
          currentMl={waterMl}
          targetMl={waterTarget}
          userId={userId}
          onUpdate={setWaterMl}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/mode1" className="select-card flex flex-col items-center py-4 gap-2">
          <Utensils className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium">{t('mode1')}</span>
        </Link>
        <Link href="/mode2" className="select-card flex flex-col items-center py-4 gap-2">
          <Dumbbell className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium">{t('mode2')}</span>
        </Link>
        <Link href="/mode3" className="select-card flex flex-col items-center py-4 gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium">{t('mode3')}</span>
        </Link>
        <Link href="/progress" className="select-card flex flex-col items-center py-4 gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium">{t('progress')}</span>
        </Link>
        <Link href="/mind" className="select-card flex flex-col items-center py-4 gap-2 col-span-2">
          <Brain className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium">{t('mind')}</span>
        </Link>
      </div>

      {isEvening() && (
        <div className="mt-4">
          <EveningCheckIn />
        </div>
      )}

      {showCheckIn && userId && (
        <MorningCheckIn userId={userId} onClose={() => setShowCheckIn(false)} />
      )}
    </AppLayout>
  );
}
