
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
    { icon: Phone, label: 'Calls', color: 'text-feature-call', screen: 'dialer' as WatchScreen },
    { icon: Music, label: 'Music', color: 'text-feature-music', screen: 'music' as WatchScreen },
    { icon: Activity, label: 'Fitness', color: 'text-feature-fitness', screen: 'fitness' as WatchScreen },
    { icon: Heart, label: 'Health', color: 'text-feature-health', screen: 'health' as WatchScreen },
    { icon: Cloud, label: 'Weather', color: 'text-feature-weather', screen: 'weather' as WatchScreen },
    { icon: Camera, label: 'Camera', color: 'text-primary', screen: 'chat' as WatchScreen },
    { icon: Mail, label: 'Messages', color: 'text-accent', screen: 'chat' as WatchScreen },
    { icon: MapPin, label: 'Maps', color: 'text-green-400', screen: 'settings' as WatchScreen },
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.screen) {
      onNavigate(feature.screen);
    }
  };

  return (
    <div className="watch-content-safe flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-4 watch-slide-up">
        <h2 className="text-lg font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">Features</h2>
        <div className="text-xs text-white/60">App Collection</div>
      </div>

      {/* Features Grid - Better spacing and sizing */}
      <div className="grid grid-cols-3 gap-3 mb-6 max-w-[230px]">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Button
              key={feature.label}
              variant="ghost"
              onClick={() => handleFeatureClick(feature)}
              className="flex flex-col items-center justify-center w-15 h-15 p-3 rounded-xl glass-bg hover:bg-white/15 watch-glow transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon size={18} className={`${feature.color} mb-1`} />
              <span className="text-xs text-white/80 leading-tight">{feature.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
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

export default FeaturesScreen;
