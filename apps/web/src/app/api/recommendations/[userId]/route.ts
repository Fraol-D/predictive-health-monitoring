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

export async function GET(
  request: Request,
  { params }: { params: { userId: string } } // userId here is firebaseUID
) {
  try {
    const firebaseUID = params.userId;

    if (!firebaseUID) {
      return NextResponse.json({ error: 'Missing Firebase UID for fetching recommendations.' }, { status: 400 });
    }

    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    // Fetch recommendations from your Node.js backend
    const response = await fetch(`${BACKEND_API_BASE_URL}/recommendations/user/${mongoUserId}`);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch recommendations from backend: ${response.status} ${errorBody}`);
    }

    const recommendations = await response.json();

    // The backend already returns a direct array of recommendations, so just pass it through
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST handler for new recommendations (if needed by frontend, e.g., from an AI generation process)
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const firebaseUID = params.userId; // userId in params is firebaseUID
    const { assessmentId, title, category, advice, priority } = await request.json();

    if (!firebaseUID || !assessmentId || !title || !category || !advice || !priority) {
      return NextResponse.json({ error: 'Missing required recommendation data.' }, { status: 400 });
    }

    const backendRes = await fetch(`${BACKEND_API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUID,
        assessmentId,
        title,
        category,
        advice,
        priority,
      }),
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.text();
      console.error('Backend recommendation save failed:', backendRes.status, errorBody);
      return NextResponse.json({ error: `Backend Save Error: ${backendRes.status} ${errorBody}` }, { status: backendRes.status });
    }

    const savedRecommendation = await backendRes.json();
    return NextResponse.json(savedRecommendation);

  } catch (error) {
    console.error('Error saving recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to save recommendation' },
      { status: 500 }
    );
  }
} 