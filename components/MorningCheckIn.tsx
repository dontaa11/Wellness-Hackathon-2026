'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😄'];

interface MorningCheckInProps {
  userId: string;
  onClose: () => void;
}

export function MorningCheckIn({ userId, onClose }: MorningCheckInProps) {
  const t = useTranslations('checkIn');
  const [mood, setMood] = useState(3);
  const [meal, setMeal] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const supabase = createClient();
    const today = formatDate();

    const { error: progressError } = await supabase
      .from('progress_entries')
      .upsert(
        { user_id: userId, date: today, mood_score: mood, sleep_hours: sleepHours },
        { onConflict: 'user_id,date' }
      );

    if (meal) {
      await supabase.from('daily_logs').insert({
        user_id: userId,
        date: today,
        log_type: 'food',
        content: { meal, source: 'morning_checkin' },
      });
    }

    if (progressError) {
      toast.error(progressError.message);
    } else {
      localStorage.setItem('checkin_date', today);
      toast.success('Check-in saved!');
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold">{t('title')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">{t('mood')}</label>
            <div className="flex justify-between text-3xl">
              {MOOD_EMOJIS.map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMood(i + 1)}
                  className={`p-2 rounded-xl transition-transform ${mood === i + 1 ? 'scale-125 bg-primary/10' : 'opacity-50'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('meal')}</label>
            <input
              type="text"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="input-field"
              placeholder="Injera with shiro..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('sleep')}: {sleepHours} {t('hours')}
            </label>
            <input
              type="range"
              min={3}
              max={12}
              step={0.5}
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <button onClick={submit} disabled={loading} className="btn-primary w-full">
            {t('submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
