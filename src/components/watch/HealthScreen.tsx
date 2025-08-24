import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ArrowLeft, 
  Activity,
  Brain,
  Moon
} from 'lucide-react';

interface HealthScreenProps {
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

const HealthScreen = ({ onNavigate }: HealthScreenProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentValue, setCurrentValue] = useState(120);
  const [progress, setProgress] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
      switch(activeTab) {
        case 0: // Vitals - Blood Pressure
          const newBP = Math.floor(Math.random() * 20) + 110;
          setCurrentValue(newBP);
          setProgress((newBP / 140) * 100);
          break;
        case 1: // Stress
          const newStress = Math.floor(Math.random() * 5) + 1;
          setCurrentValue(newStress);
          setProgress((6 - newStress) * 20);
          break;
        case 2: // Sleep
          const newSleep = 7 + Math.random() * 2;
          setCurrentValue(Math.round(newSleep * 10) / 10);
          setProgress((newSleep / 10) * 100);
          break;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const tabs = [
    {
      icon: Activity,
      color: '#ef4444',
      label: 'Blood Pressure',
      unit: 'mmHg',
      status: currentValue > 130 ? 'HIGH' : 'NORMAL'
    },
    {
      icon: Brain,
      color: '#8b5cf6',
      label: 'Stress Level',
      unit: '/5',
      status: currentValue > 3 ? 'HIGH' : 'LOW'
    },
    {
      icon: Moon,
      color: '#3b82f6',
      label: 'Sleep Duration',
      unit: 'hours',
      status: currentValue > 7 ? 'GOOD' : 'SHORT'
    }
  ];

  const currentTab = tabs[activeTab];
  const circumference = 2 * Math.PI * 45;

  return (
    <div className="mt-4 relative w-full h-full flex flex-col items-center justify-center watch-scroll overflow-y-auto">
      
      {/* Header */}
      <div className="absolute w-full flex items-center justify-center">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => onNavigate('features')}
          className="absolute left-6 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20"
        >
          <ArrowLeft size={24} className="text-white" />
        </Button>
      </div>
 {/* Metric label */}
      <div className="text-center mb-1">
        <div className="text-sm text-white/50 font-medium">
          {currentTab.label}
        </div>
      </div>
      {/* Main Circle */}
      <div className="relative flex items-center justify-center mb-1">
        <svg className="w-56 h-56 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={currentTab.color}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{
              filter: `drop-shadow(0 0 8px ${currentTab.color}60)`
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <currentTab.icon 
            size={32} 
            style={{ color: currentTab.color }}
            className="mb-4"
          />
          <div className="text-4xl font-light text-white mb-2">
            {currentValue}
          </div>
          <div className="text-sm text-white/60 mb-4">
            {currentTab.unit}
          </div>
          <div 
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: `${currentTab.color}20`,
              color: currentTab.color
            }}
          >
            {currentTab.status}
          </div>
        </div>
      </div>

      {/* Tab indicators */}
      <div className="flex space-x-4 mb-8">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeTab === index 
                  ? 'bg-white/20 scale-110' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{
                borderColor: activeTab === index ? tab.color : 'transparent',
                borderWidth: activeTab === index ? '2px' : '0px'
              }}
            >
              <Icon 
                size={18} 
                style={{ 
                  color: activeTab === index ? tab.color : '#ffffff60'
                }} 
              />
            </button>
          );
        })}
      </div>

     

      {/* Home button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('home')}
        className="absolute bottom-[167px] right-[15px] rounded-full w-10 h-10 p-0 bg-white/10 hover:bg-white/20"
      >
        <Home size={16} className="text-white" />
      </Button>

    </div>
  );
};

export default HealthScreen;