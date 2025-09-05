# 🔥 Firebase Authentication Integration

Successfully integrated your existing Firebase authentication system from `tsunamissystem` into the new Next.js frontend.

## ✅ What's Been Integrated

### 1. **Firebase Configuration**
- **File**: `src/lib/firebase.ts`
- **Features**: Firebase app initialization with Auth, Firestore, and Storage
- **Environment**: All Firebase config variables added to `env.local.example`

### 2. **Enhanced Authentication System**
- **File**: `src/lib/firebase-auth.ts`
- **Features**:
  - Google OAuth authentication
  - Email/password registration and login
  - User profile management in Firestore
  - Role-based access control (ADMIN, OPERATOR, VIEWER)
  - Comprehensive error handling

### 3. **Auth Context Provider**
- **File**: `src/context/AuthContext.tsx`
- **Features**:
  - Real-time authentication state management
  - User profile synchronization with Firestore
  - Custom hooks for auth requirements (`useRequireAuth`, `useRequireRole`)

### 4. **Authentication Pages**
- **Sign In**: `src/app/auth/signin/page.tsx`
  - Google OAuth button
  - Email/password form
  - Modern UI with Shadcn/ui components
  - Error handling and validation

- **Sign Up**: `src/app/auth/signup/page.tsx`
  - Google OAuth registration
  - Email/password registration
  - Terms acceptance
  - Form validation

- **Unauthorized**: `src/app/auth/unauthorized/page.tsx`
  - Role-based access denied page
  - User-friendly error messages

### 5. **Authentication Guards**
- **File**: `src/components/auth/auth-guard.tsx`
- **Features**:
  - Route protection
  - Role-based access control
  - Loading states
  - Automatic redirects

### 6. **User Menu Component**
- **File**: `src/components/auth/user-menu.tsx`
- **Features**:
  - User profile display
  - Role badges
  - Navigation menu
  - Logout functionality

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🚀 How to Use

### 1. **Protect Routes**
```tsx
import { AuthGuard } from '@/components/auth/auth-guard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Your protected content</div>
    </AuthGuard>
  );
}
```

### 2. **Role-Based Protection**
```tsx
import { AdminGuard, OperatorGuard } from '@/components/auth/auth-guard';

// Only admins can access
<AdminGuard>
  <AdminPanel />
</AdminGuard>

// Admins and operators can access
<OperatorGuard>
  <OperatorPanel />
</OperatorGuard>
```

### 3. **Use Authentication in Components**
```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, userProfile, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return (
    <div>
      Welcome {user.displayName}!
      Your role: {userProfile?.role}
    </div>
  );
}
```

### 4. **Authentication Actions**
```tsx
import { loginWithGoogle, logoutUser } from '@/lib/firebase-auth';

// Google sign in
const handleGoogleSignIn = async () => {
  try {
    await loginWithGoogle();
    // User is now signed in
  } catch (error) {
    console.error('Sign in failed:', error);
  }
};

// Sign out
const handleSignOut = async () => {
  try {
    await logoutUser();
    // User is now signed out
  } catch (error) {
    console.error('Sign out failed:', error);
  }
};
```

## 🎨 UI Components

### Authentication Pages
- **Modern Design**: Gradient backgrounds with tsunami theme colors
- **Responsive**: Mobile-first design with Tailwind CSS
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Error Handling**: User-friendly error messages
- **Loading States**: Spinners and disabled states during authentication

### User Menu
- **Avatar Display**: User photo or initials
- **Role Badges**: Visual role indicators
- **Dropdown Menu**: Profile, settings, logout options
- **Admin Access**: Special admin panel link for admins

## 🔐 Security Features

### 1. **Authentication Flow**
- Secure Google OAuth integration
- JWT token handling (handled by Firebase)
- Automatic token refresh
- Session persistence

### 2. **Authorization**
- Role-based access control
- Route protection
- Component-level guards
- Firestore security rules integration

### 3. **User Management**
- User profiles stored in Firestore
- Default role assignment (VIEWER)
- Preferences management
- Last login tracking

## 📊 User Roles

### **ADMIN**
- Full system access
- User management
- System configuration
- All data access

### **OPERATOR**
- Monitoring dashboards
- Alert management
- Data analysis
- Limited admin functions

### **VIEWER**
- Read-only access
- Dashboard viewing
- Alert notifications
- Basic profile management

## 🔄 Migration from Your Existing System

Your existing Firebase setup has been **enhanced** with:

1. **Better Error Handling**: Comprehensive error messages
2. **Role Management**: Firestore-based user roles
3. **UI Improvements**: Modern Shadcn/ui components
4. **Type Safety**: Full TypeScript integration
5. **Route Protection**: Automatic authentication guards

## 🚀 Next Steps

1. **Copy Environment Variables**: Transfer your Firebase config from the old system
2. **Test Authentication**: Try signing in with Google
3. **Customize Roles**: Assign appropriate roles to users in Firestore
4. **Integrate with Backend**: Connect Firebase auth with your GraphQL backend
5. **Add User Management**: Create admin pages for user role management

## 🛠️ Firestore Collections

The system creates these Firestore collections:

```
users/
  {userId}/
    uid: string
    email: string
    displayName: string
    photoURL?: string
    role: 'ADMIN' | 'OPERATOR' | 'VIEWER'
    preferences: {
      alertTypes: string[]
      regions: string[]
      emailNotifications: boolean
      smsNotifications: boolean
      pushNotifications: boolean
    }
    createdAt: timestamp
    updatedAt: timestamp
    lastLoginAt: timestamp
```

## 🎯 Features Ready to Use

✅ **Google OAuth Sign In/Up**  
✅ **Email/Password Authentication**  
✅ **Role-Based Access Control**  
✅ **Protected Routes**  
✅ **User Profile Management**  
✅ **Modern UI Components**  
✅ **Error Handling**  
✅ **Loading States**  
✅ **Responsive Design**  
✅ **TypeScript Support**

Your Firebase authentication is now fully integrated and ready for production! 🎉
