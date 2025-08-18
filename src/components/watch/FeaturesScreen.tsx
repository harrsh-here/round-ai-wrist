
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Music, Heart, Cloud, Camera, Mail, MapPin, Activity, Home } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface FeaturesScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const FeaturesScreen = ({ onNavigate }: FeaturesScreenProps) => {
  const features = [
    { icon: Phone, label: 'Calls', color: 'text-feature-call', screen: null },
    { icon: Music, label: 'Music', color: 'text-feature-music', screen: null },
    { icon: Activity, label: 'Fitness', color: 'text-feature-fitness', screen: 'fitness' as WatchScreen },
    { icon: Heart, label: 'Health', color: 'text-feature-health', screen: null },
    { icon: Cloud, label: 'Weather', color: 'text-feature-weather', screen: null },
    { icon: Camera, label: 'Camera', color: 'text-primary', screen: null },
    { icon: Mail, label: 'Messages', color: 'text-accent', screen: null },
    { icon: MapPin, label: 'Maps', color: 'text-green-400', screen: null },
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.screen) {
      onNavigate(feature.screen);
    } else if (feature.label === 'Calls') {
      onNavigate('dialer' as WatchScreen);
    } else if (feature.label === 'Music') {
      onNavigate('music' as WatchScreen);
    }
  };

  return (
    <div className="watch-content-safe flex flex-col items-center justify-center h-full">
      {/* Header */}
      <div className="text-center mb-4 watch-slide-up">
        <h2 className="text-sm font-semibold text-white">Features</h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 max-w-[200px]">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Button
              key={feature.label}
              variant="ghost"
              onClick={() => handleFeatureClick(feature)}
              className="flex flex-col items-center justify-center w-14 h-14 p-2 rounded-xl glass-bg hover:bg-white/15 watch-glow transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon size={20} className={`${feature.color} mb-1`} />
              <span className="text-xs text-white/80">{feature.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default FeaturesScreen;
