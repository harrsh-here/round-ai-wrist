import React, { useState, useEffect, useRef } from 'react';
import WatchContainer from './components/WatchContainer';

const App = () => {
  // Core states
  const [isWatchOn, setIsWatchOn] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenIndex, setScreenIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [homeScreenType, setHomeScreenType] = useState('analog');

  // Screen order for swipe navigation
  const screens = ['home', 'dashboard', 'health', 'chat', 'settings'];

  // Chat state
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [currentChat, setCurrentChat] = useState({
    userMessage: '',
    aiResponse: '',
    isProcessing: false
  });

  // Mic button press state
  const [isMicPressed, setIsMicPressed] = useState(false);
  const micTimeoutRef = useRef(null);

  // Settings and status
  const [settings, setSettings] = useState({
    brightness: 80,
    bluetooth: true,
    wifi: true,
    notifications: true,
    theme: 'dark'
  });

  // Health data simulation
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    steps: 8547,
    calories: 324,
    activeMinutes: 45,
    distance: 5.2
  });

  // Weather data simulation
  const [weatherData, setWeatherData] = useState({
    temperature: 24,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 8
  });

  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time and health data
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setHealthData(prev => ({
        ...prev,
        heartRate: 68 + Math.floor(Math.random() * 12)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Swipe navigation
  const navigateToScreen = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    setTimeout(() => {
      let newIndex;
      if (direction === 'left') {
        newIndex = (screenIndex + 1) % screens.length;
      } else if (direction === 'right') {
        newIndex = (screenIndex - 1 + screens.length) % screens.length;
      }

      setScreenIndex(newIndex);
      setCurrentScreen(screens[newIndex]);

      setTimeout(() => {
        setSwipeDirection('');
        setIsAnimating(false);
      }, 350);
    }, 150);
  };

  // Power button handler
  const handlePowerButton = () => {
    setIsWatchOn(!isWatchOn);
  };

  // Mic button handlers
  const handleMicPress = () => {
    if (!isWatchOn) return;

    if (currentScreen !== 'chat') {
      setScreenIndex(3);
      setCurrentScreen('chat');
    }

    setIsMicPressed(true);
    setIsListening(true);
    setCurrentChat({ userMessage: '', aiResponse: '', isProcessing: false });
  };

  const handleMicRelease = () => {
    if (!isWatchOn) return;

    setIsMicPressed(false);
    setIsListening(false);

    if (isListening) {
      setCurrentChat({ userMessage: 'Voice command received', aiResponse: '', isProcessing: true });

      setTimeout(() => {
        const responses = [
          'Weather is sunny, 24°C today with light breeze.',
          'Alarm set for 7:00 AM tomorrow morning.',
          'Playing your workout playlist now.',
          'Your heart rate is normal at 72 BPM.',
          'Found 3 highly rated restaurants nearby.',
          'Reminder: Meeting at 3 PM today.',
          'Battery level is good at 85%.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setCurrentChat({
          userMessage: 'Voice command received',
          aiResponse: randomResponse,
          isProcessing: false
        });
      }, 2500);
    }
  };

  // Text input handler
  const handleTextSubmit = () => {
    if (textInput.trim() && !currentChat.isProcessing) {
      setCurrentChat({
        userMessage: textInput,
        aiResponse: '',
        isProcessing: true
      });
      setTextInput('');

      setTimeout(() => {
        const responses = [
          'I can help with that right away!',
          'Let me check that information for you.',
          'Done! Anything else you need?',
          'Processing your request now...',
          'Great question! Here\'s what I found.',
          'Task completed successfully.',
          'I\'ll send the details to your phone.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setCurrentChat(prev => ({
          ...prev,
          aiResponse: randomResponse,
          isProcessing: false
        }));
      }, 2000);
    }
  };

  const watchState = {
    isWatchOn,
    currentScreen,
    screenIndex,
    screens,
    swipeDirection,
    isAnimating,
    homeScreenType,
    setHomeScreenType,
    isListening,
    textInput,
    setTextInput,
    currentChat,
    isMicPressed,
    settings,
    setSettings,
    healthData,
    weatherData,
    currentTime,
    navigateToScreen,
    handlePowerButton,
    handleMicPress,
    handleMicRelease,
    handleTextSubmit
  };

  return <WatchContainer {...watchState} />;
};

export default App;