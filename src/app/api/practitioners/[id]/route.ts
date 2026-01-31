import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  try {
    const practitionerId = params.id;

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
      .eq('id', practitionerId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Practitioner not found' }, { status: 404 });
    }

    return NextResponse.json({ practitioner: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
