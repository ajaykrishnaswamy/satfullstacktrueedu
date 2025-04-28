import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { SATTest } from '@/types/sat';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    const { data, error } = await supabase
      .from('sat_tests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch SAT test' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'SAT test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data as SATTest);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    const body = await request.json();
    const { name, questions, status, sections, total_time } = body;

    const { data, error } = await supabase
      .from('sat_tests')
      .update({
        name,
        questions,
        status,
        sections,
        total_time
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update SAT test' },
        { status: 500 }
      );
    }

    return NextResponse.json(data as SATTest);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    const { error } = await supabase
      .from('sat_tests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete SAT test' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 