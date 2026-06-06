'use client';

import { useTranslations } from 'next-intl';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const t = useTranslations('onboarding');
  const percent = (current / total) * 100;

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-500 mb-2 text-center">
        {t('step', { current, total })}
      </p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
