import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, Plus, Trash, CheckCircle, Circle, Calendar, Clock, AlertTriangle, ArrowLeft, Edit3, X, Target, CheckSquare } from 'lucide-react';
import { fetchTodos, createTodo, updateTodo, deleteTodo as deleteTodoAPI, type TodoFromAPI } from '@/api/api';

interface TodoScreenProps {
  onNavigate: (screen: string) => void;
}

interface Task {
  task_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
  // Additional fields used throughout the component (camelCase duplicates for UI convenience)
  id?: string;
  dueDate: string | null;
  dueTime: string | null;
  isCompleted: boolean;
  createdAt: Date;
}

//const API_BASE_URL = 'http://localhost:3000/api';
//ChangeLOCAL TO GLOBAl
const API_BASE_URL = 'https://fuznex.onrender.com/api';
const TodoScreen = ({ onNavigate }: TodoScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [loading, setLoading] = useState(true);
  const [displayedTasks, setDisplayedTasks] = useState(7);
  const [hasMore, setHasMore] = useState(true);
  const [completingTask, setCompletingTask] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    dueTime: ''
  });

  // Fetch tasks from backend on mount
  useEffect(() => {
    setLoading(true);
    fetchTodos()
      .then(apiTasks => {
        const mapped: Task[] = apiTasks.map(t => ({
          id: String(t.task_id),
          title: t.title,
          description: t.description || '',
          priority: t.priority,
          dueDate: t.due_date || null,
          dueTime: null,
          isCompleted: t.is_completed,
          createdAt: new Date(t.created_at)
        }));
        setTasks(mapped);
      })
      .catch(() => {
        // Fallback to demo data if API fails
        setTasks([
          { id: '1', title: 'Morning workout', description: 'Complete 30-minute cardio', priority: 'high', dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], dueTime: '07:00', isCompleted: false, createdAt: new Date() },
          { id: '2', title: 'Team meeting', description: 'Discuss milestones', priority: 'medium', dueDate: new Date().toISOString().split('T')[0], dueTime: '14:00', isCompleted: true, createdAt: new Date() },
          { id: '3', title: 'Buy groceries', description: '', priority: 'low', dueDate: null, dueTime: null, isCompleted: false, createdAt: new Date() },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Sort tasks: overdue -> upcoming -> future -> completed
  const sortedTasks = [...tasks].sort((a, b) => {
    const now = new Date();
    const getTaskPriority = (task: Task) => {
      if (task.isCompleted) return 4; // Completed last
      if (!task.dueDate) return 3; // No due date tasks

      const dueDate = new Date(task.dueDate);
      if (dueDate < now) return 1; // Overdue first
      if (dueDate.toDateString() === now.toDateString()) return 2; // Today/upcoming
      return 3; // Future tasks
    };

    const priorityA = getTaskPriority(a);
    const priorityB = getTaskPriority(b);

    if (priorityA !== priorityB) return priorityA - priorityB;

    // Within same category, sort by due date/time
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }

    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const filteredTasks = sortedTasks.filter(task => {
    if (filter === 'pending' && task.isCompleted) return false;
    if (filter === 'completed' && !task.isCompleted) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  const visibleTasks = filteredTasks.slice(0, displayedTasks);

  useEffect(() => {
    setHasMore(filteredTasks.length > displayedTasks);
  }, [filteredTasks.length, displayedTasks]);

  const loadMoreTasks = () => {
    if (hasMore) {
      setLoading(true);
      setTimeout(() => {
        setDisplayedTasks(prev => prev + 7);
        setLoading(false);
      }, 800);
    }
  };

  const toggleComplete = (taskId: string) => {
    if (completingTask) return;

    setCompletingTask(taskId);
    const task = tasks.find(t => t.id === taskId);
    const newCompleted = task ? !task.isCompleted : false;

    // Optimistic update
    setTimeout(() => {
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, isCompleted: newCompleted } : t
      ));
      setTimeout(() => setCompletingTask(null), 300);
    }, 200);

    // Sync to backend
    const numId = parseInt(taskId);
    if (!isNaN(numId)) {
      updateTodo(numId, { is_completed: newCompleted } as any).catch(() => { });
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    const numId = parseInt(taskId);
    if (!isNaN(numId)) {
      deleteTodoAPI(numId).catch(() => { });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id
          ? { ...task, ...formData }
          : task
      ));
      const numId = parseInt(editingTask.id);
      if (!isNaN(numId)) {
        updateTodo(numId, {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          due_date: formData.dueDate || undefined,
        } as any).catch(() => { });
      }
      setEditingTask(null);
    } else {
      // Optimistic local add
      const tempTask: Task = {
        id: Date.now().toString(),
        ...formData,
        isCompleted: false,
        createdAt: new Date()
      };
      setTasks(prev => [tempTask, ...prev]);

      // Create on backend
      createTodo({
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        due_date: formData.dueDate || undefined,
      }).then(created => {
        // Replace temp task with real one
        setTasks(prev => prev.map(t =>
          t.id === tempTask.id ? { ...t, id: String(created.task_id) } : t
        ));
      }).catch(() => { });
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
      <div className="watch-content-safe flex flex-col h-full p-4 bg-gradient-to-br from-blue-400/10 via-white/5 to-blue-200/10 backdrop-blur-sm animate-gradient bg-[length:400%_400%] overflow-x-hidden">
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

        <div className="flex-1 space-y-4 overflow-x-hidden">
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
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-content-safe flex flex-col h-full p-4 bg-gradient-to-br from-blue-400/10 via-white/5 to-blue-200/10 backdrop-blur-sm animate-gradient bg-[length:400%_400%] overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 ">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('features')}
          className="rounded-full w-7 h-7 p-0 bg-white/10 hover:bg-white "
        >
          <ArrowLeft size={12} className="text-white" />
        </Button>
        <h2 className=" text-lg font-semibold text-white ">Tasks</h2>

        {/* Home Button */}
        <div className="relative right-[205px] justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('features')}
            className="rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/15"
          >
            <ArrowLeft size={14} className="text-white" />
          </Button>
        </div>

      </div>

      {/* Stats in corner */}
      <div className="flex justify-center space-x-2 mb-1">
        <div className="bg-white/5 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Clock size={8} className="text-yellow-400" />
          <span className="text-xs text-white font-medium">{tasks.filter(t => !t.isCompleted).length}</span>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <CheckSquare size={8} className="text-green-400" />
          <span className="text-xs text-white font-medium">{tasks.filter(t => t.isCompleted).length}</span>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Target size={8} className="text-white/60" />
          <span className="text-xs text-white font-medium">{tasks.length}</span>
        </div>
      </div>



      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
        {visibleTasks.length === 0 ? (
          <div className="text-center py-8">
            <Circle size={32} className="text-white/40 mx-auto mb-2" />
            <div className="text-sm text-white/60">No tasks found</div>
          </div>
        ) : (
          <>
            {visibleTasks.map((task) => {
              const dueInfo = formatDueDate(task.dueDate, task.dueTime);
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;
              const isCompleting = completingTask === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => toggleComplete(task.id)}
                  className={`bg-white/10 rounded-lg border transition-all duration-500 cursor-pointer hover:scale-[0.987]   ${isCompleting
                    ? 'animate-pulse scale-105 brightness-110'
                    : ''
                    } ${task.isCompleted
                      ? 'border-cyan-800/30 bg-gray-100/5 opacity-90 backdrop-blur-sm mb-4 '
                      : isOverdue
                        ? 'border-orange-400/30 bg-red-800/5 backdrop-blur-sm mb-3'
                        : 'border-green-400/30 bg-green-800/5 backdrop-blur-xs mb-3'
                    } ${task.description ? 'p-3' : 'p-2'}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0">
                      {isCompleting ? (
                        <div className="animate-spin">
                          <Circle size={14} className="text-blue-400" />
                        </div>
                      ) : task.isCompleted ? (
                        <CheckCircle size={14} className="text-green-400 animate-bounce" />
                      ) : (
                        <Circle size={14} className="text-white/60" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${task.isCompleted ? 'text-white/60 line-through' : 'text-white'
                        }`}>
                        {task.title}
                      </div>

                      {task.description && (
                        <div className="text-xs text-white/50 mt-0.5 leading-tight">
                          {task.description.length > 60
                            ? <>
                              {task.description.slice(0, 60)}…
                              <div className="text-[10px] text-cyan-400 mt-0.5">View details in phone</div>
                            </>
                            : task.description
                          }
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {dueInfo ? (
                          <div className={`text-[11px] flex items-center space-x-1 ${isOverdue ? 'text-orange-200' : 'text-white-500'
                            }`}>
                            {isOverdue && <AlertTriangle size={8} />}
                            <Calendar size={8} />
                            <span>{dueInfo}</span>
                          </div>
                        ) : (
                          <div className={`text-[9px] px-1.5 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </div>
                        )}

                        {dueInfo && (
                          <div className={`text-xs px-1.5 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </div>
                        )}
                      </div>


                    </div>

                    <div className="flex flex-col space-y-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.task_id)}
                        className="w-5 h-5 p-0 bg-red-500/20 hover:bg-red-500/30 rounded"
                      >
                        <Trash size={8} className="text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading shimmer */}
            {loading && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="w-4 h-4 rounded-full bg-white/20" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-3/4 bg-white/20" />
                        <Skeleton className="h-2 w-1/2 bg-white/10" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-4 w-8 rounded-full bg-white/10" />
                          <Skeleton className="h-4 w-16 bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* Load more button */}
            {hasMore && !loading && (
              <Button
                onClick={loadMoreTasks}
                variant="ghost"
                className="w-full mt-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 mb-3 "
              >
                Load more ({filteredTasks.length - displayedTasks} remaining)
              </Button>
            )}

          </>

        )}

        <div className="h-16 pb-16 text-center text-xs text-white/50 italic">
          <div className="text-center text-xs text-white/60 py-4">
            For more information and changes,
            <br />
            please check your phone
          </div>
        </div>
      </div>



    </div>
  );
};

export default TodoScreen;