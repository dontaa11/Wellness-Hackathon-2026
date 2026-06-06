'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import { createClient } from '@/lib/supabase/client';
import type { Mode3Response, Profile } from '@/types';
import { toast } from 'sonner';
import { RefreshCw, Sun, Moon, Pill, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'skincare' | 'supplements' | 'natural';

export default function Mode3Page() {
  const t = useTranslations('mode3');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<Mode3Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('skincare');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/groq/mode3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Failed');
      setResult(await res.json());
    } catch {
      toast.error('Using cached wellness recommendations.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          if (data) setProfile(data as Profile);
        });
      }
    });
    load();
  }, []);

  const tabs: { key: Tab; label: string; icon: typeof Sun }[] = [
    { key: 'skincare', label: t('skincare'), icon: Sun },
    { key: 'supplements', label: t('supplements'), icon: Pill },
    { key: 'natural', label: t('natural'), icon: Leaf },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">{t('title')}</h1>
          <p className="text-gray-500 text-sm">{t('subtitle')}</p>
        </div>
        <button onClick={load} disabled={loading} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <RefreshCw className={cn('w-5 h-5', loading && 'animate-spin')} />
        </button>
      </div>

      {profile && (
        <div className="card mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{profile.name}</p>
              <p className="text-sm text-gray-500 capitalize">{profile.skin_type} skin · {profile.activity_level}</p>
            </div>
            {profile.gender === 'female' && (
              <span className="text-xs bg-accent/20 text-accent-dark px-2 py-1 rounded-full">{t('girlsMode')}</span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-sm transition-colors',
              tab === key ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {loading && <CardSkeleton />}

      {result && !loading && (
        <div className="space-y-4">
          {tab === 'skincare' && (
            <>
              <div className="card">
                <h3 className="flex items-center gap-2 font-serif font-semibold mb-3">
                  <Sun className="w-5 h-5 text-accent" /> {t('morning')}
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {result.skincare.morning.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </div>
              <div className="card">
                <h3 className="flex items-center gap-2 font-serif font-semibold mb-3">
                  <Moon className="w-5 h-5 text-primary" /> {t('evening')}
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {result.skincare.evening.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </div>
            </>
          )}

          {tab === 'supplements' && result.supplements.map((s, i) => (
            <div key={i} className="card">
              <h4 className="font-medium">{s.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{s.reason}</p>
            </div>
          ))}

          {tab === 'natural' && result.natural_options.map((n, i) => (
            <div key={i} className="card">
              <h4 className="font-medium">{n.name}</h4>
              <p className="text-sm text-primary mt-1">{n.benefit}</p>
              <p className="text-sm text-gray-500 mt-1">{n.usage}</p>
            </div>
          ))}

          {result.avoid.length > 0 && (
            <div className="card bg-red-50 dark:bg-red-900/20">
              <h4 className="font-medium text-red-600 mb-2">{t('avoid')}</h4>
              <ul className="list-disc list-inside text-sm">
                {result.avoid.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
