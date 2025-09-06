'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { hasFirebaseConfig } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [showManualOptions, setShowManualOptions] = useState(false);
  
  // Detect if we're on Vercel production to avoid redirect loops
  const isProduction = typeof window !== 'undefined' && 
    window.location.hostname.includes('vercel.app');

  useEffect(() => {
    // Show manual options after 2 seconds instead of redirecting
    const timeout = setTimeout(() => {
      setShowManualOptions(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Show manual navigation to avoid redirect loops
  if (showManualOptions || isProduction) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-tsunami-blue-50 via-white to-tsunami-green-50 p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 shadow-lg">
            <span className="text-3xl">🌊</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 bg-clip-text text-transparent">
              Tsunami Early Warning System
            </h1>
            <p className="text-muted-foreground">Choose where to go:</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full rounded-md bg-tsunami-blue-600 px-4 py-3 text-center text-white font-medium hover:bg-tsunami-blue-700 transition-colors"
            >
              🏠 Dashboard
            </Link>
            
            <Link
              href="/auth/signin"
              className="block w-full rounded-md border border-tsunami-blue-600 px-4 py-3 text-center text-tsunami-blue-600 font-medium hover:bg-tsunami-blue-50 transition-colors"
            >
              🔐 Sign In
            </Link>
            
            <Link
              href="/auth/signup"
              className="block w-full rounded-md border border-tsunami-green-600 px-4 py-3 text-center text-tsunami-green-600 font-medium hover:bg-tsunami-green-50 transition-colors"
            >
              📝 Sign Up
            </Link>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>🔥 Firebase: {hasFirebaseConfig ? 'Connected' : 'Demo Mode'}</p>
            <p>👤 User: {user ? 'Authenticated' : 'Not signed in'}</p>
            <p>⚡ Redirect: Disabled (manual navigation)</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading initially
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500">
          <span className="text-2xl">🌊</span>
        </div>
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Tsunami Alert System...</p>
      </div>
    </div>
  );
}
