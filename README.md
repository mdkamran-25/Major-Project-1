# Tsunami Alert System - Frontend

A Next.js frontend application for the Tsunami Alert MVP system with Firebase authentication and
real-time monitoring capabilities.

## Environment Variables Setup

Make sure to configure these environment variables in Vercel dashboard for production deployment.

## 🚀 Tech Stack

| Layer/Feature        | Technology/Tool                              |
| -------------------- | -------------------------------------------- |
| **Framework**        | Next.js 14 (App Router, SSR/SSG/ISR)         |
| **Language**         | TypeScript                                   |
| **Styling**          | Tailwind CSS, PostCSS                        |
| **UI Components**    | Custom components (Atomic Design), Shadcn/ui |
| **State Management** | React Context API, Zustand                   |
| **GraphQL**          | Apollo Client, GraphQL Code Generator        |
| **Authentication**   | NextAuth.js with Google OAuth                |
| **Maps**             | Mapbox GL JS, React Map GL                   |
| **Image Management** | Cloudinary, Next/Image                       |
| **Testing**          | Jest, React Testing Library, Playwright      |
| **Linting/Format**   | ESLint, Prettier, lint-staged, Husky         |
| **CI/CD**            | GitHub Actions                               |
| **Deployment**       | Vercel                                       |

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Dashboard homepage
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard routes
│   └── api/               # API routes
├── components/            # React components (Atomic Design)
│   ├── ui/               # Base UI components (Shadcn/ui)
│   ├── atoms/            # Smallest components
│   ├── molecules/        # Component combinations
│   └── organisms/        # Complex components
├── graphql/              # GraphQL operations
│   ├── queries/          # GraphQL queries
│   ├── mutations/        # GraphQL mutations
│   ├── subscriptions/    # Real-time subscriptions
│   └── fragments/        # Reusable fragments
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── apollo-client.ts  # Apollo Client setup
│   ├── auth.ts          # NextAuth configuration
│   ├── cloudinary.ts    # Cloudinary integration
│   └── utils.ts         # Utility functions
├── stores/               # Zustand state stores
├── styles/               # Global styles and Tailwind
├── types/                # TypeScript type definitions
│   └── generated.ts      # Generated GraphQL types
└── utils/                # Helper utilities
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp env.local.example .env.local
```

Configure the following environment variables:

```env
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GraphQL API
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT=ws://localhost:4000/graphql

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token_here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Generate GraphQL Types

```bash
npm run codegen
```

### 4. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 UI Components & Design System

### Atomic Design Pattern

The component library follows Atomic Design principles:

#### **Atoms** (Basic building blocks)

- `Button`, `Input`, `Badge`, `Avatar`
- `Card`, `Dialog`, `Tooltip`, `Spinner`

#### **Molecules** (Simple combinations)

- `AlertStatusCard` - Displays current alert status
- `GPSStationMarker` - GPS station on map
- `DataOverview` - Statistics cards
- `UserMenu` - Profile dropdown

#### **Organisms** (Complex components)

- `MapDashboard` - Interactive Mapbox map
- `DashboardLayout` - Main layout with navigation
- `AlertHistory` - Alert timeline
- `DataTable` - Sortable data tables

### Shadcn/ui Integration

Components are built on top of Radix UI primitives with Tailwind CSS styling:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function AlertCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Alert Status
          <Badge variant="success">SAFE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline">View Details</Button>
      </CardContent>
    </Card>
  );
}
```

## 🔌 GraphQL Integration

### Apollo Client Setup

The app uses Apollo Client for GraphQL operations with real-time subscriptions:

```tsx
// Queries
const { data, loading, error } = useGetCurrentAlertStatusQuery();

// Mutations
const [updatePreferences] = useUpdateUserPreferencesMutation();

// Subscriptions
const { data: alertUpdate } = useAlertStatusUpdatedSubscription();
```

### Code Generation

GraphQL types are automatically generated from the schema:

```bash
# Generate types from backend schema
npm run codegen

