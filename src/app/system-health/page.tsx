'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Server,
  Database,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Globe,
  Settings,
  Play,
  Square,
  RotateCcw
} from 'lucide-react';

// Mock system health data
const mockSystemHealth = {
  overall: 'HEALTHY',
  uptime: '99.8%',
  lastCheck: new Date().toISOString(),
  components: [
    {
      name: 'GPS Data Fetcher',
      status: 'HEALTHY',
      responseTime: 145,
      errorRate: 0.1,
      lastCheck: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      details: {
        activeConnections: 11,
        dataPoints: 1440,
        lastError: null
      }
    },
    {
      name: 'Satellite Processor',
      status: 'HEALTHY',
      responseTime: 2100,
      errorRate: 0.0,
      lastCheck: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      details: {
        imagesProcessed: 48,
        queueSize: 0,
        lastError: null
      }
    },
    {
      name: 'Detection Engine',
      status: 'HEALTHY',
      responseTime: 890,
      errorRate: 0.2,
      lastCheck: new Date(Date.now() - 30 * 1000).toISOString(),
      details: {
        analysisCount: 156,
        confidence: 0.95,
        lastError: null
      }
    },
    {
      name: 'Alert Manager',
      status: 'HEALTHY',
      responseTime: 320,
      errorRate: 0.0,
      lastCheck: new Date(Date.now() - 45 * 1000).toISOString(),
      details: {
        alertsSent: 127,
        deliveryRate: 99.2,
        lastError: null
      }
    },
    {
      name: 'Database',
      status: 'DEGRADED',
      responseTime: 1250,
      errorRate: 2.1,
      lastCheck: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      details: {
        connections: 45,
        queries: 2840,
        lastError: 'Connection timeout at 10:25 UTC'
      }
    },
    {
      name: 'Notification Service',
      status: 'HEALTHY',
      responseTime: 180,
      errorRate: 0.5,
      lastCheck: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      details: {
        messagesSent: 89,
        deliveryRate: 98.9,
        lastError: null
      }
    }
  ],
  metrics: {
    uptime: '15d 14h 23m',
    responseTime: 425,
    dataFreshness: 2,
    errorRate: 0.3,
    resourceUsage: {
      cpu: 23.5,
      memory: 67.2,
      disk: 78.5,
      network: 12.3
    },
    performanceData: [
      { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), responseTime: 380, cpuUsage: 25.1, memoryUsage: 65.8, activeConnections: 42 },
      { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), responseTime: 420, cpuUsage: 28.3, memoryUsage: 68.2, activeConnections: 38 },
      { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), responseTime: 395, cpuUsage: 22.7, memoryUsage: 66.5, activeConnections: 45 },
      { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), responseTime: 445, cpuUsage: 31.2, memoryUsage: 69.1, activeConnections: 41 },
      { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), responseTime: 410, cpuUsage: 26.8, memoryUsage: 67.8, activeConnections: 39 },
      { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), responseTime: 425, cpuUsage: 23.5, memoryUsage: 67.2, activeConnections: 43 }
    ]
  }
};

