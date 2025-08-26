import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Bell, Mail, Phone, Calendar, MessageSquare, Heart, ArrowLeft, Check, X } from 'lucide-react';
import { WatchScreen } from '../SmartWatch';

interface NotificationsScreenProps {
  onNavigate: (screen: WatchScreen) => void;
  currentScreen: WatchScreen;
}

interface Notification {
  id: string;
  type: 'message' | 'call' | 'email' | 'calendar' | 'health' | 'app';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: any;
  color: string;
}

const NotificationsScreen = ({ onNavigate }: NotificationsScreenProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'Mom',
      content: 'Don\'t forget to take your vitamins!',
      time: '2m ago',
      isRead: false,
      priority: 'high',
      icon: MessageSquare,
      color: '#4ecdc4'
    },
    {
      id: '2',
      type: 'call',
      title: 'Missed Call',
      content: 'Sarah called you',
      time: '5m ago',
      isRead: false,
      priority: 'medium',
      icon: Phone,
      color: '#45b7d1'
    },
    {
      id: '3',
      type: 'email',
      title: 'Work Email',
      content: 'Meeting scheduled for 3 PM',
      time: '15m ago',
      isRead: true,
      priority: 'medium',
      icon: Mail,
      color: '#96ceb4'
    },
    {
      id: '4',
      type: 'calendar',
      title: 'Calendar',
      content: 'Gym session in 30 minutes',
      time: '30m ago',
      isRead: false,
      priority: 'low',
      icon: Calendar,
      color: '#feca57'
    },
    {
      id: '5',
      type: 'health',
      title: 'Health Alert',
      content: 'Time to stand up and move!',
      time: '1h ago',
      isRead: true,
      priority: 'low',
      icon: Heart,
      color: '#ff6b6b'
    },
    {
      id: '6',
      type: 'app',
      title: 'Weather Update',
      content: 'Rain expected this evening',
      time: '2h ago',
      isRead: true,
      priority: 'low',
      icon: Bell,
      color: '#a55eea'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotifications = [
        'New message from Dad: "How was your day?"',
        'Reminder: Drink water',
        'Weather alert: Sunny day ahead',
        'Fitness goal: 500 steps to go!',
        'Battery low: 15% remaining'
      ];

      const randomNotification = newNotifications[Math.floor(Math.random() * newNotifications.length)];
      
      const newNotif: Notification = {
        id: Date.now().toString(),
        type: 'app',
        title: 'System',
        content: randomNotification,
        time: 'now',
        isRead: false,
        priority: 'low',
        icon: Bell,
        color: '#26de81'
      };

      setNotifications(prev => [newNotif, ...prev.slice(0, 9)]); // Keep only 10 notifications
    }, 15000); // New notification every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-transparent backdrop-blur-sm">
        <div className="text-center py-4 watch-slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="absolute left-[78px] top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 glass-bg hover:bg-white/15 z-20"
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
          <div className="flex items-center justify-center space-x-2">
            <Bell size={16} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{unreadCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="absolute top-16 left-0 right-0 z-10 flex justify-center mb-4">
        <div className="bg-white/15 backdrop-blur-md rounded-full p-1 flex border border-white/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter('all')}
            className={`px-4 py-1 rounded-full transition-all text-xs ${
              filter === 'all' 
                ? 'bg-blue-500/30 text-white shadow-md border border-white/30' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter('unread')}
            className={`px-4 py-1 rounded-full transition-all text-xs ${
              filter === 'unread' 
                ? 'bg-red-500/30 text-white shadow-md border border-white/30' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto watch-scroll pt-28 pb-16 px-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={32} className="text-white/30 mx-auto mb-2" />
            <div className="text-white/60 text-sm">No notifications</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`glass-bg rounded-lg p-3 transition-all duration-300 border ${
                    notification.isRead 
                      ? 'border-white/10 opacity-70' 
                      : 'border-white/20 shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${notification.color}40` }}
                    >
                      <Icon size={14} style={{ color: notification.color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold text-white truncate">
                          {notification.title}
                        </div>
                        <div className="text-xs text-white/50 flex-shrink-0 ml-2">
                          {notification.time}
                        </div>
                      </div>
                      
                      <div className="text-xs text-white/80 mb-2 line-clamp-2">
                        {notification.content}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className={`w-2 h-2 rounded-full ${
                          notification.priority === 'high' ? 'bg-red-400' :
                          notification.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        
                        <div className="flex space-x-1">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="w-6 h-6 bg-green-500/20 hover:bg-green-500/30 rounded-full p-0"
                            >
                              <Check size={10} className="text-green-400" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => dismissNotification(notification.id)}
                            className="w-6 h-6 bg-red-500/20 hover:bg-red-500/30 rounded-full p-0"
                          >
                            <X size={10} className="text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationsScreen;