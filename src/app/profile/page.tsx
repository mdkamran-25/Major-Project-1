'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { updateUserProfile } from '@/lib/firebase-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Settings,
  Camera,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Mock user data extensions
const mockUserExtensions = {
  profile: {
    bio: 'Tsunami monitoring specialist with 10+ years of experience in early warning systems.',
    location: 'Vancouver, BC, Canada',
    timezone: 'Pacific Standard Time (PST)',
    phone: '+1 (555) 123-4567',
    department: 'Emergency Management',
    joinDate: '2020-03-15',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  preferences: {
    alertTypes: ['HIGH', 'CRITICAL'],
    regions: ['Pacific Northwest', 'Vancouver Island', 'Coastal Oregon'],
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    language: 'English',
    theme: 'system',
    timezone: 'America/Vancouver'
  },
  activity: [
    {
      id: '1',
      action: 'Viewed GPS monitoring dashboard',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'view'
    },
    {
      id: '2',
      action: 'Updated alert preferences',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'update'
    },
    {
      id: '3',
      action: 'Acknowledged system alert',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      type: 'action'
    },
    {
      id: '4',
      action: 'Generated analytics report',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      type: 'export'
    },
    {
      id: '5',
      action: 'Logged into system',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      type: 'login'
    }
  ]
};

export default function ProfilePage() {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    bio: mockUserExtensions.profile.bio,
    location: mockUserExtensions.profile.location,
    phone: mockUserExtensions.profile.phone,
    department: mockUserExtensions.profile.department
  });

  const [preferences, setPreferences] = useState(
    userProfile?.preferences || mockUserExtensions.preferences
  );

  // Update form data when user profile loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || ''
      }));
    }
    if (userProfile?.preferences) {
      setPreferences(userProfile.preferences);
    }
  }, [user, userProfile]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Update user profile in Firebase
      await updateUserProfile(user.uid, {
        displayName: formData.name,
        preferences: preferences,
        // Add other fields as needed
        updatedAt: new Date()
      });
      
      // Refresh user profile to get latest data
      await refreshUserProfile();
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Could add toast notification here for error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.displayName || '',
      bio: mockUserExtensions.profile.bio,
      location: mockUserExtensions.profile.location,
      phone: mockUserExtensions.profile.phone,
      department: mockUserExtensions.profile.department
    });
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'OPERATOR':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'VIEWER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'update':
        return <Settings className="h-4 w-4 text-green-500" />;
      case 'action':
        return <CheckCircle className="h-4 w-4 text-orange-500" />;
      case 'export':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'login':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account information and preferences
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={user?.photoURL || ''} 
                    alt={user?.displayName || 'User'} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 text-white text-xl">
                    {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.displayName || 'User'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getRoleBadgeColor(userProfile?.role || 'VIEWER')}`}>
                      {userProfile?.role || 'VIEWER'}
                    </Badge>
                    {userProfile?.isActive && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.email}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {mockUserExtensions.profile.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {new Date(mockUserExtensions.profile.joinDate).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-gray-700 mt-3">
                  {mockUserExtensions.profile.bio}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      Email cannot be changed. Contact administrator if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type={showPhone ? 'text' : 'password'}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPhone(!showPhone)}
                      >
                        {showPhone ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account status and system access details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">User ID</span>
                      <span className="text-sm text-gray-600">{user?.uid || 'N/A'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Role</span>
                      <Badge className={`${getRoleBadgeColor(userProfile?.role || 'VIEWER')}`}>
                        {userProfile?.role || 'VIEWER'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Account Status</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Active</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Join Date</span>
                      <span className="text-sm text-gray-600">
                        {new Date(mockUserExtensions.profile.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last Login</span>
                      <span className="text-sm text-gray-600">
                        {formatTimeAgo(mockUserExtensions.profile.lastLogin)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Timezone</span>
                      <span className="text-sm text-gray-600">
                        {mockUserExtensions.profile.timezone}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Permissions</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'View GPS Data', granted: true },
                        { name: 'View Satellite Imagery', granted: true },
                        { name: 'Manage Alerts', granted: userProfile?.role !== 'VIEWER' },
                        { name: 'System Administration', granted: userProfile?.role === 'ADMIN' },
                        { name: 'User Management', granted: userProfile?.role === 'ADMIN' }
                      ].map((permission) => (
                        <div key={permission.name} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{permission.name}</span>
                          {permission.granted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure how you receive alerts and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive alerts via email</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full ${preferences.emailNotifications ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}>
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${preferences.emailNotifications ? 'left-6' : 'left-0.5'}`} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-500">Receive alerts via text message</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full ${preferences.smsNotifications ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}>
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${preferences.smsNotifications ? 'left-6' : 'left-0.5'}`} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive alerts in your browser</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full ${preferences.pushNotifications ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}>
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${preferences.pushNotifications ? 'left-6' : 'left-0.5'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium">Alert Types to Receive</Label>
                    <div className="mt-2 space-y-2">
                      {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`alert-${level}`}
                            checked={preferences.alertTypes.includes(level)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreferences({
                                  ...preferences,
                                  alertTypes: [...preferences.alertTypes, level]
                                });
                              } else {
                                setPreferences({
                                  ...preferences,
                                  alertTypes: preferences.alertTypes.filter(t => t !== level)
                                });
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`alert-${level}`} className="text-sm">
                            {level} Priority Alerts
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Preferences</CardTitle>
                  <CardDescription>
                    Select regions you want to monitor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Monitored Regions</Label>
                    <div className="space-y-2">
                      {[
                        'Pacific Northwest',
                        'Vancouver Island',
                        'Coastal Oregon',
                        'Northern California',
                        'Puget Sound',
                        'Columbia River'
                      ].map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`region-${region}`}
                            checked={preferences.regions.includes(region)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreferences({
                                  ...preferences,
                                  regions: [...preferences.regions, region]
                                });
                              } else {
                                setPreferences({
                                  ...preferences,
                                  regions: preferences.regions.filter(r => r !== region)
                                });
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`region-${region}`} className="text-sm">
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select
                          id="language"
                          value={preferences.language}
                          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="English">English</option>
                          <option value="French">Français</option>
                          <option value="Spanish">Español</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <select
                          id="theme"
                          value={preferences.theme}
                          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="system">System</option>
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Login Sessions</p>
                        <p className="text-sm text-gray-500">Manage active sessions</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Login History</p>
                        <p className="text-sm text-gray-500">Review recent login activity</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password regularly for better security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button className="w-full">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and system interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserExtensions.activity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outline">
                    Load More Activity
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
