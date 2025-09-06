import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Home, CheckCircle, Circle, Clock, AlertTriangle, ArrowLeft, Mic, MicOff } from 'lucide-react';

interface TodoScreenProps {
  onNavigate: (screen: string) => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  dueTime: string | null;
  isCompleted: boolean;
  createdAt: Date;
}

const TodoScreen = ({ onNavigate }: TodoScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Morning workout',
      description: 'Complete 30-minute cardio session',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '07:00',
      isCompleted: false,
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Team meeting',
      description: 'Discuss project milestones with team',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '14:00',
      isCompleted: true,
      createdAt: new Date()
    },
    {
      id: '3',
      title: 'Buy groceries',
      description: 'Milk, bread, fruits, vegetables',
      priority: 'low',
      dueDate: null,
      dueTime: null,
      isCompleted: false,
      createdAt: new Date()
    }
  ]);

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

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
    
    // Simulate processing voice command
    setTimeout(() => {
      const commands = [
        'Task added: Call dentist at 3 PM',
        'Task completed: Morning workout',
        'Task updated: Buy groceries priority changed to high',
        'Task deleted: Old reminder removed'
      ];
      
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      
      // Simulate task action based on voice command
      if (randomCommand.includes('added')) {
        const newTask: Task = {
          id: Date.now().toString(),
          title: 'Call dentist',
          description: 'Schedule routine checkup',
          priority: 'medium',
          dueDate: new Date().toISOString().split('T')[0],
          dueTime: '15:00',
          isCompleted: false,
          createdAt: new Date()
        };
        setTasks(prev => [newTask, ...prev]);
      } else if (randomCommand.includes('completed')) {
        setTasks(prev => prev.map(task => 
          task.title.includes('workout') ? { ...task, isCompleted: true } : task
        ));
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const toggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatDueTime = (dueDate: string | null, dueTime: string | null) => {
    if (!dueDate || !dueTime) return 'No due time';
    
    const today = new Date().toISOString().split('T')[0];
    const timeDisplay = new Date(`2000-01-01T${dueTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    if (dueDate === today) {
      return `Today ${timeDisplay}`;
    } else {
      const date = new Date(dueDate);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${timeDisplay}`;
    }
  };

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

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
          <h2 className="text-lg font-bold text-white">Tasks</h2>
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

      {/* Task List */}
      <div className="flex-1 overflow-y-auto watch-scroll space-y-3">
        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-white/60 font-medium">ACTIVE TASKS</div>
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="glass-bg rounded-lg p-3 border border-white/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComplete(task.id)}
                      className="w-6 h-6 p-0 rounded-full border border-white/30 hover:border-green-400 transition-colors"
                    >
                      <Circle size={12} className="text-white/60" />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white mb-1">
                        {task.title}
                      </div>
                      <div className="text-xs text-white/60 mb-2">
                        {task.description}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-white/50">
                          <Clock size={10} />
                          <span>{formatDueTime(task.dueDate, task.dueTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-white/60 font-medium">COMPLETED</div>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="glass-bg rounded-lg p-3 border border-white/20 opacity-60"
              >
                <div className="flex items-start space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComplete(task.id)}
                    className="w-6 h-6 p-0 rounded-full bg-green-500/20 border border-green-400"
                  >
                    <CheckCircle size={12} className="text-green-400" />
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white/70 line-through mb-1">
                      {task.title}
                    </div>
                    <div className="text-xs text-white/50">
                      {task.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <div className="text-white/60 text-sm mb-2">No tasks yet</div>
            <div className="text-white/40 text-xs">Use voice commands to add tasks</div>
          </div>
        )}
      </div>

      {/* Stats & Controls */}
      <div className="flex justify-between items-center py-3 border-t border-white/10 mt-2">
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-sm font-bold text-primary">
              {activeTasks.length}
            </div>
            <div className="text-xs text-white/60">Active</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-green-400">
              {completedTasks.length}
            </div>
            <div className="text-xs text-white/60">Done</div>
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
          Hold mic: "Add task", "Mark complete", "Delete task"
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

export default TodoScreen;