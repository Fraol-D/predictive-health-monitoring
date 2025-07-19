import { NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const firebaseUID = searchParams.get('userId');

    if (!firebaseUID) {
      return NextResponse.json({ error: 'Firebase UID is required' }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_API_BASE_URL}/notifications?userId=${firebaseUID}`);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch notifications from backend: ${response.status} ${errorBody}`);
    }

    const notifications = await response.json();
    return NextResponse.json(notifications);

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { notificationId, firebaseUID } = await request.json();

    if (!notificationId || !firebaseUID) {
      return NextResponse.json({ error: 'Notification ID and Firebase UID are required' }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_API_BASE_URL}/notifications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, firebaseUID }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to mark notification as read: ${response.status} ${errorBody}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 