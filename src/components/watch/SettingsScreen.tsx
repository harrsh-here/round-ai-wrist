
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, User, Bell, Wifi, Battery, Moon, CheckCircle, LogOut } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface SettingsScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const SettingsScreen = ({ onNavigate }: SettingsScreenProps) => {
  const [notifications, setNotifications] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [nightMode, setNightMode] = useState(false);

  const user = {
    name: 'Harsh Patidar',
    email: 'harsh.patidar@example.com',
    avatar: 'HP'
  };

  const handleLogout = () => {
    // For now, just navigate back to home
    onNavigate('home');
  };

  const settingsItems = [
    {
      icon: Bell,
      label: 'Notifications',
      component: (
        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
          className="scale-75"
        />
      ),
    },
    {
      icon: Wifi,
      label: 'Wi-Fi',
      component: (
        <Switch
          checked={wifi}
          onCheckedChange={setWifi}
          className="scale-75"
        />
      ),
    },
    {
      icon: Moon,
      label: 'Night Mode',
      component: (
        <Switch
          checked={nightMode}
          onCheckedChange={setNightMode}
          className="scale-75"
        />
      ),
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col p-6 bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/90">
      {/* Header */}
      <div className="text-center mb-4 watch-slide-up">
        <h2 className="text-lg font-semibold text-white">Settings</h2>
      </div>

      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4 pr-2">
          {/* User Profile */}
          <div className="watch-slide-up backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm mr-3">
                {user.avatar}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white flex items-center">
                  {user.name}
                  <CheckCircle size={14} className="text-green-400 ml-2" />
                </div>
                <div className="text-xs text-white/70">{user.email}</div>
                <div className="text-xs text-green-400 font-medium">Logged In</div>
              </div>
            </div>
          </div>

          {/* Settings List */}
          <div className="space-y-3">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 watch-slide-up shadow-sm"
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <Icon size={16} className="text-accent" />
                    </div>
                    <span className="text-sm text-white font-medium">{item.label}</span>
                  </div>
                  <div className="flex-shrink-0">
                    {item.component}
                  </div>
                </div>
              );
            })}

            {/* Battery Status */}
            <div className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-feature-fitness/20 flex items-center justify-center">
                  <Battery size={16} className="text-green-400" />
                </div>
                <span className="text-sm text-white font-medium">Battery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-7/10 h-full bg-gradient-to-r from-green-400 to-feature-fitness rounded-full" />
                </div>
                <span className="text-sm font-mono text-green-400 font-bold">85%</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-4 rounded-xl backdrop-blur-md bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 transition-all duration-300 group"
            >
              <LogOut size={16} className="text-red-400 mr-2" />
              <span className="text-sm text-red-400 font-medium">Logout</span>
            </button>

            {/* Device Info */}
            <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-center shadow-sm">
              <div className="text-xs text-primary font-semibold mb-1">FuzNex AI SmartWatch v2.1</div>
              <div className="text-xs text-white/60">Serial: FZ-AI-2024-{user.avatar}</div>
              <div className="text-xs text-green-400 font-medium mt-1">● Online</div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-12 h-12 p-0 backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 shadow-lg"
        >
          <Home size={18} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default SettingsScreen;