export default function SystemHealthPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'DEGRADED':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'CRITICAL':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'MAINTENANCE':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DEGRADED':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'CRITICAL':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'MAINTENANCE':
        return <Settings className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // const getUsageColor = (usage: number) => {
  //   if (usage < 50) return 'bg-green-500';
  //   if (usage < 80) return 'bg-yellow-500';
  //   return 'bg-red-500';
  // };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleComponentAction = async (_component: string, _action: string) => {
    // console.log(`${action} ${component}`); // Removed console.log for production
    // Simulate action
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                System Health
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor system components and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Checking...' : 'Health Check'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <Card className={`mb-8 border-2 ${getStatusColor(mockSystemHealth.overall)}`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(mockSystemHealth.overall)}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold">
                      System Status: {mockSystemHealth.overall}
                    </h2>
                    <Badge className="bg-green-100 text-green-800">
                      Uptime: {mockSystemHealth.uptime}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mt-1">
                    All critical systems operational. Last check: {formatTimeAgo(mockSystemHealth.lastCheck)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">{mockSystemHealth.metrics.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemHealth.metrics.resourceUsage.cpu}%</div>
              <Progress 
                value={mockSystemHealth.metrics.resourceUsage.cpu} 
                className="mt-2"
                style={{
                  '--progress-foreground': mockSystemHealth.metrics.resourceUsage.cpu < 50 ? '#22c55e' : 
                    mockSystemHealth.metrics.resourceUsage.cpu < 80 ? '#eab308' : '#ef4444'
                } as React.CSSProperties}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemHealth.metrics.resourceUsage.memory}%</div>
              <Progress 
                value={mockSystemHealth.metrics.resourceUsage.memory} 
                className="mt-2"
                style={{
                  '--progress-foreground': mockSystemHealth.metrics.resourceUsage.memory < 50 ? '#22c55e' : 
                    mockSystemHealth.metrics.resourceUsage.memory < 80 ? '#eab308' : '#ef4444'
                } as React.CSSProperties}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemHealth.metrics.resourceUsage.disk}%</div>
              <Progress 
                value={mockSystemHealth.metrics.resourceUsage.disk} 
                className="mt-2"
                style={{
                  '--progress-foreground': mockSystemHealth.metrics.resourceUsage.disk < 50 ? '#22c55e' : 
                    mockSystemHealth.metrics.resourceUsage.disk < 80 ? '#eab308' : '#ef4444'
                } as React.CSSProperties}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Usage</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemHealth.metrics.resourceUsage.network}%</div>
              <Progress 
                value={mockSystemHealth.metrics.resourceUsage.network} 
                className="mt-2"
                style={{
                  '--progress-foreground': mockSystemHealth.metrics.resourceUsage.network < 50 ? '#22c55e' : 
                    mockSystemHealth.metrics.resourceUsage.network < 80 ? '#eab308' : '#ef4444'
                } as React.CSSProperties}
              />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="components" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="metrics">Performance</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-6">
            {/* Component Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockSystemHealth.components.map((component) => (
                <Card 
                  key={component.name} 
                  className={`cursor-pointer transition-all ${
                    selectedComponent === component.name ? 'ring-2 ring-tsunami-blue-500' : ''
                  }`}
                  onClick={() => setSelectedComponent(selectedComponent === component.name ? null : component.name)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Server className="h-5 w-5" />
                        <span>{component.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(component.status)}
                        <Badge className={`${getStatusColor(component.status)} text-xs`}>
                          {component.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Response Time</p>
                        <p className="font-medium">{component.responseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Error Rate</p>
                        <p className={`font-medium ${component.errorRate > 1 ? 'text-red-600' : 'text-green-600'}`}>
                          {component.errorRate}%
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Last checked: {formatTimeAgo(component.lastCheck)}
                    </div>

                    {selectedComponent === component.name && (
                      <div className="border-t pt-4 space-y-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Component Details</h4>
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            {Object.entries(component.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                <span className={`font-medium ${key === 'lastError' && value ? 'text-red-600' : ''}`}>
                                  {value === null ? 'None' : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComponentAction(component.name, 'restart');
                            }}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComponentAction(component.name, 'stop');
                            }}
                          >
                            <Square className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComponentAction(component.name, 'start');
                            }}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-tsunami-blue-600" />
                    <span>Response Time Trends</span>
                  </CardTitle>
                  <CardDescription>
                    System response times over the last 6 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Response time chart</p>
                      <p className="text-xs text-gray-400 mt-1">Real-time performance monitoring</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cpu className="h-5 w-5 text-tsunami-green-600" />
                    <span>Resource Usage</span>
                  </CardTitle>
                  <CardDescription>
                    CPU and memory usage over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MemoryStick className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Resource usage chart</p>
                      <p className="text-xs text-gray-400 mt-1">System resource monitoring</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>
                  Key performance indicators and system metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Avg Response Time</span>
                    </div>
                    <div className="text-2xl font-bold">{mockSystemHealth.metrics.responseTime}ms</div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -12% from yesterday
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Data Freshness</span>
                    </div>
                    <div className="text-2xl font-bold">{mockSystemHealth.metrics.dataFreshness}min</div>
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Within target
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Error Rate</span>
                    </div>
                    <div className="text-2xl font-bold">{mockSystemHealth.metrics.errorRate}%</div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -0.2% from yesterday
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Availability</span>
                    </div>
                    <div className="text-2xl font-bold">99.8%</div>
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Above target
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent System Events</CardTitle>
                <CardDescription>
                  Latest system logs and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '10:45:23', level: 'INFO', component: 'GPS Fetcher', message: 'Successfully updated data from 11 stations' },
                    { time: '10:43:15', level: 'WARN', component: 'Database', message: 'Connection timeout detected, retrying...' },
                    { time: '10:42:08', level: 'INFO', component: 'Alert Manager', message: 'Alert notification sent successfully' },
                    { time: '10:40:32', level: 'INFO', component: 'Satellite Processor', message: 'Image analysis completed in 2.1s' },
                    { time: '10:38:45', level: 'ERROR', component: 'Database', message: 'Query timeout after 30s' },
                    { time: '10:35:12', level: 'INFO', component: 'System Health', message: 'Health check completed successfully' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                      <div className="text-xs text-gray-500 font-mono w-20 flex-shrink-0">
                        {log.time}
                      </div>
                      <div className="flex-shrink-0">
                        <Badge 
                          variant={log.level === 'ERROR' ? 'destructive' : 
                                  log.level === 'WARN' ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {log.level}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{log.component}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outline">
                    Load More Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
