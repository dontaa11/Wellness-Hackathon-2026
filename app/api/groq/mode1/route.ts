import { NextRequest, NextResponse } from 'next/server';
import { generateMode1 } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { meal, locale = 'en' } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const result = await generateMode1(profile as Profile, meal, locale);

    await supabase.from('daily_logs').insert({
      user_id: user.id,
      log_type: 'food',
      content: { meal, analysis: result.meal_analysis, workout: result.workout },
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
