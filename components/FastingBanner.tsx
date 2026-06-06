'use client';

import { useTranslations } from 'next-intl';
import { getActiveFastingPeriod } from '@/lib/utils';
import { Moon } from 'lucide-react';

interface FastingBannerProps {
  periods: string[];
}

export function FastingBanner({ periods }: FastingBannerProps) {
  const t = useTranslations('dashboard');
  const active = getActiveFastingPeriod(periods);

  if (!active) return null;

  return (
    <div className="bg-accent/20 border border-accent rounded-xl p-4 flex items-center gap-3">
      <Moon className="w-6 h-6 text-accent-dark flex-shrink-0" />
      <p className="text-sm font-medium">
        {t('fastingBanner', { period: active.name, days: active.daysRemaining })}
      </p>
    </div>
  );
}
