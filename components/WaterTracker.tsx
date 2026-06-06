'use client';

import { useTranslations } from 'next-intl';
import { Droplets } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate, getWaterTargetMl } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

interface WaterTrackerProps {
  currentMl: number;
  targetMl: number;
  userId: string;
  onUpdate: (ml: number) => void;
}

export function WaterTracker({ currentMl, targetMl, userId, onUpdate }: WaterTrackerProps) {
  const t = useTranslations('dashboard');
  const [loading, setLoading] = useState(false);
  const percent = Math.min(100, Math.round((currentMl / targetMl) * 100));
  const glasses = Math.floor(currentMl / 250);

  const addWater = async () => {
    setLoading(true);
    const supabase = createClient();
    const newMl = currentMl + 250;
    const today = formatDate();

    const { error } = await supabase
      .from('progress_entries')
      .upsert({ user_id: userId, date: today, water_ml: newMl }, { onConflict: 'user_id,date' });

    if (error) {
      toast.error(error.message);
    } else {
      onUpdate(newMl);
      toast.success('+250ml');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
          <Droplets className="w-5 h-5 text-primary" />
          {t('waterTracker')}
        </h3>
        <span className="text-sm text-gray-500">
          {currentMl} / {targetMl} ml
        </span>
      </div>
      <div className="progress-bar mb-3">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: Math.min(glasses, 12) }).map((_, i) => (
            <div key={i} className="w-6 h-8 bg-primary/20 rounded-b-lg border border-primary/40" />
          ))}
        </div>
        <button onClick={addWater} disabled={loading} className="btn-primary text-sm py-2 px-4">
          {t('addWater')}
        </button>
      </div>
    </div>
  );
}

export function calculateWaterTarget(weightKg: number) {
  return getWaterTargetMl(weightKg);
}
