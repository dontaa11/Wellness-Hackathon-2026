'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FoodPicker } from '@/components/FoodPicker';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import { createClient } from '@/lib/supabase/client';
import { getYouTubeSearchUrl } from '@/lib/utils';
import type { Mode1Response, Profile, EthiopianFood } from '@/types';
import { toast } from 'sonner';
import { ExternalLink, Clock, Droplets } from 'lucide-react';

export default function Mode1Page() {
  const t = useTranslations('mode1');
  const [meal, setMeal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Mode1Response | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          if (data) setProfile(data as Profile);
        });
      }
    });
  }, []);

  const analyze = async () => {
    if (!meal.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/groq/mode1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error('Could not analyze meal. Showing cached recommendations.');
      setResult({
        meal_analysis: { calories: 400, protein_g: 18, carbs_g: 50, fat_g: 12 },
        workout: {
          type: 'Bodyweight circuit',
          duration_min: 25,
          exercises: [
            { name: 'Walking', sets: 1, reps: '15 min', muscle_group: 'cardio', type: 'cardio' },
            { name: 'Squats', sets: 3, reps: '12', muscle_group: 'legs', type: 'bodyweight' },
          ],
          best_time: '1 hour after eating',
          water_glasses: 8,
        },
      });
    }
    setLoading(false);
  };

  const onFoodSelect = (food: EthiopianFood) => {
    setMeal(`${food.name_en} (${food.serving_description}) - ${food.calories_per_serving} kcal`);
  };

  return (
    <AppLayout>
      <h1 className="font-serif text-2xl font-bold mb-1">{t('title')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('subtitle')}</p>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          placeholder={t('input')}
          className="input-field"
        />
        <FoodPicker onSelect={onFoodSelect} fastingOnly={profile?.fasting_mode} />
        <button onClick={analyze} disabled={loading || !meal} className="btn-primary w-full">
          {loading ? t('analyze') + '...' : t('analyze')}
        </button>
      </div>

      {loading && <CardSkeleton />}

      {result && !loading && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-serif text-lg font-semibold mb-3">{t('mealAnalysis')}</h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div><p className="text-xl font-bold text-primary">{result.meal_analysis.calories}</p><p className="text-xs text-gray-500">kcal</p></div>
              <div><p className="text-xl font-bold">{result.meal_analysis.protein_g}g</p><p className="text-xs text-gray-500">protein</p></div>
              <div><p className="text-xl font-bold">{result.meal_analysis.carbs_g}g</p><p className="text-xs text-gray-500">carbs</p></div>
              <div><p className="text-xl font-bold">{result.meal_analysis.fat_g}g</p><p className="text-xs text-gray-500">fat</p></div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-serif text-lg font-semibold mb-3">{t('workoutPlan')}</h3>
            <p className="text-sm text-gray-500 mb-2">{result.workout.type} · {result.workout.duration_min} min</p>
            <div className="flex gap-4 text-sm mb-4">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {t('bestTime')}: {result.workout.best_time}</span>
              <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {result.workout.water_glasses} {t('waterGlasses')}</span>
            </div>
            <h4 className="font-medium mb-2">{t('exercises')}</h4>
            <div className="space-y-2">
              {result.workout.exercises.map((ex, i) => (
                <a
                  key={i}
                  href={getYouTubeSearchUrl(ex.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-primary/5"
                >
                  <div>
                    <p className="font-medium">{ex.name}</p>
                    <p className="text-sm text-gray-500">{ex.sets} sets × {ex.reps}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-primary" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
