'use client';

import { onAuthStateChanged, User } from 'firebase/auth';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '@/lib/firebase';
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
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

    return unsubscribe;
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
