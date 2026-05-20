// server/config/firebase.js
const admin = require("firebase-admin");

let db;

const initFirebase = () => {
  if (admin.apps.length === 0) {
    // Option 1: Use service account JSON file (recommended for production)
    // Download from Firebase Console > Project Settings > Service Accounts > Generate new private key
    // Then set GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
    // OR paste the JSON values individually into .env (shown below)

    const serviceAccount = {
      type: "service_account",
      
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
  return db;
};

const getDb = () => {
  if (!db) initFirebase();
  return db;
};

module.exports = { initFirebase, getDb, admin };