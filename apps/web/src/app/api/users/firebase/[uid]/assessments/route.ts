import { NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

export async function GET(
    request: Request,
    { params }: { params: { uid: string } }
) {
    try {
        const uid = params.uid;

        if (!uid) {
            return NextResponse.json({ error: 'Missing Firebase UID.' }, { status: 400 });
        }

        const backendRes = await fetch(`${BACKEND_API_BASE_URL}/users/firebase/${uid}/assessments`);

        if (!backendRes.ok) {
            const errorBody = await backendRes.json();
            return NextResponse.json({ error: errorBody.message || 'Failed to fetch assessments' }, { status: backendRes.status });
        }

        const data = await backendRes.json();
        return NextResponse.json(data);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
    }
} 