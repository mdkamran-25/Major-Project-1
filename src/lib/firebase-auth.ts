// lib/firebase-auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
  isActive: boolean;
  preferences: {
    alertTypes: string[];
    regions: string[];
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    language?: string;
    theme?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Email/Password Authentication
export async function registerUser(email: string, password: string, name: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, {
      displayName: name,
    });

    // Create user profile in Firestore
    await createUserProfile(user, { displayName: name });

    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await updateLastLogin(userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

// Google Authentication
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserProfile(user);
    } else {
      await updateLastLogin(user.uid);
    }

    return user;
  } catch (error) {
    console.error('Error with Google login:', error);
    throw error;
  }
}

// Logout
export async function logoutUser(): Promise<void> {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// User Profile Management
export async function createUserProfile(
  user: User,
  additionalData?: { displayName?: string }
): Promise<void> {
  const userRef = doc(db, 'users', user.uid);

  const defaultPreferences = {
    alertTypes: ['HIGH', 'CRITICAL'],
    regions: ['Pacific Northwest'],
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  };

  const userProfile: Partial<UserProfile> = {
    uid: user.uid,
    email: user.email || '',
    displayName: additionalData?.displayName || user.displayName || '',
    photoURL: user.photoURL || undefined,
    role: 'VIEWER', // Default role
    isActive: true,
    preferences: defaultPreferences,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
    lastLoginAt: serverTimestamp() as any,
  };

  try {
    await setDoc(userRef, userProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function updateLastLogin(uid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    // Don't throw error for this non-critical operation
  }
}

// Utility functions
export function getAuthErrorMessage(error: any): string {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completion.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser.';
    default:
      return error.message || 'An error occurred during authentication.';
  }
}
