import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Home, Plus, Trash, CheckCircle, Circle, Calendar, Clock, AlertTriangle, ArrowLeft, Edit3, X } from 'lucide-react';

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
      description: 'Discuss project milestones',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '14:00',
      isCompleted: true,
      createdAt: new Date()
    },
    {
      id: '3',
      title: 'Buy groceries',
      description: 'Milk, bread, fruits',
      priority: 'low',
      dueDate: null,
      dueTime: null,
      isCompleted: false,
      createdAt: new Date()
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    dueTime: ''
  });

  // Simulate new tasks being added
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        const newTasks = [
          'Check emails',
          'Call dentist',
          'Review documents',
          'Plan weekend trip',
          'Update portfolio'
        ];
        
        const randomTask = newTasks[Math.floor(Math.random() * newTasks.length)];
        const newTask: Task = {
          id: Date.now().toString(),
          title: randomTask,
          description: 'Auto-generated task',
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          dueDate: Math.random() > 0.5 ? new Date().toISOString().split('T')[0] : null,
          dueTime: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : null,
          isCompleted: false,
          createdAt: new Date()
        };
        
        setTasks(prev => [newTask, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending' && task.isCompleted) return false;
    if (filter === 'completed' && !task.isCompleted) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  const toggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...formData }
          : task
      ));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        isCompleted: false,
        createdAt: new Date()
      };
      setTasks(prev => [newTask, ...prev]);
    }

    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      dueTime: ''
    });
    setShowAddForm(false);
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || ''
    });
    setShowAddForm(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400/30';
      case 'medium': return 'text-yellow-400 border-yellow-400/30';
      case 'low': return 'text-green-400 border-green-400/30';
      default: return 'text-white/60 border-white/20';
    }
  };

  const formatDueDate = (date: string | null, time: string | null) => {
    if (!date) return null;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    let dateStr = '';
    if (date === today) dateStr = 'Today';
    else if (date === tomorrow) dateStr = 'Tomorrow';
    else dateStr = new Date(date).toLocaleDateString();
    
    return time ? `${dateStr} at ${time}` : dateStr;
  };

  if (showAddForm) {
    return (
      <div className="watch-content-safe flex flex-col h-full p-4 bg-black/95 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowAddForm(false);
              setEditingTask(null);
              setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                dueTime: ''
              });
            }}
            className="rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20"
          >
            <X size={16} className="text-white" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm h-20 resize-none"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/80 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">Due Time</label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setEditingTask(null);
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white"
            >
              {editingTask ? 'Update' : 'Create'}
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
          <h2 className="text-lg font-bold text-white">Tasks</h2>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="rounded-full w-8 h-8 p-0 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
        >
          <Plus size={16} className="text-white" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
          className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
          className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto watch-scroll space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <Circle size={32} className="text-white/40 mx-auto mb-2" />
            <div className="text-sm text-white/60">No tasks found</div>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const dueInfo = formatDueDate(task.dueDate, task.dueTime);
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;
            
            return (
              <div
                key={task.id}
                className={`glass-bg rounded-lg p-3 border transition-all ${
                  task.isCompleted 
                    ? 'border-green-400/30 bg-green-400/5' 
                    : isOverdue 
                    ? 'border-red-400/30 bg-red-400/5'
                    : 'border-white/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.isCompleted ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <Circle size={16} className="text-white/60 hover:text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${
                      task.isCompleted ? 'text-white/60 line-through' : 'text-white'
                    }`}>
                      {task.title}
                    </div>
                    
                    {task.description && (
                      <div className="text-xs text-white/60 mt-1">
                        {task.description}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3 mt-2">
                      <div className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </div>
                      
                      {dueInfo && (
                        <div className={`text-xs flex items-center space-x-1 ${
                          isOverdue ? 'text-red-400' : 'text-white/60'
                        }`}>
                          {isOverdue && <AlertTriangle size={10} />}
                          <Calendar size={10} />
                          <span>{dueInfo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(task)}
                      className="w-6 h-6 p-0 bg-white/10 hover:bg-white/20 rounded"
                    >
                      <Edit3 size={10} className="text-white/70" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="w-6 h-6 p-0 bg-red-500/20 hover:bg-red-500/30 rounded"
                    >
                      <Trash size={10} className="text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-center space-x-4 py-3 border-t border-white/10 mt-2">
        <div className="text-center">
          <div className="text-sm font-bold text-white">
            {tasks.filter(t => !t.isCompleted).length}
          </div>
          <div className="text-xs text-white/60">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-green-400">
            {tasks.filter(t => t.isCompleted).length}
          </div>
          <div className="text-xs text-white/60">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white">
            {tasks.length}
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

export default TodoScreen;