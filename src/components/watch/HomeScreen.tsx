
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Activity, Settings, MessageSquare, Grid3X3, Footprints, Zap, Battery, Wifi, Bluetooth, Phone } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface HomeScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const [time, setTime] = useState(new Date());
  const [bpm, setBpm] = useState(72);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Simulate varying BPM (65-85 range)
      setBpm(Math.floor(Math.random() * 20) + 65);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const quickActions = [
    { icon: Grid3X3, label: 'Features', screen: 'features' as WatchScreen, color: 'text-primary' },
    { icon: Activity, label: 'Fitness', screen: 'fitness' as WatchScreen, color: 'text-feature-fitness' },
    { icon: MessageSquare, label: 'AI Chat', screen: 'chat' as WatchScreen, color: 'text-ai-primary' },
    { icon: Settings, label: 'Settings', screen: 'settings' as WatchScreen, color: 'text-muted-foreground' },
  ];

  return (
    <div className="watch-content-safe">
      {/* Status Bar - Fixed at top */}
      <div className="watch-status-bar">
        <div className="flex items-center space-x-2">
          <div className="status-icon battery">
            <Battery size={10} />
            <span className="text-xs">85%</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="status-icon wifi">
            <Wifi size={8} />
          </div>
          <div className="status-icon bluetooth">
            <Bluetooth size={8} />
          </div>
          <div className="status-icon">
            <Phone size={8} className="text-feature-call" />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto watch-scroll">
        {/* Time Display - Prominent and centered */}
        <div className="text-center mb-6 watch-slide-up">
          <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent">
            {formatTime(time)}
          </div>
          <div className="text-sm text-primary/80">
            {formatDate(time)}
          </div>
        </div>

        {/* Quick Stats - Improved spacing */}
        <div className="flex justify-center space-x-2 mb-6">
          <div className="dark-glass-bg p-3 rounded-xl text-center min-w-[55px] watch-glow">
            <Heart size={14} className={`text-feature-health mx-auto mb-1 ${bpm > 80 ? 'animate-bmp-pulse' : ''}`} />
            <div className="text-sm font-bold text-white">{bpm}</div>
            <div className="text-xs text-white/60">BPM</div>
          </div>
          
          <div className="dark-glass-bg p-3 rounded-xl text-center min-w-[55px] watch-glow">
            <Footprints size={14} className="text-primary mx-auto mb-1" />
            <div className="text-sm font-bold text-white">8.2K</div>
            <div className="text-xs text-white/60">Steps</div>
          </div>
          
          <div className="dark-glass-bg p-3 rounded-xl text-center min-w-[55px] watch-glow">
            <Zap size={14} className="text-feature-fitness mx-auto mb-1" />
            <div className="text-sm font-bold text-white">387</div>
            <div className="text-xs text-white/60">Cal</div>
          </div>
        </div>

        {/* Quick Actions - Radial grid layout */}
        <div className="grid grid-cols-2 gap-3 mb-6 max-w-[160px] mx-auto">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="ghost"
                onClick={() => onNavigate(action.screen)}
                className="flex flex-col items-center justify-center h-16 dark-glass-bg hover:bg-white/15 transition-all duration-300 watch-glow rounded-xl p-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon size={18} className={`${action.color} mb-1`} />
                <span className="text-xs text-white/90">{action.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Analog Watch Access */}
        <div className="flex justify-center pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('analog')}
            className="rounded-full w-12 h-12 p-0 dark-glass-bg hover:bg-white/15 pulse-ring"
          >
            <Clock size={16} className="text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
