
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Home, User, Bell, Wifi, Battery, Moon, CheckCircle } from 'lucide-react';
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
    <div className="relative w-full h-full flex flex-col p-4 bg-gradient-to-br from-background via-card/30 to-background">
      {/* Header */}
      <div className="text-center mb-4 watch-slide-up">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Settings</h2>
      </div>

      {/* User Profile */}
      <div className="mb-4 watch-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm mr-3">
            {user.avatar}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground flex items-center">
              {user.name}
              <CheckCircle size={14} className="text-green-400 ml-2" />
            </div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            <div className="text-xs text-green-400 font-medium">Logged In</div>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 space-y-3 overflow-y-auto mb-4">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-card/60 to-muted/20 border border-border/30 watch-slide-up shadow-sm"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                  <Icon size={14} className="text-accent" />
                </div>
                <span className="text-sm text-foreground font-medium">{item.label}</span>
              </div>
              <div className="flex-shrink-0">
                {item.component}
              </div>
            </div>
          );
        })}

        {/* Battery Status */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-feature-fitness/10 border border-green-400/30 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-feature-fitness/20 flex items-center justify-center">
              <Battery size={14} className="text-green-400" />
            </div>
            <span className="text-sm text-foreground font-medium">Battery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="w-7/8 h-full bg-gradient-to-r from-green-400 to-feature-fitness rounded-full" />
            </div>
            <span className="text-sm font-mono text-green-400 font-bold">85%</span>
          </div>
        </div>

        {/* Device Info */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-muted/10 to-card/20 border border-border/20 text-center shadow-sm">
          <div className="text-xs text-primary font-semibold mb-1">SmartWatch AI v2.1</div>
          <div className="text-xs text-muted-foreground">Serial: SW-AI-2024-{user.avatar}</div>
          <div className="text-xs text-green-400 font-medium mt-1">● Online</div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 hover:bg-primary/20 shadow-lg"
        >
          <Home size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SettingsScreen;
