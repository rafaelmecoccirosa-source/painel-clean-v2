import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from('profiles').select('count').limit(1).single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json(
      { status: 'ok', db: true, ts: new Date().toISOString() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: 'error', db: false },
      { status: 503 }
    );
  }
}
