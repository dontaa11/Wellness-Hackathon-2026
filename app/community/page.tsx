'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { Trophy } from 'lucide-react';
import { format, startOfWeek } from 'date-fns';

interface LeaderEntry {
  display_name: string;
  streak_days: number;
  user_id?: string;
}

export default function CommunityPage() {
  const t = useTranslations('community');
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [optedIn, setOptedIn] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
      const { data } = await supabase
        .from('leaderboard_entries')
        .select('display_name, streak_days, user_id')
        .eq('week_start', weekStart)
        .eq('opted_in', true)
        .order('streak_days', { ascending: false })
        .limit(10);

      if (data) {
        setLeaders(data);
        const idx = data.findIndex((e) => e.user_id === user.id);
        if (idx >= 0) setRank(idx + 1);
      }

      const { data: own } = await supabase
        .from('leaderboard_entries')
        .select('opted_in')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .single();

      if (own) setOptedIn(own.opted_in);
    };
    load();
  }, []);

  const toggleOptIn = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();
    const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');

    await supabase.from('leaderboard_entries').upsert({
      user_id: user.id,
      display_name: profile?.name?.charAt(0) + '***' || 'Anonymous',
      week_start: weekStart,
      opted_in: !optedIn,
      streak_days: 0,
    }, { onConflict: 'user_id,week_start' });

    setOptedIn(!optedIn);
  };

  return (
    <AppLayout>
      <h1 className="font-serif text-2xl font-bold mb-2">{t('title')}</h1>
      {rank && <p className="text-primary font-medium mb-4">{t('rank', { rank })}</p>}

      <button onClick={toggleOptIn} className="btn-secondary w-full mb-6">
        {optedIn ? 'Leave leaderboard' : t('optIn')}
      </button>

      <h2 className="font-serif font-semibold mb-3 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent" /> {t('topStreaks')}
      </h2>

      <div className="space-y-2">
        {leaders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No entries yet. Be the first!</p>
        ) : (
          leaders.map((entry, i) => (
            <div key={i} className="card flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-accent text-gray-900' : 'bg-gray-100'}`}>
                  {i + 1}
                </span>
                <span className="font-medium">{entry.display_name}</span>
              </div>
              <span className="text-primary font-bold">{entry.streak_days} days</span>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
