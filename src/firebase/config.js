// src/firebase/config.js
// Firebase is initialized once here and exported for use throughout the app.

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env;

// Guard: show a clear error in the UI if env vars are missing
const missing = [
  ['VITE_FIREBASE_API_KEY',            VITE_FIREBASE_API_KEY],
  ['VITE_FIREBASE_AUTH_DOMAIN',        VITE_FIREBASE_AUTH_DOMAIN],
  ['VITE_FIREBASE_PROJECT_ID',         VITE_FIREBASE_PROJECT_ID],
  ['VITE_FIREBASE_STORAGE_BUCKET',     VITE_FIREBASE_STORAGE_BUCKET],
  ['VITE_FIREBASE_MESSAGING_SENDER_ID',VITE_FIREBASE_MESSAGING_SENDER_ID],
  ['VITE_FIREBASE_APP_ID',             VITE_FIREBASE_APP_ID],
].filter(([, v]) => !v || v === 'undefined').map(([k]) => k);

export const firebaseConfigError = missing.length > 0
  ? `Missing Firebase environment variables:\n${missing.join('\n')}\n\nAdd them in Vercel → Project Settings → Environment Variables, then redeploy.`
  : null;

const firebaseConfig = {
  apiKey:            VITE_FIREBASE_API_KEY,
  authDomain:        VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         VITE_FIREBASE_PROJECT_ID,
  storageBucket:     VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             VITE_FIREBASE_APP_ID,
};

let app, auth, db, googleProvider;

try {
  app           = initializeApp(firebaseConfig);
  auth          = getAuth(app);
  db            = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.error('Firebase init failed:', e);
}

export { auth, db, googleProvider };
export default app;
