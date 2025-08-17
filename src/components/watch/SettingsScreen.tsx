import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Home, User, Bell, Wifi, Battery, Moon } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface SettingsScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

const SettingsScreen = ({ onNavigate }: SettingsScreenProps) => {
  const [userId, setUserId] = useState('user@example.com');
  const [notifications, setNotifications] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [nightMode, setNightMode] = useState(false);

  const settingsItems = [
    {
      icon: User,
      label: 'User ID',
      component: (
        <Input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="h-6 text-xs bg-secondary/50 border-border/50"
          placeholder="Enter User ID"
        />
      ),
    },
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
    <div className="relative w-full h-full flex flex-col p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
      </div>

      {/* Settings List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border/50 watch-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-2">
                <Icon size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <div className="flex-shrink-0">
                {item.component}
              </div>
            </div>
          );
        })}

        {/* Battery Status */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border/50">
          <div className="flex items-center space-x-2">
            <Battery size={14} className="text-green-400" />
            <span className="text-sm text-foreground">Battery</span>
          </div>
          <span className="text-sm font-mono text-green-400">85%</span>
        </div>

        {/* Device Info */}
        <div className="p-2 rounded-lg bg-card/50 border border-border/50 text-center">
          <div className="text-xs text-muted-foreground">SmartWatch AI v2.1</div>
          <div className="text-xs text-muted-foreground">Serial: SW-AI-2024</div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 hover:bg-primary/20"
        >
          <Home size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SettingsScreen;