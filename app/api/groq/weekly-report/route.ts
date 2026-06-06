import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyReport } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';
import { subDays, format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const { locale = 'en' } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

    const { data: progress } = await supabase
      .from('progress_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', weekAgo);

    const { data: workouts } = await supabase
      .from('daily_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('log_type', 'workout')
      .gte('date', weekAgo);

    const entries = progress || [];
    const avgWater = entries.reduce((s, e) => s + (e.water_ml || 0), 0) / Math.max(entries.length, 1) / 1000;
    const avgMood = entries.filter((e) => e.mood_score).reduce((s, e) => s + (e.mood_score || 0), 0) / Math.max(entries.filter((e) => e.mood_score).length, 1);
    const avgSleep = entries.filter((e) => e.sleep_hours).reduce((s, e) => s + (e.sleep_hours || 0), 0) / Math.max(entries.filter((e) => e.sleep_hours).length, 1);

    const weights = entries.filter((e) => e.weight_kg).map((e) => e.weight_kg as number);
    const weightChange = weights.length >= 2 ? weights[weights.length - 1] - weights[0] : 0;

    const result = await generateWeeklyReport(profile.name, {
      avgCalories: 1800,
      workoutsCompleted: workouts?.length || 0,
      avgWater: Math.round(avgWater * 10) / 10,
      avgMood: Math.round(avgMood * 10) / 10,
      avgSleep: Math.round(avgSleep * 10) / 10,
      weightChange: Math.round(weightChange * 10) / 10,
    }, locale);

    const weekStart = format(subDays(new Date(), new Date().getDay()), 'yyyy-MM-dd');
    await supabase.from('weekly_reports').insert({
      user_id: user.id,
      week_start: weekStart,
      report: result,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
