'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Mail,
  Smartphone,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  Filter,
  Search,
  Archive,
  Trash2,
} from 'lucide-react';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'SYSTEM',
    priority: 'HIGH',
    title: 'System Health Alert',
    message: 'Database connection timeout detected. System performance may be affected.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    archived: false,
    channel: 'EMAIL',
    recipient: 'admin@tsunami-alert.com',
  },
  {
    id: '2',
    type: 'ALERT',
    priority: 'MEDIUM',
    title: 'GPS Station Anomaly',
    message: 'Station UCLU reporting elevated displacement readings. Monitoring closely.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: true,
    archived: false,
    channel: 'SMS',
    recipient: '+1-555-0123',
  },
  {
    id: '3',
    type: 'MAINTENANCE',
    priority: 'LOW',
    title: 'Scheduled Maintenance Complete',
    message:
      'Satellite data processing maintenance completed successfully. All systems operational.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    archived: false,
    channel: 'PUSH',
    recipient: 'All Users',
  },
  {
    id: '4',
    type: 'SECURITY',
    priority: 'HIGH',
    title: 'New Login Detected',
    message:
      "New login from IP address 192.168.1.100. If this wasn't you, please secure your account.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    archived: false,
    channel: 'EMAIL',
    recipient: 'admin@tsunami-alert.com',
  },
  {
    id: '5',
    type: 'ALERT',
    priority: 'CRITICAL',
    title: 'Tsunami Alert Resolved',
    message: 'Previous tsunami warning for Coastal Oregon has been resolved. All clear.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    archived: true,
    channel: 'SMS',
    recipient: '+1-555-0123',
  },
  {
    id: '6',
    type: 'SYSTEM',
    priority: 'LOW',
    title: 'Data Backup Complete',
    message: 'Daily data backup completed successfully. All systems backed up.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
    archived: false,
    channel: 'EMAIL',
    recipient: 'admin@tsunami-alert.com',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || notification.type === typeFilter;
    const matchesPriority = priorityFilter === 'ALL' || notification.priority === priorityFilter;

    return matchesSearch && matchesType && matchesPriority;
  });

  const unreadCount = notifications.filter((n) => !n.read && !n.archived).length;
  const archivedCount = notifications.filter((n) => n.archived).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ALERT':
        return 'bg-red-100 text-red-800';
      case 'SYSTEM':
        return 'bg-blue-100 text-blue-800';
      case 'SECURITY':
        return 'bg-purple-100 text-purple-800';
      case 'MAINTENANCE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'SMS':
        return <Smartphone className="h-4 w-4" />;
      case 'PUSH':
        return <Bell className="h-4 w-4" />;
      case 'WEBHOOK':
        return <Globe className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleArchive = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, archived: true, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'read':
        setNotifications(
          notifications.map((n) =>
            selectedNotifications.includes(n.id) ? { ...n, read: true } : n
          )
        );
        break;
      case 'archive':
        setNotifications(
          notifications.map((n) =>
            selectedNotifications.includes(n.id) ? { ...n, archived: true, read: true } : n
          )
        );
        break;
      case 'delete':
        setNotifications(notifications.filter((n) => !selectedNotifications.includes(n.id)));
        break;
    }
    setSelectedNotifications([]);
  };

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Notifications</h1>
              <p className="mt-1 text-gray-600">Manage your alerts and system notifications</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </Button>
              {selectedNotifications.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('read')}>
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Mark Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('archive')}>
                    <Archive className="mr-1 h-4 w-4" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Notifications requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">All notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{archivedCount}</div>
              <p className="text-xs text-muted-foreground">Archived notifications</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedCount})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="ALL">All Types</option>
                      <option value="ALERT">Alerts</option>
                      <option value="SYSTEM">System</option>
                      <option value="SECURITY">Security</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="ALL">All Priorities</option>
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setTypeFilter('ALL');
                        setPriorityFilter('ALL');
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${
                    !notification.read ? 'border-l-4 border-l-tsunami-blue-500 bg-blue-50/30' : ''
                  } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-tsunami-blue-500' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNotifications([...selectedNotifications, notification.id]);
                            } else {
                              setSelectedNotifications(
                                selectedNotifications.filter((id) => id !== notification.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className={`${getTypeColor(notification.type)} text-xs`}>
                            {notification.type}
                          </Badge>
                          <Badge className={`${getPriorityColor(notification.priority)} text-xs`}>
                            {notification.priority}
                          </Badge>
                          <div className="flex items-center space-x-1 text-gray-500">
                            {getChannelIcon(notification.channel)}
                            <span className="text-xs">{notification.channel}</span>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>

                        <div>
                          <h3 className="mb-1 font-semibold text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-700">{notification.message}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </div>
                            <div>To: {notification.recipient}</div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                            {!notification.archived && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => handleArchive(notification.id)}
                              >
                                Archive
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-red-600"
                              onClick={() => handleDelete(notification.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No notifications found</h3>
                  <p className="text-center text-gray-500">
                    Try adjusting your search criteria or filters to find notifications.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-6">
            <div className="space-y-4">
              {filteredNotifications
                .filter((n) => !n.read && !n.archived)
                .map((notification) => (
                  <Card
                    key={notification.id}
                    className="border-l-4 border-l-tsunami-blue-500 bg-blue-50/30"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge className={`${getTypeColor(notification.type)} text-xs`}>
                              {notification.type}
                            </Badge>
                            <Badge className={`${getPriorityColor(notification.priority)} text-xs`}>
                              {notification.priority}
                            </Badge>
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          </div>

                          <div>
                            <h3 className="mb-1 font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-700">{notification.message}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as Read
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            <div className="space-y-4">
              {filteredNotifications
                .filter((n) => n.archived)
                .map((notification) => (
                  <Card key={notification.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge className={`${getTypeColor(notification.type)} text-xs`}>
                              {notification.type}
                            </Badge>
                            <Badge className={`${getPriorityColor(notification.priority)} text-xs`}>
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              ARCHIVED
                            </Badge>
                          </div>

                          <div>
                            <h3 className="mb-1 font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-700">{notification.message}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-red-600"
                              onClick={() => handleDelete(notification.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure your notification settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <div className="relative h-6 w-12 rounded-full bg-green-500">
                      <div className="absolute left-6 top-0.5 h-5 w-5 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive browser notifications</p>
                    </div>
                    <div className="relative h-6 w-12 rounded-full bg-green-500">
                      <div className="absolute left-6 top-0.5 h-5 w-5 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                    </div>
                    <div className="relative h-6 w-12 rounded-full bg-gray-300">
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Button className="w-full">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
