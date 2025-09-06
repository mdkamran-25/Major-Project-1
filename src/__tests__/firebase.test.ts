// Mock Firebase modules to avoid import issues
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

describe('Firebase Configuration', () => {
  // Mock environment variables for testing
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should detect when Firebase config is missing', () => {
    // Remove Firebase env vars
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    // Re-import to get updated config
    jest.isolateModules(() => {
      const { hasFirebaseConfig } = require('@/lib/firebase');
      expect(hasFirebaseConfig).toBe(false);
    });
  });

  it('should detect when Firebase config is present', () => {
    // Set Firebase env vars
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
    
    // Re-import to get updated config
    jest.isolateModules(() => {
      const { hasFirebaseConfig } = require('@/lib/firebase');
      expect(hasFirebaseConfig).toBe(true);
    });
  });

  it('should handle Firebase initialization gracefully', () => {
    expect(() => {
      require('@/lib/firebase');
    }).not.toThrow();
  });
});
