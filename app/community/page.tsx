'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { Trophy, Users } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

interface LeaderboardEntry {
  id: string;
  display_name: string;
  streak_days: number;
  week_start: string;
}

export default function CommunityPage() {
  const t = useTranslations();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opted, setOpted] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .eq('opted_in', true)
        .order('streak_days', { ascending: false })
        .limit(50);
      if (err) throw err;
      setLeaderboard(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleOptIn = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please log in to participate');
        return;
      }
      const newOptedStatus = !opted;
      const { error: err } = await supabase
        .from('leaderboard_entries')
        .update({ opted_in: newOptedStatus })
        .eq('user_id', user.id)
        .eq('week_start', new Date().toISOString().split('T')[0]);
      if (err) throw err;
      setOpted(newOptedStatus);
      await fetchLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update opt-in status');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-4 p-4">
          <LoadingSkeleton lines={5} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 pb-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('community.leaderboard')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('community.description')}
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {t('community.joinLeaderboard')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('community.optInDescription')}
                </p>
              </div>
            </div>
            <button
              onClick={toggleOptIn}
              className={`px-4 py-2 rounded-lg font-medium transition ${opted ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100'}`}
            >
              {opted ? t('community.optedIn') : t('community.optIn')}
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                {t('community.noEntries')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {t('community.rank')}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {t('community.name')}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {t('community.streak')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'}`}>
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {entry.display_name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {entry.streak_days}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('common.days')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {t('community.howItWorks')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>{t('community.info1')}</li>
            <li>{t('community.info2')}</li>
            <li>{t('community.info3')}</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
