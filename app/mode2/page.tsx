'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import type { Mode2Response } from '@/types';
import { toast } from 'sonner';
import { Flame, AlertTriangle } from 'lucide-react';

export default function Mode2Page() {
  const t = useTranslations('mode2');
  const [workoutType, setWorkoutType] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const [freeText, setFreeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Mode2Response | null>(null);

  const analyze = async () => {
    const workout = freeText || `${workoutType}: ${sets} sets × ${reps} reps, ${duration} min`;
    if (!workout.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/groq/mode2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workout }),
      });
      if (!res.ok) throw new Error('Failed');
      setResult(await res.json());
    } catch {
      toast.error('Could not generate meal plan. Showing defaults.');
    }
    setLoading(false);
  };

  const MealCard = ({ title, meal }: { title: string; meal: Mode2Response['meals']['breakfast'] }) => (
    <div className="card">
      <p className="text-xs text-gray-500 uppercase mb-1">{title}</p>
      <h4 className="font-serif text-lg font-semibold">{meal.name_en}</h4>
      <p className="text-sm text-primary">{meal.name_am}</p>
      <p className="text-sm text-gray-500 mt-1">{meal.portion}</p>
      <div className="flex gap-3 mt-2 text-sm">
        <span>{meal.calories} kcal</span>
        <span>P: {meal.protein_g}g</span>
        <span>C: {meal.carbs_g}g</span>
        <span>F: {meal.fat_g}g</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">{meal.reasoning}</p>
    </div>
  );

  return (
    <AppLayout>
      <h1 className="font-serif text-2xl font-bold mb-1">{t('title')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('subtitle')}</p>

      <div className="space-y-3 mb-6">
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder={t('input')}
          className="input-field min-h-[80px]"
        />
        <div className="grid grid-cols-3 gap-2">
          <input value={workoutType} onChange={(e) => setWorkoutType(e.target.value)} placeholder={t('type')} className="input-field" />
          <input value={sets} onChange={(e) => setSets(e.target.value)} placeholder={t('sets')} className="input-field" />
          <input value={reps} onChange={(e) => setReps(e.target.value)} placeholder={t('reps')} className="input-field" />
        </div>
        <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder={t('duration')} className="input-field" type="number" />
        <button onClick={analyze} disabled={loading} className="btn-primary w-full">
          {t('analyze')}
        </button>
      </div>

      {loading && <CardSkeleton />}

      {result && !loading && (
        <div className="space-y-4">
          <div className="card flex items-center gap-3">
            <Flame className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-gray-500">{t('caloriesBurned')}</p>
              <p className="text-3xl font-bold">{result.calories_burned} kcal</p>
            </div>
          </div>

          <h3 className="font-serif text-lg font-semibold">{t('recoveryMeals')}</h3>
          <MealCard title="Breakfast" meal={result.meals.breakfast} />
          <MealCard title="Lunch" meal={result.meals.lunch} />
          <MealCard title="Dinner" meal={result.meals.dinner} />

          {result.avoid.length > 0 && (
            <div className="card">
              <h4 className="flex items-center gap-2 font-medium text-red-600 mb-2">
                <AlertTriangle className="w-4 h-4" /> {t('avoid')}
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {result.avoid.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
