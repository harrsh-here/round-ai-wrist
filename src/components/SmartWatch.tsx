
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { removeWatchToken, getWatchToken, sendHeartbeat, logoutWatch, goOffline, fetchNotifications } from '@/api/api';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, Play, Pause, Music } from 'lucide-react';


import AnalogWatch from './watch/AnalogWatch';
import HomeScreen from './watch/HomeScreen';
import FeaturesScreen from './watch/FeaturesScreen';
import AIChat from './watch/AIChat';
import SettingsScreen from './watch/SettingsScreen';
import FitnessScreen from './watch/FitnessScreen';
import HealthScreen from './watch/HealthScreen';
import LoginScreen from './watch/LoginScreen';
import DialerScreen from './watch/DialerScreen';
import MusicScreen from './watch/MusicScreen';
import WeatherScreen from './watch/WeatherScreen';
import NotificationsScreen from './watch/NotificationsScreen';
import CameraScreen from './watch/CameraScreen';
import MessagesScreen from './watch/MessagesScreen';
import MapsScreen from './watch/MapsScreen';
import StatusBar from './watch/StatusBar';
import TodoScreen from './watch/TodoScreen';
import AlarmScreen from './watch/AlarmScreen';

export type WatchScreen = 'login' | 'analog' | 'home' | 'features' | 'chat' | 'settings' | 'fitness' | 'health' | 'dialer' | 'music' | 'weather' | 'notifications' | 'camera' | 'messages' | 'maps' | 'todos' | 'alarms';

