import React from 'react';
import { Battery, Wifi, Bluetooth, Bell, Sun, Heart, Target, MessageCircle } from 'lucide-react';
import AnalogClock from '../ui/AnalogClock';
import MicIndicator from '../ui/MicIndicator';
import WidgetCard from '../ui/WidgetCard';

const HomeScreen = ({ 
  homeScreenType, 
  setHomeScreenType, 
  currentTime, 
  isListening, 
  settings, 
  healthData, 
  weatherData,
  handleMicPress,
  handleMicRelease
}) => {
  // Analog Home Screen - Pure clock focus
  const AnalogHomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full relative" style={{ margin: '25px' }}>
      {/* Beautiful Analog Clock - Main Focus */}
      <div className="flex-1 flex items-center justify-center">
        <AnalogClock currentTime={currentTime} />
      </div>

      {/* Minimal Digital Time Below Clock */}
      <div className="text-center mt-4">
        <div className="text-lg font-bold text-white bg-black/40 px-4 py-2 rounded-2xl border border-cyan-400/30 backdrop-blur-sm">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Tap to Switch to Digital */}
      <button
        onClick={() => setHomeScreenType('digital')}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
      >
        Tap for Digital
      </button>

      <MicIndicator isListening={isListening} />
    </div>
  );

  // Digital Smart Home Screen
  const DigitalHomeScreen = () => (
    <div className="flex flex-col h-full p-3 space-y-3" style={{ margin: '20px' }}>
      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-1 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
          <Battery size={10} className="text-green-400" />
          <span className="text-green-400 font-bold">85%</span>
        </div>
        <div className="flex items-center space-x-1 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
          {settings.wifi && <Wifi size={8} className="text-cyan-400" />}
          {settings.bluetooth && <Bluetooth size={8} className="text-blue-400" />}
          <Bell size={8} className="text-purple-400" />
        </div>
      </div>

      {/* Large Digital Time */}
      <div className="text-center">
        <div className="text-3xl font-bold text-white bg-gradient-to-br from-cyan-500/20 to-purple-500/20 px-4 py-3 rounded-3xl border border-cyan-400/40 backdrop-blur-sm shadow-lg">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-cyan-400 font-medium mt-1">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Smart Widgets Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {/* Weather Widget */}
        <WidgetCard
          icon={Sun}
          title="Weather"
          value={`${weatherData.temperature}°C`}
          unit="Sunny"
          gradient="from-blue-500/20 to-cyan-500/20"
          borderColor="border-blue-500/40"
          iconColor="text-yellow-400"
          valueColor="text-cyan-400"
        />

        {/* Health Widget */}
        <WidgetCard
          icon={Heart}
          title="Heart"
          value={healthData.heartRate}
          unit="BPM"
          gradient="from-red-500/20 to-pink-500/20"
          borderColor="border-red-500/40"
          iconColor="text-red-400"
          valueColor="text-red-400"
        />

        {/* Steps Widget */}
        <WidgetCard
          icon={Target}
          title="Steps"
          value={`${(healthData.steps / 1000).toFixed(1)}K`}
          unit="Today"
          gradient="from-green-500/20 to-emerald-500/20"
          borderColor="border-green-500/40"
          iconColor="text-green-400"
          valueColor="text-green-400"
        />

        {/* AI Assistant Widget */}
        <WidgetCard
          icon={MessageCircle}
          title="AI"
          value={isListening ? 'Listening...' : 'Ready'}
          unit="Tap to speak"
          gradient={isListening 
            ? "from-purple-500/30 to-cyan-500/30" 
            : "from-purple-500/20 to-cyan-500/20"
          }
          borderColor={isListening ? "border-purple-500/60" : "border-purple-500/40"}
          iconColor="text-purple-400"
          valueColor="text-purple-400"
          className={isListening ? "scale-105" : ""}
          onClick={() => {
            handleMicPress();
            setTimeout(handleMicRelease, 2000);
          }}
        />
      </div>

      {/* Switch to Analog */}
      <button
        onClick={() => setHomeScreenType('analog')}
        className="text-xs text-gray-400 hover:text-cyan-400 transition-colors text-center"
      >
        Switch to Analog
      </button>

      <MicIndicator isListening={isListening} />
    </div>
  );

  return homeScreenType === 'analog' ? <AnalogHomeScreen /> : <DigitalHomeScreen />;
};

export default HomeScreen;