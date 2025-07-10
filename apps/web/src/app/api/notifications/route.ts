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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firebaseUID = searchParams.get('userId'); // Expect userId as a query parameter

  if (!firebaseUID) {
    return NextResponse.json({ error: 'Missing Firebase UID for fetching notifications.' }, { status: 400 });
  }

  try {
    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    const response = await fetch(`${BACKEND_API_BASE_URL}/notifications/user/${mongoUserId}`);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch notifications from backend: ${response.status} ${errorBody}`);
    }
    const notifications = await response.json();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications.', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { notificationId, firebaseUID } = await request.json();

  if (!notificationId || !firebaseUID) {
    return NextResponse.json({ error: 'Missing notification ID or Firebase UID for marking as read.' }, { status: 400 });
  }

  try {
    const mongoUserId = await getOrCreateMongoUserId(firebaseUID);

    // Call backend to mark notification as read
    const response = await fetch(`${BACKEND_API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      // Optionally, pass userId for authorization in backend if needed
      // body: JSON.stringify({ userId: mongoUserId }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to mark notification as read in backend: ${response.status} ${errorBody}`);
    }

    return NextResponse.json({ message: 'Notification marked as read successfully.' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to mark notification as read.', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 