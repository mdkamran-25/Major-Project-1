'use client';

import { useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Clock, Bell } from 'lucide-react';

const ALERT_STATUS_SUBSCRIPTION = gql`
  subscription AlertStatusUpdated {
    alertStatusUpdated {
      id
      status
      level
      confidence
      message
      region
      lastUpdated
      isActive
      details {
        anomalyDetected
        gpsTriggered
        satelliteTriggered
        triggeredStations
        recommendation
        estimatedImpactTime
        affectedAreas
        evacuationZones
      }
    }
  }
`;

const DETECTION_RESULT_SUBSCRIPTION = gql`
  subscription DetectionResultUpdated {
    detectionResultUpdated {
      id
      anomalyDetected
      confidence
      alertLevel
      timestamp
      region
      gpsAnalysis {
        maxDisplacement
        triggeredStationsCount
        confidence
      }
      satelliteAnalysis {
        anomalyDetected
        anomalyScore
        confidence
      }
    }
  }
`;

interface AlertSubscriptionProps {
  onAlertUpdate?: (alert: any) => void;
  onDetectionUpdate?: (detection: any) => void;
}

export function AlertSubscription({ onAlertUpdate, onDetectionUpdate }: AlertSubscriptionProps) {
  // Alert Status Subscription
  const { data: alertData } = useSubscription(ALERT_STATUS_SUBSCRIPTION, {
    onData: ({ data }) => {
      const alert = data?.data?.alertStatusUpdated;
      if (alert) {
        // Show toast notification for alert changes
        const getAlertIcon = (status: string) => {
          switch (status) {
            case 'SAFE':
              return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'WATCH':
              return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'WARNING':
              return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            case 'ALERT':
              return <AlertTriangle className="h-5 w-5 text-red-500" />;
            default:
              return <Bell className="h-5 w-5 text-blue-500" />;
          }
        };

        const getAlertColor = (status: string) => {
          switch (status) {
            case 'SAFE':
              return 'border-green-500';
            case 'WATCH':
              return 'border-yellow-500';
            case 'WARNING':
              return 'border-orange-500';
            case 'ALERT':
              return 'border-red-500';
            default:
              return 'border-blue-500';
          }
        };

        // Only show toast for non-SAFE alerts or significant changes
        if (alert.status !== 'SAFE' || alert.confidence > 30) {
          toast({
            title: 'Alert Status Updated',
            description: (
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.status)}
                <span>{alert.message}</span>
              </div>
            ),
            className: `${getAlertColor(alert.status)} border-l-4`,
            duration: alert.status === 'ALERT' ? 0 : 5000, // Critical alerts persist
          });
        }

        onAlertUpdate?.(alert);
      }
    },
  });

  // Detection Result Subscription
  const { data: detectionData } = useSubscription(DETECTION_RESULT_SUBSCRIPTION, {
    onData: ({ data }) => {
      const detection = data?.data?.detectionResultUpdated;
      if (detection) {
        // Show toast for significant detection results
        if (detection.anomalyDetected || detection.confidence > 50) {
          toast({
            title: 'New Detection Result',
            description: (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>{`${detection.anomalyDetected ? 'Anomaly detected' : 'Analysis complete'} in ${detection.region} - Confidence: ${(detection.confidence * 100).toFixed(1)}%`}</span>
              </div>
            ),
            className: detection.anomalyDetected
              ? 'border-orange-500 border-l-4'
              : 'border-blue-500 border-l-4',
          });
        }

        onDetectionUpdate?.(detection);
      }
    },
  });

  return null; // This component only handles subscriptions
}

// Hook for using alert subscriptions
export function useAlertSubscription() {
  const { data: alertData, loading: alertLoading } = useSubscription(ALERT_STATUS_SUBSCRIPTION);
  const { data: detectionData, loading: detectionLoading } = useSubscription(
    DETECTION_RESULT_SUBSCRIPTION
  );

  return {
    currentAlert: alertData?.alertStatusUpdated,
    latestDetection: detectionData?.detectionResultUpdated,
    loading: alertLoading || detectionLoading,
  };
}
