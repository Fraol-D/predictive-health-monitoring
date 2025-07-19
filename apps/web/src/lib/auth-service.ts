import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Ensures a user with the given Firebase UID exists in the MongoDB database.
 * If the user doesn't exist, it creates them.
 * @param firebaseUID The user's Firebase UID.
 * @returns The user's MongoDB `_id`.
 */
export async function getOrCreateMongoUserId(firebaseUID: string): Promise<string> {
  if (!firebaseUID) {
    throw new Error('Firebase UID is required.');
  }
  
  try {
    const userResponse = await fetch(`${BACKEND_API_BASE_URL}/users/firebase/${firebaseUID}`);
    
    if (userResponse.status === 404) {
      // User not found, create them
      const newUserResponse = await fetch(`${BACKEND_API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // You might want to pass more user details from the frontend if available
        body: JSON.stringify({ 
          firebaseUID, 
          name: 'New User', // Placeholder
          email: `${firebaseUID}@example.com` // Placeholder
        }),
      });

      if (!newUserResponse.ok) {
        const errorBody = await newUserResponse.text();
        throw new Error(`Failed to create user in backend: ${newUserResponse.status} ${errorBody}`);
      }
      
      const newUserData = await newUserResponse.json();
      return newUserData._id;

    } else if (userResponse.ok) {
      const userData = await userResponse.json();
      return userData._id;
    } else {
      // Handle other non-successful responses
      const errorBody = await userResponse.text();
      throw new Error(`Failed to fetch user from backend: ${userResponse.status} ${errorBody}`);
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('Error ensuring user in backend:', errorMessage);
    throw new Error(`Backend user synchronization failed: ${errorMessage}`);
  }
}

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
  }

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      return null;
    }
  }

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
}

export const authService = new AuthService(); 