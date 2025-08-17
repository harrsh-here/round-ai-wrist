
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
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/90">
      {/* Header */}
      <div className="text-center mb-6 watch-slide-up">
        <h2 className="text-lg font-semibold text-white">Features</h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-60">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Button
              key={feature.label}
              variant="ghost"
              onClick={() => handleFeatureClick(feature)}
              className={`flex flex-col items-center justify-center w-16 h-16 p-2 rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 watch-glow transition-all duration-300 ${
                feature.screen ? 'cursor-pointer' : 'cursor-default'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon size={22} className={`${feature.color} mb-1`} />
              <span className="text-xs text-white/80">{feature.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-12 h-12 p-0 backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 shadow-lg"
        >
          <Home size={18} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default FeaturesScreen;
