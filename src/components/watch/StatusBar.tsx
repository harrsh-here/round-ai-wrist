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
            <div className="flex items-center justify-between px-[60px] mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickSettings(false)}
                className="rounded-full w-6 h-6 p-0 bg-white/10 hover:bg-white/20"
              >
                <X size={12} className="text-white" />
              </Button>
              <h2 className="text-m font-bold text-white">Quick Settings</h2>
              
              {/* Full Settings Button */}
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setShowQuickSettings(false);
                    onNavigate && onNavigate('settings');
                  }}
                  className="w-8 h-8 bg-transparent text-white rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:text-white/90 hover:bg-white/10 flex items-center justify-center"
                >
                  <Settings size={16} />
                </Button>
              </div>
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


          </div>
        )}
      </div>
    );
  }

  // Regular status bar
  return (
    <div 
      className="absolute  top-0 left-0 right-0 z-10 cursor-pointer"
      onClick={handleStatusBarClick}
    >
      <div className="flex items-center justify-between w-24 mx-auto px-0 py-1 rounded-full bg-white/10">
        <div
          className="absolute top-0 left-0 w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
          }}
        />
        
         

          {/* Center indicator - pill shape to show slidable */}
          <div className="w-10 h-1 mx-auto bg-white/20 rounded-full" />

          
        
      </div>
    </div>
  );
};

export default StatusBar;