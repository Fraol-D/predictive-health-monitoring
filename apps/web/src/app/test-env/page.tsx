'use client';

export default function TestEnv() {
  return (
    <div className="p-4">
      <h1>Environment Variables Test</h1>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '***' : 'undefined',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }, null, 2)}
      </pre>
    </div>
  );
} 