import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const studentId = context.params.id;
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('students')
      .update({ name, email })
      .eq('id', studentId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update student' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 