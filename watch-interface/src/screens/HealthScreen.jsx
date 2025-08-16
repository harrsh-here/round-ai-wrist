import React from 'react';
import { Heart, Target, Flame, Timer, Navigation, Sun, Activity } from 'lucide-react';
import MicIndicator from '../ui/MicIndicator';
import WidgetCard from '../ui/WidgetCard';

const HealthScreen = ({ isListening, healthData }) => {
  return (
    <div className="flex flex-col h-full p-3 space-y-3" style={{ margin: '20px' }}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-base font-bold text-white">Health</h2>
        <p className="text-xs text-cyan-400">Today's Progress</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-3" style={{ maxHeight: '200px', paddingBottom: '40px' }}>
        {/* Primary Metrics - side by side */}
        <div className="grid grid-cols-2 gap-2">
          <WidgetCard
            icon={Heart}
            title="Heart"
            value={healthData.heartRate}
            unit="BPM"
            gradient="from-red-500/20 via-red-500/10 to-pink-500/20"
            borderColor="border-red-500/40"
            iconColor="text-red-400"
            valueColor="text-red-400"
          />

          <WidgetCard
            icon={Target}
            title="Steps"
            value={`${(healthData.steps / 1000).toFixed(1)}K`}
            unit="Today"
            gradient="from-green-500/20 via-green-500/10 to-emerald-500/20"
            borderColor="border-green-500/40"
            iconColor="text-green-400"
            valueColor="text-green-400"
          />
        </div>

        {/* Secondary Metrics - 3 column grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-1 text-center">
              <Flame size={12} className="text-orange-400" />
              <div className="text-sm font-bold text-orange-400">{healthData.calories}</div>
              <div className="text-xs text-gray-300">KCAL</div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-1 text-center">
              <Timer size={12} className="text-purple-400" />
              <div className="text-sm font-bold text-purple-400">{healthData.activeMinutes}</div>
              <div className="text-xs text-gray-300">MIN</div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/40 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-1 text-center">
              <Navigation size={12} className="text-blue-400" />
              <div className="text-sm font-bold text-blue-400">{healthData.distance}</div>
              <div className="text-xs text-gray-300">KM</div>
            </div>
          </div>
        </div>

        {/* Additional metrics for scrolling */}
        <div className="grid grid-cols-2 gap-2">
          <WidgetCard
            icon={Sun}
            title="Sleep"
            value="7.2h"
            unit="Last night"
            gradient="from-yellow-500/20 to-orange-500/20"
            borderColor="border-yellow-500/40"
            iconColor="text-yellow-400"
            valueColor="text-yellow-400"
          />

          <WidgetCard
            icon={Activity}
            title="Stress"
            value="Low"
            unit="Current"
            gradient="from-teal-500/20 to-cyan-500/20"
            borderColor="border-teal-500/40"
            iconColor="text-teal-400"
            valueColor="text-teal-400"
          />
        </div>
      </div>

      <MicIndicator isListening={isListening} />
    </div>
  );
};

export default HealthScreen;