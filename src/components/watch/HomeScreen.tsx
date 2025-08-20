
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Activity, Settings, MessageSquare, Grid3X3, Footprints, Zap } from 'lucide-react';
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
    <div className="watch-content-safe flex flex-col">
      <div className="watch-scroll-content flex flex-col items-center justify-start">
        {/* Time Display - Now at top and always visible */}
        <div className="text-center mb-6 watch-slide-up pt-4">
          <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-white/95 to-white/85 bg-clip-text text-transparent">
            {formatTime(time)}
          </div>
          <div className="text-sm text-white/70">
            {formatDate(time)}
          </div>
        </div>

        {/* Quick Stats - Better spacing */}
        <div className="flex justify-center space-x-3 mb-6">
          <div className="glass-bg p-3 rounded-xl text-center min-w-[65px] watch-glow">
            <Heart size={18} className={`text-feature-health mx-auto mb-1 ${bpm > 80 ? 'animate-bmp-pulse' : ''}`} />
            <div className="text-sm font-bold text-white">{bpm}</div>
            <div className="text-xs text-white/60">BPM</div>
          </div>
          
          <div className="glass-bg p-3 rounded-xl text-center min-w-[65px] watch-glow">
            <Footprints size={18} className="text-primary mx-auto mb-1" />
            <div className="text-sm font-bold text-white">8.2K</div>
            <div className="text-xs text-white/60">Steps</div>
          </div>
          
          <div className="glass-bg p-3 rounded-xl text-center min-w-[65px] watch-glow">
            <Zap size={18} className="text-feature-fitness mx-auto mb-1" />
            <div className="text-sm font-bold text-white">387</div>
            <div className="text-xs text-white/60">Cal</div>
          </div>
        </div>

        {/* Quick Actions - Better layout */}
        <div className="grid grid-cols-2 gap-3 mb-6 max-w-[200px]">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="ghost"
                onClick={() => onNavigate(action.screen)}
                className="flex flex-col items-center justify-center h-16 glass-bg hover:bg-white/15 transition-all duration-300 watch-glow rounded-xl p-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon size={22} className={`${action.color} mb-1`} />
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
            className="rounded-full w-12 h-12 p-0 glass-bg hover:bg-white/15"
          >
            <Clock size={18} className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
