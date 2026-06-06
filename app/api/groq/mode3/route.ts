import { NextRequest, NextResponse } from 'next/server';
import { generateMode3 } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { locale = 'en' } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const result = await generateMode3(profile as Profile, locale);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to generate wellness plan' }, { status: 500 });
  }
}
