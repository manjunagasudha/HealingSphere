// server/firebaseAdmin.ts
import admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

// This function safely decodes the Base64-encoded service account key
const getServiceAccount = () => {
  const serviceAccountJson = process.env.FIREBASE_ADMIN_KEY;

  if (!serviceAccountJson) {
    // For local development, you can fallback to the JSON file
    if (process.env.NODE_ENV !== 'production') {
      try {
        return require('./serviceAccountKey.json');
      } catch (e) {
        console.error("Could not load serviceAccountKey.json. Please ensure the file exists for local development or set FIREBASE_ADMIN_KEY.");
        throw e;
      }
    }
    throw new Error('FIREBASE_ADMIN_KEY environment variable is not set for production.');
  }

  try {
    const decodedKey = Buffer.from(serviceAccountJson, 'base64').toString('utf-8');
    return JSON.parse(decodedKey);
  } catch (error) {
    console.error('Error parsing Firebase Admin SDK key:', error);
    throw new Error('Could not parse FIREBASE_ADMIN_KEY. Ensure it is a valid base64-encoded JSON.');
  }
};

// Initialize Firebase Admin SDK only once
if (!getApps().length) {
  initializeApp({
    credential: cert(getServiceAccount()),
  });
}

export default admin;
