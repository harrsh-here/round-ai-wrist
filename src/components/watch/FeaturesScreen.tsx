
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Music, Heart, Cloud, Camera, Mail, MapPin, Activity, Home, Bell, Clock, CheckSquare } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface FeaturesScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const FeaturesScreen = ({ onNavigate }: FeaturesScreenProps) => {
  const features = [
    { icon: Bell, label: 'Notifications', color: 'text-red-400', screen: 'notifications' as WatchScreen },
    { icon: Bell, label: 'Notifications', color: 'text-blue-400', screen: 'notifications' as WatchScreen },
    { icon: Phone, label: 'Calls', color: 'text-feature-call', screen: 'dialer' as WatchScreen },
    { icon: Music, label: 'Music', color: 'text-feature-music', screen: 'music' as WatchScreen },
    { icon: Activity, label: 'Fitness', color: 'text-feature-fitness', screen: 'fitness' as WatchScreen },
    { icon: Heart, label: 'Health', color: 'text-feature-health', screen: 'health' as WatchScreen },
    { icon: Cloud, label: 'Weather', color: 'text-feature-weather', screen: 'weather' as WatchScreen },
    { icon: Camera, label: 'Camera', color: 'text-primary', screen: 'camera' as WatchScreen },
    { icon: Mail, label: 'Messages', color: 'text-accent', screen: 'messages' as WatchScreen },
    { icon: MapPin, label: 'Maps', color: 'text-green-400', screen: 'maps' as WatchScreen },
    { icon: Clock, label: 'Alarms', color: 'text-blue-400', screen: 'alarms' as WatchScreen },
    { icon: CheckSquare, label: 'Tasks', color: 'text-purple-400', screen: 'todos' as WatchScreen },
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.screen) {
      onNavigate(feature.screen);
    }
  };

  return (
   
    <div className="watch-content-safe flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-400/10 via-white/5 to-blue-200/10 backdrop-blur-sm animate-gradient bg-[length:400%_400%]">
      {/* Header */}
      <div className="text-center mb-4 watch-slide-up">
        <h2 className="text-lg font-bold bg-gradient-to-r from-white via-white/30 to-white/70 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Features</h2>
        <div className="text-xs text-white/60">App Collection</div>
      </div>

      {/* Features Grid - Better spacing and sizing */}
      <div className="grid grid-cols-3 gap-2 mb-6 max-w-[240px]">
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
              <Icon size={16} className={`${feature.color} mb-1`} />
              <span className="text-xs text-white/80 leading-tight text-center">{feature.label}</span>
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
