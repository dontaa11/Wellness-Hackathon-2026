'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { SleepRecommendation } from '@/types';
import { CardSkeleton } from './LoadingSkeleton';
import { Moon } from 'lucide-react';

export function EveningCheckIn() {
  const t = useTranslations('evening');
  const [bedtime, setBedtime] = useState('22:00');
  const [stress, setStress] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SleepRecommendation | null>(null);

  const getTips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/groq/sleep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedtimeGoal: bedtime, stressLevel: stress }),
      });
      if (res.ok) setResult(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="flex items-center gap-2 font-serif font-semibold mb-4">
        <Moon className="w-5 h-5 text-primary" /> {t('title')}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">{t('bedtime')}</label>
          <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">{t('stress')}: {stress}/5</label>
          <input type="range" min={1} max={5} value={stress} onChange={(e) => setStress(parseInt(e.target.value))} className="w-full accent-primary mt-1" />
        </div>
        <button onClick={getTips} className="btn-primary w-full">{t('getTips')}</button>
      </div>
      {loading && <div className="mt-4"><CardSkeleton /></div>}
      {result && (
        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Ideal sleep:</strong> {result.ideal_duration_hours} hours</p>
          <p><strong>Wake up:</strong> {result.wake_up_time}</p>
          <ol className="list-decimal list-inside">{result.bedtime_routine.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
    </div>
  );
}
