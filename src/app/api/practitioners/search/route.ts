import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    // const serviceId = searchParams.get('serviceId');
    // searchQuery available but search functionality not yet implemented

    let query = supabase
      .from('practitioners')
      .select(
        `
        *,
        users:id(
          id,
          email,
          full_name,
          phone_number,
          state,
          profile_image_url
        ),
        practitioner_services(
          *,
          services(*)
        ),
        availability(*)
      `
      )
      .eq('is_verified', true);

    if (state) {
      query = query.eq('license_state', state);
    }

    // TODO: Implement service filtering by filtering results client-side
    // or creating a separate database view/function
    // if (serviceId) {
    //   // Service filtering will be implemented in a future update
    // }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ practitioners: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
