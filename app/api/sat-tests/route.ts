import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { SATTest } from '@/types/sat';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sat_tests')
      .select(`
        id,
        name,
        questions,
        status,
        created_at,
        share_id,
        sections,
        total_time
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch SAT tests' },
        { status: 500 }
      );
    }

    return NextResponse.json(data as SATTest[]);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, questions, status, sections, total_time } = body;

    const { data, error } = await supabase
      .from('sat_tests')
      .insert([
        {
          name,
          questions,
          status,
          sections,
          total_time
        }
      ])
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create SAT test' },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0] as SATTest);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 