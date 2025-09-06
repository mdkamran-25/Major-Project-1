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
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
