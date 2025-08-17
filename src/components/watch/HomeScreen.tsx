
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Settings, Grid3X3, Clock, Activity } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface HomeScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const [time, setTime] = useState(new Date());
  const [bpm, setBpm] = useState(72);
  const [steps, setSteps] = useState(8234);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const bpmInterval = setInterval(() => {
      // Simulate varying BPM (68-78 range for resting)
      setBpm(Math.floor(Math.random() * 10) + 68);
    }, 3000);

    const stepsInterval = setInterval(() => {
      // Slowly increment steps
      setSteps(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);

    return () => {
      clearInterval(bpmInterval);
      clearInterval(stepsInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      {/* Digital Clock Display */}
      <div className="text-center mb-6 watch-slide-up">
        <div className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-accent font-medium">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 w-full max-w-48">
        <button
          onClick={() => onNavigate('fitness')}
          className="text-center p-2 rounded-lg bg-gradient-to-br from-feature-fitness/20 to-feature-health/20 border border-border/50 hover:from-feature-fitness/30 hover:to-feature-health/30 transition-all duration-300 watch-glow"
        >
          <div className="text-xs text-muted-foreground">Steps</div>
          <div className="text-sm font-bold text-primary">{steps.toLocaleString()}</div>
        </button>
        <button
          onClick={() => onNavigate('fitness')}
          className="text-center p-2 rounded-lg bg-gradient-to-br from-feature-health/20 to-destructive/20 border border-border/50 hover:from-feature-health/30 hover:to-destructive/30 transition-all duration-300 watch-glow"
        >
          <div className="text-xs text-muted-foreground">BPM</div>
          <div className="text-sm font-bold text-feature-health animate-bpm-pulse">{bpm}</div>
        </button>
        <div className="text-center p-2 rounded-lg bg-gradient-to-br from-feature-weather/20 to-primary/20 border border-border/50">
          <div className="text-xs text-muted-foreground">Temp</div>
          <div className="text-sm font-bold text-feature-weather">22°C</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-40">
        <Button
          variant="ghost"
          onClick={() => onNavigate('analog')}
          className="rounded-full w-12 h-12 p-0 bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 watch-glow"
        >
          <Clock size={20} className="text-primary" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('features')}
          className="rounded-full w-12 h-12 p-0 bg-gradient-to-br from-accent/10 to-feature-fitness/10 hover:from-accent/20 hover:to-feature-fitness/20 border border-accent/20 watch-glow"
        >
          <Grid3X3 size={20} className="text-accent" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('chat')}
          className="rounded-full w-12 h-12 p-0 bg-gradient-to-br from-ai-primary/10 to-ai-secondary/10 hover:from-ai-primary/20 hover:to-ai-secondary/20 border border-ai-primary/20 watch-glow"
        >
          <MessageCircle size={20} className="text-ai-primary" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('settings')}
          className="rounded-full w-12 h-12 p-0 bg-gradient-to-br from-muted/10 to-secondary/10 hover:from-muted/20 hover:to-secondary/20 border border-muted/20 watch-glow"
        >
          <Settings size={20} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
