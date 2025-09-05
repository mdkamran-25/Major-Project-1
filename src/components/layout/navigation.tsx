'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/auth/user-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompactStatusIndicator } from '@/components/realtime/status-indicator';
import { 
  Home,
  Map,
  Satellite,
  AlertTriangle,
  BarChart3,
  Settings,
  User,
  Shield,
  Activity,
  Bell,
  Menu,
  X,
  Waves
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and status'
  },
  {
    name: 'GPS Monitoring',
    href: '/gps-monitoring',
    icon: Map,
    description: 'Real-time GPS data'
  },
  {
    name: 'Satellite Imagery',
    href: '/satellite-imagery',
    icon: Satellite,
    description: 'Satellite analysis'
  },
  {
    name: 'Alert Management',
    href: '/alert-management',
    icon: AlertTriangle,
    description: 'Alert system control'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Data analysis & trends'
  },
  {
    name: 'System Health',
    href: '/system-health',
    icon: Activity,
    description: 'System monitoring'
  }
];

const userMenuItems = [
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    roles: ['ADMIN', 'OPERATOR', 'VIEWER']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN', 'OPERATOR', 'VIEWER']
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['ADMIN', 'OPERATOR', 'VIEWER']
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: Shield,
    roles: ['ADMIN']
  }
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { userProfile } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const hasAccess = (roles: string[]) => {
    return userProfile?.role && roles.includes(userProfile.role);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white/95 lg:backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 rounded-full flex items-center justify-center">
              <Waves className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Tsunami Alert
              </h1>
              <p className="text-xs text-gray-500">Early Warning System</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-4 py-6 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-tsunami-blue-50 to-tsunami-green-50 text-tsunami-blue-700 border border-tsunami-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon 
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive(item.href) 
                        ? 'text-tsunami-blue-600' 
                        : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Menu Items */}
          <div className="px-4 py-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Account
            </h3>
            <div className="space-y-1">
              {userMenuItems.map((item) => {
                if (!hasAccess(item.roles)) return null;
                
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-tsunami-blue-50 to-tsunami-green-50 text-tsunami-blue-700 border border-tsunami-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon 
                      className={cn(
                        'mr-3 h-4 w-4 flex-shrink-0',
                        isActive(item.href) 
                          ? 'text-tsunami-blue-600' 
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {item.name}
                    {item.name === 'Admin Panel' && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        ADMIN
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 rounded-full flex items-center justify-center">
              <Waves className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">
              Tsunami Alert
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <CompactStatusIndicator />
            <UserMenu />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors',
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-tsunami-blue-50 to-tsunami-green-50 text-tsunami-blue-700 border border-tsunami-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon 
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive(item.href) 
                          ? 'text-tsunami-blue-600' 
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Menu */}
            <div className="px-2 py-3 space-y-1 bg-gray-50">
              {userMenuItems.map((item) => {
                if (!hasAccess(item.roles)) return null;
                
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-tsunami-blue-50 to-tsunami-green-50 text-tsunami-blue-700 border border-tsunami-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon 
                      className={cn(
                        'mr-3 h-4 w-4 flex-shrink-0',
                        isActive(item.href) 
                          ? 'text-tsunami-blue-600' 
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {item.name}
                    {item.name === 'Admin Panel' && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        ADMIN
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
