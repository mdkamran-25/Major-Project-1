// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Check if Firebase environment variables are available
const hasFirebaseConfig = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// Default/fallback Firebase config for development or when env vars are missing
const defaultFirebaseConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'demo-project',
  storageBucket: 'demo-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:demo',
};

const firebaseConfig = hasFirebaseConfig
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
        `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }
  : defaultFirebaseConfig;

// Initialize Firebase
let app: any;
let auth: any;
let db: any;
let storage: any;
let analytics: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Analytics only in browser environment and if supported
  if (typeof window !== 'undefined' && hasFirebaseConfig) {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('🔥 Firebase Analytics initialized');
      }
    });
  }

  if (!hasFirebaseConfig) {
    console.warn(
      '🔥 Firebase: Using demo configuration. Set environment variables for production.'
    );
  }
} catch (error) {
  console.error('🔥 Firebase initialization failed:', error);
  // Create mock objects to prevent app crashes
  auth = null;
  db = null;
  storage = null;
  analytics = null;
}

// Export Firebase services with null checks
export { auth, db, storage, analytics, hasFirebaseConfig };
export default app;
