import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Music, Heart, Cloud, Camera, Mail, MapPin, Zap, Home } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface FeaturesScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const FeaturesScreen = ({ onNavigate }: FeaturesScreenProps) => {
  const features = [
    { icon: Phone, label: 'Calls', color: 'text-feature-call' },
    { icon: Music, label: 'Music', color: 'text-feature-music' },
    { icon: Heart, label: 'Health', color: 'text-feature-health' },
    { icon: Cloud, label: 'Weather', color: 'text-feature-weather' },
    { icon: Camera, label: 'Camera', color: 'text-primary' },
    { icon: Mail, label: 'Messages', color: 'text-accent' },
    { icon: MapPin, label: 'Maps', color: 'text-green-400' },
    { icon: Zap, label: 'Fitness', color: 'text-yellow-400' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Features</h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 max-w-52">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Button
              key={feature.label}
              variant="ghost"
              className="flex flex-col items-center justify-center w-14 h-14 p-2 rounded-xl hover:bg-secondary/50 watch-glow"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon size={18} className={feature.color} />
              <span className="text-xs mt-1 text-muted-foreground">{feature.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 hover:bg-primary/20"
        >
          <Home size={16} />
        </Button>
      </div>
    </div>
  );
};

export default FeaturesScreen;