const SmartWatch = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Persist login: check for saved token on mount
  const hasToken = !!getWatchToken();
  const [isWatchOn, setIsWatchOn] = useState(hasToken);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(hasToken);
  const [currentScreen, setCurrentScreen] = useState<WatchScreen>(hasToken ? 'home' : 'login');
  const [showVoiceQuery, setShowVoiceQuery] = useState(false);
  const [navHistory, setNavHistory] = useState<WatchScreen[]>([]);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [brightness, setBrightness] = useState(75);
  const [soundMode, setSoundMode] = useState<'on' | 'vibrate' | 'off'>('on');
  const [showStatusBar, setShowStatusBar] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // Global music state
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicSongName, setMusicSongName] = useState('');
  const globalAudioRef = useRef<HTMLAudioElement | null>(null);

  // Create persistent global audio element
  useEffect(() => {
    if (!(window as any).__fuznex_audio) {
      (window as any).__fuznex_audio = new Audio();
    }
    globalAudioRef.current = (window as any).__fuznex_audio;

    // Listen for play/pause to sync state
    const audio = globalAudioRef.current;
    const onPlay = () => {
      setMusicPlaying(true);
      localStorage.setItem('watch_music_playing', 'true');
    };
    const onPause = () => {
      setMusicPlaying(false);
      localStorage.setItem('watch_music_playing', 'false');
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Restore state
    setMusicPlaying(localStorage.getItem('watch_music_playing') === 'true');

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // Sync song name from localStorage when screen changes
  useEffect(() => {
    const playlist = [
      'Shreya Ghoshal Performance', 'Atif Aslam - Lamhe',
      'Atif Aslam - Gima 2015', 'Ankhon Mein Teri - KK', 'Breathless'
    ];
    const idx = JSON.parse(localStorage.getItem('watch_music_song') || '0');
    setMusicSongName(playlist[idx] || 'Unknown');
    setMusicPlaying(localStorage.getItem('watch_music_playing') === 'true');
  }, [currentScreen]);

  const screens: WatchScreen[] = ['home', 'analog', 'features', 'fitness', 'health', 'chat', 'settings', 'notifications', 'camera', 'messages', 'todos', 'alarms'];

  const navigateToScreen = (screen: WatchScreen) => {
    if (screen === currentScreen || !isWatchOn) return;

    setIsTransitioning(true);
    setNavHistory(prev => [...prev, currentScreen]);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 150);
  };

  // Navigate with action params (e.g. music autoplay)
  const navigateWithAction = (screen: WatchScreen, params?: any) => {
    if (params) setPendingAction({ screen, params });
    navigateToScreen(screen);
  };

  // Go back to previous screen
  const goBack = () => {
    if (navHistory.length === 0) {
      navigateToScreen('home');
      return;
    }
    const prev = navHistory[navHistory.length - 1];
    setNavHistory(h => h.slice(0, -1));
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(prev);
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
    if (isWatchOn) {
      // Turning OFF — send offline signal
      goOffline().catch(() => { });
      setIsWatchOn(false);
      // Pause music when watch turns off
      if (globalAudioRef.current && !globalAudioRef.current.paused) {
        globalAudioRef.current.pause();
      }
    } else {
      setIsWatchOn(true);
      if (isLoggedIn) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('login');
      }
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsWatchOn(true);
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    await logoutWatch();
    setIsLoggedIn(false);
    removeWatchToken();
    setCurrentScreen('login');
  };

  // Heartbeat: send online signal every 30s while logged in AND watch is on
  // If the device was removed from the phone, force-logout the watch
  useEffect(() => {
    if (!isLoggedIn || !isWatchOn || !getWatchToken()) return;
    const doHeartbeat = async () => {
      try {
        await sendHeartbeat();
      } catch (err: any) {
        // If 404 = device was removed from phone → force logout
        if (err?.message?.includes('404')) {
          removeWatchToken();
          setIsLoggedIn(false);
          setCurrentScreen('login');
        }
      }
    };
    doHeartbeat();
    const interval = setInterval(doHeartbeat, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, isWatchOn]);

  // Poll notifications every 30s to update unread badge
  useEffect(() => {
    if (!isLoggedIn || !isWatchOn || !getWatchToken()) return;
    const pollNotifs = () => {
      fetchNotifications()
        .then(notifs => {
          const unread = notifs.filter(n => !n.is_read).length;
          setUnreadCount(unread);
        })
        .catch(() => { });
    };
    pollNotifs();
    const interval = setInterval(pollNotifs, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, isWatchOn]);

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
      'Set a timer for 5 minutes',
      'Call Sarah',
      'Play my workout playlist',
    ];

    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    setVoiceQuery(randomQuery);
    setShowVoiceQuery(true);
  };

  const handleVoiceQueryClick = () => {
    setShowVoiceQuery(false);
    setVoiceQuery('');
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
      onBack: goBack,
      onNavigateWithAction: navigateWithAction,
      currentScreen,
      onShowStatusBar: () => setShowStatusBar(true),
      brightness,
      soundMode,
      pendingAction,
      clearPendingAction: () => setPendingAction(null),
    };

    switch (currentScreen) {
      case 'analog':
        return <AnalogWatch {...screenProps} />;
      case 'home':
        return <HomeScreen {...screenProps} unreadCount={unreadCount} />;
      case 'features':
        return <FeaturesScreen {...screenProps} />;
      case 'chat':
        return <AIChat {...screenProps} />;
      case 'settings':
        return <SettingsScreen {...screenProps} onLogout={handleLogout} />;
      case 'fitness':
        return <FitnessScreen {...screenProps} />;
      case 'health':
        return <HealthScreen {...screenProps} />;
      case 'dialer':
        return <DialerScreen {...screenProps} />;
      case 'music':
        return <MusicScreen {...screenProps} />;
      case 'weather':
        return <WeatherScreen {...screenProps} />;
      case 'notifications':
        return <NotificationsScreen {...screenProps} setUnreadCount={setUnreadCount} />;
      case 'camera':
        return <CameraScreen {...screenProps} />;
      case 'messages':
        return <MessagesScreen {...screenProps} />;
      // case 'maps':
      //   return <MapsScreen {...screenProps} />;
      case 'alarms':
        return <AlarmScreen {...screenProps} />;
      case 'todos':
        return <TodoScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} unreadCount={unreadCount} />;
    }
  };

  return (
    <div className="watch-container select-none">
      <div className="watch-bezel watch-fade-in">
        <div className="watch-strap-top" />
        <div className="watch-strap-bottom" />

        {/* Inner Bezel with glow effect - Limited to bezel area */}
        <div className={`watch-bezel-inner-glow animate-fade-in ${isWatchOn ? 'watch-on' : 'watch-off'}`} />

        {/* Watch Screen */}
        <div className="watch-screen">
          {showVoiceQuery && voiceQuery && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 rounded-full backdrop-blur-sm cursor-pointer"
              onClick={handleVoiceQueryClick}
            >
              <div className="text-center p-4">
                <div className="text-accent text-xs mb-2 animate-pulse">Voice Query:</div>
                <div className="text-foreground text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text">
                  {voiceQuery}
                </div>
                <div className="text-white/60 text-xs mt-2">Tap to close</div>
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
            className={`relative w-full h-full transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
          >
            {renderScreen()}

            {/* Status Bar - Only show when logged in and watch is on */}
            {isWatchOn && isLoggedIn && (
              <StatusBar
                onNavigate={navigateToScreen}
              // brightness={brightness}
              // onBrightnessChange={setBrightness}
              // soundMode={soundMode}
              // onSoundModeChange={setSoundMode}
              />
            )}

          </div>
        </div>
        <button
          className={`watch-power-button ${isWatchOn ? 'active' : ''} ${!isWatchOn ? 'opacity-60' : 'opacity-100'}`}
          onClick={handlePowerButton}
          title="Power Button"
        />
        <button
          className={`watch-voice-button ${isListening ? 'active' : ''} ${!isWatchOn || !isLoggedIn ? 'opacity-60' : 'opacity-100'}`}

          onMouseDown={handleVoiceButtonPress}
          onMouseUp={handleVoiceButtonRelease}
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
