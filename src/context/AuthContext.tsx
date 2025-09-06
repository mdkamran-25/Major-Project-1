'use client';

import { onAuthStateChanged, User } from 'firebase/auth';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth, hasFirebaseConfig } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/lib/firebase-auth';

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  refreshUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  useEffect(() => {
    // If Firebase is not properly configured, set loading to false immediately
    if (!hasFirebaseConfig || !auth) {
      console.warn('🔥 Firebase not configured, skipping authentication');
      setLoading(false);
      return;
    }

    // Set a timeout to prevent infinite loading
    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      console.warn('🔥 Auth state timeout, setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(timeoutId); // Clear timeout since we got a response
      
      setUser(currentUser);
      
      if (currentUser && hasFirebaseConfig) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userProfile, 
        loading, 
        refreshUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom hook for checking authentication status
export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page
      window.location.href = '/auth/signin';
    }
  }, [user, loading]);

  return { user, loading };
};

// Custom hook for role-based access control
export const useRequireRole = (requiredRoles: string[]) => {
  const { user, userProfile, loading } = useAuth();
  
  const hasRequiredRole = userProfile?.role && requiredRoles.includes(userProfile.role);
  
  useEffect(() => {
    if (!loading && (!user || !hasRequiredRole)) {
      // Redirect to unauthorized page or login
      window.location.href = '/unauthorized';
    }
  }, [user, userProfile, loading, hasRequiredRole]);

  return { user, userProfile, loading, hasRequiredRole };
};
