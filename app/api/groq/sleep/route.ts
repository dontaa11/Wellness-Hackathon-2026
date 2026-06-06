import { NextRequest, NextResponse } from 'next/server';
import { generateSleepRecommendation } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { bedtimeGoal, stressLevel, locale = 'en' } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const result = await generateSleepRecommendation(profile as Profile, bedtimeGoal, stressLevel, locale);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to generate sleep tips' }, { status: 500 });
  }
}
