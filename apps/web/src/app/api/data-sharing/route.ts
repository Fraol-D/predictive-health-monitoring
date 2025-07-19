import { NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

// Helper to ensure user exists in MongoDB and return their MongoDB _id
async function getOrCreateMongoUserId(firebaseUID: string) {
  let mongoUserId;
  try {
    let userResponse = await fetch(`${BACKEND_API_BASE_URL}/users/firebase/${firebaseUID}`);
    let userData = await userResponse.json();

    if (userResponse.status === 404) {
      const newUserResponse = await fetch(`${BACKEND_API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUID, name: 'New User', email: `${firebaseUID}@example.com` }),
      });
      if (!newUserResponse.ok) {
        const errorBody = await newUserResponse.text();
        throw new Error(`Failed to create user in backend: ${newUserResponse.status} ${errorBody}`);
      }
      const newUserData = await newUserResponse.json();
      mongoUserId = newUserData._id;
    } else if (userResponse.ok) {
      mongoUserId = userData._id;
    } else {
      const errorBody = await userResponse.text();
      throw new Error(`Failed to fetch user from backend: ${userResponse.status} ${errorBody}`);
    }
  } catch (e) {
    console.error('Error ensuring user in backend:', e);
    throw new Error(`Backend user synchronization failed: ${e instanceof Error ? e.message : String(e)}`);
  }
  return mongoUserId;
}

export async function POST(request: Request) {
  try {
    const { userId: firebaseUID, sharedDataId, assessmentIds, consentGiven } = await request.json();

    if (!firebaseUID || !sharedDataId || !assessmentIds || consentGiven === undefined) {
      return NextResponse.json({ error: 'Missing required data for sharing.' }, { status: 400 });
    }

    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    // Call your Node.js backend to save the shared data
    const response = await fetch(`${BACKEND_API_BASE_URL}/sharing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: mongoUserId,
        sharedDataId: sharedDataId,
        assessmentIds: assessmentIds,
        consentGiven: consentGiven,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to save shared data to backend: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing data sharing request:', error);
    return NextResponse.json({ error: 'Failed to share data.', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firebaseUID = searchParams.get('userId'); // Expect userId as a query parameter

  if (!firebaseUID) {
    return NextResponse.json({ error: 'Missing Firebase UID for fetching shared data.' }, { status: 400 });
  }

  try {
    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    const response = await fetch(`${BACKEND_API_BASE_URL}/sharing/user/${mongoUserId}`);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch shared data from backend: ${response.status} ${errorBody}`);
    }
    const sharedData = await response.json();
    return NextResponse.json(sharedData);
  } catch (error) {
    console.error('Error fetching shared data history:', error);
    return NextResponse.json({ error: 'Failed to fetch shared data history.', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 