# Watch for schema changes
npm run codegen:watch
```

### Real-time Features

```tsx
// Real-time alert updates
const AlertStatus = () => {
  const { data } = useAlertStatusUpdatedSubscription();

  return (
    <div className={`alert-${data?.alertStatusUpdated.status.toLowerCase()}`}>
      {data?.alertStatusUpdated.message}
    </div>
  );
};
```

## 🗺️ Interactive Map Dashboard

### Mapbox Integration

The map dashboard uses Mapbox GL JS with React Map GL:

```tsx
import Map, { Marker, Popup } from 'react-map-gl';

function MapDashboard() {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: -122.4194,
        latitude: 37.7749,
        zoom: 8,
      }}
      style={{ width: '100%', height: '500px' }}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
    >
      {gpsStations.map((station) => (
        <Marker key={station.id} longitude={station.longitude} latitude={station.latitude}>
          <GPSStationMarker station={station} />
        </Marker>
      ))}
    </Map>
  );
}
```

### Features

- **GPS Station Visualization**: Real-time station status and displacement
- **Satellite Imagery Overlay**: Latest processed satellite data
- **Alert Zones**: Visual alert boundaries and evacuation zones
- **Interactive Popups**: Detailed station information
- **Real-time Updates**: Live data via GraphQL subscriptions

## 🔐 Authentication & Authorization

### NextAuth.js with Google OAuth

```tsx
// Sign in with Google
import { signIn, signOut, useSession } from 'next-auth/react';

function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Spinner />;

  if (session) {
    return <Button onClick={() => signOut()}>Sign out {session.user.name}</Button>;
  }

  return <Button onClick={() => signIn('google')}>Sign in with Google</Button>;
}
```

### Role-based Access Control

```tsx
// Component with role-based rendering
function AdminPanel() {
  const { data: session } = useSession();

  if (session?.user?.role !== 'ADMIN') {
    return <div>Access denied</div>;
  }

  return <AdminDashboard />;
}
```

## 📊 State Management

### React Context + Custom Hooks

```tsx
// Alert context
const AlertContext = createContext();

export function useAlertContext() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within AlertProvider');
  }
  return context;
}

// Usage
const { currentAlert, updateAlert } = useAlertContext();
```

### Zustand for Complex State

```tsx
// Store definition
import { create } from 'zustand';

interface DashboardStore {
  selectedRegion: string;
  mapView: 'satellite' | 'terrain';
  setSelectedRegion: (region: string) => void;
  setMapView: (view: 'satellite' | 'terrain') => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  selectedRegion: 'Pacific Northwest',
  mapView: 'satellite',
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setMapView: (view) => set({ mapView: view }),
}));

// Usage in component
const { selectedRegion, setSelectedRegion } = useDashboardStore();
```

## 🧪 Testing Strategy

### Unit Tests with Jest

```tsx
// Component test
import { render, screen } from '@testing-library/react';
import { AlertStatusCard } from './AlertStatusCard';

test('displays alert status correctly', () => {
  const mockAlert = createMockAlertStatus();

  render(<AlertStatusCard alert={mockAlert} />);

  expect(screen.getByText('SAFE')).toBeInTheDocument();
  expect(screen.getByText('All systems normal')).toBeInTheDocument();
});
```

### Integration Tests

```tsx
// GraphQL integration test
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: { query: GET_CURRENT_ALERT_STATUS },
    result: { data: { currentAlertStatus: mockAlert } },
  },
];

test('loads and displays alert status', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <AlertDashboard />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('SAFE')).toBeInTheDocument();
  });
});
```

### E2E Tests with Playwright

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard loads and displays alert status', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.locator('[data-testid="alert-status"]')).toBeVisible();
  await expect(page.locator('[data-testid="map-dashboard"]')).toBeVisible();
});
```

## 🚀 Performance Optimizations

### Next.js Optimizations

- **App Router**: Improved routing and layouts
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Next/Image with Cloudinary
- **Code Splitting**: Automatic route-based splitting
- **ISR**: Incremental Static Regeneration for data

