import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Home, Clock, Bell, BellOff, ArrowLeft, Mic, MicOff, Volume2 } from 'lucide-react';

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

  const [currentTime, setCurrentTime] = useState(new Date());
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for alarms
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

  const handleMicPress = () => {
    if (isProcessing || isListening) return;
    
    const timer = setTimeout(() => {
      setIsListening(true);
      startVoiceInput();
    }, 100);
    
    setPressTimer(timer);
  };

  const handleMicRelease = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    
    if (isListening) {
      setIsListening(false);
      processVoiceInput();
    }
  };

  const startVoiceInput = () => {
    setTimeout(() => {
      if (isListening) {
        setIsListening(false);
        processVoiceInput();
      }
    }, 3000);
  };

  const processVoiceInput = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const commands = [
        'Alarm set: Wake up at 6:30 AM',
        'Alarm updated: Morning workout moved to 7:30 AM',
        'Alarm deleted: Old reminder removed',
        'All alarms turned off for weekend'
      ];
      
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      
      if (randomCommand.includes('set')) {
        const newAlarm: Alarm = {
          id: Date.now().toString(),
          time: '06:30',
          label: 'Wake up',
          isActive: true,
          repeatPattern: 'daily',
          createdAt: new Date()
        };
        setAlarms(prev => [newAlarm, ...prev]);
      } else if (randomCommand.includes('updated')) {
        setAlarms(prev => prev.map(alarm => 
          alarm.label.includes('Workout') ? { ...alarm, time: '07:30' } : alarm
        ));
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const toggleAlarm = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm =>
      alarm.id === alarmId ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRepeatText = (pattern: string) => {
    switch (pattern) {
      case 'once': return 'Once';
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Daily';
    }
  };

  const dismissAlarm = () => {
    setRingingAlarm(null);
  };

  const snoozeAlarm = () => {
    if (ringingAlarm) {
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

  // Ringing Alarm Screen
  if (ringingAlarm) {
    return (
      <div className="watch-content-safe flex flex-col h-full bg-gradient-to-br from-red-900/20 to-orange-900/20 animate-pulse">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Bell size={40} className="text-red-400" />
          </div>
          
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-white mb-2">
              {formatTime(ringingAlarm.time)}
            </div>
            <div className="text-lg text-white/80 mb-1">
              {ringingAlarm.label}
            </div>
            <div className="text-sm text-white/60">
              {getRepeatText(ringingAlarm.repeatPattern)}
            </div>
          </div>
          
          <div className="flex space-x-6">
            <Button
              onClick={snoozeAlarm}
              className="w-16 h-16 rounded-full bg-orange-500/20 hover:bg-orange-500/30 border-2 border-orange-400"
            >
              <div className="text-center">
                <Clock size={16} className="text-orange-400 mx-auto mb-1" />
                <div className="text-xs text-orange-400">Snooze</div>
              </div>
            </Button>
            
            <Button
              onClick={dismissAlarm}
              className="w-16 h-16 rounded-full bg-red-500/20 hover:bg-red-500/30 border-2 border-red-400"
            >
              <div className="text-center">
                <BellOff size={16} className="text-red-400 mx-auto mb-1" />
                <div className="text-xs text-red-400">Stop</div>
              </div>
            </Button>
          </div>
        </div>
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
        
        {/* Voice Input Button */}
        <Button
          variant="ghost"
          size="sm"
          onMouseDown={handleMicPress}
          onMouseUp={handleMicRelease}
          onMouseLeave={handleMicRelease}
          onTouchStart={handleMicPress}
          onTouchEnd={handleMicRelease}
          disabled={isProcessing}
          className={`rounded-full w-8 h-8 p-0 transition-all duration-300 ${
            isListening 
              ? 'bg-cyan-400/20 border border-cyan-400 animate-pulse' 
              : isProcessing
              ? 'bg-white/5'
              : 'bg-white/10 hover:bg-cyan-400/20 hover:border-cyan-400/50'
          }`}
        >
          {isListening ? (
            <MicOff size={12} className="text-cyan-400" />
          ) : (
            <Mic size={12} className={isProcessing ? "text-white/40" : "text-white/70"} />
          )}
        </Button>
      </div>

      {/* Voice Status */}
      {(isListening || isProcessing) && (
        <div className="text-center mb-4">
          <div className={`text-xs font-light ${
            isListening ? 'text-cyan-400 animate-pulse' : 'text-white/60'
          }`}>
            {isListening ? '● Listening...' : '● Processing...'}
          </div>
        </div>
      )}

      {/* Current Time */}
      <div className="text-center mb-4 py-3 glass-bg rounded-lg">
        <div className="text-xl font-mono font-bold text-white">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })}
        </div>
        <div className="text-xs text-white/60">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Alarms List */}
      <div className="flex-1 overflow-y-auto watch-scroll space-y-3">
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`glass-bg rounded-lg p-4 border transition-all duration-300 ${
                alarm.isActive 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-white/20 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-2xl font-mono font-bold text-white">
                      {formatTime(alarm.time)}
                    </div>
                    <Switch
                      checked={alarm.isActive}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
                      className="scale-90"
                    />
                  </div>
                  
                  <div className="text-sm font-medium text-white mb-1">
                    {alarm.label}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">
                      {getRepeatText(alarm.repeatPattern)}
                    </div>
                    <div className={`flex items-center space-x-1 text-xs ${
                      alarm.isActive ? 'text-primary' : 'text-white/40'
                    }`}>
                      {alarm.isActive ? (
                        <>
                          <Bell size={10} />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <BellOff size={10} />
                          <span>Off</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-white/60 text-sm mb-2">No alarms set</div>
            <div className="text-white/40 text-xs">Use voice commands to add alarms</div>
          </div>
        )}
      </div>

      {/* Stats & Controls */}
      <div className="flex justify-between items-center py-3 border-t border-white/10 mt-2">
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-sm font-bold text-primary">
              {alarms.filter(a => a.isActive).length}
            </div>
            <div className="text-xs text-white/60">Active</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-white">
              {alarms.length}
            </div>
            <div className="text-xs text-white/60">Total</div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="rounded-full w-10 h-10 p-0 glass-bg hover:bg-white/15"
        >
          <Home size={16} className="text-white" />
        </Button>
      </div>

      {/* Voice hint */}
      <div className="text-center py-2">
        <div className="text-xs text-white/40">
          Hold mic: "Set alarm", "Turn off alarm", "Snooze 5 minutes"
        </div>
      </div>

      {/* Listening indicator overlay */}
      {isListening && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-cyan-600/5 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 border-2 border-cyan-400/30 rounded-full animate-ping" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmScreen;