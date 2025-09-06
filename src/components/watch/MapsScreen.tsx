import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, MapPin, Navigation, Compass, ArrowLeft, Map, Satellite, Car, X } from 'lucide-react';

interface MapsScreenProps {
  onNavigate: (screen: string) => void;
}

interface Location {
  name: string;
  coordinates: string;
  distance: string;
  time: string;
  type: 'landmark' | 'restaurant' | 'hospital' | 'mall';
}

const MapsScreen = ({ onNavigate }: MapsScreenProps) => {
  const [currentLocation, setCurrentLocation] = useState({
    name: 'New Delhi',
    coordinates: '28.6139° N, 77.2090° E',
    address: 'Connaught Place, New Delhi, India'
  });

  const [mapMode, setMapMode] = useState<'normal' | 'satellite' | 'traffic'>('normal');
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);

  const [nearbyPlaces] = useState<Location[]>([
    {
      name: 'Red Fort',
      coordinates: '28.6562° N, 77.2410° E',
      distance: '2.3 km',
      time: '8 min',
      type: 'landmark'
    },
    {
      name: 'India Gate',
      coordinates: '28.6129° N, 77.2295° E',
      distance: '1.8 km',
      time: '6 min',
      type: 'landmark'
    },
    {
      name: 'Lotus Temple',
      coordinates: '28.5535° N, 77.2588° E',
      distance: '12.5 km',
      time: '25 min',
      type: 'landmark'
    },
    {
      name: 'Karim Hotel',
      coordinates: '28.6506° N, 77.2334° E',
      distance: '3.1 km',
      time: '12 min',
      type: 'restaurant'
    },
    {
      name: 'AIIMS Hospital',
      coordinates: '28.5672° N, 77.2100° E',
      distance: '5.2 km',
      time: '18 min',
      type: 'hospital'
    },
    {
      name: 'Select City Walk',
      coordinates: '28.5244° N, 77.2066° E',
      distance: '8.7 km',
      time: '22 min',
      type: 'mall'
    }
  ]);

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Slightly change coordinates to simulate movement
      const latChange = (Math.random() - 0.5) * 0.001;
      const lonChange = (Math.random() - 0.5) * 0.001;
      
      setCurrentLocation(prev => {
        const [lat, lon] = prev.coordinates.split(', ').map(coord => 
          parseFloat(coord.replace(/[°NSEW\s]/g, ''))
        );
        
        return {
          ...prev,
          coordinates: `${(lat + latChange).toFixed(4)}° N, ${(lon + lonChange).toFixed(4)}° E`
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'landmark': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'hospital': return '🏥';
      case 'mall': return '🛍️';
      default: return '📍';
    }
  };

  const getPlaceColor = (type: string) => {
    switch (type) {
      case 'landmark': return 'text-yellow-400 border-yellow-400/30';
      case 'restaurant': return 'text-orange-400 border-orange-400/30';
      case 'hospital': return 'text-red-400 border-red-400/30';
      case 'mall': return 'text-purple-400 border-purple-400/30';
      default: return 'text-white/60 border-white/20';
    }
  };

  const startNavigation = (place: Location) => {
    setSelectedDestination(place);
    setIsNavigating(true);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setSelectedDestination(null);
  };

  const toggleMapMode = () => {
    const modes: ('normal' | 'satellite' | 'traffic')[] = ['normal', 'satellite', 'traffic'];
    const currentIndex = modes.indexOf(mapMode);
    setMapMode(modes[(currentIndex + 1) % modes.length]);
  };

  const getMapModeIcon = () => {
    switch (mapMode) {
      case 'satellite': return <Satellite size={14} className="text-blue-400" />;
      case 'traffic': return <Car size={14} className="text-red-400" />;
      default: return <Map size={14} className="text-green-400" />;
    }
  };

  return (
    <div className="watch-content-safe flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20"
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
          <h2 className="text-lg font-bold text-white">Maps</h2>
        </div>
        
        <Button
          onClick={toggleMapMode}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full"
        >
          {getMapModeIcon()}
          <span className="text-xs text-white capitalize">{mapMode}</span>
        </Button>
      </div>

      {/* Navigation Status */}
      {isNavigating && selectedDestination && (
        <div className="mx-4 mb-3 glass-bg rounded-lg p-3 border border-primary/30 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation size={14} className="text-primary" />
              <div>
                <div className="text-sm font-medium text-white">
                  To {selectedDestination.name}
                </div>
                <div className="text-xs text-white/70">
                  {selectedDestination.distance} • {selectedDestination.time}
                </div>
              </div>
            </div>
            <Button
              onClick={stopNavigation}
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 bg-red-500/20 hover:bg-red-500/30 rounded"
            >
              <X size={10} className="text-red-400" />
            </Button>
          </div>
        </div>
      )}

      {/* Map Simulation */}
      <div className="flex-1 mx-4 mb-3 bg-gradient-to-br from-green-800/30 to-blue-800/30 rounded-xl border border-white/20 relative overflow-hidden">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="border border-white/10" />
            ))}
          </div>
        </div>
        
        {/* Current Location Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-blue-500/50 rounded-full animate-ping" />
        </div>
        
        {/* Nearby Places Markers */}
        <div className="absolute top-1/4 right-1/4">
          <div className="w-3 h-3 bg-red-500 rounded-full" title="Red Fort" />
        </div>
        <div className="absolute bottom-1/3 left-1/3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" title="India Gate" />
        </div>
        <div className="absolute top-1/3 left-1/4">
          <div className="w-3 h-3 bg-purple-500 rounded-full" title="Lotus Temple" />
        </div>

        {/* Map Mode Overlay */}
        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs text-white capitalize">{mapMode} View</span>
        </div>

        {/* Compass */}
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Compass size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Current Location Info */}
      <div className="mx-4 mb-3 glass-bg rounded-lg p-3 border border-white/20">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin size={14} className="text-primary" />
          <span className="text-sm font-medium text-white">Current Location</span>
        </div>
        <div className="text-xs text-white/80 mb-1">{currentLocation.name}</div>
        <div className="text-xs text-white/60 mb-1">{currentLocation.address}</div>
        <div className="text-xs text-white/50 font-mono">{currentLocation.coordinates}</div>
      </div>

      {/* Nearby Places */}
      <div className="flex-1 overflow-y-auto watch-scroll mx-4">
        <div className="text-sm text-white/80 mb-2">Nearby Places</div>
        <div className="space-y-2">
          {nearbyPlaces.map((place, index) => (
            <div
              key={index}
              className={`glass-bg rounded-lg p-3 border transition-all ${getPlaceColor(place.type)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-lg">{getPlaceIcon(place.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {place.name}
                    </div>
                    <div className="text-xs text-white/60">
                      {place.distance} • {place.time}
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => startNavigation(place)}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 bg-primary/20 hover:bg-primary/30 rounded-full"
                >
                  <Navigation size={12} className="text-primary" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Home Button */}
      <div className="flex justify-center pt-2 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MapsScreen;