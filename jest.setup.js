import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

// Mock Mapbox GL
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    removeSource: jest.fn(),
    getSource: jest.fn(),
    getLayer: jest.fn(),
    setLayoutProperty: jest.fn(),
    setPaintProperty: jest.fn(),
    flyTo: jest.fn(),
    fitBounds: jest.fn(),
    resize: jest.fn(),
  })),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
    setPopup: jest.fn().mockReturnThis(),
  })),
  Popup: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setHTML: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  })),
  supported: jest.fn(() => true),
}));

// Mock react-map-gl
jest.mock('react-map-gl', () => ({
  Map: ({ children, ...props }) => (
    <div data-testid="mapbox-map" {...props}>
      {children}
    </div>
  ),
  Marker: ({ children, ...props }) => (
    <div data-testid="mapbox-marker" {...props}>
      {children}
    </div>
  ),
  Popup: ({ children, ...props }) => (
    <div data-testid="mapbox-popup" {...props}>
      {children}
    </div>
  ),
  Source: ({ children, ...props }) => (
    <div data-testid="mapbox-source" {...props}>
      {children}
    </div>
  ),
  Layer: (props) => <div data-testid="mapbox-layer" {...props} />,
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
};

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
});

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn((success) =>
      success({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
        },
      })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
});

// Suppress console errors in tests unless explicitly needed
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
      args[0].includes('Warning: An invalid form control') ||
      args[0].includes('Warning: componentWillReceiveProps has been renamed'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Mock environment variables for tests
process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';
process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT = 'ws://localhost:4000/graphql';
process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'pk.test_token';
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test_cloud';

// Global test utilities
global.createMockUser = () => ({
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'VIEWER',
  isActive: true,
});

global.createMockAlertStatus = () => ({
  id: 'alert-1',
  status: 'SAFE',
  level: 'NONE',
  confidence: 0.95,
  message: 'All systems normal',
  region: 'Pacific Northwest',
  lastUpdated: new Date().toISOString(),
  isActive: true,
});

global.createMockGPSReading = () => ({
  id: 'gps-1',
  stationId: 'TEST01',
  latitude: 37.7749,
  longitude: -122.4194,
  displacementX: 2.5,
  displacementY: -1.2,
  displacementZ: 0.8,
  magnitude: 2.9,
  quality: 'GOOD',
  timestamp: new Date().toISOString(),
});
