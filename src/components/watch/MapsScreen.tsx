import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, MapPin, Navigation, Locate, Zap, ArrowLeft, Car, Clock } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface MapsScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const MapsScreen = ({ onNavigate }: MapsScreenProps) => {
  const [currentLocation, setCurrentLocation] = useState({
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.6139, lng: 77.2090 }
  });

  const [mapMode, setMapMode] = useState<'normal' | 'satellite' | 'traffic'>('normal');
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);

  // Famous locations in India
  const indianLocations = [
    { name: 'Red Fort', city: 'Delhi', distance: '2.5 km', time: '8 min', coordinates: { lat: 28.6562, lng: 77.2410 } },
    { name: 'India Gate', city: 'Delhi', distance: '3.2 km', time: '12 min', coordinates: { lat: 28.6129, lng: 77.2295 } },
    { name: 'Lotus Temple', city: 'Delhi', distance: '15 km', time: '35 min', coordinates: { lat: 28.5535, lng: 77.2588 } },
    { name: 'Qutub Minar', city: 'Delhi', distance: '18 km', time: '42 min', coordinates: { lat: 28.5245, lng: 77.1855 } },
    { name: 'Akshardham', city: 'Delhi', distance: '12 km', time: '28 min', coordinates: { lat: 28.6127, lng: 77.2773 } }
  ];

  const [nearbyPlaces] = useState(indianLocations);

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight GPS movement
      setCurrentLocation(prev => ({
        ...prev,
        coordinates: {
          lat: prev.coordinates.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.coordinates.lng + (Math.random() - 0.5) * 0.001
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const startNavigation = (place: typeof nearbyPlaces[0]) => {
    setDestination(place.name);
    setIsNavigating(true);
    
    // Simulate navigation completion
    setTimeout(() => {
      setIsNavigating(false);
      setDestination(null);
    }, 10000);
  };

  const toggleMapMode = () => {
    const modes: ('normal' | 'satellite' | 'traffic')[] = ['normal', 'satellite', 'traffic'];
    const currentIndex = modes.indexOf(mapMode);
    setMapMode(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <div className="relative  w-full h-full flex flex-col bg-gradient-to-br from-green-900/20 to-blue-900/20 ">
      {/* Header */}
      <div className="absolute top-2 left-0 right-0 z-50 bg-transparent">
        <div className="text-center py-4 watch-slide-up relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="absolute left-[85px] top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 glass-bg hover:bg-white/15 z-20"
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
          <div className="flex items-center justify-center space-x-2">
            <MapPin size={16} className="text-green-400" />
            <h2 className="text-lg font-bold text-white">Maps</h2>
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div className="absolute top-8 mt-3 left-[94px] right-0 translate-y-1/2 z-10 px-3 w-40 h-7 " >
        <div className="glass-bg rounded-lg p-2 text-center border border-white/20 ">
          <div className="flex items-center justify-center space-x-1 mb-0.5">
            <Locate size={10} className="text-green-400" />
            <span className="text-[10px] text-white font-medium">Current Location</span>
          </div>
          <div className="text-xs font-bold text-white">{currentLocation.city}</div>
          <div className="text-[10px] text-white/70">{currentLocation.state}, {currentLocation.country}</div>
          <div className="text-[10px] text-white/50 font-mono mt-0.5">
            {currentLocation.coordinates.lat.toFixed(4)}, {currentLocation.coordinates.lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="flex-1 flex items-center justify-center px-4 pt-12 pb-20  watch-scroll overflow-y-auto">
        <div className="absolute w-full bottom-[0px] max-w-[2200px] aspect-square bg-gradient-to-br from-green-800/30 to-blue-800/30 rounded-full border-2 border-white/20 overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Map Mode Indicator */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white font-medium">
            {mapMode.charAt(0).toUpperCase() + mapMode.slice(1)}
          </div>

          {/* Current Location Pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping" />
            </div>
          </div>

          {/* Nearby Places Indicators */}
          {nearbyPlaces.slice(0, 3).map((place, index) => {
            const positions = [
              { top: '15%', left: '60%' },
              { top: '55%', left: '25%' },
              { top: '20%', left: '15%' }
            ];
            
            return (
              <div
                key={place.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={positions[index]}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full border border-white" />
              </div>
            );
          })}

          {/* Navigation Route */}
          {isNavigating && destination && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Navigation size={24} className="text-blue-400 mx-auto mb-1 animate-spin" />
                <div className="text-xs text-white font-medium">Navigating to</div>
                <div className="text-xs text-blue-400">{destination}</div>
              </div>
            </div>
          )}

          {/* India Outline (Simplified) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="text-6xl text-white/20">🇮🇳</div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-2">
          <Button
            onClick={toggleMapMode}
            className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
              mapMode === 'traffic' ? 'bg-red-500/30 text-red-400 border border-red-400/50' :
              mapMode === 'satellite' ? 'bg-blue-500/30 text-blue-400 border border-blue-400/50' :
              'bg-green-500/30 text-green-400 border border-green-400/50'
            }`}
          >
            {mapMode === 'traffic' && <Car size={10} className="mr-0.5" />}
            {mapMode === 'satellite' && <Zap size={10} className="mr-0.5" />}
            {mapMode === 'normal' && <MapPin size={10} className="mr-0.5" />}
            {mapMode.charAt(0).toUpperCase() + mapMode.slice(1)}
          </Button>
        </div>
        {/* Nearby Places */}
        <div className="flex justify-center">
          <div className="max-h-24 w-[200px] overflow-y-auto watch-scroll">
            <div className="space-y-1">
              {nearbyPlaces.slice(0, 3).map((place, index) => (
                <div
                  key={place.name}
                  onClick={() => startNavigation(place)}
                  className="glass-bg rounded-lg p-2 cursor-pointer transition-all hover:bg-white/20 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{place.name}</div>
                      <div className="text-xs text-white/60">{place.city}</div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-white/70">
                      <div className="flex items-center space-x-1">
                        <MapPin size={8} />
                        <span>{place.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={8} />
                        <span>{place.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button
      <div className="absolute bottom-4 left-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div> */}
    </div>
  );
};

export default MapsScreen;