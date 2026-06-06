'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function BreathingExercise() {
  const t = useTranslations('mind');
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const start = () => {
    setActive(true);
    setPhase('inhale');
    setTimeout(() => setPhase('hold'), 4000);
    setTimeout(() => setPhase('exhale'), 11000);
    setTimeout(() => { setActive(false); setPhase('inhale'); }, 19000);
  };

  return (
    <div className="card text-center">
      <h3 className="font-serif text-lg font-semibold mb-2">{t('breathing')}</h3>
      <p className="text-sm text-gray-500 mb-4">{t('breathingDesc')}</p>
      <div className="flex justify-center mb-4">
        <div
          className={`w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center ${active ? 'breathing-circle' : ''}`}
        >
          <div className="w-20 h-20 rounded-full bg-primary/40 flex items-center justify-center">
            <span className="text-white font-medium text-sm capitalize">{phase}</span>
          </div>
        </div>
      </div>
      <button onClick={start} disabled={active} className="btn-primary">
        {active ? phase + '...' : 'Start'}
      </button>
    </div>
  );
}
