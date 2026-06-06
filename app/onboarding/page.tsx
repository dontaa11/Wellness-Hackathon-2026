'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ProgressBar } from '@/components/ProgressBar';
import { createClient } from '@/lib/supabase/client';
import {
  calculateBMI,
  getBMICategory,
  calculateDailyCalories,
  calculateProteinTarget,
  calculateWaterTarget,
  cn,
} from '@/lib/utils';
import type { OnboardingData, Gender, Goal, ActivityLevel, SkinType, FastingPeriod } from '@/types';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react';

const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const ta = useTranslations('onboarding.analysis');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    age: 25,
    gender: 'male',
    weight_kg: 70,
    height_cm: 170,
    goal: 'stay_fit',
    activity_level: 'moderate',
    skin_type: 'normal',
    fasting_mode: false,
    fasting_periods: [],
  });

  const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePeriod = (period: FastingPeriod) => {
    setData((prev) => ({
      ...prev,
      fasting_periods: prev.fasting_periods.includes(period)
        ? prev.fasting_periods.filter((p) => p !== period)
        : [...prev.fasting_periods, period],
    }));
  };

  const bmi = calculateBMI(data.weight_kg, data.height_cm);
  const bmiCategory = getBMICategory(bmi);
  const calories = calculateDailyCalories(data);
  const protein = calculateProteinTarget(data.weight_kg, data.goal);
  const water = calculateWaterTarget(data.weight_kg);

  const finish = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Not authenticated');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: data.name,
      age: data.age,
      gender: data.gender,
      weight_kg: data.weight_kg,
      height_cm: data.height_cm,
      goal: data.goal,
      skin_type: data.skin_type,
      activity_level: data.activity_level,
      fasting_mode: data.fasting_mode,
      fasting_periods: data.fasting_periods,
    });

    if (error) {
      toast.error(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const goals: Goal[] = ['lose_weight', 'build_muscle', 'stay_fit', 'eat_healthy'];
  const activities: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'very_active'];
  const skins: SkinType[] = ['oily', 'dry', 'combination', 'normal', 'sensitive'];
  const periods: FastingPeriod[] = ['tsome', 'hudade', 'apostolat', 'fillseta'];

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-lg mx-auto">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold">{t('welcome.title')}</h1>
          <p className="text-gray-500">{t('welcome.subtitle')}</p>
          <button onClick={() => setStep(2)} className="btn-primary w-full">
            {t('welcome.cta')}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">{t('basicInfo.title')}</h2>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={t('basicInfo.name')}
            className="input-field"
          />
          <input
            type="number"
            value={data.age}
            onChange={(e) => update('age', parseInt(e.target.value))}
            placeholder={t('basicInfo.age')}
            className="input-field"
          />
          <div>
            <p className="text-sm font-medium mb-2">{t('basicInfo.gender')}</p>
            <div className="flex gap-2">
              {(['male', 'female', 'other'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update('gender', g)}
                  className={cn('select-card flex-1 text-center py-3', data.gender === g && 'select-card-active')}
                >
                  {t(`basicInfo.${g}`)}
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            value={data.weight_kg}
            onChange={(e) => update('weight_kg', parseFloat(e.target.value))}
            placeholder={t('basicInfo.weight')}
            className="input-field"
          />
          <input
            type="number"
            value={data.height_cm}
            onChange={(e) => update('height_cm', parseFloat(e.target.value))}
            placeholder={t('basicInfo.height')}
            className="input-field"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">{t('goal.title')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update('goal', g)}
                className={cn('select-card py-6 text-center', data.goal === g && 'select-card-active')}
              >
                <span className="font-medium">{t(`goal.${g}`)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">{t('activity.title')}</h2>
          {activities.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => update('activity_level', a)}
              className={cn('select-card w-full text-left p-4', data.activity_level === a && 'select-card-active')}
            >
              <p className="font-medium">{t(`activity.${a}`)}</p>
              <p className="text-sm text-gray-500">{t(`activity.${a}Desc`)}</p>
            </button>
          ))}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">{t('skin.title')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {skins.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update('skin_type', s)}
                className={cn('select-card py-4 text-center', data.skin_type === s && 'select-card-active')}
              >
                {t(`skin.${s}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">{t('fasting.title')}</h2>
          <p className="text-gray-500">{t('fasting.question')}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => update('fasting_mode', true)}
              className={cn('select-card flex-1 py-4 text-center', data.fasting_mode && 'select-card-active')}
            >
              {t('fasting.yes')}
            </button>
            <button
              type="button"
              onClick={() => { update('fasting_mode', false); update('fasting_periods', []); }}
              className={cn('select-card flex-1 py-4 text-center', !data.fasting_mode && 'select-card-active')}
            >
              {t('fasting.no')}
            </button>
          </div>
          {data.fasting_mode && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('fasting.periods')}</p>
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePeriod(p)}
                  className={cn('select-card w-full py-3 text-left px-4', data.fasting_periods.includes(p) && 'select-card-active')}
                >
                  {t(`fasting.${p}`)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 7 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">{ta('title')}</h2>
          <div className="card space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary/5 rounded-xl p-4">
                <p className="text-sm text-gray-500">{ta('bmi')}</p>
                <p className="text-3xl font-bold text-primary">{bmi}</p>
                <p className="text-sm">{ta(bmiCategory as 'underweight')}</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-4">
                <p className="text-sm text-gray-500">{ta('calories')}</p>
                <p className="text-3xl font-bold text-accent-dark">{calories}</p>
                <p className="text-sm">kcal/day</p>
              </div>
              <div className="bg-primary/5 rounded-xl p-4">
                <p className="text-sm text-gray-500">{ta('protein')}</p>
                <p className="text-2xl font-bold text-primary">{protein}g</p>
              </div>
              <div className="bg-primary/5 rounded-xl p-4">
                <p className="text-sm text-gray-500">{ta('water')}</p>
                <p className="text-2xl font-bold text-primary">{water}L</p>
              </div>
            </div>
            <div className="h-32 bg-gradient-to-b from-primary/10 to-primary/30 rounded-xl flex items-end justify-center pb-4">
              <div
                className="bg-primary/60 rounded-t-full transition-all"
                style={{ width: '60px', height: `${Math.min(100, (data.height_cm / 200) * 100)}%` }}
              />
            </div>
          </div>
          <button onClick={finish} disabled={loading || !data.name} className="btn-primary w-full">
            {ta('finish')}
          </button>
        </div>
      )}

      {step > 1 && step < 7 && (
        <div className="flex gap-3 mt-8">
          <button onClick={() => setStep(step - 1)} className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {t('back')}
          </button>
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 2 && !data.name}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {t('next')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
