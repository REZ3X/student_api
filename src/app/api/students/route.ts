import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find({});
    return NextResponse.json(students);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const student = new Student(body);
    await student.save();
    return NextResponse.json(student, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}