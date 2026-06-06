'use client';

import { useState } from 'react';
import { ETHIOPIAN_FOODS } from '@/lib/foods';
import type { EthiopianFood } from '@/types';
import { Search } from 'lucide-react';

interface FoodPickerProps {
  onSelect: (food: EthiopianFood) => void;
  fastingOnly?: boolean;
  locale?: string;
}

export function FoodPicker({ onSelect, fastingOnly = false, locale = 'en' }: FoodPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const foods = ETHIOPIAN_FOODS.filter((f) => {
    if (fastingOnly && !f.is_fasting_friendly) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return f.name_en.toLowerCase().includes(q) || f.name_am.includes(query);
  });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn-secondary w-full flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" />
        Pick from database
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods..."
            className="input-field rounded-none border-0 border-b"
          />
          <div className="overflow-y-auto max-h-48">
            {foods.map((food) => (
              <button
                key={food.id}
                type="button"
                onClick={() => { onSelect(food); setOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-primary/5 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{locale === 'am' ? food.name_am : food.name_en}</p>
                  <p className="text-xs text-gray-500">{food.calories_per_serving} kcal · {food.serving_description}</p>
                </div>
                {food.is_fasting_friendly && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">ጾም</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