### Bundle Optimization

```tsx
// Lazy loading for heavy components
import dynamic from 'next/dynamic';

const MapDashboard = dynamic(() => import('./MapDashboard'), {
  loading: () => <MapSkeleton />,
  ssr: false, // Disable SSR for map component
});

// Tree shaking for utilities
import { cn } from '@/lib/utils'; // Only import what's needed
```

### Caching Strategy

- **Apollo Client Cache**: In-memory GraphQL cache
- **Next.js Cache**: Static generation and ISR
- **Browser Cache**: Service worker for offline support
- **CDN**: Cloudinary for image delivery

## 📱 Responsive Design

### Mobile-First Approach

```tsx
// Responsive component
function DashboardGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AlertStatusCard className="md:col-span-2 lg:col-span-1" />
      <MapDashboard className="col-span-full lg:col-span-2" />
    </div>
  );
}
```

### Breakpoint System

- **sm**: 640px+ (Mobile landscape)
- **md**: 768px+ (Tablet)
- **lg**: 1024px+ (Desktop)
- **xl**: 1280px+ (Large desktop)
- **2xl**: 1536px+ (Extra large)

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline includes:

1. **Code Quality**: ESLint, Prettier, TypeScript checks
2. **Testing**: Unit tests with coverage, E2E tests
3. **Security**: Dependency audit, Snyk scanning
4. **Build**: Next.js production build
5. **Deploy**: Automatic deployment to Vercel
6. **Monitoring**: Lighthouse performance audits

### Deployment Environments

- **Development**: Local development server
- **Staging**: `develop` branch → Vercel staging
- **Production**: `main` branch → Vercel production

## 🛡️ Security Features

### Content Security Policy

```tsx
// next.config.js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];
```

### Authentication Security

- **JWT Tokens**: Secure token-based authentication
- **CSRF Protection**: Built-in NextAuth.js protection
- **Secure Cookies**: HttpOnly, Secure, SameSite
- **Rate Limiting**: Apollo Client request throttling

## 📈 Monitoring & Analytics

### Performance Monitoring

- **Core Web Vitals**: Lighthouse CI integration
- **Bundle Analysis**: Webpack bundle analyzer
- **Error Tracking**: Console error monitoring
- **User Analytics**: Optional Google Analytics

### Real-time Monitoring

```tsx
// Performance monitoring hook
function usePerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  }, []);
}
```

## 🎯 Key Features

### 🚨 **Real-time Alert System**

- Live alert status updates via GraphQL subscriptions
- Color-coded alert levels (Safe, Watch, Warning, Alert)
- Push notifications for critical alerts
- Alert history and timeline

### 🗺️ **Interactive Map Dashboard**

- Mapbox GL JS integration with custom styling
- Real-time GPS station markers with status indicators
- Satellite imagery overlays
- Interactive popups with detailed station information
- Zoom and pan controls with region selection

### 📊 **Data Visualization**

- Real-time GPS displacement charts
- Satellite anomaly score visualization
- System health metrics dashboard
- Historical data trends and analysis

### 👤 **User Management**

- Google OAuth authentication
- Role-based access control (Admin, Operator, Viewer)
- User preferences and notification settings
- Profile management

### 📱 **Responsive Design**

- Mobile-first responsive design
- Touch-friendly interface for tablets
- Progressive Web App (PWA) capabilities
- Offline support for critical functions

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run format          # Format with Prettier
npm run format:check    # Check Prettier formatting
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests

# GraphQL
npm run codegen         # Generate GraphQL types
npm run codegen:watch   # Watch for schema changes

# Analysis
npm run analyze         # Bundle analysis
npm run clean           # Clean build artifacts
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Set the following in your deployment environment:

- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: Random secret for JWT
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT`: Backend GraphQL URL
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox access token
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `npm run lint:fix` before committing
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🌊 Tsunami Early Warning System - Protecting lives through technology**

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
