'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAlertSubscription } from '@/components/realtime/alert-subscription';
import { useDataSubscription } from '@/components/realtime/data-subscription';
import { Wifi, WifiOff, Activity, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export function StatusIndicator({ showDetails = false, className = '' }: StatusIndicatorProps) {
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'reconnecting'
  >('connected');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { currentAlert, latestDetection, loading: alertLoading } = useAlertSubscription();
  const {
    latestGPSReading,
    latestSatelliteData,
    systemHealth,
    loading: dataLoading,
  } = useDataSubscription();

  // Update last update time when any data changes
  useEffect(() => {
    if (
      currentAlert ||
      latestDetection ||
      latestGPSReading ||
      latestSatelliteData ||
      systemHealth
    ) {
      setLastUpdate(new Date());
    }
  }, [currentAlert, latestDetection, latestGPSReading, latestSatelliteData, systemHealth]);

  // Simulate connection status (in real app, this would come from Apollo Client connection state)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      const shouldSimulateIssue = Math.random() < 0.05; // 5% chance
      if (shouldSimulateIssue && connectionStatus === 'connected') {
        setConnectionStatus('reconnecting');
        setTimeout(() => setConnectionStatus('connected'), 2000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3 text-green-500" />;
      case 'reconnecting':
        return <Activity className="h-3 w-3 animate-pulse text-yellow-500" />;
      case 'disconnected':
        return <WifiOff className="h-3 w-3 text-red-500" />;
    }
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
            <div className="flex items-center space-x-1">
              {getConnectionIcon()}
              <span>Live</span>
            </div>
          </Badge>
        );
      case 'reconnecting':
        return (
          <Badge variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-700">
            <div className="flex items-center space-x-1">
              {getConnectionIcon()}
              <span>Reconnecting</span>
            </div>
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700">
            <div className="flex items-center space-x-1">
              {getConnectionIcon()}
              <span>Offline</span>
            </div>
          </Badge>
        );
    }
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';

    const diff = Date.now() - lastUpdate.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!showDetails) {
    return <div className={`flex items-center space-x-2 ${className}`}>{getConnectionBadge()}</div>;
  }

  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}>
      {getConnectionBadge()}

      <div className="flex items-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>Last update: {formatLastUpdate()}</span>
        </div>

        {currentAlert && (
          <div className="flex items-center space-x-1">
            <div
              className={`h-2 w-2 rounded-full ${
                currentAlert.status === 'SAFE'
                  ? 'bg-green-500'
                  : currentAlert.status === 'WATCH'
                    ? 'bg-yellow-500'
                    : currentAlert.status === 'WARNING'
                      ? 'bg-orange-500'
                      : 'bg-red-500'
              }`}
            />
            <span>{currentAlert.status}</span>
          </div>
        )}

        {systemHealth && (
          <div className="flex items-center space-x-1">
            <div
              className={`h-2 w-2 rounded-full ${
                systemHealth.overallStatus === 'HEALTHY'
                  ? 'bg-green-500'
                  : systemHealth.overallStatus === 'DEGRADED'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            />
            <span>System {systemHealth.overallStatus.toLowerCase()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for navigation bars
export function CompactStatusIndicator({ className = '' }: { className?: string }) {
  return <StatusIndicator showDetails={false} className={className} />;
}

// Detailed version for dashboards
export function DetailedStatusIndicator({ className = '' }: { className?: string }) {
  return <StatusIndicator showDetails={true} className={className} />;
}
