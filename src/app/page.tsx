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
  const [forceRedirect, setForceRedirect] = useState(false);

  useEffect(() => {
    // Immediate redirect if Firebase not configured
    if (!hasFirebaseConfig) {
      console.warn('🔥 Firebase not configured, redirecting to dashboard');
      router.replace('/dashboard');
      return;
    }

    // Set multiple timeouts to ensure redirect happens
    const timeout1 = setTimeout(() => {
      setRedirectTimeout(true);
    }, 2000); // 2 second timeout

    const timeout2 = setTimeout(() => {
      console.warn('🚨 Force redirect after 4 seconds');
      setForceRedirect(true);
    }, 4000); // 4 second force redirect

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [router]);

  useEffect(() => {
    // Force redirect logic
    if (forceRedirect) {
      console.warn('🚨 Forcing redirect to dashboard due to timeout');
      router.replace('/dashboard');
      return;
    }

    // Normal auth flow or timeout redirect
    if (!loading || redirectTimeout) {
      if (user) {
        console.log('✅ User authenticated, redirecting to dashboard');
        router.replace('/dashboard');
      } else {
        console.log('❌ No user, redirecting to signin');
        router.replace('/auth/signin');
      }
    }
  }, [user, loading, redirectTimeout, forceRedirect, router]);

  // Show loading while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500">
          <span className="text-2xl">🌊</span>
        </div>
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Tsunami Alert System...</p>
        
        {/* Emergency bypass button after timeout */}
        {redirectTimeout && (
          <div className="mt-6 space-y-2">
            <p className="text-sm text-orange-600">Taking longer than expected?</p>
            <button
              onClick={() => router.replace('/dashboard')}
              className="rounded-md bg-tsunami-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-tsunami-blue-700"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
