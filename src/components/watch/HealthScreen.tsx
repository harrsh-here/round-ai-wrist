import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Heart, 
  ArrowLeft, 
  Thermometer, 
  Droplets, 
  Wind, 
  Moon,
  Activity,
  Zap,
  Pill,
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface HealthScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const HealthScreen = ({ onNavigate }: HealthScreenProps) => {
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });
  const [oxygenSat, setOxygenSat] = useState(98);
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  const [bodyTemp, setBodyTemp] = useState(98.6);
  const [stressLevel, setStressLevel] = useState(3); // 1-5 scale
  const [hydrationLevel, setHydrationLevel] = useState(65); // percentage

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time vital signs
      setHeartRate(Math.floor(Math.random() * 20) + 65);
      setBloodPressure({
        systolic: Math.floor(Math.random() * 20) + 110,
        diastolic: Math.floor(Math.random() * 15) + 70
      });
      setOxygenSat(Math.floor(Math.random() * 3) + 97);
      setRespiratoryRate(Math.floor(Math.random() * 6) + 14);
      setBodyTemp(+(Math.random() * 2 + 97.5).toFixed(1));
      setStressLevel(Math.floor(Math.random() * 5) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const vitalStats = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: heartRate,
      unit: 'BPM',
      color: 'text-feature-health',
      bgColor: 'bg-feature-health/10',
      animate: true,
      status: heartRate > 80 ? 'high' : heartRate < 60 ? 'low' : 'normal'
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: `${bloodPressure.systolic}/${bloodPressure.diastolic}`,
      unit: 'mmHg',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      animate: false,
      status: bloodPressure.systolic > 130 ? 'high' : 'normal'
    },
    {
      icon: Droplets,
      label: 'Blood O₂',
      value: oxygenSat,
      unit: '%',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      animate: false,
      status: oxygenSat < 95 ? 'low' : 'normal'
    },
    {
      icon: Wind,
      label: 'Breathing',
      value: respiratoryRate,
      unit: '/min',
      color: 'text-feature-fitness',
      bgColor: 'bg-feature-fitness/10',
      animate: false,
      status: 'normal'
    }
  ];

  const secondaryStats = [
    {
      icon: Thermometer,
      label: 'Body Temp',
      value: `${bodyTemp}°F`,
      color: 'text-orange-400',
      status: bodyTemp > 99.5 ? 'high' : 'normal'
    },
    {
      icon: Zap,
      label: 'Stress Level',
      value: `${stressLevel}/5`,
      color: stressLevel > 3 ? 'text-red-400' : 'text-green-400',
      status: stressLevel > 3 ? 'high' : 'normal'
    },
    {
      icon: Droplets,
      label: 'Hydration',
      value: `${hydrationLevel}%`,
      color: hydrationLevel < 50 ? 'text-orange-400' : 'text-blue-400',
      status: hydrationLevel < 50 ? 'low' : 'normal'
    }
  ];

  const sleepData = {
    duration: '7h 23m',
    quality: 85,
    deepSleep: '2h 15m'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-red-400';
      case 'low': return 'text-orange-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="watch-content-safe flex flex-col items-center justify-center p-4 select-none mb-[-70px] overflow-hidden">
      {/* Header */}
      <div className="relative w-full text-center mb-4 watch-slide-up">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('features')}
          className="absolute left-[78px] top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 glass-bg hover:bg-white/15"
        >
          <ArrowLeft size={14} className="text-white" />
        </Button>
        <h2 className="text-lg font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          Health
        </h2>
        <div className="text-xs text-white/60">Vital Signs Monitor</div>
      </div>

      {/* Main Vital Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 w-full max-w-[200px]">
        {vitalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`glass-bg p-2.5 rounded-xl text-center watch-glow relative`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon 
                  size={12} 
                  className={`${stat.color} ${stat.animate ? 'animate-bmp-pulse' : ''}`} 
                />
                <div className={`w-2 h-2 rounded-full ${getStatusColor(stat.status)}`} />
              </div>
              <div className="text-xs font-bold text-white">
                {stat.value}
              </div>
              <div className="text-[10px] text-white/60">
                {stat.unit}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="flex justify-between w-full max-w-[200px] mb-3">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-bg p-2 rounded-lg text-center"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <Icon size={10} className={stat.color} />
              <div className="text-[10px] font-medium text-white mt-1">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sleep & Activity Summary */}
      <div className="grid grid-cols-2 gap-2 mb-3 w-full max-w-[200px]">
        <div className="glass-bg p-2.5 rounded-xl text-center">
          <div className="flex items-center justify-center mb-1">
            <Moon size={12} className="text-purple-400" />
            <span className="text-[10px] text-white/60 ml-1">Sleep</span>
          </div>
          <div className="text-xs font-bold text-white">{sleepData.duration}</div>
          <div className="text-[10px] text-white/60">Quality: {sleepData.quality}%</div>
        </div>
        
        <div className="glass-bg p-2.5 rounded-xl text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-[10px] text-white/60 ml-1">HRV</span>
          </div>
          <div className="text-xs font-bold text-white">42ms</div>
          <div className="text-[10px] text-white/60">Good</div>
        </div>
      </div>

      {/* Health Alerts & Reminders */}
      <div className="flex justify-center space-x-2 mb-4">
        <div className="glass-bg p-2 rounded-lg">
          <Pill size={10} className="text-blue-400 mx-auto" />
          <div className="text-[8px] text-white/80 mt-1">Med 2PM</div>
        </div>
        
        {stressLevel > 3 && (
          <div className="glass-bg p-2 rounded-lg">
            <AlertTriangle size={10} className="text-red-400 mx-auto" />
            <div className="text-[8px] text-white/80 mt-1">Stress!</div>
          </div>
        )}
        
        <div className="glass-bg p-2 rounded-lg">
          <Clock size={10} className="text-yellow-400 mx-auto" />
          <div className="text-[8px] text-white/80 mt-1">ECG OK</div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center space-x-3 mb-4">
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
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              strokeDasharray={`${hydrationLevel}, 100`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplets size={8} className="text-accent" />
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
              stroke="hsl(var(--feature-health))"
              strokeWidth="2"
              strokeDasharray={`${sleepData.quality}, 100`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Moon size={8} className="text-purple-400" />
          </div>
        </div>
      </div>

      {/* Home Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
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

export default HealthScreen;