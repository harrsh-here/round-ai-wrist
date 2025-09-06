import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Battery, Wifi, Bluetooth, Phone, Sun, Flashlight, X, Settings } from 'lucide-react';

interface StatusBarProps {
  onNavigate?: (screen: string) => void;
}

const StatusBar = ({ onNavigate }: StatusBarProps) => {
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [phoneConnected, setPhoneConnected] = useState(true);
  const [brightness, setBrightness] = useState([75]);
  const [flashlight, setFlashlight] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);

  // Simulate battery drain
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(0, prev - 0.1));
    }, 60000); // Drain 0.1% per minute
    return () => clearInterval(interval);
  }, []);

  const handleStatusBarClick = () => {
    setShowQuickSettings(true);
  };

  const handleFlashlightToggle = () => {
    setFlashlight(!flashlight);
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'text-green-400';
    if (batteryLevel > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSignalStrength = (connected: boolean) => {
    return connected ? 'text-primary' : 'text-gray-500';
  };

  if (showQuickSettings) {
    return (
      <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md rounded-full">
        {/* Flashlight Overlay */}
        {flashlight && (
          <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center z-60">
            <Button
              onClick={handleFlashlightToggle}
              className="w-20 h-20 bg-black/80 hover:bg-black/90 rounded-full text-white text-lg font-bold"
            >
              Turn Off
            </Button>
          </div>
        )}
        
        {!flashlight && (
          <div className="p-6 h-full overflow-y-auto watch-scroll">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Quick Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickSettings(false)}
                className="rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20"
              >
                <X size={16} className="text-white" />
              </Button>
            </div>

            {/* Connectivity Toggles */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass-bg p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Wifi size={16} className={getSignalStrength(wifi)} />
                    <span className="text-sm text-white">Wi-Fi</span>
                  </div>
                  <Switch
                    checked={wifi}
                    onCheckedChange={setWifi}
                    className="scale-75"
                  />
                </div>
                <div className="text-xs text-white/60">
                  {wifi ? 'Connected' : 'Disconnected'}
                </div>
              </div>

              <div className="glass-bg p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Bluetooth size={16} className={getSignalStrength(bluetooth)} />
                    <span className="text-sm text-white">Bluetooth</span>
                  </div>
                  <Switch
                    checked={bluetooth}
                    onCheckedChange={setBluetooth}
                    className="scale-75"
                  />
                </div>
                <div className="text-xs text-white/60">
                  {bluetooth ? 'Connected' : 'Disconnected'}
                </div>
              </div>

              <div className="glass-bg p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className={getSignalStrength(phoneConnected)} />
                    <span className="text-sm text-white">Phone</span>
                  </div>
                  <Switch
                    checked={phoneConnected}
                    onCheckedChange={setPhoneConnected}
                    className="scale-75"
                  />
                </div>
                <div className="text-xs text-white/60">
                  {phoneConnected ? 'Connected' : 'Disconnected'}
                </div>
              </div>

              <div className="glass-bg p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Flashlight size={16} className={flashlight ? 'text-yellow-400' : 'text-white/60'} />
                    <span className="text-sm text-white">Flashlight</span>
                  </div>
                  <Switch
                    checked={flashlight}
                    onCheckedChange={handleFlashlightToggle}
                    className="scale-75"
                  />
                </div>
                <div className="text-xs text-white/60">
                  {flashlight ? 'On' : 'Off'}
                </div>
              </div>
            </div>

            {/* Brightness Control */}
            <div className="glass-bg p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <Sun size={16} className="text-yellow-400" />
                <span className="text-sm text-white">Brightness</span>
                <span className="text-xs text-white/60 ml-auto">{brightness[0]}%</span>
              </div>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Battery Status */}
            <div className="glass-bg p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Battery size={16} className={getBatteryColor()} />
                  <span className="text-sm text-white">Battery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-3 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        batteryLevel > 50 ? 'bg-green-400' :
                        batteryLevel > 20 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${batteryLevel}%` }}
                    />
                  </div>
                  <span className={`text-sm font-mono font-bold ${getBatteryColor()}`}>
                    {Math.round(batteryLevel)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Full Settings Button */}
            <Button
              onClick={() => {
                setShowQuickSettings(false);
                onNavigate && onNavigate('settings');
              }}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white rounded-xl py-3"
            >
              <Settings size={16} className="mr-2" />
              Full Settings
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Regular status bar
  return (
    <div 
      className="absolute top-2 left-2 right-2 z-40 cursor-pointer"
      onClick={handleStatusBarClick}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/10">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white font-mono">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Battery size={12} className={getBatteryColor()} />
            <span className="text-xs text-white font-medium">
              {Math.round(batteryLevel)}%
            </span>
          </div>
          <Wifi size={12} className={getSignalStrength(wifi)} />
          <Bluetooth size={12} className={getSignalStrength(bluetooth)} />
          <Phone size={12} className={getSignalStrength(phoneConnected)} />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;