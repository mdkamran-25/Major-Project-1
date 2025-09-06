'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { hasFirebaseConfig } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/auth/signin' 
}: AuthGuardProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // Set timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // If Firebase is not configured, allow access (demo mode)
    if (!hasFirebaseConfig) {
      console.warn('🔥 Firebase not configured, allowing access in demo mode');
      return;
    }

    if (!loading || loadingTimeout) {
      // Not authenticated
      if (!user) {
        router.replace(redirectTo);
        return;
      }

      // Check role requirements
      if (requiredRoles.length > 0 && userProfile) {
        const hasRequiredRole = requiredRoles.includes(userProfile.role);
        if (!hasRequiredRole) {
          router.replace('/auth/unauthorized');
          return;
        }
      }
    }
  }, [user, userProfile, loading, loadingTimeout, router, requiredRoles, redirectTo]);

  // If Firebase is not configured, render children directly (demo mode)
  if (!hasFirebaseConfig) {
    return <>{children}</>;
  }

  // Show loading while checking authentication (with timeout)
  if (loading && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or doesn't have required role
  if (!user || (requiredRoles.length > 0 && userProfile && !requiredRoles.includes(userProfile.role))) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRoles={['ADMIN']}>
      {children}
    </AuthGuard>
  );
}

export function OperatorGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRoles={['ADMIN', 'OPERATOR']}>
      {children}
    </AuthGuard>
  );
}

export function ViewerGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRoles={['ADMIN', 'OPERATOR', 'VIEWER']}>
      {children}
    </AuthGuard>
  );
}
