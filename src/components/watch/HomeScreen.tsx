
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Settings, Grid3X3, Clock, Activity, Heart, Footprints, Zap } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface HomeScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const [time, setTime] = useState(new Date());
  const [bpm, setBpm] = useState(72);
  const [steps, setSteps] = useState(8234);
  const [calories, setCalories] = useState(387);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const bpmInterval = setInterval(() => {
      setBpm(Math.floor(Math.random() * 15) + 65);
    }, 2500);

    const stepsInterval = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    const caloriesInterval = setInterval(() => {
      setCalories(Math.floor(steps * 0.047));
    }, 6000);

    return () => {
      clearInterval(bpmInterval);
      clearInterval(stepsInterval);
      clearInterval(caloriesInterval);
    };
  }, [steps]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-card/50 to-background">
      {/* Digital Clock Display */}
      <div className="text-center mb-6 watch-slide-up">
        <div className="text-4xl font-mono font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2 drop-shadow-lg">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-accent font-medium bg-gradient-to-r from-accent/80 to-feature-fitness/80 bg-clip-text text-transparent">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Enhanced Fitness Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-56">
        <button
          onClick={() => onNavigate('fitness')}
          className="group relative p-3 rounded-xl bg-gradient-to-br from-feature-fitness/20 via-feature-fitness/10 to-transparent border border-feature-fitness/30 hover:from-feature-fitness/30 hover:to-feature-fitness/10 transition-all duration-300 watch-glow overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-feature-fitness/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Footprints size={16} className="text-feature-fitness mx-auto mb-1" />
          <div className="text-xs text-muted-foreground mb-1">Steps</div>
          <div className="text-sm font-bold text-feature-fitness">{steps.toLocaleString()}</div>
          <div className="w-full h-1 bg-muted/30 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-feature-fitness to-feature-fitness/60 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((steps / 12000) * 100, 100)}%` }}
            />
          </div>
        </button>

        <button
          onClick={() => onNavigate('fitness')}
          className="group relative p-3 rounded-xl bg-gradient-to-br from-feature-health/20 via-feature-health/10 to-transparent border border-feature-health/30 hover:from-feature-health/30 hover:to-feature-health/10 transition-all duration-300 watch-glow overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-feature-health/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Heart size={16} className="text-feature-health mx-auto mb-1 animate-bpm-pulse" />
          <div className="text-xs text-muted-foreground mb-1">BPM</div>
          <div className="text-sm font-bold text-feature-health">{bpm}</div>
          <div className="w-full h-1 bg-muted/30 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-feature-health to-destructive/60 rounded-full animate-pulse"
              style={{ width: `${((bpm - 50) / 50) * 100}%` }}
            />
          </div>
        </button>

        <button
          onClick={() => onNavigate('fitness')}
          className="group relative p-3 rounded-xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 hover:from-accent/30 hover:to-accent/10 transition-all duration-300 watch-glow overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Zap size={16} className="text-accent mx-auto mb-1" />
          <div className="text-xs text-muted-foreground mb-1">Kcal</div>
          <div className="text-sm font-bold text-accent">{calories}</div>
          <div className="w-full h-1 bg-muted/30 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-accent to-feature-fitness rounded-full transition-all duration-500"
              style={{ width: `${(calories / 500) * 100}%` }}
            />
          </div>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-44">
        <Button
          variant="ghost"
          onClick={() => onNavigate('analog')}
          className="rounded-full w-14 h-14 p-0 bg-gradient-to-br from-primary/15 to-secondary/15 hover:from-primary/25 hover:to-secondary/25 border border-primary/25 watch-glow shadow-lg"
        >
          <Clock size={22} className="text-primary drop-shadow-sm" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('features')}
          className="rounded-full w-14 h-14 p-0 bg-gradient-to-br from-accent/15 to-feature-fitness/15 hover:from-accent/25 hover:to-feature-fitness/25 border border-accent/25 watch-glow shadow-lg"
        >
          <Grid3X3 size={22} className="text-accent drop-shadow-sm" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('chat')}
          className="rounded-full w-14 h-14 p-0 bg-gradient-to-br from-ai-primary/15 to-ai-secondary/15 hover:from-ai-primary/25 hover:to-ai-secondary/25 border border-ai-primary/25 watch-glow shadow-lg"
        >
          <MessageCircle size={22} className="text-ai-primary drop-shadow-sm" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('settings')}
          className="rounded-full w-14 h-14 p-0 bg-gradient-to-br from-muted/15 to-secondary/15 hover:from-muted/25 hover:to-secondary/25 border border-muted/25 watch-glow shadow-lg"
        >
          <Settings size={22} className="text-muted-foreground drop-shadow-sm" />
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
