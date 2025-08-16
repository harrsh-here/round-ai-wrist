import React from 'react';
import { Monitor, Bluetooth, Wifi, Bell, Sun, User, Volume2 } from 'lucide-react';
import MicIndicator from '../ui/MicIndicator';

const SettingsScreen = ({ isListening, settings, setSettings }) => {
  return (
    <div className="flex flex-col h-full p-3 space-y-3" style={{ margin: '20px' }}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-base font-bold text-white">Settings</h2>
      </div>

      {/* Scrollable Settings List */}
      <div className="flex-1 space-y-2 overflow-y-auto" style={{ maxHeight: '200px', paddingBottom: '40px' }}>
        {/* Brightness */}
        <div className="p-2 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/40 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Monitor size={12} className="text-yellow-400" />
              <span className="text-xs text-white font-semibold">Brightness</span>
            </div>
            <span className="text-xs text-gray-300 font-bold">{settings.brightness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.brightness}
            onChange={(e) => setSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
            className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Toggle Settings */}
        {[
          { key: 'bluetooth', icon: Bluetooth, label: 'Bluetooth', color: 'text-blue-400' },
          { key: 'wifi', icon: Wifi, label: 'Wi-Fi', color: 'text-cyan-400' },
          { key: 'notifications', icon: Bell, label: 'Notifications', color: 'text-purple-400' }
        ].map((setting) => (
          <div key={setting.key} className="p-2 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <setting.icon size={12} className={setting.color} />
                <span className="text-xs text-white font-semibold">{setting.label}</span>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [setting.key]: !prev[setting.key] }))}
                className={`w-8 h-4 rounded-full transition-all duration-300 relative ${
                  settings[setting.key]
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                    : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300 ${
                    settings[setting.key] ? 'left-4' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}

        {/* Theme Settings */}
        <div className="p-2 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun size={12} className="text-yellow-400" />
              <span className="text-xs text-white font-semibold">Theme</span>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="p-2 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/40 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <User size={12} className="text-green-400" />
            <span className="text-xs text-white font-semibold">Profile</span>
          </div>
        </div>

        <div className="p-2 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/40 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Volume2 size={12} className="text-orange-400" />
            <span className="text-xs text-white font-semibold">Sound & Vibration</span>
          </div>
        </div>
      </div>

      <MicIndicator isListening={isListening} />
    </div>
  );
};

export default SettingsScreen;