'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { BreathingExercise } from '@/components/BreathingExercise';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import type { MindWellnessResponse } from '@/types';
import { toast } from 'sonner';

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😄'];

export default function MindPage() {
  const t = useTranslations('mind');
  const [mood, setMood] = useState(3);
  const [tips, setTips] = useState<MindWellnessResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const getTips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/groq/mind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodScore: mood }),
      });
      if (!res.ok) throw new Error();
      setTips(await res.json());
    } catch {
      toast.error('Could not load tips.');
    }
    setLoading(false);
  };

  return (
    <AppLayout>
      <h1 className="font-serif text-2xl font-bold mb-6">{t('title')}</h1>

      <div className="card mb-4">
        <p className="text-sm font-medium mb-3">How are you feeling?</p>
        <div className="flex justify-between text-3xl mb-4">
          {MOOD_EMOJIS.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setMood(i + 1)}
              className={`p-2 rounded-xl transition-transform ${mood === i + 1 ? 'scale-125 bg-primary/10' : 'opacity-50'}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <button onClick={getTips} className="btn-primary w-full">{t('tips')}</button>
      </div>

      {mood <= 2 && <div className="mb-4"><BreathingExercise /></div>}

      {loading && <CardSkeleton />}

      {tips && !loading && (
        <div className="card space-y-3">
          <p className="text-primary font-medium italic">{tips.encouragement}</p>
          <h3 className="font-serif font-semibold">{t('tips')}</h3>
          <ul className="space-y-2">
            {tips.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary font-bold">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AppLayout>
  );
}
