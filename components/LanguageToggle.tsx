'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LanguageToggle() {
  const router = useRouter();
  const [locale, setLocale] = useState<'en' | 'am'>('en');

  const toggle = async () => {
    const newLocale = locale === 'en' ? 'am' : 'en';
    setLocale(newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle language"
    >
      {locale === 'en' ? 'አማ' : 'EN'}
    </button>
  );
}
