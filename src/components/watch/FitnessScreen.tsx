
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Heart, Footprints, Zap, Target, Trophy, TrendingUp } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface FitnessScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const FitnessScreen = ({ onNavigate }: FitnessScreenProps) => {
  const [bpm, setBpm] = useState(72);
  const [steps, setSteps] = useState(8234);
  const [calories, setCalories] = useState(387);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate varying BPM (65-85 range)
      setBpm(Math.floor(Math.random() * 20) + 65);
      
      // Slowly increment steps
      setSteps(prev => prev + Math.floor(Math.random() * 3));
      
      // Update calories based on steps
      setCalories(Math.floor(steps * 0.047));
    }, 2000);

    return () => clearInterval(interval);
  }, [steps]);

  const fitnessStats = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: `${bpm}`,
      unit: 'BPM',
      color: 'text-feature-health',
      bgColor: 'bg-feature-health/10',
      animate: true
    },
    {
      icon: Footprints,
      label: 'Steps',
      value: steps.toLocaleString(),
      unit: 'steps',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      animate: false
    },
    {
      icon: Zap,
      label: 'Calories',
      value: calories.toString(),
      unit: 'kcal',
      color: 'text-feature-fitness',
      bgColor: 'bg-feature-fitness/10',
      animate: false
    },
    {
      icon: Target,
      label: 'Active Time',
      value: '2h 34m',
      unit: 'today',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      animate: false
    }
  ];

  const achievements = [
    { icon: Trophy, label: '10K Steps', achieved: steps > 10000 },
    { icon: TrendingUp, label: 'Goal Streak', achieved: true },
    { icon: Zap, label: 'Active Hour', achieved: true }
  ];

  return (
    <div className="watch-content-safe flex flex-col items-center justify-center p-3">
      {/* Header */}
      <div className="text-center mb-3 watch-slide-up">
        <h2 className="text-lg font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          Fitness
        </h2>
        <div className="text-xs text-white/60">Today's Activity</div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 w-full max-w-[220px]">
        {fitnessStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`glass-bg p-2 rounded-xl text-center watch-glow`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon 
                size={14} 
                className={`${stat.color} mx-auto mb-1 ${stat.animate ? 'animate-bpm-pulse' : ''}`} 
              />
              <div className={`text-sm font-bold text-white`}>
                {stat.value}
              </div>
              <div className="text-xs text-white/60">
                {stat.unit}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Rings */}
      <div className="flex justify-center space-x-3 mb-3">
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="hsl(var(--feature-health))"
              strokeWidth="2"
              strokeDasharray={`${(steps / 12000) * 100}, 100`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Footprints size={8} className="text-primary" />
          </div>
        </div>
        
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="hsl(var(--feature-fitness))"
              strokeWidth="2"
              strokeDasharray={`${(calories / 500) * 100}, 100`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={8} className="text-feature-fitness" />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="flex justify-center space-x-2 mb-3">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.label}
              className={`p-2 rounded-lg ${
                achievement.achieved 
                  ? 'glass-bg text-accent' 
                  : 'bg-muted/20 text-muted-foreground'
              }`}
            >
              <Icon size={10} />
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
        >
          <Home size={14} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default FitnessScreen;
