import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Get all exams assigned to a student
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Get student's exam IDs from the students table
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('student_exams')
      .eq('id', studentId)
      .single();

    if (studentError) {
      console.error('Database error:', studentError);
      return NextResponse.json(
        { error: 'Failed to fetch student exams' },
        { status: 500 }
      );
    }

    if (!student?.student_exams?.length) {
      return NextResponse.json([]);
    }

    // Get the full exam details for the assigned exams
    const { data: exams, error: examsError } = await supabase
      .from('sat_tests')
      .select('*')
      .in('id', student.student_exams);

    if (examsError) {
      console.error('Database error:', examsError);
      return NextResponse.json(
        { error: 'Failed to fetch exam details' },
        { status: 500 }
      );
    }

    return NextResponse.json(exams || []);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Assign exam(s) to student(s)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentIds, examIds } = body;

    if (!studentIds?.length || !examIds?.length) {
      return NextResponse.json(
        { error: 'Student IDs and Exam IDs are required' },
        { status: 400 }
      );
    }

    const updates = [];
    for (const studentId of studentIds) {
      // Get current student_exams array
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('student_exams')
        .eq('id', studentId)
        .single();

      if (fetchError) {
        console.error('Database error:', fetchError);
        continue;
      }

      // Combine existing and new exam IDs, removing duplicates
      const currentExams = student?.student_exams || [];
      const updatedExams = [...new Set([...currentExams, ...examIds])];

      // Update student's exam array
      const { error: updateError } = await supabase
        .from('students')
        .update({ student_exams: updatedExams })
        .eq('id', studentId);

      if (updateError) {
        console.error('Database error:', updateError);
        continue;
      }

      updates.push({
        student_id: studentId,
        exam_ids: examIds
      });
    }

    return NextResponse.json(updates);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Unassign exam(s) from a student
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const examId = searchParams.get('examId');

    if (!studentId || !examId) {
      return NextResponse.json(
        { error: 'Student ID and Exam ID are required' },
        { status: 400 }
      );
    }

    // Get current student_exams array
    const { data: student, error: fetchError } = await supabase
      .from('students')
      .select('student_exams')
      .eq('id', studentId)
      .single();

    if (fetchError) {
      console.error('Database error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch student' },
        { status: 500 }
      );
    }

    // Remove the exam ID from the array
    const currentExams = student?.student_exams || [];
    const updatedExams = currentExams.filter(id => id !== examId);

    // Update student's exam array
    const { error: updateError } = await supabase
      .from('students')
      .update({ student_exams: updatedExams })
      .eq('id', studentId);

    if (updateError) {
      console.error('Database error:', updateError);
      return NextResponse.json(
        { error: 'Failed to unassign exam' },
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