import React from 'react';
import { Music, Phone, Navigation, AlarmClock, Volume2, Bell } from 'lucide-react';
import MicIndicator from '../ui/MicIndicator';

const DashboardScreen = ({ isListening, handleMicPress, handleMicRelease }) => {
  return (
    <div className="flex flex-col h-full p-3 space-y-3" style={{ margin: '20px' }}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-base font-bold text-white">Dashboard</h2>
        <p className="text-xs text-cyan-400">Quick Actions</p>
      </div>

      {/* AI Status */}
      <div className="flex justify-center">
        <div 
          className={`relative w-14 h-14 rounded-full cursor-pointer transition-all duration-500 ${
            isListening ? 'scale-110' : 'hover:scale-105'
          }`} 
          onClick={() => {
            handleMicPress();
            setTimeout(handleMicRelease, 2000);
          }}
        >
          <div className={`w-full h-full rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-cyan-400 p-1 ${
            isListening ? 'animate-pulse shadow-xl shadow-cyan-500/50' : 'shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className={`text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent ${
                isListening ? 'animate-pulse' : ''
              }`}>
                AI
              </div>
            </div>
          </div>
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping"></div>
          )}
        </div>
      </div>

      {/* Circular Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-2 flex-1 items-center">
        {[
          { icon: Music, label: 'Music', color: 'from-purple-500/30 to-pink-500/30 border-purple-500/50', iconColor: 'text-purple-400' },
          { icon: Phone, label: 'Call', color: 'from-green-500/30 to-emerald-500/30 border-green-500/50', iconColor: 'text-green-400' },
          { icon: Navigation, label: 'Maps', color: 'from-blue-500/30 to-cyan-500/30 border-blue-500/50', iconColor: 'text-blue-400' },
          { icon: AlarmClock, label: 'Alarm', color: 'from-orange-500/30 to-red-500/30 border-orange-500/50', iconColor: 'text-orange-400' },
          { icon: Volume2, label: 'Audio', color: 'from-cyan-500/30 to-blue-500/30 border-cyan-500/50', iconColor: 'text-cyan-400' },
          { icon: Bell, label: 'Alert', color: 'from-indigo-500/30 to-purple-500/30 border-indigo-500/50', iconColor: 'text-indigo-400' }
        ].map((item, index) => (
          <button 
            key={index}
            className={`p-2 rounded-xl bg-gradient-to-br ${item.color} backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-200 border flex flex-col items-center space-y-1 shadow-md`}
          >
            <item.icon size={12} className={item.iconColor} />
            <span className="text-xs text-white font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <MicIndicator isListening={isListening} />
    </div>
  );
};

export default DashboardScreen;