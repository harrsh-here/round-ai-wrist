
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
    const bmpInterval = setInterval(() => {
      setBpm(Math.floor(Math.random() * 15) + 65);
    }, 2500);

    const stepsInterval = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    const caloriesInterval = setInterval(() => {
      setCalories(Math.floor(steps * 0.047));
    }, 6000);

    return () => {
      clearInterval(bmpInterval);
      clearInterval(stepsInterval);
      clearInterval(caloriesInterval);
    };
  }, [steps]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-sm">
      {/* Digital Clock Display with premium styling */}
      <div className="text-center mb-6 watch-slide-up backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="text-3xl font-mono font-bold text-white mb-2 drop-shadow-xl filter">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-white/80 font-medium">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Enhanced Fitness Stats with glassomorphic design */}
      <div className="grid grid-cols-3 gap-3 mb-6 w-full max-w-60">
        <button
          onClick={() => onNavigate('fitness')}
          className="group relative p-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 watch-glow overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-feature-fitness/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Footprints size={20} className="text-feature-fitness mx-auto mb-1" />
          <div className="text-xs text-white/70 mb-1">Steps</div>
          <div className="text-sm font-bold text-white">{steps.toLocaleString()}</div>
          <div className="w-full h-1 bg-white/20 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-feature-fitness to-feature-fitness/60 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((steps / 12000) * 100, 100)}%` }}
            />
          </div>
        </button>

        <button
          onClick={() => onNavigate('fitness')}
          className="group relative p-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 watch-glow overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-feature-health/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Heart size={20} className="text-feature-health mx-auto mb-1 animate-bpm-pulse" />
          <div className="text-xs text-white/70 mb-1">BPM</div>
          <div className="text-sm font-bold text-white">{bpm}</div>
          <div className="w-full h-1 bg-white/20 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-feature-health to-destructive/60 rounded-full animate-pulse"
              style={{ width: `${((bpm - 50) / 50) * 100}%` }}
            />
          </div>
        </button>

        <button
          onClick={() => onNavigate('fitness')}
          className="group relative p-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 watch-glow overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Zap size={20} className="text-accent mx-auto mb-1" />
          <div className="text-xs text-white/70 mb-1">Kcal</div>
          <div className="text-sm font-bold text-white">{calories}</div>
          <div className="w-full h-1 bg-white/20 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-accent to-feature-fitness rounded-full transition-all duration-500"
              style={{ width: `${(calories / 500) * 100}%` }}
            />
          </div>
        </button>
      </div>

      {/* Navigation Buttons with glassomorphic styling */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-48">
        <Button
          variant="ghost"
          onClick={() => onNavigate('analog')}
          className="rounded-full w-16 h-16 p-0 backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 watch-glow shadow-lg transition-all duration-300"
        >
          <Clock size={26} className="text-white drop-shadow-sm" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('features')}
          className="rounded-full w-16 h-16 p-0 backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 watch-glow shadow-lg transition-all duration-300"
        >
          <Grid3X3 size={26} className="text-white drop-shadow-sm" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('chat')}
          className="rounded-full w-16 h-16 p-0 backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 watch-glow shadow-lg transition-all duration-300"
        >
          <MessageCircle size={26} className="text-white drop-shadow-sm" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('settings')}
          className="rounded-full w-16 h-16 p-0 backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 watch-glow shadow-lg transition-all duration-300"
        >
          <Settings size={26} className="text-white drop-shadow-sm" />
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
