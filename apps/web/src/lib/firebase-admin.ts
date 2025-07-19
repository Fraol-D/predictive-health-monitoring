import admin from 'firebase-admin';

// Re-implement the function to be more robust and provide better error logging.
function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Add more detailed logging to debug the private key issue.
  console.log('--- FIREBASE ADMIN ENV VARS (RAW) ---');
  console.log('Project ID:', projectId ? 'Loaded' : 'MISSING!');
  console.log('Client Email:', clientEmail ? 'Loaded' : 'MISSING!');
  // Log a snippet to avoid exposing the full key, but to check its format.
  console.log('Private Key (Raw Snippet):', privateKey ? privateKey.substring(0, 50).replace(/\n/g, '\\n') + '...' : 'MISSING!');
  
  // The private key needs to be formatted with actual newlines.
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  console.log('--- FIREBASE ADMIN ENV VARS (PROCESSED) ---');
  console.log('Private Key (Processed Snippet):', privateKey ? privateKey.substring(0, 50).replace(/\n/g, '\\n') + '...' : 'MISSING!');
  console.log('---------------------------------');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin SDK credentials are not set in .env.local. Check server logs for details.'
    );
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
    // Add more context to the error message for easier debugging.
    if (error.message.includes('PEM')) {
        console.error("This is likely an issue with the FIREBASE_PRIVATE_KEY format in your .env.local file. Ensure it's a single line with `\\n` for newlines, and no extra quotes.");
    }
    throw new Error(`Firebase Admin initialization failed: ${error.message}`);
  }
}

export const adminApp = getFirebaseAdminApp();
export const adminAuth = adminApp.auth();
export const adminDb = adminApp.firestore(); 