import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, MessageCircle, Settings, Phone, Music, Heart, Cloud } from 'lucide-react';
import AnalogWatch from './watch/AnalogWatch';
import HomeScreen from './watch/HomeScreen';
import FeaturesScreen from './watch/FeaturesScreen';
import AIChat from './watch/AIChat';
import SettingsScreen from './watch/SettingsScreen';

export type WatchScreen = 'analog' | 'home' | 'features' | 'chat' | 'settings';

const SmartWatch = () => {
  const [currentScreen, setCurrentScreen] = useState<WatchScreen>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToScreen = (screen: WatchScreen) => {
    if (screen === currentScreen) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 150);
  };

  const renderScreen = () => {
    const screenProps = {
      onNavigate: navigateToScreen,
      currentScreen,
    };

    switch (currentScreen) {
      case 'analog':
        return <AnalogWatch {...screenProps} />;
      case 'home':
        return <HomeScreen {...screenProps} />;
      case 'features':
        return <FeaturesScreen {...screenProps} />;
      case 'chat':
        return <AIChat {...screenProps} />;
      case 'settings':
        return <SettingsScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  };

  return (
    <div className="watch-container">
      <div className="watch-bezel watch-fade-in">
        {/* Watch Straps */}
        <div className="watch-strap-top" />
        <div className="watch-strap-bottom" />
        
        {/* Watch Screen */}
        <div className="watch-screen">
          <div 
            className={`relative w-full h-full transition-opacity duration-150 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {renderScreen()}
          </div>
        </div>

        {/* Watch Crown/Button - Optional decorative element */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
          <div className="w-6 h-8 bg-gradient-to-r from-gray-600 to-gray-400 rounded-r-lg shadow-lg border border-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default SmartWatch;