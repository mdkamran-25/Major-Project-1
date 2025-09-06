'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { hasFirebaseConfig } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirectTimeout, setRedirectTimeout] = useState(false);

  useEffect(() => {
    // Set a timeout to force redirect if loading takes too long
    const timeoutId = setTimeout(() => {
      setRedirectTimeout(true);
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // If Firebase is not configured, redirect directly to dashboard
    if (!hasFirebaseConfig) {
      console.warn('🔥 Firebase not configured, redirecting to dashboard');
      router.replace('/dashboard');
      return;
    }

    // Normal auth flow or timeout redirect
    if (!loading || redirectTimeout) {
      if (user) {
        // Redirect authenticated users to dashboard
        router.replace('/dashboard');
      } else {
        // Redirect unauthenticated users to signin
        router.replace('/auth/signin');
      }
    }
  }, [user, loading, redirectTimeout, router]);

  // Show loading while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">🌊</span>
        </div>
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading Tsunami Alert System...</p>
      </div>
    </div>
  );
}
