'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Bell,
  Globe,
  Shield,
  Palette,
  Database,
  Wifi,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Smartphone,
  Mail
} from 'lucide-react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'Tsunami Early Warning System',
    refreshInterval: 30,
    dataRetention: 90,
    timezone: 'America/Vancouver',
    language: 'English',
    
    // Alert Settings
    alertThresholds: {
      low: 30,
      medium: 60,
      high: 85,
      critical: 95
    },
    alertCooldown: 300,
    autoAcknowledge: false,
    
    // Notification Settings
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    webhookEnabled: false,
    
    // API Settings
    apiTimeout: 30,
    maxRetries: 3,
    rateLimitPerMinute: 100,
    
    // Display Settings
    theme: 'system',
    compactMode: false,
    showAnimations: true,
    highContrast: false
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      systemName: 'Tsunami Early Warning System',
      refreshInterval: 30,
      dataRetention: 90,
      timezone: 'America/Vancouver',
      language: 'English',
      alertThresholds: {
        low: 30,
        medium: 60,
        high: 85,
        critical: 95
      },
      alertCooldown: 300,
      autoAcknowledge: false,
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      webhookEnabled: false,
      apiTimeout: 30,
      maxRetries: 3,
      rateLimitPerMinute: 100,
      theme: 'system',
      compactMode: false,
      showAnimations: true,
      highContrast: false
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                System Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Configure system behavior and preferences
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API & Data</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <SettingsIcon className="h-5 w-5" />
                    <span>System Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Basic system settings and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-name">System Name</Label>
                    <Input
                      id="system-name"
                      value={settings.systemName}
                      onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Data Refresh Interval (seconds)</Label>
                    <Input
                      id="refresh-interval"
                      type="number"
                      min="10"
                      max="300"
                      value={settings.refreshInterval}
                      onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-gray-500">
                      How often to refresh real-time data (10-300 seconds)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention (days)</Label>
                    <Input
                      id="data-retention"
                      type="number"
                      min="30"
                      max="365"
                      value={settings.dataRetention}
                      onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-gray-500">
                      How long to keep historical data (30-365 days)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">System Timezone</Label>
                    <select
                      id="timezone"
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                      <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">System Language</Label>
                    <select
                      id="language"
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="English">English</option>
                      <option value="French">Français</option>
                      <option value="Spanish">Español</option>
                      <option value="Japanese">日本語</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>System Status</span>
                  </CardTitle>
                  <CardDescription>
                    Current system configuration and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Version</p>
                      <p className="text-sm text-gray-600">v2.1.0</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Environment</p>
                      <p className="text-sm text-gray-600">Production</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Uptime</p>
                      <p className="text-sm text-gray-600">15d 14h 23m</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Status</p>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <p className="text-sm text-green-600">Healthy</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">System Resources</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CPU Usage</span>
                        <span className="text-sm font-medium">23.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Memory Usage</span>
                        <span className="text-sm font-medium">67.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Storage Usage</span>
                        <span className="text-sm font-medium">78.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Connections</span>
                        <span className="text-sm font-medium">43</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Alert Thresholds</span>
                  </CardTitle>
                  <CardDescription>
                    Configure confidence thresholds for different alert levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="threshold-low">Low Alert Threshold (%)</Label>
                    <Input
                      id="threshold-low"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.alertThresholds.low}
                      onChange={(e) => setSettings({
                        ...settings,
                        alertThresholds: {
                          ...settings.alertThresholds,
                          low: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threshold-medium">Medium Alert Threshold (%)</Label>
                    <Input
                      id="threshold-medium"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.alertThresholds.medium}
                      onChange={(e) => setSettings({
                        ...settings,
                        alertThresholds: {
                          ...settings.alertThresholds,
                          medium: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threshold-high">High Alert Threshold (%)</Label>
                    <Input
                      id="threshold-high"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.alertThresholds.high}
                      onChange={(e) => setSettings({
                        ...settings,
                        alertThresholds: {
                          ...settings.alertThresholds,
                          high: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threshold-critical">Critical Alert Threshold (%)</Label>
                    <Input
                      id="threshold-critical"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.alertThresholds.critical}
                      onChange={(e) => setSettings({
                        ...settings,
                        alertThresholds: {
                          ...settings.alertThresholds,
                          critical: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Alert Behavior</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how alerts are handled and processed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-cooldown">Alert Cooldown (seconds)</Label>
                    <Input
                      id="alert-cooldown"
                      type="number"
                      min="60"
                      max="3600"
                      value={settings.alertCooldown}
                      onChange={(e) => setSettings({ ...settings, alertCooldown: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-gray-500">
                      Minimum time between similar alerts (60-3600 seconds)
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-acknowledge">Auto-acknowledge Low Alerts</Label>
                      <p className="text-sm text-gray-500">Automatically acknowledge low-priority alerts</p>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full ${settings.autoAcknowledge ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                      onClick={() => setSettings({ ...settings, autoAcknowledge: !settings.autoAcknowledge })}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.autoAcknowledge ? 'left-6' : 'left-0.5'}`} />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Current Thresholds</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm text-green-700">Low Alert</span>
                        <span className="text-sm font-medium">{settings.alertThresholds.low}%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="text-sm text-yellow-700">Medium Alert</span>
                        <span className="text-sm font-medium">{settings.alertThresholds.medium}%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="text-sm text-orange-700">High Alert</span>
                        <span className="text-sm font-medium">{settings.alertThresholds.high}%</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm text-red-700">Critical Alert</span>
                        <span className="text-sm font-medium">{settings.alertThresholds.critical}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Channels</span>
                  </CardTitle>
                  <CardDescription>
                    Enable or disable different notification methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Send alerts via email</p>
                      </div>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full ${settings.emailEnabled ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                      onClick={() => setSettings({ ...settings, emailEnabled: !settings.emailEnabled })}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.emailEnabled ? 'left-6' : 'left-0.5'}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Send alerts via text message</p>
                      </div>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full ${settings.smsEnabled ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                      onClick={() => setSettings({ ...settings, smsEnabled: !settings.smsEnabled })}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.smsEnabled ? 'left-6' : 'left-0.5'}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Browser and mobile push alerts</p>
                      </div>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full ${settings.pushEnabled ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                      onClick={() => setSettings({ ...settings, pushEnabled: !settings.pushEnabled })}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.pushEnabled ? 'left-6' : 'left-0.5'}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Webhook Integration</p>
                        <p className="text-sm text-gray-500">Send to external systems</p>
                      </div>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full ${settings.webhookEnabled ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                      onClick={() => setSettings({ ...settings, webhookEnabled: !settings.webhookEnabled })}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.webhookEnabled ? 'left-6' : 'left-0.5'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Status</CardTitle>
                  <CardDescription>
                    Current status of notification services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Email Service</span>
                      </div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">SMS Service</span>
                      </div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Push Service</span>
                      </div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Webhook Service</span>
                      </div>
                      <span className="text-sm text-yellow-600">Disabled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wifi className="h-5 w-5" />
                    <span>API Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure API behavior and limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-timeout">API Timeout (seconds)</Label>
                    <Input
                      id="api-timeout"
                      type="number"
                      min="5"
                      max="120"
                      value={settings.apiTimeout}
                      onChange={(e) => setSettings({ ...settings, apiTimeout: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-retries">Maximum Retries</Label>
                    <Input
                      id="max-retries"
                      type="number"
                      min="1"
                      max="10"
                      value={settings.maxRetries}
                      onChange={(e) => setSettings({ ...settings, maxRetries: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
                    <Input
                      id="rate-limit"
                      type="number"
                      min="10"
                      max="1000"
                      value={settings.rateLimitPerMinute}
                      onChange={(e) => setSettings({ ...settings, rateLimitPerMinute: parseInt(e.target.value) })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Status</CardTitle>
                  <CardDescription>
                    Current API performance and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Response Time</p>
                      <p className="text-sm text-gray-600">425ms avg</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Success Rate</p>
                      <p className="text-sm text-green-600">99.7%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Requests/min</p>
                      <p className="text-sm text-gray-600">87</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Error Rate</p>
                      <p className="text-sm text-red-600">0.3%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Display Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize the appearance and behavior of the interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <select
                        id="theme"
                        value={settings.theme}
                        onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compact-mode">Compact Mode</Label>
                        <p className="text-sm text-gray-500">Use smaller spacing and elements</p>
                      </div>
                      <div 
                        className={`w-12 h-6 rounded-full ${settings.compactMode ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                        onClick={() => setSettings({ ...settings, compactMode: !settings.compactMode })}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.compactMode ? 'left-6' : 'left-0.5'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="animations">Show Animations</Label>
                        <p className="text-sm text-gray-500">Enable smooth transitions and effects</p>
                      </div>
                      <div 
                        className={`w-12 h-6 rounded-full ${settings.showAnimations ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                        onClick={() => setSettings({ ...settings, showAnimations: !settings.showAnimations })}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.showAnimations ? 'left-6' : 'left-0.5'}`} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="high-contrast">High Contrast</Label>
                        <p className="text-sm text-gray-500">Improve accessibility with higher contrast</p>
                      </div>
                      <div 
                        className={`w-12 h-6 rounded-full ${settings.highContrast ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                        onClick={() => setSettings({ ...settings, highContrast: !settings.highContrast })}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${settings.highContrast ? 'left-6' : 'left-0.5'}`} />
                      </div>
                    </div>
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
