'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { ProgressEntry, WeeklyReport, Profile } from '@/types';
import { toast } from 'sonner';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';

export default function ProgressPage() {
  const t = useTranslations('progress');
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [weight, setWeight] = useState('');
  const [weightDate, setWeightDate] = useState(formatDate());

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (prof) setProfile(prof as Profile);

      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const { data } = await supabase
        .from('progress_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo)
        .order('date');

      if (data) setEntries(data as ProgressEntry[]);
    };
    load();
  }, []);

  const logWeight = async () => {
    if (!weight) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('progress_entries').upsert(
      { user_id: user.id, date: weightDate, weight_kg: parseFloat(weight) },
      { onConflict: 'user_id,date' }
    );

    if (error) toast.error(error.message);
    else {
      toast.success('Weight logged!');
      setEntries((prev) => [...prev.filter((e) => e.date !== weightDate), {
        id: '', user_id: user.id, date: weightDate, weight_kg: parseFloat(weight), water_ml: 0, streak_days: 0,
      }]);
      setWeight('');
    }
  };

  const generateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch('/api/groq/weekly-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!res.ok) throw new Error();
      setReport(await res.json());
    } catch {
      toast.error('Could not generate report.');
    }
    setLoadingReport(false);
  };

  const weightData = entries.filter((e) => e.weight_kg).map((e) => ({ date: e.date.slice(5), weight: e.weight_kg }));
  const waterData = entries.slice(-7).map((e) => ({ date: e.date.slice(5), water: (e.water_ml || 0) / 1000 }));
  const moodData = entries.filter((e) => e.mood_score).slice(-7).map((e) => ({ date: e.date.slice(5), mood: e.mood_score }));
  const currentStreak = entries.length > 0 ? entries[entries.length - 1].streak_days : 0;

  return (
    <AppLayout>
      <h1 className="font-serif text-2xl font-bold mb-6">{t('title')}</h1>

      <div className="card mb-4">
        <h3 className="font-serif font-semibold mb-3">{t('weight')}</h3>
        <div className="flex gap-2 mb-4">
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="kg" className="input-field flex-1" />
          <input type="date" value={weightDate} onChange={(e) => setWeightDate(e.target.value)} className="input-field flex-1" />
          <button onClick={logWeight} className="btn-primary px-4">{t('logWeight')}</button>
        </div>
        {weightData.length > 0 && (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#2D7A4F" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-primary">{currentStreak}</p>
          <p className="text-xs text-gray-500">{t('currentStreak')}</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-accent">{Math.max(...entries.map((e) => e.streak_days), 0)}</p>
          <p className="text-xs text-gray-500">{t('longestStreak')}</p>
        </div>
      </div>

      {waterData.length > 0 && (
        <div className="card mb-4">
          <h3 className="font-serif font-semibold mb-3">{t('waterWeek')}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="water" fill="#2D7A4F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {moodData.length > 0 && (
        <div className="card mb-4">
          <h3 className="font-serif font-semibold mb-3">{t('moodTrend')}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis domain={[1, 5]} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#E8B84B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {profile && (
        <div className="card mb-4">
          <h3 className="font-serif font-semibold mb-2">{t('goalProgress')}</h3>
          <p className="text-sm text-gray-500 capitalize mb-2">{profile.goal.replace('_', ' ')}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }} />
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif font-semibold">{t('weeklyReport')}</h3>
          <button onClick={generateReport} disabled={loadingReport} className="btn-accent text-sm py-2 px-4">
            {t('generateReport')}
          </button>
        </div>
        {loadingReport && <CardSkeleton />}
        {report && !loadingReport && (
          <div className="space-y-3 text-sm">
            <div><p className="font-medium">{t('summary')}</p><p className="text-gray-600">{report.summary}</p></div>
            <div><p className="font-medium text-primary">{t('highlight')}</p><p className="text-gray-600">{report.highlight}</p></div>
            <div><p className="font-medium text-accent-dark">{t('improve')}</p><p className="text-gray-600">{report.improve}</p></div>
            <div>
              <p className="font-medium">{t('goals')}</p>
              <ul className="list-disc list-inside text-gray-600">{report.goals.map((g, i) => <li key={i}>{g}</li>)}</ul>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
