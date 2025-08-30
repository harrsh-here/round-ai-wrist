import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Camera, RotateCcw, Zap, Timer, ArrowLeft, Smartphone, Wifi } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface CameraScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const CameraScreen = ({ onNavigate }: CameraScreenProps) => {
  const [isConnected, setIsConnected] = useState(true);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
  const [timerMode, setTimerMode] = useState<0 | 3 | 10>(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastPhotoTime, setLastPhotoTime] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : prev); // 90% chance to stay connected
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev! - 1);
      }, 1000);
    } else if (countdown === 0) {
      capturePhoto();
      setCountdown(null);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const capturePhoto = () => {
    setIsCapturing(true);
    setPhotoCount(prev => prev + 1);
    
    setTimeout(() => {
      setIsCapturing(false);
      setLastPhotoTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    }, 500);
  };

  const handleShutterPress = () => {
    if (!isConnected || isCapturing) return;
    
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

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-br from-blue-900/40 via-black/30 to-blue-800/40 gradient-flow">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 py-2 z-10 bg-transparent backdrop-blur-sm">
        <div className="text-center py-4 watch-slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="absolute left-[16px] top-[175px] -translate-y-1/2 rounded-full w-9 h-9 p-0 glass-bg hover:bg-white/15 z-20"
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
          <div className="flex items-center justify-center space-x-0.5">
            <Camera size={12} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Remote Camera</h2>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="absolute top-16 left-0 right-0 z-10 flex justify-center">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2 ${
          isConnected 
            ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
            : 'bg-red-500/20 text-red-400 border border-red-400/30'
        }`}>
          <Smartphone size={10} />
          <span>{isConnected ? 'Connected to Phone' : 'Disconnected'}</span>
          <Wifi size={10} />
        </div>
      </div>

      {/* Camera Viewfinder Simulation */}
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-20">
        <div className="relative w-full max-w-[200px] aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-white/20 overflow-hidden">
          {/* Viewfinder Grid */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
          </div>

          {/* Simulated Camera View */}
          <div className="absolute left-[75px] flex items-center justify-center">
            <div className="text-center">
              <Camera size={32} className="text-white/40 mx-auto mb-2" />
              <div className="text-xs text-white/60">Live View</div>
              {lastPhotoTime && (
                <div className="text-xs text-green-400 mt-1">
                  Last: {lastPhotoTime}
                </div>
              )}
            </div>
          </div>

          {/* Flash Effect */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white animate-pulse" />
          )}

          {/* Countdown Overlay */}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center translate-y-[-10px] translate-x-[10px]">
              <div className="text-6xl font-bold text-white animate-pulse">
                {countdown}
              </div>
            </div>
          )}

          {/* Photo Count */}
          <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1">
            <div className="text-xs text-white font-mono">{photoCount.toString().padStart(3, '0')}</div>
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Settings Row */}
        <div className="flex justify-center space-x-6 mb-4">
          {/* Flash Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFlash}
            className={`w-10 h-10 rounded-full p-0 transition-all ${
              flashMode === 'on' ? 'bg-yellow-500/30 border border-yellow-400/50' :
              flashMode === 'auto' ? 'bg-blue-500/30 border border-blue-400/50' :
              'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Zap size={16} className={
              flashMode === 'on' ? 'text-yellow-400' :
              flashMode === 'auto' ? 'text-blue-400' :
              'text-white/70'
            } />
          </Button>

          {/* Timer Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTimer}
            className={`w-10 h-10 rounded-full p-0 transition-all ${
              timerMode > 0 ? 'bg-green-500/30 border border-green-400/50' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="flex flex-col items-center">
              <Timer size={12} className={timerMode > 0 ? 'text-green-400' : 'text-white/70'} />
              {timerMode > 0 && (
                <span className="text-xs font-bold text-green-400">{timerMode}</span>
              )}
            </div>
          </Button>

          {/* Flip Camera */}
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full p-0 bg-white/10 hover:bg-white/20"
            disabled={!isConnected}
          >
            <RotateCcw size={16} className="text-white/70" />
          </Button>
        </div>

        {/* Shutter Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleShutterPress}
            disabled={!isConnected || isCapturing}
            className={`w-20 h-20 rounded-full border-4 border-white/30 transition-all duration-200 ${
              isCapturing 
                ? 'bg-red-500 scale-95' 
                : 'bg-white hover:bg-white/90 hover:scale-105 active:scale-95'
            }`}
          >
            <div className={`w-16 h-16 rounded-full ${
              isCapturing ? 'bg-red-600' : 'bg-white border-2 border-gray-300'
            }`} />
          </Button>
        </div>

        {/* Status Text */}
        <div className="text-center mt-3">
          <div className="text-xs text-white/60">
            {!isConnected ? 'Connect your phone to take photos' :
             countdown !== null ? 'Get ready...' :
             isCapturing ? 'Capturing...' :
             timerMode > 0 ? `Timer: ${timerMode}s` :
             'Tap to capture'}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute bottom-4 left-4">
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

export default CameraScreen;