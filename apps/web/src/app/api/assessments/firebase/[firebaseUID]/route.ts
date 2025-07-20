import { NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL || 'http://localhost:3001/api';

export async function GET(request: Request, { params }: { params: { firebaseUID: string } }) {
  const { firebaseUID } = params;
  try {
    const backendRes = await fetch(`${BACKEND_API_BASE_URL}/assessments/firebase/${firebaseUID}`);
    const contentType = backendRes.headers.get('content-type');
    const body = contentType && contentType.includes('application/json')
      ? await backendRes.json()
      : await backendRes.text();
    return new NextResponse(
      JSON.stringify(body),
      {
        status: backendRes.status,
        headers: { 'content-type': contentType || 'application/json' },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assessment history', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
