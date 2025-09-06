import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Home, Plus, Trash, Clock, Bell, BellOff, ArrowLeft, Edit3, Volume2 } from 'lucide-react';

interface AlarmScreenProps {
  onNavigate: (screen: string) => void;
}

interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  repeatPattern: 'once' | 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}

const AlarmScreen = ({ onNavigate }: AlarmScreenProps) => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: '1',
      time: '07:00',
      label: 'Morning Workout',
      isActive: true,
      repeatPattern: 'daily',
      createdAt: new Date()
    },
    {
      id: '2',
      time: '14:30',
      label: 'Lunch Break',
      isActive: true,
      repeatPattern: 'daily',
      createdAt: new Date()
    },
    {
      id: '3',
      time: '22:00',
      label: 'Sleep Time',
      isActive: false,
      repeatPattern: 'daily',
      createdAt: new Date()
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    time: '',
    label: '',
    repeatPattern: 'daily' as 'once' | 'daily' | 'weekly' | 'monthly'
  });

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for alarm triggers
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTimeStr = now.toTimeString().slice(0, 5);
      
      alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentTimeStr && !ringingAlarm) {
          setRingingAlarm(alarm);
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms, ringingAlarm]);

  const toggleAlarm = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const deleteAlarm = (alarmId: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time || !formData.label.trim()) return;

    if (editingAlarm) {
      setAlarms(prev => prev.map(alarm => 
        alarm.id === editingAlarm.id 
          ? { ...alarm, ...formData }
          : alarm
      ));
      setEditingAlarm(null);
    } else {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        createdAt: new Date()
      };
      setAlarms(prev => [newAlarm, ...prev]);
    }

    setFormData({
      time: '',
      label: '',
      repeatPattern: 'daily'
    });
    setShowAddForm(false);
  };

  const startEdit = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setFormData({
      time: alarm.time,
      label: alarm.label,
      repeatPattern: alarm.repeatPattern
    });
    setShowAddForm(true);
  };

  const dismissAlarm = () => {
    setRingingAlarm(null);
  };

  const snoozeAlarm = () => {
    if (ringingAlarm) {
      // Add 5 minutes to current time for snooze
      const snoozeTime = new Date(Date.now() + 5 * 60000);
      const snoozeTimeStr = snoozeTime.toTimeString().slice(0, 5);
      
      const snoozeAlarm: Alarm = {
        ...ringingAlarm,
        id: Date.now().toString(),
        time: snoozeTimeStr,
        label: `${ringingAlarm.label} (Snoozed)`,
        repeatPattern: 'once'
      };
      
      setAlarms(prev => [snoozeAlarm, ...prev]);
      setRingingAlarm(null);
    }
  };

  const getRepeatText = (pattern: string) => {
    switch (pattern) {
      case 'once': return 'Once';
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Once';
    }
  };

  const getTimeUntilAlarm = (alarmTime: string) => {
    const now = new Date();
    const [hours, minutes] = alarmTime.split(':').map(Number);
    const alarmDate = new Date();
    alarmDate.setHours(hours, minutes, 0, 0);
    
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    
    const diff = alarmDate.getTime() - now.getTime();
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursUntil > 0) {
      return `${hoursUntil}h ${minutesUntil}m`;
    }
    return `${minutesUntil}m`;
  };

  // Ringing Alarm Overlay
  if (ringingAlarm) {
    return (
      <div className="watch-content-safe flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-500/30 to-orange-500/30 p-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Bell size={32} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {ringingAlarm.time}
          </div>
          <div className="text-lg text-white/90 mb-1">
            {ringingAlarm.label}
          </div>
          <div className="text-sm text-white/70">
            {getRepeatText(ringingAlarm.repeatPattern)}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={snoozeAlarm}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full"
          >
            Snooze 5m
          </Button>
          <Button
            onClick={dismissAlarm}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full"
          >
            Dismiss
          </Button>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="watch-content-safe flex flex-col h-full p-4 bg-black/95 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {editingAlarm ? 'Edit Alarm' : 'New Alarm'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowAddForm(false);
              setEditingAlarm(null);
              setFormData({
                time: '',
                label: '',
                repeatPattern: 'daily'
              });
            }}
            className="rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20"
          >
            <X size={16} className="text-white" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-2">Time *</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">Label *</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              placeholder="Enter alarm label"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">Repeat</label>
            <select
              value={formData.repeatPattern}
              onChange={(e) => setFormData(prev => ({ ...prev, repeatPattern: e.target.value as 'once' | 'daily' | 'weekly' | 'monthly' }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setEditingAlarm(null);
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white"
            >
              {editingAlarm ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

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
          <h2 className="text-lg font-bold text-white">Alarms</h2>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="rounded-full w-8 h-8 p-0 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
        >
          <Plus size={16} className="text-white" />
        </Button>
      </div>

      {/* Current Time */}
      <div className="text-center mb-4 glass-bg rounded-lg p-3">
        <div className="text-2xl font-bold text-white">
          {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
        </div>
        <div className="text-sm text-white/60">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Alarms List */}
      <div className="flex-1 overflow-y-auto watch-scroll space-y-3">
        {alarms.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={32} className="text-white/40 mx-auto mb-2" />
            <div className="text-sm text-white/60">No alarms set</div>
          </div>
        ) : (
          alarms.map((alarm) => {
            const timeUntil = alarm.isActive ? getTimeUntilAlarm(alarm.time) : null;
            
            return (
              <div
                key={alarm.id}
                className={`glass-bg rounded-lg p-4 border transition-all ${
                  alarm.isActive 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'border-white/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-xl font-bold text-white">
                        {alarm.time}
                      </div>
                      {alarm.isActive ? (
                        <Bell size={16} className="text-primary" />
                      ) : (
                        <BellOff size={16} className="text-white/40" />
                      )}
                    </div>
                    
                    <div className="text-sm text-white/80 mb-1">
                      {alarm.label}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-white/60">
                        {getRepeatText(alarm.repeatPattern)}
                      </div>
                      {timeUntil && (
                        <div className="text-xs text-primary">
                          in {timeUntil}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Switch
                      checked={alarm.isActive}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
                      className="scale-75"
                    />
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(alarm)}
                        className="w-6 h-6 p-0 bg-white/10 hover:bg-white/20 rounded"
                      >
                        <Edit3 size={10} className="text-white/70" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlarm(alarm.id)}
                        className="w-6 h-6 p-0 bg-red-500/20 hover:bg-red-500/30 rounded"
                      >
                        <Trash size={10} className="text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-center space-x-6 py-3 border-t border-white/10 mt-2">
        <div className="text-center">
          <div className="text-sm font-bold text-primary">
            {alarms.filter(a => a.isActive).length}
          </div>
          <div className="text-xs text-white/60">Active</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white/60">
            {alarms.filter(a => !a.isActive).length}
          </div>
          <div className="text-xs text-white/60">Inactive</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white">
            {alarms.length}
          </div>
          <div className="text-xs text-white/60">Total</div>
        </div>
      </div>

      {/* Home Button */}
      <div className="flex justify-center pt-2">
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

export default AlarmScreen;