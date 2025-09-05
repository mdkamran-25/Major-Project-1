'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect authenticated users to dashboard
        router.replace('/dashboard');
      } else {
        // Redirect unauthenticated users to signin
        router.replace('/auth/signin');
      }
    }
  }, [user, loading, router]);

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
