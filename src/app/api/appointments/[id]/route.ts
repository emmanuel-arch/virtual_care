import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: unknown,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  try {
    const appointmentId = params.id;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointmentId = params.id;
    const { status, video_room_id } = await request.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (video_room_id) updateData.video_room_id = video_room_id;

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
