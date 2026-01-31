import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { license_number, license_state, bio, years_of_experience, education } =
      await request.json();

    const { error } = await supabase.from('practitioners').insert({
      id: sessionData.session.user.id,
      license_number,
      license_state,
      bio,
      years_of_experience,
      education,
      is_verified: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Practitioner profile created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('practitioners')
      .select(
        `
        *,
        users:id(*),
        practitioner_services(*, services(*)),
        availability(*)
      `
      )
      .eq('id', sessionData.session.user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ practitioner: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
