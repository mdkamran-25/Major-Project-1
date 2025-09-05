'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Bell,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  MessageSquare,
  Volume2,
  Mail,
  Smartphone,
  Globe,
  Shield,
  Activity,
  Settings,
  Plus,
  Filter,
  Search
} from 'lucide-react';

// Mock alert data
const mockAlerts = [
  {
    id: '1',
    alertId: 'ALERT-2025-001',
    status: 'SAFE',
    level: 'NONE',
    confidence: 15,
    message: '✅ Normal conditions in Pacific Northwest at 10:30 UTC. Confidence: 15.0%',
    region: 'Pacific Northwest',
    timestamp: new Date().toISOString(),
    duration: null,
    resolved: true,
    resolvedAt: new Date().toISOString(),
    isActive: false
  },
  {
    id: '2',
    alertId: 'ALERT-2025-002',
    status: 'WATCH',
    level: 'LOW',
    confidence: 45,
    message: '⚠️ Elevated readings detected at 3 GPS stations. Monitoring closely.',
    region: 'Vancouver Island',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    resolved: true,
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isActive: false
  },
  {
    id: '3',
    alertId: 'ALERT-2025-003',
    status: 'WARNING',
    level: 'MEDIUM',
    confidence: 75,
    message: '🚨 Significant anomaly detected. Prepare for possible evacuation.',
    region: 'Coastal Oregon',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    resolved: true,
    resolvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    isActive: false
  }
];

const mockNotifications = [
  {
    id: '1',
    type: 'SMS',
    recipient: '+1-555-0123',
    message: 'Tsunami Alert: Normal conditions in Pacific Northwest',
    status: 'DELIVERED',
    sentAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    type: 'EMAIL',
    recipient: 'admin@coastalwatch.gov',
    message: 'Weekly Tsunami System Status Report',
    status: 'SENT',
    sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    deliveredAt: null
  },
  {
    id: '3',
    type: 'PUSH',
    recipient: 'mobile-app-users',
    message: 'System maintenance scheduled for tonight',
    status: 'DELIVERED',
    sentAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 59 * 60 * 1000).toISOString()
  }
];

export default function AlertManagementPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [testMessage, setTestMessage] = useState('');
  const [testRecipients, setTestRecipients] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'WATCH':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'WARNING':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ALERT':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'NONE':
        return 'text-green-600';
      case 'LOW':
        return 'text-yellow-600';
      case 'MEDIUM':
        return 'text-orange-600';
      case 'HIGH':
      case 'CRITICAL':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'SMS':
        return <Smartphone className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'PUSH':
        return <Bell className="h-4 w-4" />;
      case 'WEBHOOK':
        return <Globe className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getNotificationStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600';
      case 'SENT':
        return 'text-blue-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'FAILED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSendTestAlert = async () => {
    if (!testMessage.trim() || !testRecipients.trim()) return;
    
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add to notifications list
    const newNotification = {
      id: Date.now().toString(),
      type: 'SMS',
      recipient: testRecipients,
      message: testMessage,
      status: 'SENT',
      sentAt: new Date().toISOString(),
      deliveredAt: null
    };
    
    setNotifications([newNotification, ...notifications]);
    setTestMessage('');
    setTestRecipients('');
    setIsSending(false);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.alertId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Alert Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage tsunami alerts and notifications
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Status</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">SAFE</div>
              <p className="text-xs text-muted-foreground">
                All systems normal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No active alerts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications Sent</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">&lt;30s</div>
              <p className="text-xs text-muted-foreground">
                Average alert time
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Alert History</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="test">Test Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-alerts">Search Alerts</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-alerts"
                        placeholder="Search by message, region, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Alert Status</Label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SAFE">Safe</option>
                      <option value="WATCH">Watch</option>
                      <option value="WARNING">Warning</option>
                      <option value="ALERT">Alert</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('ALL');
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className={`${getStatusColor(alert.status)}`}>
                            {alert.status}
                          </Badge>
                          <Badge variant="outline" className={getLevelColor(alert.level)}>
                            {alert.level}
                          </Badge>
                          <span className="text-sm text-gray-500">{alert.alertId}</span>
                          {alert.resolved ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        
                        <p className="text-gray-900 font-medium">{alert.message}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTimeAgo(alert.timestamp)}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {alert.region}
                          </div>
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-1" />
                            Confidence: {alert.confidence}%
                          </div>
                          {alert.duration && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Duration: {alert.duration}min
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {!alert.resolved && (
                          <Button variant="outline" size="sm">
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                  <p className="text-gray-500 text-center">
                    Try adjusting your search criteria or filters to find alerts.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>
                  History of sent notifications and their delivery status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getNotificationTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{notification.type}</span>
                            <span className={`text-sm ${getNotificationStatusColor(notification.status)}`}>
                              {notification.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">To: {notification.recipient}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>Sent: {formatTimeAgo(notification.sentAt)}</p>
                        {notification.deliveredAt && (
                          <p>Delivered: {formatTimeAgo(notification.deliveredAt)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Send Test Alert</span>
                </CardTitle>
                <CardDescription>
                  Test the alert notification system with a custom message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-message">Alert Message</Label>
                  <Textarea
                    id="test-message"
                    placeholder="Enter your test alert message..."
                    value={testMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTestMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-recipients">Recipients</Label>
                  <Input
                    id="test-recipients"
                    placeholder="Enter phone numbers or email addresses (comma-separated)"
                    value={testRecipients}
                    onChange={(e) => setTestRecipients(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleSendTestAlert}
                    disabled={isSending || !testMessage.trim() || !testRecipients.trim()}
                    className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600"
                  >
                    {isSending ? (
                      <>
                        <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Test Alert
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTestMessage('🧪 This is a test alert from the Tsunami Early Warning System. Please ignore this message.');
                      setTestRecipients('+1-555-TEST');
                    }}
                  >
                    Use Sample Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>
                    Configure notification delivery methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Send alerts via text message</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Send alerts via email</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Send alerts to mobile apps</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Webhook Integration</p>
                        <p className="text-sm text-gray-500">Send to external systems</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alert Thresholds</CardTitle>
                  <CardDescription>
                    Configure when alerts should be triggered
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Low Alert Threshold</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="number" value="30" className="w-20" />
                      <span className="text-sm text-gray-500">% confidence</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Medium Alert Threshold</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="number" value="60" className="w-20" />
                      <span className="text-sm text-gray-500">% confidence</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>High Alert Threshold</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="number" value="85" className="w-20" />
                      <span className="text-sm text-gray-500">% confidence</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Save Thresholds
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
