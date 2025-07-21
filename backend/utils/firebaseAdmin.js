const admin = require("firebase-admin");

if (!admin.apps.length) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Remove any accidental trailing backslashes if present (e.g., from shell parsing)
    privateKey = privateKey.replace(/\\(?!n)/g, ""); // Removes \ unless it's followed by n (for \\n)
    // Now, replace \\n with actual newlines
    privateKey = privateKey.replace(/\\n/g, "\n");
    // Ensure the key is trimmed to remove any leading/trailing whitespace from the whole string
    privateKey = privateKey.trim();
    // Add a final newline if missing, as PEM often requires it
    if (!privateKey.endsWith("\n")) {
      privateKey += "\n";
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

module.exports = admin;
