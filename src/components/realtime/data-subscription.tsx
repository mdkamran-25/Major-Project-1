'use client';

import { useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { toast } from '@/hooks/use-toast';
import { MapPin, Satellite, Activity } from 'lucide-react';

const GPS_READING_SUBSCRIPTION = gql`
  subscription NewGPSReading {
    newGPSReading {
      id
      stationId
      station {
        name
        network
      }
      latitude
      longitude
      displacementX
      displacementY
      displacementZ
      magnitude
      quality
      timestamp
    }
  }
`;

const SATELLITE_DATA_SUBSCRIPTION = gql`
  subscription NewSatelliteData {
    newSatelliteData {
      id
      imageUrl
      timestamp
      region
      anomalyScore
      metadata {
        satellite
        resolution
      }
    }
  }
`;

const SYSTEM_HEALTH_SUBSCRIPTION = gql`
  subscription SystemHealthUpdated {
    systemHealthUpdated {
      id
      overallStatus
      components {
        name
        status
        responseTime
        errorRate
      }
      metrics {
        uptime
        responseTime
        errorRate
        resourceUsage {
          cpu
          memory
          disk
          network
        }
      }
      timestamp
    }
  }
`;

interface DataSubscriptionProps {
  onGPSUpdate?: (reading: any) => void;
  onSatelliteUpdate?: (data: any) => void;
  onSystemHealthUpdate?: (health: any) => void;
  showToasts?: boolean;
}

export function DataSubscription({
  onGPSUpdate,
  onSatelliteUpdate,
  onSystemHealthUpdate,
  showToasts = false,
}: DataSubscriptionProps) {
  // GPS Reading Subscription
  const { data: gpsData } = useSubscription(GPS_READING_SUBSCRIPTION, {
    onData: ({ data }) => {
      const reading = data?.data?.newGPSReading;
      if (reading) {
        // Show toast for anomalous readings
        if (showToasts && (reading.quality === 'ANOMALOUS' || reading.magnitude > 15)) {
          toast({
            title: 'GPS Anomaly Detected',
            description: (
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span>{`Station ${reading.stationId} (${reading.station.name}) reporting ${reading.magnitude.toFixed(1)}mm displacement`}</span>
              </div>
            ),
            className: 'border-orange-500 border-l-4',
          });
        }

        onGPSUpdate?.(reading);
      }
    },
  });

  // Satellite Data Subscription
  const { data: satelliteData } = useSubscription(SATELLITE_DATA_SUBSCRIPTION, {
    onData: ({ data }) => {
      const satelliteReading = data?.data?.newSatelliteData;
      if (satelliteReading) {
        // Show toast for high anomaly scores
        if (showToasts && satelliteReading.anomalyScore > 0.7) {
          toast({
            title: 'Satellite Anomaly Detected',
            description: (
              <div className="flex items-center space-x-2">
                <Satellite className="h-5 w-5 text-red-500" />
                <span>{`High anomaly score (${(satelliteReading.anomalyScore * 100).toFixed(1)}%) detected in ${satelliteReading.region}`}</span>
              </div>
            ),
            className: 'border-red-500 border-l-4',
          });
        }

        onSatelliteUpdate?.(satelliteReading);
      }
    },
  });

  // System Health Subscription
  const { data: healthData } = useSubscription(SYSTEM_HEALTH_SUBSCRIPTION, {
    onData: ({ data }) => {
      const health = data?.data?.systemHealthUpdated;
      if (health) {
        // Show toast for system health changes
        if (showToasts && health.overallStatus !== 'HEALTHY') {
          toast({
            title: 'System Health Alert',
            description: (
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-yellow-500" />
                <span>{`System status changed to ${health.overallStatus}`}</span>
              </div>
            ),
            className: 'border-yellow-500 border-l-4',
          });
        }

        onSystemHealthUpdate?.(health);
      }
    },
  });

  return null; // This component only handles subscriptions
}

// Hook for using data subscriptions
export function useDataSubscription() {
  const { data: gpsData, loading: gpsLoading } = useSubscription(GPS_READING_SUBSCRIPTION);
  const { data: satelliteData, loading: satelliteLoading } = useSubscription(
    SATELLITE_DATA_SUBSCRIPTION
  );
  const { data: healthData, loading: healthLoading } = useSubscription(SYSTEM_HEALTH_SUBSCRIPTION);

  return {
    latestGPSReading: gpsData?.newGPSReading,
    latestSatelliteData: satelliteData?.newSatelliteData,
    systemHealth: healthData?.systemHealthUpdated,
    loading: gpsLoading || satelliteLoading || healthLoading,
  };
}
