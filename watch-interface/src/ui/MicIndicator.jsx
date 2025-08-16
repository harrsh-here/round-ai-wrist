import React from 'react';
import { Mic, MicOff } from 'lucide-react';

const MicIndicator = ({ isListening, position = "top-right", size = 12 }) => {
  const positionClasses = {
    "top-right": "absolute top-4 right-4",
    "top-left": "absolute top-4 left-4",
    "bottom-right": "absolute bottom-4 right-4",
    "bottom-left": "absolute bottom-4 left-4",
    "center": "relative"
  };

  return (
    <div className={positionClasses[position]}>
      <div className={`p-2 rounded-full transition-all duration-300 ${
        isListening 
          ? 'bg-red-500/30 border border-red-500/60 animate-pulse' 
          : 'bg-gray-800/50 border border-gray-600/30'
      }`}>
        {isListening ? (
          <Mic size={size} className="text-red-400" />
        ) : (
          <Mic size={size} className="text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default MicIndicator;