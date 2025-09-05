'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Satellite, 
  Download,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Calendar,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Layers,
  Filter,
  BarChart3
} from 'lucide-react';

// Mock satellite data
const mockSatelliteData = {
  latest: {
    id: '1',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzMzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2NjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOTk5O3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxpdmUgU2F0ZWxsaXRlIEltYWdlcnk8L3RleHQ+Cjwvc3ZnPgo=',
    timestamp: new Date().toISOString(),
    region: 'Pacific Northwest',
    regionBounds: [-130, 40, -120, 50],
    regionCenter: [-125, 45],
    anomalyScore: 0.23,
    metadata: {
      satellite: 'Sentinel-1',
      resolution: '100m',
      polarization: 'VV',
      processingLevel: 'Level-1 GRD',
      cloudCover: 0.0,
      dataSource: 'Google Earth Engine'
    },
    processingInfo: {
      baselineComparison: true,
      anomalyThreshold: 0.7,
      processingTime: '2.3s',
      algorithm: 'Statistical Change Detection'
    }
  },
  historical: [
    {
      id: '2',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzMzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2NjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOTk5O3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhpc3RvcmljYWwgSW1hZ2VyeTwvdGV4dD4KPC9zdmc+Cg==',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      region: 'Pacific Northwest',
      regionBounds: [-130, 40, -120, 50],
      regionCenter: [-125, 45],
      anomalyScore: 0.18,
      metadata: {
        satellite: 'Sentinel-1',
        resolution: '100m',
        polarization: 'VV',
        processingLevel: 'Level-1 GRD',
        cloudCover: 0.0,
        dataSource: 'Google Earth Engine'
      },
      processingInfo: {
        baselineComparison: true,
        anomalyThreshold: 0.7,
        processingTime: '1.8s',
        algorithm: 'Statistical Change Detection'
      }
    },
    {
      id: '3',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzMzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2NjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOTk5O3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhpc3RvcmljYWwgSW1hZ2VyeTwvdGV4dD4KPC9zdmc+Cg==',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      region: 'Pacific Northwest',
      regionBounds: [-130, 40, -120, 50],
      regionCenter: [-125, 45],
      anomalyScore: 0.31,
      metadata: {
        satellite: 'Sentinel-1',
        resolution: '100m',
        polarization: 'VV',
        processingLevel: 'Level-1 GRD',
        cloudCover: 0.0,
        dataSource: 'Google Earth Engine'
      },
      processingInfo: {
        baselineComparison: true,
        anomalyThreshold: 0.7,
        processingTime: '2.5s',
        algorithm: 'Statistical Change Detection'
      }
    },
    {
      id: '4',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzMzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2NjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOTk5O3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhpc3RvcmljYWwgSW1hZ2VyeTwvdGV4dD4KPC9zdmc+Cg==',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      region: 'Pacific Northwest',
      regionBounds: [-130, 40, -120, 50],
      regionCenter: [-125, 45],
      anomalyScore: 0.15,
      metadata: {
        satellite: 'Sentinel-1',
        resolution: '100m',
        polarization: 'VV',
        processingLevel: 'Level-1 GRD',
        cloudCover: 0.0,
        dataSource: 'Google Earth Engine'
      },
      processingInfo: {
        baselineComparison: true,
        anomalyThreshold: 0.7,
        processingTime: '1.9s',
        algorithm: 'Statistical Change Detection'
      }
    }
  ]
};

export default function SatelliteImageryPage() {
  const [selectedImage, setSelectedImage] = useState(mockSatelliteData.latest);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);

  const getAnomalyColor = (score: number) => {
    if (score < 0.3) return 'text-green-600';
    if (score < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAnomalyBadgeColor = (score: number) => {
    if (score < 0.3) return 'bg-green-100 text-green-800 border-green-200';
    if (score < 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const handleProcessImage = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
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
                Satellite Imagery Analysis
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time satellite monitoring with anomaly detection
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleProcessImage}
                disabled={isProcessing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? 'Processing...' : 'Refresh Data'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Image</CardTitle>
              <Satellite className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Fresh</div>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(selectedImage.timestamp)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anomaly Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAnomalyColor(selectedImage.anomalyScore)}`}>
                {(selectedImage.anomalyScore * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Current detection level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Source</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedImage.metadata.satellite}</div>
              <p className="text-xs text-muted-foreground">
                {selectedImage.metadata.resolution} resolution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedImage.processingInfo.processingTime}</div>
              <p className="text-xs text-muted-foreground">
                Analysis duration
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Satellite className="h-5 w-5 text-tsunami-blue-600" />
                      <span>Current Satellite Image</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedImage.region} • {new Date(selectedImage.timestamp).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getAnomalyBadgeColor(selectedImage.anomalyScore)}`}>
                      Anomaly: {(selectedImage.anomalyScore * 100).toFixed(1)}%
                    </Badge>
                    {selectedImage.anomalyScore < 0.3 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                      disabled={zoomLevel <= 50}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-3">
                      {zoomLevel}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                      disabled={zoomLevel >= 200}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(100)}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMetadata(!showMetadata)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {showMetadata ? 'Hide' : 'Show'} Info
                    </Button>
                  </div>
                </div>

                {/* Image Display */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                  <img
                    src={selectedImage.imageUrl}
                    alt="Satellite imagery"
                    className="w-full h-auto"
                    style={{ 
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                  
                  {/* Overlay Information */}
                  {showMetadata && (
                    <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3" />
                          <span>{selectedImage.region}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(selectedImage.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-3 w-3" />
                          <span>Anomaly: {(selectedImage.anomalyScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-tsunami-blue-600" />
                        <p className="font-medium">Processing satellite data...</p>
                        <Progress value={66} className="w-48 mt-3" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-tsunami-green-600" />
                  <span>Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Detection Algorithm</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Algorithm:</span>
                        <span className="font-medium">{selectedImage.processingInfo.algorithm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Baseline Comparison:</span>
                        <span className="font-medium">
                          {selectedImage.processingInfo.baselineComparison ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Threshold:</span>
                        <span className="font-medium">
                          {(selectedImage.processingInfo.anomalyThreshold * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Image Metadata</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Satellite:</span>
                        <span className="font-medium">{selectedImage.metadata.satellite}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolution:</span>
                        <span className="font-medium">{selectedImage.metadata.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cloud Cover:</span>
                        <span className="font-medium">{selectedImage.metadata.cloudCover}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Historical Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Images</CardTitle>
                <CardDescription>
                  Historical satellite data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[selectedImage, ...mockSatelliteData.historical].map((image, index) => (
                  <div
                    key={image.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedImage.id === image.id 
                        ? 'border-tsunami-blue-500 bg-tsunami-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {index === 0 ? 'Latest' : formatTimeAgo(image.timestamp)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Score: {(image.anomalyScore * 100).toFixed(1)}%
                        </p>
                      </div>
                      <Badge className={`text-xs ${getAnomalyBadgeColor(image.anomalyScore)}`}>
                        {image.anomalyScore < 0.3 ? 'Normal' : 
                         image.anomalyScore < 0.7 ? 'Watch' : 'Alert'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleProcessImage}
                  disabled={isProcessing}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reprocess Image
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Layers className="h-4 w-4 mr-2" />
                  View Layers
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Processing Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Pipeline</span>
                    <span className="text-green-600">Operational</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Image Analysis</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Anomaly Detection</span>
                    <span className="text-green-600">Running</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span className="text-yellow-600">78% Used</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
