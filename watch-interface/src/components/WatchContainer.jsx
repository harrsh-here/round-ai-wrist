import React from 'react';
import { ChevronLeft, ChevronRight, Power, Mic, Battery } from 'lucide-react';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HealthScreen from '../screens/HealthScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

const WatchContainer = (props) => {
  const {
    isWatchOn,
    currentScreen,
    screenIndex,
    screens,
    swipeDirection,
    isAnimating,
    isListening,
    isMicPressed,
    navigateToScreen,
    handlePowerButton,
    handleMicPress,
    handleMicRelease
  } = props;

  // Screen renderer with animations
  const renderScreen = () => {
    const screenComponents = {
      home: HomeScreen,
      dashboard: DashboardScreen,
      health: HealthScreen,
      chat: ChatScreen,
      settings: SettingsScreen
    };

    const ScreenComponent = screenComponents[currentScreen];

    return (
      <div className={`h-full transition-all duration-300 ${
        swipeDirection === 'left' ? 'transform -translate-x-full opacity-0' :
        swipeDirection === 'right' ? 'transform translate-x-full opacity-0' :
        'transform translate-x-0 opacity-100'
      }`}>
        <ScreenComponent {...props} />
      </div>
    );
  };

  // Power off screen
  if (!isWatchOn) {
    return (
      <div className="flex flex-col items-center space-y-6 p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
        <div className="relative">
          <div className="w-80 h-80 bg-black rounded-full border-8 border-gray-800 relative overflow-hidden flex items-center justify-center">
            <div className="text-gray-600 text-sm">FuzNex</div>
            
            {/* Physical Buttons */}
            <button
              onClick={handlePowerButton}
              className="absolute -right-2 top-16 w-3 h-8 bg-gray-700 rounded-l-lg shadow-lg hover:bg-gray-600 transition-all active:scale-95"
              title="Power Button"
            />
            <div className="absolute -right-2 top-28 w-3 h-6 bg-gray-700 rounded-l-lg shadow-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
      {/* Watch Container */}
      <div className="relative">
        <div className="w-80 h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-full border-8 border-gray-700 relative overflow-hidden shadow-2xl">
          {/* Screen Bezel */}
          <div className="absolute inset-4 rounded-full border-2 border-gray-600/50 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
            {/* Ambient Light Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
            
            {/* Screen Content */}
            <div className="w-full h-full relative">
              {renderScreen()}
            </div>
          </div>

          {/* Physical Buttons */}
          <button
            onClick={handlePowerButton}
            className="absolute -right-2 top-16 w-3 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-lg shadow-lg hover:from-gray-500 hover:to-gray-600 transition-all active:scale-95"
            title="Power Button"
          />
          <button
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
            className={`absolute -right-2 top-28 w-3 h-6 rounded-l-lg shadow-lg transition-all active:scale-95 ${
              isMicPressed 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
            }`}
            title="Voice Command Button"
          />
        </div>

        {/* Screen Indicator Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === screenIndex
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 scale-125'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Navigation Controls - Positioned Below */}
        <div className="flex justify-center items-center mt-6 space-x-8">
          <button
            onClick={() => navigateToScreen('right')}
            disabled={isAnimating}
            className="p-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:scale-110 active:scale-95"
            title="Previous Screen"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>

          <div className="text-center">
            <div className="text-white font-semibold text-sm capitalize">{currentScreen}</div>
            <div className="text-gray-400 text-xs">{screenIndex + 1} of {screens.length}</div>
          </div>

          <button
            onClick={() => navigateToScreen('left')}
            disabled={isAnimating}
            className="p-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:scale-110 active:scale-95"
            title="Next Screen"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        {/* Watch Info */}
        <div className="text-center mt-8 space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            FuzNex Smartwatch
          </h1>
          <p className="text-gray-400 text-sm">
            Advanced AI • Voice Commands • Health Tracking
          </p>
          
          {/* Status Indicators */}
          <div className="flex justify-center space-x-4 mt-4 text-xs">
            <div className={`flex items-center space-x-1 ${isWatchOn ? 'text-green-400' : 'text-gray-500'}`}>
              <Power size={12} />
              <span>{isWatchOn ? 'ON' : 'OFF'}</span>
            </div>
            <div className={`flex items-center space-x-1 ${isListening ? 'text-red-400' : 'text-gray-500'}`}>
              <Mic size={12} />
              <span>{isListening ? 'LISTENING' : 'READY'}</span>
            </div>
            <div className="flex items-center space-x-1 text-cyan-400">
              <Battery size={12} />
              <span>85%</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-2">Controls:</h3>
            <div className="text-gray-300 text-sm space-y-1 text-left">
              <p>• <strong>Power Button:</strong> Turn watch on/off</p>
              <p>• <strong>Voice Button:</strong> Hold to speak, release to process</p>
              <p>• <strong>Navigation:</strong> Use arrow buttons to swipe between screens</p>
              <p>• <strong>Home Screen:</strong> Tap to switch between analog/digital</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchContainer;