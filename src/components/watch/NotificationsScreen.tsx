import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Bell, Mail, Phone, Calendar, Heart, ArrowLeft, X, Check } from 'lucide-react';
import { fetchNotifications, markNotificationRead, deleteNotificationAPI, type NotificationFromAPI } from '@/api/api';

// Update the interface
interface NotificationsScreenProps {
  onNavigate: (screen: string) => void;
  setUnreadCount?: (count: number) => void; // Add this prop
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

const NotificationsScreen = ({ onNavigate, setUnreadCount }: NotificationsScreenProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Fetch notifications from backend on mount
  useEffect(() => {
    fetchNotifications()
      .then(apiNotifs => {
        const mapped: Notification[] = apiNotifs.map(n => ({
          id: String(n.notification_id),
          title: n.title || 'Notification',
          message: n.message || '',
          type: 'system' as const,
          timestamp: new Date(n.reminder_time || n.created_at),
          isRead: n.is_read,
          priority: n.is_important ? 'high' as const : 'medium' as const
        }));
        setNotifications(mapped);
      })
      .catch(() => {
        // Fallback to demo data
        setNotifications([
          { id: '1', title: 'Sarah Wilson', message: 'Hey! Are we still on for lunch today?', type: 'message', timestamp: new Date(Date.now() - 5 * 60000), isRead: false, priority: 'medium' },
          { id: '2', title: 'Missed Call', message: 'Mom called 2 times', type: 'call', timestamp: new Date(Date.now() - 15 * 60000), isRead: false, priority: 'high' },
          { id: '3', title: 'Health Alert', message: 'Heart rate elevated: 95 BPM', type: 'health', timestamp: new Date(Date.now() - 30 * 60000), isRead: true, priority: 'high' },
          { id: '4', title: 'Calendar Reminder', message: 'Meeting with team in 30 minutes', type: 'calendar', timestamp: new Date(Date.now() - 45 * 60000), isRead: false, priority: 'medium' },
        ]);
      });
  }, []);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.isRead) return false;
    return true;
  });

  const markAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notifId ? { ...notif, isRead: true } : notif
    ));
    const numId = parseInt(notifId);
    if (!isNaN(numId)) {
      markNotificationRead(numId).catch(() => { });
    }
  };

  const dismissNotification = (notifId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notifId));
    const numId = parseInt(notifId);
    if (!isNaN(numId)) {
      deleteNotificationAPI(numId).catch(() => { });
    }
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

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Inside the component, use useEffect to update the parent component
  useEffect(() => {
    // Update the parent component with the unread count
    if (setUnreadCount) {
      setUnreadCount(unreadCount);
    }
  }, [unreadCount, setUnreadCount]);

  return (
    <div className="watch-content-safe flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="rounded-full w-6 h-6 p-0 bg-white/10 hover:bg-white/20"
          >
            <ArrowLeft size={12} className="text-white" />
          </Button>
          <h2 className="text-base font-bold text-white">Notifications</h2>

        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative flex space-x-1 mb-2 w-[75%] mx-auto rounded-full  overflow-hidden">
        <Button
          onClick={() => setFilter('all')}
          variant="ghost"
          size="sm"
          className={`flex-1 text-[12px] px-1 ${filter === 'all'
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-white/10 text-white/70 hover:bg-white/30'
            }`}
        >
          All ({notifications.length})
        </Button>
        <Button
          onClick={() => setFilter('unread')}
          variant="ghost"
          size="sm"
          className={`flex-1 text-[12px] px-1 ${filter === 'unread'
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
        >
          Unread ({unreadCount})
        </Button>

        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="ghost"
            size="sm"
            className="absolute -right-0 z-40 top-full mt-1 rounded-full w-6 h-6 p-0 bg-white/10 hover:bg-white/20"
          >
            <Check size={12} className="text-white" />
          </Button>
        )}
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
                onClick={() => markAsRead(notification.id)}
                className={`glass-bg rounded-lg p-3 border transition-all cursor-pointer ${getNotificationColor(notification.type, notification.priority)
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
                    <div className={`text-sm font-medium ${notification.isRead ? 'text-white/70' : 'text-white'
                      }`}>
                      {notification.title}
                    </div>
                    <div className={`text-xs mt-1 ${notification.isRead ? 'text-white/50' : 'text-white/70'
                      }`}>
                      {notification.message}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      {formatTimestamp(notification.timestamp)}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1" onClick={(e) => e.stopPropagation()}>
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


    </div>
  );
};

export default NotificationsScreen;