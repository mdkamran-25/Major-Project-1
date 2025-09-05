'use client';

import { TopNavbar } from './top-navbar';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AlertSubscription } from '@/components/realtime/alert-subscription';
import { DataSubscription } from '@/components/realtime/data-subscription';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />

        {/* Real-time Subscriptions */}
        <AlertSubscription />
        <DataSubscription showToasts={true} />

        {/* Main Content */}
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
