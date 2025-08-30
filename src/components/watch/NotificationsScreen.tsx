import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Bell, Mail, Phone, Calendar, Heart, ArrowLeft, X, Check } from 'lucide-react';

interface NotificationsScreenProps {
  onNavigate: (screen: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'call' | 'email' | 'calendar' | 'health' | 'system';
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NotificationsScreen = ({ onNavigate }: NotificationsScreenProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Sarah Wilson',
      message: 'Hey! Are we still on for lunch today?',
      type: 'message',
      timestamp: new Date(Date.now() - 5 * 60000),
      isRead: false,
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Missed Call',
      message: 'Mom called 2 times',
      type: 'call',
      timestamp: new Date(Date.now() - 15 * 60000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '3',
      title: 'Health Alert',
      message: 'Heart rate elevated: 95 BPM',
      type: 'health',
      timestamp: new Date(Date.now() - 30 * 60000),
      isRead: true,
      priority: 'high'
    },
    {
      id: '4',
      title: 'Calendar Reminder',
      message: 'Meeting with team in 30 minutes',
      type: 'calendar',
      timestamp: new Date(Date.now() - 45 * 60000),
      isRead: false,
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Email',
      message: 'New message from john@company.com',
      type: 'email',
      timestamp: new Date(Date.now() - 60 * 60000),
      isRead: true,
      priority: 'low'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 15 seconds
        const newNotifications = [
          {
            title: 'Alex Chen',
            message: 'Thanks for the help today!',
            type: 'message' as const,
            priority: 'medium' as const
          },
          {
            title: 'Workout Reminder',
            message: 'Time for your evening workout',
            type: 'system' as const,
            priority: 'low' as const
          },
          {
            title: 'Dr. Smith',
            message: 'Appointment confirmed for tomorrow',
            type: 'message' as const,
            priority: 'high' as const
          },
          {
            title: 'Battery Low',
            message: 'Watch battery at 15%',
            type: 'system' as const,
            priority: 'medium' as const
          },
          {
            title: 'Step Goal',
            message: 'You reached 10,000 steps!',
            type: 'health' as const,
            priority: 'low' as const
          }
        ];
        
        const randomNotif = newNotifications[Math.floor(Math.random() * newNotifications.length)];
        const newNotification: Notification = {
          id: Date.now().toString(),
          ...randomNotif,
          timestamp: new Date(),
          isRead: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.isRead) return false;
    return true;
  });

  const markAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notifId ? { ...notif, isRead: true } : notif
    ));
  };

  const dismissNotification = (notifId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notifId));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return Mail;
      case 'call': return Phone;
      case 'email': return Mail;
      case 'calendar': return Calendar;
      case 'health': return Heart;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-red-400/30 bg-red-400/5';
    if (priority === 'medium') return 'border-yellow-400/30 bg-yellow-400/5';
    
    switch (type) {
      case 'message': return 'border-blue-400/30 bg-blue-400/5';
      case 'call': return 'border-green-400/30 bg-green-400/5';
      case 'health': return 'border-red-400/30 bg-red-400/5';
      case 'calendar': return 'border-purple-400/30 bg-purple-400/5';
      default: return 'border-white/20';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="watch-content-safe flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20"
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
          <h2 className="text-lg font-bold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{unreadCount}</span>
            </div>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="ghost"
            size="sm"
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded"
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        <Button
          onClick={() => setFilter('all')}
          variant="ghost"
          size="sm"
          className={`flex-1 text-xs ${
            filter === 'all' 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          All ({notifications.length})
        </Button>
        <Button
          onClick={() => setFilter('unread')}
          variant="ghost"
          size="sm"
          className={`flex-1 text-xs ${
            filter === 'unread' 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto watch-scroll space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={32} className="text-white/40 mx-auto mb-2" />
            <div className="text-sm text-white/60">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </div>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`glass-bg rounded-lg p-3 border transition-all ${
                  getNotificationColor(notification.type, notification.priority)
                } ${!notification.isRead ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Icon size={14} className={
                      notification.priority === 'high' ? 'text-red-400' :
                      notification.priority === 'medium' ? 'text-yellow-400' :
                      'text-primary'
                    } />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${
                      notification.isRead ? 'text-white/70' : 'text-white'
                    }`}>
                      {notification.title}
                    </div>
                    <div className={`text-xs mt-1 ${
                      notification.isRead ? 'text-white/50' : 'text-white/70'
                    }`}>
                      {notification.message}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      {formatTimestamp(notification.timestamp)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="w-6 h-6 p-0 bg-green-500/20 hover:bg-green-500/30 rounded"
                      >
                        <Check size={10} className="text-green-400" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                      className="w-6 h-6 p-0 bg-red-500/20 hover:bg-red-500/30 rounded"
                    >
                      <X size={10} className="text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Home Button */}
      <div className="flex justify-center pt-4">
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