
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AnalogWatch from './watch/AnalogWatch';
import HomeScreen from './watch/HomeScreen';
import FeaturesScreen from './watch/FeaturesScreen';
import AIChat from './watch/AIChat';
import SettingsScreen from './watch/SettingsScreen';
import FitnessScreen from './watch/FitnessScreen';

export type WatchScreen = 'analog' | 'home' | 'features' | 'chat' | 'settings' | 'fitness';

const SmartWatch = () => {
  const [currentScreen, setCurrentScreen] = useState<WatchScreen>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isWatchOn, setIsWatchOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');

  const navigateToScreen = (screen: WatchScreen) => {
    if (screen === currentScreen || !isWatchOn) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 150);
  };

  const handlePowerButton = () => {
    setIsWatchOn(!isWatchOn);
    if (!isWatchOn) {
      setCurrentScreen('home');
    }
  };

  const handleVoiceButtonPress = () => {
    if (!isWatchOn) return;
    setIsListening(true);
  };

  const handleVoiceButtonRelease = () => {
    if (!isWatchOn) return;
    setIsListening(false);
    
    // Simulate voice query
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
    
    // Clear query after 3 seconds
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
          {/* Voice Query Overlay */}
          {voiceQuery && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 rounded-full">
              <div className="text-center p-4">
                <div className="text-accent text-xs mb-2">Voice Query:</div>
                <div className="text-foreground text-sm font-medium">{voiceQuery}</div>
              </div>
            </div>
          )}
          
          {/* Listening Overlay */}
          {isListening && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 rounded-full voice-listening">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-2 animate-voice-pulse">
                  <div className="w-4 h-4 rounded-full bg-accent" />
                </div>
                <div className="text-accent text-xs">Listening...</div>
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

        {/* Power Button */}
        <button
          className={`watch-power-button ${!isWatchOn ? 'opacity-50' : ''}`}
          onClick={handlePowerButton}
          title="Power Button"
        />

        {/* Voice Button */}
        <button
          className={`watch-voice-button ${isListening ? 'active' : ''}`}
          onMouseDown={handleVoiceButtonPress}
          onMouseUp={handleVoiceButtonRelease}
          onMouseLeave={handleVoiceButtonRelease}
          onTouchStart={handleVoiceButtonPress}
          onTouchEnd={handleVoiceButtonRelease}
          title="Voice Button (Hold to speak)"
        />
      </div>
    </div>
  );
};

export default SmartWatch;
