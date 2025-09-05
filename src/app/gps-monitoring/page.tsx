'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Activity,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

// Mock GPS station data
const mockGPSStations = [
  {
    id: '1',
    stationId: 'ALBH',
    name: 'Alberni, BC',
    latitude: 49.2378,
    longitude: -124.8056,
    network: 'PBO',
    isActive: true,
    elevation: 45.2,
    quality: 'EXCELLENT',
    displacementX: 2.5,
    displacementY: -1.2,
    displacementZ: 0.8,
    magnitude: 2.9,
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    stationId: 'NANO',
    name: 'Nanaimo, BC',
    latitude: 49.1666,
    longitude: -123.9406,
    network: 'PBO',
    isActive: true,
    elevation: 28.7,
    quality: 'GOOD',
    displacementX: 1.8,
    displacementY: 0.5,
    displacementZ: -0.3,
    magnitude: 1.9,
    lastUpdate: new Date(Date.now() - 1 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    stationId: 'UCLU',
    name: 'Ucluelet, BC',
    latitude: 48.9358,
    longitude: -125.5433,
    network: 'PBO',
    isActive: true,
    elevation: 15.3,
    quality: 'EXCELLENT',
    displacementX: 3.2,
    displacementY: -2.1,
    displacementZ: 1.5,
    magnitude: 4.0,
    lastUpdate: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    stationId: 'BAMF',
    name: 'Bamfield, BC',
    latitude: 48.8358,
    longitude: -125.1358,
    network: 'PBO',
    isActive: false,
    elevation: 22.1,
    quality: 'POOR',
    displacementX: 0.0,
    displacementY: 0.0,
    displacementZ: 0.0,
    magnitude: 0.0,
    lastUpdate: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

export default function GPSMonitoringPage() {
  const [stations, setStations] = useState(mockGPSStations);
  const [searchTerm, setSearchTerm] = useState('');
  const [qualityFilter, setQualityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.stationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuality = qualityFilter === 'ALL' || station.quality === qualityFilter;
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && station.isActive) ||
                         (statusFilter === 'INACTIVE' && !station.isActive);
    
    return matchesSearch && matchesQuality && matchesStatus;
  });

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'GOOD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FAIR':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'POOR':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude < 2) return 'text-green-600';
    if (magnitude < 5) return 'text-yellow-600';
    if (magnitude < 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
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
                GPS Monitoring
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time GPS displacement monitoring and station management
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
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stations.length}</div>
              <p className="text-xs text-muted-foreground">
                Monitoring network
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stations.filter(s => s.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently reporting
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anomalous Readings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stations.filter(s => s.magnitude > 10).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Magnitude</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stations.reduce((acc, s) => acc + s.magnitude, 0) / stations.length).toFixed(1)}mm
              </div>
              <p className="text-xs text-muted-foreground">
                Current average
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="stations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stations">Station List</TabsTrigger>
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="stations" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Stations</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Station name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quality">Data Quality</Label>
                    <select
                      id="quality"
                      value={qualityFilter}
                      onChange={(e) => setQualityFilter(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="ALL">All Quality Levels</option>
                      <option value="EXCELLENT">Excellent</option>
                      <option value="GOOD">Good</option>
                      <option value="FAIR">Fair</option>
                      <option value="POOR">Poor</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Station Status</Label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="ALL">All Stations</option>
                      <option value="ACTIVE">Active Only</option>
                      <option value="INACTIVE">Inactive Only</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setQualityFilter('ALL');
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

            {/* Stations List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStations.map((station) => (
                <Card 
                  key={station.id} 
                  className={`cursor-pointer transition-all ${
                    selectedStation === station.id ? 'ring-2 ring-tsunami-blue-500' : ''
                  } ${!station.isActive ? 'opacity-75' : ''}`}
                  onClick={() => setSelectedStation(selectedStation === station.id ? null : station.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{station.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={station.isActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {station.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                        <Badge className={`text-xs ${getQualityColor(station.quality)}`}>
                          {station.quality}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      {station.stationId} • {station.network} Network
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Latitude</p>
                        <p className="font-medium">{station.latitude.toFixed(4)}°</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Longitude</p>
                        <p className="font-medium">{station.longitude.toFixed(4)}°</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Elevation</p>
                        <p className="font-medium">{station.elevation}m</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Magnitude</p>
                        <p className={`font-bold ${getMagnitudeColor(station.magnitude)}`}>
                          {station.magnitude.toFixed(1)}mm
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Displacement (mm)</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-gray-500">East (X)</p>
                          <p className="font-medium flex items-center justify-center">
                            {station.displacementX > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : station.displacementX < 0 ? (
                              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            ) : null}
                            {station.displacementX.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-gray-500">North (Y)</p>
                          <p className="font-medium flex items-center justify-center">
                            {station.displacementY > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : station.displacementY < 0 ? (
                              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            ) : null}
                            {station.displacementY.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-gray-500">Up (Z)</p>
                          <p className="font-medium flex items-center justify-center">
                            {station.displacementZ > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : station.displacementZ < 0 ? (
                              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            ) : null}
                            {station.displacementZ.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(station.lastUpdate)}
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStations.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
                  <p className="text-gray-500 text-center">
                    Try adjusting your search criteria or filters to find stations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interactive GPS Station Map</CardTitle>
                <CardDescription>
                  Geographical view of all GPS monitoring stations with real-time data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Interactive Map</h3>
                    <p className="text-gray-500">
                      Mapbox integration will display GPS stations here with real-time displacement data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Displacement Trends</CardTitle>
                  <CardDescription>
                    Historical displacement patterns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Displacement trend chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Station Performance</CardTitle>
                  <CardDescription>
                    Data quality and uptime statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Performance metrics chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
