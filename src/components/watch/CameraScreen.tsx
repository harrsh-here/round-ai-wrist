import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Camera, Zap, Timer, RotateCcw, ArrowLeft, Smartphone, Wifi } from 'lucide-react';

interface CameraScreenProps {
  onNavigate: (screen: string) => void;
}

const CameraScreen = ({ onNavigate }: CameraScreenProps) => {
  const [isConnected, setIsConnected] = useState(true);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [timerMode, setTimerMode] = useState<0 | 3 | 10>(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [photoCount, setPhotoCount] = useState(247);
  const [lastPhotoTime, setLastPhotoTime] = useState<Date | null>(null);

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance every 5 seconds
        setIsConnected(prev => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            capturePhoto();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const capturePhoto = () => {
    setIsCapturing(true);
    setPhotoCount(prev => prev + 1);
    setLastPhotoTime(new Date());
    
    // Simulate capture flash
    setTimeout(() => {
      setIsCapturing(false);
    }, 200);
  };

  const handleShutterPress = () => {
    if (!isConnected || isCapturing || countdown > 0) return;
    
    if (timerMode > 0) {
      setCountdown(timerMode);
    } else {
      capturePhoto();
    }
  };

  const toggleFlash = () => {
    const modes: ('off' | 'on' | 'auto')[] = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flashMode);
    setFlashMode(modes[(currentIndex + 1) % modes.length]);
  };

  const toggleTimer = () => {
    const modes: (0 | 3 | 10)[] = [0, 3, 10];
    const currentIndex = modes.indexOf(timerMode);
    setTimerMode(modes[(currentIndex + 1) % modes.length]);
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on': return <Zap size={16} className="text-yellow-400" />;
      case 'auto': return <Zap size={16} className="text-blue-400" />;
      default: return <Zap size={16} className="text-white/40" />;
    }
  };

  const getTimerIcon = () => {
    if (timerMode === 0) return <Timer size={16} className="text-white/40" />;
    return <Timer size={16} className="text-primary" />;
  };

  return (
    <div className="watch-content-safe flex flex-col h-full relative">
      {/* Capture Flash Overlay */}
      {isCapturing && (
        <div className="absolute inset-0 bg-white rounded-full z-50 animate-pulse" />
      )}
      
      {/* Countdown Overlay */}
      {countdown > 0 && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-full z-40 flex items-center justify-center">
          <div className="text-6xl font-bold text-white animate-pulse">
            {countdown}
          </div>
        </div>
      )}

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
          <h2 className="text-lg font-bold text-white">Camera</h2>
        </div>
        
        {/* Connection Status */}
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
          isConnected ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'
        }`}>
          <Smartphone size={12} className={isConnected ? 'text-green-400' : 'text-red-400'} />
          <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Camera Viewfinder Simulation */}
      <div className="flex-1 mx-4 mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/20 relative overflow-hidden">
        {/* Viewfinder Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/10" />
            ))}
          </div>
        </div>
        
        {/* Remote Camera Indicator */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-white">Remote</span>
          </div>
          
          {isConnected && (
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <Wifi size={12} className="text-green-400" />
            </div>
          )}
        </div>

        {/* Photo Info */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs text-white">Photos: {photoCount}</span>
          </div>
          
          {lastPhotoTime && (
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs text-white">
                Last: {lastPhotoTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
        </div>

        {/* Center Focus Point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-2 border-white/60 rounded-full" />
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-4">
        {/* Settings Row */}
        <div className="flex justify-center space-x-6 mb-4">
          <Button
            onClick={toggleFlash}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
              flashMode !== 'off' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {getFlashIcon()}
            <span className="text-xs text-white/70 capitalize">{flashMode}</span>
          </Button>
          
          <Button
            onClick={toggleTimer}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
              timerMode > 0 ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {getTimerIcon()}
            <span className="text-xs text-white/70">
              {timerMode === 0 ? 'Off' : `${timerMode}s`}
            </span>
          </Button>
          
          <Button
            onClick={() => setIsConnected(!isConnected)}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            <RotateCcw size={16} className="text-white/70" />
            <span className="text-xs text-white/70">Reconnect</span>
          </Button>
        </div>

        {/* Shutter Button */}
        <div className="flex justify-center items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
          >
            <Home size={16} className="text-white" />
          </Button>
          
          <Button
            onClick={handleShutterPress}
            disabled={!isConnected || isCapturing || countdown > 0}
            className={`w-16 h-16 rounded-full border-4 border-white transition-all ${
              isConnected 
                ? 'bg-white hover:bg-gray-200 active:scale-95' 
                : 'bg-gray-500 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className={`w-12 h-12 rounded-full ${
              isConnected ? 'bg-gray-800' : 'bg-gray-600'
            }`} />
          </Button>
          
          <div className="w-10 h-10" /> {/* Spacer for symmetry */}
        </div>

        {/* Status Text */}
        <div className="text-center mt-3">
          {!isConnected ? (
            <div className="text-xs text-red-400">Phone not connected</div>
          ) : countdown > 0 ? (
            <div className="text-xs text-primary">Taking photo in {countdown}s</div>
          ) : isCapturing ? (
            <div className="text-xs text-white">Capturing...</div>
          ) : (
            <div className="text-xs text-white/60">Tap to capture photo</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraScreen;