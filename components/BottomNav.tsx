'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Dumbbell, Sparkles, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, labelKey: 'home' as const },
  { href: '/mode1', icon: Utensils, labelKey: 'food' as const },
  { href: '/mode2', icon: Dumbbell, labelKey: 'workout' as const },
  { href: '/mode3', icon: Sparkles, labelKey: 'wellness' as const },
  { href: '/progress', icon: BarChart3, labelKey: 'progress' as const },
];

export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 md:hidden">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
                active ? 'text-primary' : 'text-gray-400'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
