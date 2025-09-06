'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Activity,
  MapPin,
  Satellite,
  AlertTriangle,
  Clock,
  Database,
  PieChart,
  LineChart,
} from 'lucide-react';

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalAlerts: 127,
    alertsThisMonth: 8,
    avgResponseTime: 28,
    systemUptime: 99.8,
    dataQuality: 95.2,
  },
  gpsMetrics: {
    totalStations: 12,
    activeStations: 11,
    avgDisplacement: 2.4,
    anomalousReadings: 3,
    dataPointsToday: 1440,
  },
  satelliteMetrics: {
    imagesProcessed: 48,
    avgAnomalyScore: 0.23,
    processingTime: 2.1,
    storageUsed: 78.5,
  },
  alertTrends: [
    { month: 'Jan', safe: 28, watch: 2, warning: 1, alert: 0 },
    { month: 'Feb', safe: 25, watch: 4, warning: 2, alert: 1 },
    { month: 'Mar', safe: 30, watch: 1, warning: 0, alert: 0 },
    { month: 'Apr', safe: 27, watch: 3, warning: 1, alert: 0 },
    { month: 'May', safe: 29, watch: 2, warning: 0, alert: 0 },
    { month: 'Jun', safe: 26, watch: 3, warning: 2, alert: 0 },
  ],
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('alerts');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4" />;
    if (value < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Analytics & Reports</h1>
              <p className="mt-1 text-gray-600">System performance metrics and trend analysis</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.totalAlerts}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className={`flex items-center ${getChangeColor(5.2)}`}>
                  {getChangeIcon(5.2)}
                  <span className="ml-1">+5.2% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.avgResponseTime}s</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className={`flex items-center ${getChangeColor(-12.5)}`}>
                  {getChangeIcon(-12.5)}
                  <span className="ml-1">-12.5% improvement</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.systemUptime}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className={`flex items-center ${getChangeColor(0.3)}`}>
                  {getChangeIcon(0.3)}
                  <span className="ml-1">+0.3% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.dataQuality}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className={`flex items-center ${getChangeColor(2.1)}`}>
                  {getChangeIcon(2.1)}
                  <span className="ml-1">+2.1% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.overview.alertsThisMonth}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className={`flex items-center ${getChangeColor(-25.0)}`}>
                  {getChangeIcon(-25.0)}
                  <span className="ml-1">-25% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gps">GPS Analytics</TabsTrigger>
            <TabsTrigger value="satellite">Satellite Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alert Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Alert Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-tsunami-blue-600" />
                    <span>Alert Trends</span>
                  </CardTitle>
                  <CardDescription>Monthly alert distribution by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <BarChart3 className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">Alert trends chart will be displayed here</p>
                      <p className="mt-1 text-xs text-gray-400">Using Recharts for visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-tsunami-green-600" />
                    <span>System Performance</span>
                  </CardTitle>
                  <CardDescription>Response times and uptime metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <LineChart className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">Performance metrics chart</p>
                      <p className="mt-1 text-xs text-gray-400">Real-time system monitoring</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>System Summary</CardTitle>
                <CardDescription>Comprehensive overview of all system components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <h4 className="flex items-center font-semibold text-tsunami-blue-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      GPS Monitoring
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Stations:</span>
                        <span className="font-medium">
                          {mockAnalytics.gpsMetrics.activeStations}/
                          {mockAnalytics.gpsMetrics.totalStations}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Displacement:</span>
                        <span className="font-medium">
                          {mockAnalytics.gpsMetrics.avgDisplacement}mm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Points Today:</span>
                        <span className="font-medium">
                          {mockAnalytics.gpsMetrics.dataPointsToday.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anomalous Readings:</span>
                        <span className="font-medium text-yellow-600">
                          {mockAnalytics.gpsMetrics.anomalousReadings}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="flex items-center font-semibold text-tsunami-green-600">
                      <Satellite className="mr-2 h-4 w-4" />
                      Satellite Analysis
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Images Processed:</span>
                        <span className="font-medium">
                          {mockAnalytics.satelliteMetrics.imagesProcessed}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Anomaly Score:</span>
                        <span className="font-medium">
                          {(mockAnalytics.satelliteMetrics.avgAnomalyScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Time:</span>
                        <span className="font-medium">
                          {mockAnalytics.satelliteMetrics.processingTime}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage Used:</span>
                        <span className="font-medium text-orange-600">
                          {mockAnalytics.satelliteMetrics.storageUsed}%
                        </span>
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
                        <span className="text-gray-600">Total Alerts:</span>
                        <span className="font-medium">{mockAnalytics.overview.totalAlerts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Month:</span>
                        <span className="font-medium">
                          {mockAnalytics.overview.alertsThisMonth}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Response:</span>
                        <span className="font-medium">
                          {mockAnalytics.overview.avgResponseTime}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-medium text-green-600">99.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gps" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>GPS Station Performance</CardTitle>
                  <CardDescription>Individual station metrics and reliability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">GPS station performance chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Displacement Patterns</CardTitle>
                  <CardDescription>Historical displacement trends and anomalies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <TrendingUp className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">Displacement pattern analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* GPS Station List */}
            <Card>
              <CardHeader>
                <CardTitle>Station Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['ALBH', 'NANO', 'UCLU', 'BAMF'].map((stationId, index) => (
                    <div
                      key={stationId}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-3 w-3 rounded-full ${index < 3 ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <div>
                          <p className="font-medium">{stationId}</p>
                          <p className="text-sm text-gray-500">
                            {index < 3 ? 'Operational' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{index < 3 ? '99.5%' : '0%'} uptime</p>
                        <p className="text-xs text-gray-500">
                          {index < 3 ? 'Excellent' : 'Needs attention'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satellite" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Metrics</CardTitle>
                  <CardDescription>Image processing performance and throughput</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <Satellite className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">Processing metrics chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Anomaly Detection</CardTitle>
                  <CardDescription>Anomaly scores and detection accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <PieChart className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">Anomaly detection chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Distribution</CardTitle>
                  <CardDescription>Breakdown of alerts by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <PieChart className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">Alert distribution pie chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                  <CardDescription>Alert response and resolution times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">Response time trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {mockAnalytics.alertTrends.reduce((acc, month) => acc + month.safe, 0)}
                    </div>
                    <p className="text-sm text-gray-600">Safe Alerts</p>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {mockAnalytics.alertTrends.reduce((acc, month) => acc + month.watch, 0)}
                    </div>
                    <p className="text-sm text-gray-600">Watch Alerts</p>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {mockAnalytics.alertTrends.reduce((acc, month) => acc + month.warning, 0)}
                    </div>
                    <p className="text-sm text-gray-600">Warning Alerts</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {mockAnalytics.alertTrends.reduce((acc, month) => acc + month.alert, 0)}
                    </div>
                    <p className="text-sm text-gray-600">Critical Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
