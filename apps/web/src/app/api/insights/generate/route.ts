import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

export async function POST(request: Request) {
    console.log('Starting /api/insights/generate POST request');
    // Log all incoming headers for debugging
    const headersObj: Record<string, string> = {};
    request.headers.forEach((value, key) => { headersObj[key] = value; });
    console.log('[DEBUG] Incoming headers:', headersObj);
    const body = await request.json();
    console.log('Received request body:', body);
    const { assessmentId } = body;
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    console.log('Authorization token present:', !!token);

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('Verifying ID token...');
        const decodedToken = await adminAuth.verifyIdToken(token);
        console.log('Token verified, firebaseUID:', decodedToken.uid);
        const firebaseUID = decodedToken.uid;

        if (!assessmentId) {
            return NextResponse.json({ error: 'Missing assessmentId' }, { status: 400 });
        }

        console.log('Fetching backend at:', `${BACKEND_API_BASE_URL}/insights/generate`);
        const backendRes = await fetch(`${BACKEND_API_BASE_URL}/insights/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ assessmentId }),
        });
        console.log('Backend response status:', backendRes.status);

        if (!backendRes.ok) {
            const errorBody = await backendRes.json();
            return NextResponse.json({ error: 'Failed to trigger insight generation', details: errorBody }, { status: backendRes.status });
        }

        const data = await backendRes.json();
        return NextResponse.json(data);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        if (error instanceof Error) {
            console.error('Error in insights generate proxy:', error.stack || error);
        } else {
            console.error('Error in insights generate proxy:', error);
        }
        if (errorMessage.includes('auth/id-token-expired')) {
            return NextResponse.json({ error: 'Authentication token expired. Please log in again.' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
    }
} 