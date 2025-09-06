'use client';

// import { Metadata } from 'next'; // Unused import
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  MapPin,
  Satellite,
  Activity,
  TrendingUp,
  Clock,
  Shield,
  Waves,
  // Users, // Unused import
  Database,
  // Wifi, // Unused import
  Battery,
} from 'lucide-react';

// This would typically come from GraphQL queries
const mockData = {
  alertStatus: {
    status: 'SAFE',
    level: 'NONE',
    confidence: 15,
    lastUpdated: new Date().toISOString(),
    message: '✅ Normal conditions in Pacific Northwest',
  },
  gpsStations: {
    total: 12,
    active: 11,
    anomalous: 0,
  },
  satelliteData: {
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    anomalyScore: 0.23,
    region: 'Pacific Northwest',
  },
  systemHealth: {
    overall: 'HEALTHY',
    uptime: '99.8%',
    responseTime: 145,
  },
};

export default function DashboardPage() {
  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'WATCH':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'WARNING':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ALERT':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 30) return 'bg-green-500';
    if (confidence < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                Tsunami Monitoring Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Real-time monitoring and early warning system status
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Clock className="mr-2 h-4 w-4" />
                Last Updated: {new Date().toLocaleTimeString()}
              </Button>
            </div>
          </div>
        </div>

        {/* Alert Status Banner */}
        <Card className={`mb-8 border-2 ${getAlertStatusColor(mockData.alertStatus.status)}`}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {mockData.alertStatus.status === 'SAFE' ? (
                    <Shield className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold">
                      Current Status: {mockData.alertStatus.status}
                    </h2>
                    <Badge
                      variant={mockData.alertStatus.status === 'SAFE' ? 'default' : 'destructive'}
                      className="text-sm"
                    >
                      {mockData.alertStatus.level}
                    </Badge>
                  </div>
                  <p className="mt-1 text-gray-700">{mockData.alertStatus.message}</p>
                  <div className="mt-3 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${getConfidenceColor(mockData.alertStatus.confidence)}`}
                          style={{ width: `${mockData.alertStatus.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {mockData.alertStatus.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GPS Stations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.gpsStations.active}/{mockData.gpsStations.total}
              </div>
              <p className="text-xs text-muted-foreground">Active monitoring stations</p>
              <div className="mt-2">
                <Progress
                  value={(mockData.gpsStations.active / mockData.gpsStations.total) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satellite Data</CardTitle>
              <Satellite className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Fresh</div>
              <p className="text-xs text-muted-foreground">Updated 5 minutes ago</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs text-green-600">Live data</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">{mockData.systemHealth.uptime} uptime</p>
              <div className="mt-2 flex items-center space-x-2">
                <Battery className="h-3 w-3 text-green-500" />
                <span className="text-xs text-gray-600">
                  {mockData.systemHealth.responseTime}ms avg
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Excellent</div>
              <p className="text-xs text-muted-foreground">All sources operational</p>
              <div className="mt-2">
                <Progress value={95} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Waves className="h-5 w-5 text-tsunami-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Common monitoring and analysis tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="h-12 w-full justify-start"
                onClick={() => (window.location.href = '/gps-monitoring')}
              >
                <MapPin className="mr-3 h-4 w-4" />
                View GPS Station Map
              </Button>

              <Button
                variant="outline"
                className="h-12 w-full justify-start"
                onClick={() => (window.location.href = '/satellite-imagery')}
              >
                <Satellite className="mr-3 h-4 w-4" />
                Analyze Satellite Imagery
              </Button>

              <Button
                variant="outline"
                className="h-12 w-full justify-start"
                onClick={() => (window.location.href = '/alert-management')}
              >
                <AlertTriangle className="mr-3 h-4 w-4" />
                Manage Alerts & Notifications
              </Button>

              <Button
                variant="outline"
                className="h-12 w-full justify-start"
                onClick={() => (window.location.href = '/analytics')}
              >
                <TrendingUp className="mr-3 h-4 w-4" />
                View Analytics & Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-tsunami-green-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest system events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">GPS data updated</p>
                    <p className="text-xs text-gray-500">
                      All 11 stations reporting normal readings
                    </p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Satellite imagery processed</p>
                    <p className="text-xs text-gray-500">
                      Pacific Northwest region analysis complete
                    </p>
                    <p className="text-xs text-gray-400">5 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">System health check</p>
                    <p className="text-xs text-gray-500">All components operational</p>
                    <p className="text-xs text-gray-400">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">User login</p>
                    <p className="text-xs text-gray-500">Administrator accessed system</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-tsunami-blue-600" />
              <span>System Overview</span>
            </CardTitle>
            <CardDescription>
              Comprehensive monitoring system status and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-3">
                <h4 className="flex items-center font-semibold text-tsunami-blue-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  GPS Network
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Stations:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Stations:</span>
                    <span className="font-medium text-green-600">11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Quality:</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage Area:</span>
                    <span className="font-medium">Pacific Northwest</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="flex items-center font-semibold text-tsunami-green-600">
                  <Satellite className="mr-2 h-4 w-4" />
                  Satellite Monitoring
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Source:</span>
                    <span className="font-medium">Sentinel-1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution:</span>
                    <span className="font-medium">100m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Update Frequency:</span>
                    <span className="font-medium">Every 5 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anomaly Score:</span>
                    <span className="font-medium text-green-600">0.23 (Low)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="flex items-center font-semibold text-tsunami-red-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Alert System
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">SAFE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-medium text-green-600">15% (Normal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notifications:</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium">&lt; 30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
