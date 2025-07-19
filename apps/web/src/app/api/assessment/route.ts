import { NextResponse } from 'next/server';
import { getOrCreateMongoUserId } from '@/lib/auth-service';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';


export async function POST(request: Request) {
  try {
    const { firebaseUID, ...assessmentData } = await request.json();

    if (!firebaseUID) {
      return NextResponse.json({ error: 'Missing firebaseUID' }, { status: 400 });
    }
    
    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    // 1. Save the assessment to the backend
    const response = await fetch(`${BACKEND_API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: mongoUserId, ...assessmentData }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Failed to save assessment to backend:', errorBody);
        return NextResponse.json({ error: 'Failed to save assessment', details: errorBody }, { status: response.status });
    }

    const savedAssessment = await response.json();
    
    // Just return the saved assessment data. Generation will be triggered separately.
    return NextResponse.json(savedAssessment);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in assessment POST request:', error);
    return NextResponse.json({ error: 'Internal server error.', details: errorMessage }, { status: 500 });
  }
} 