import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Settings, Grid3X3, Clock } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface HomeScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      {/* Digital Clock Display */}
      <div className="text-center mb-6 watch-slide-up">
        <div className="text-3xl font-mono font-bold text-primary mb-1">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-accent font-medium">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 w-full max-w-48">
        <div className="text-center p-2 rounded-lg bg-card/50 border border-border/50">
          <div className="text-xs text-muted-foreground">Steps</div>
          <div className="text-sm font-bold text-feature-health">8,234</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-card/50 border border-border/50">
          <div className="text-xs text-muted-foreground">BPM</div>
          <div className="text-sm font-bold text-primary">72</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-card/50 border border-border/50">
          <div className="text-xs text-muted-foreground">Temp</div>
          <div className="text-sm font-bold text-feature-weather">22°C</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-40">
        <Button
          variant="ghost"
          onClick={() => onNavigate('analog')}
          className="rounded-full w-12 h-12 p-0 hover:bg-primary/20 watch-glow"
        >
          <Clock size={20} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('features')}
          className="rounded-full w-12 h-12 p-0 hover:bg-accent/20 watch-glow"
        >
          <Grid3X3 size={20} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('chat')}
          className="rounded-full w-12 h-12 p-0 hover:bg-ai-primary/20 watch-glow"
        >
          <MessageCircle size={20} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('settings')}
          className="rounded-full w-12 h-12 p-0 hover:bg-muted/20 watch-glow"
        >
          <Settings size={20} />
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;