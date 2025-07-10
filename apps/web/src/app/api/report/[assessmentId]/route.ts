import { NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';

export async function GET(
  request: Request,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const assessmentId = params.assessmentId;

    if (!assessmentId) {
      return NextResponse.json({ error: 'Missing assessmentId.' }, { status: 400 });
    }

    const backendRes = await fetch(`${BACKEND_BASE_URL}/api/reports/${assessmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.text();
      console.error('Backend report fetch failed:', backendRes.status, errorBody);
      return NextResponse.json({ error: `Backend Fetch Error: ${backendRes.status} ${errorBody}` }, { status: backendRes.status });
    }

    const reportData = await backendRes.json();
    return NextResponse.json({ success: true, data: reportData });

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch report data' 
      },
      { status: 500 }
    );
  }
} 