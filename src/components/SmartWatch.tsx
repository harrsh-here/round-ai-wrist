
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight  ,Home } from 'lucide-react';


import AnalogWatch from './watch/AnalogWatch';
import HomeScreen from './watch/HomeScreen';
import FeaturesScreen from './watch/FeaturesScreen';
import AIChat from './watch/AIChat';
import SettingsScreen from './watch/SettingsScreen';
import FitnessScreen from './watch/FitnessScreen';
import LoginScreen from './watch/LoginScreen';
import DialerScreen from './watch/DialerScreen';
import MusicScreen from './watch/MusicScreen';
import WeatherScreen from './watch/WeatherScreen';

export type WatchScreen = 'login' | 'analog' | 'home' | 'features' | 'chat' | 'settings' | 'fitness' | 'dialer' | 'music' | 'weather';

const SmartWatch = () => {
  const [currentScreen, setCurrentScreen] = useState<WatchScreen>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isWatchOn, setIsWatchOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const screens: WatchScreen[] = ['home', 'analog', 'features', 'fitness', 'chat', 'settings'];

  const navigateToScreen = (screen: WatchScreen) => {
    if (screen === currentScreen || !isWatchOn) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 150);
  };

  const navigateDirection = (direction: 'left' | 'right') => {
    if (!isWatchOn || !isLoggedIn) return;
    
    const currentIndex = screens.indexOf(currentScreen);
    let newIndex;
    
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : screens.length - 1;
    } else {
      newIndex = currentIndex < screens.length - 1 ? currentIndex + 1 : 0;
    }
    
    navigateToScreen(screens[newIndex]);
  };

  const handlePowerButton = () => {
    setIsWatchOn(!isWatchOn);
    if (!isWatchOn && isLoggedIn) {
      setCurrentScreen('home');
    } else if (!isWatchOn) {
      setCurrentScreen('login');
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsWatchOn(true);
    setCurrentScreen('home');
  };

  const handleVoiceButtonPress = () => {
    if (!isWatchOn || !isLoggedIn) return;
    setIsListening(true);
  };

  const handleVoiceButtonRelease = () => {
    if (!isWatchOn || !isLoggedIn) return;
    setIsListening(false);
    
    const queries = [
      "What's my heart rate?",
      "Show me today's steps",
      "What's the weather like?",
      "Set a timer for 5 minutes",
      "Call Sarah",
      "Play my workout playlist"
    ];
    
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    setVoiceQuery(randomQuery);
    
    setTimeout(() => setVoiceQuery(''), 3000);
  };

  const renderScreen = () => {
    if (!isWatchOn) {
      return (
        <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
          <div className="text-muted-foreground/20 text-xs">Press power button</div>
        </div>
      );
    }

    if (!isLoggedIn) {
      return <LoginScreen onLogin={handleLogin} />;
    }

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
      case 'fitness':
        return <FitnessScreen {...screenProps} />;
      case 'dialer':
        return <DialerScreen {...screenProps} />;
      case 'music':
        return <MusicScreen {...screenProps} />;
      case 'weather':
        return <WeatherScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  };

  return (
    <div className="watch-container select-none">
      <div className="watch-bezel watch-fade-in">
        {/* Watch Straps */}
        <div className="watch-strap-top" />
        <div className="watch-strap-bottom" />
        
        {/* Inner Bezel with glow effect - Limited to bezel area */}
        <div className={`watch-bezel-inner-glow animate-fade-in ${isWatchOn ? 'watch-on' : 'watch-off'}`} />
        
        {/* Watch Screen */}
        <div className="watch-screen">
          {/* Voice Query Overlay */}
          {voiceQuery && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 rounded-full backdrop-blur-sm">
              <div className="text-center p-4">
                <div className="text-accent text-xs mb-2 animate-pulse">Voice Query:</div>
                <div className="text-foreground text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {voiceQuery}
                </div>
              </div>
            </div>
          )}
          
          {/* Listening Overlay */}
          {isListening && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 rounded-full voice-listening backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent flex items-center justify-center mb-3 animate-voice-pulse mx-auto">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent/80 animate-pulse" />
                </div>
                <div className="text-accent text-sm font-medium">Listening...</div>
              </div>
            </div>
          )}
          
          <div 
            className={`relative w-full h-full transition-opacity duration-150 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {renderScreen()}
          </div>
        </div>

        {/* Power Button - Now bottom button with blue glow when on */}
        <button
          className={`watch-power-button ${isWatchOn ? 'active' : ''} ${!isWatchOn ? 'opacity-60' : 'opacity-100'}`}
          onClick={handlePowerButton}
          title="Power Button"
        />

        {/* Voice Button - Now top button with yellow glow when active */}
        <button
          className={`watch-voice-button ${isListening ? 'active' : ''} ${!isWatchOn || !isLoggedIn ? 'opacity-60' : 'opacity-100'}`}
          
          onMouseDown={handleVoiceButtonPress}
          onMouseUp={handleVoiceButtonRelease}
          // onMouseLeave={handleVoiceButtonRelease}
          onTouchStart={handleVoiceButtonPress}
          onTouchEnd={handleVoiceButtonRelease}
          title="Voice Button (Hold to speak)"
        />
      </div>
          
           {/* Back Button
      <div className="fixed bottom-[110px] left-1/2 transform -translate-x-1/2 pb-8 mb-10 z-50">

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15 p-18 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-slow"
        >
          <Home size={14} className="text-white" />
        </Button>
      </div> */}
      
      {/* Navigation Controls */}
      {(isWatchOn && isLoggedIn) && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateDirection('left')}
            className="rounded-full w-12 h-12 p-0 bg-background/10 hover:bg-primary/20 border border-border/30 backdrop-blur-sm"
          >
            <ChevronLeft size={20} className="text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateDirection('right')}
            className="rounded-full w-12 h-12 p-0 bg-background/10 hover:bg-primary/20 border border-border/30 backdrop-blur-sm"
          >
            <ChevronRight size={20} className="text-primary" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SmartWatch;
