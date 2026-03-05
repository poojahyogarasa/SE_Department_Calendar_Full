import { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Flame,
  CheckSquare,
  Pencil,
  Trash2,
  LayoutDashboard,
  Check,
  X,
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { useAuthStore } from '../../stores/useAuthStore';
import { getStoredTasks, saveTasks } from '../../utils/storage';
import type { Task, TaskList, TaskPriority } from '../../types';

export default function TasksPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? 'guest';

  const [tasks, setTasks] = useState<Task[]>(() => getStoredTasks(userId));
  const [activeList, setActiveList] = useState<TaskList>('my-day');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');

  // Persist whenever tasks change
  useEffect(() => {
    saveTasks(userId, tasks);
  }, [tasks, userId]);

  // Reload tasks when user changes
  useEffect(() => {
    setTasks(getStoredTasks(userId));
  }, [userId]);

  const listActiveClasses: Record<TaskList, string> = {
    'my-day':    'bg-primary text-white',
    'important': 'bg-primary text-white',
    'planned':   'bg-primary text-white',
    'tasks':     'bg-primary text-white',
  };

  const lists: { id: TaskList; label: string; icon: typeof CheckSquare }[] = [
    { id: 'my-day',    label: 'My Day',    icon: LayoutDashboard },
    { id: 'important', label: 'Important', icon: Flame },
    { id: 'planned',   label: 'Planned',   icon: Calendar },
    { id: 'tasks',     label: 'Tasks',     icon: CheckSquare },
  ];

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      userId,
      title: newTaskTitle.trim(),
      completed: false,
      priority: 'medium',
      list: activeList,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
    setEditPriority(task.priority ?? 'medium');
  };

  const saveEdit = (taskId: string) => {
    if (!editTitle.trim()) return;
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, title: editTitle.trim(), dueDate: editDueDate ? new Date(editDueDate) : undefined, priority: editPriority }
        : t
    ));
    setEditingId(null);
  };

  const cancelEdit = () => { setEditingId(null); };

  const filteredTasks = tasks
    .filter(t => (activeList === 'tasks' ? true : t.list === activeList))
    .filter(t => {
      if (filter === 'completed') return t.completed;
      if (filter === 'pending') return !t.completed;
      return true;
    });

  const isOverdue = (date?: Date) => {
    if (!date) return false;
    return isPast(new Date(date)) && !isToday(new Date(date));
  };

  const filterTabs: { key: 'all' | 'completed' | 'pending'; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending',   label: 'Pending' },
  ];

  // BUG_024: Removed unnecessary second sidebar — layout already has the main sidebar
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">My Tasks</h1>

          {/* Add Task Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={addTask}
              className="btn-primary flex items-center gap-2 px-4"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Tabs (underline style) */}
        <div className="flex border-b border-gray-200 px-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                filter === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-1">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 py-3 px-2 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {editingId === task.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="input-field flex-1 text-sm"
                      autoFocus
                    />
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="input-field w-36 text-sm"
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                      className="input-field w-28 text-sm"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <button onClick={() => saveEdit(task.id)} className="p-1.5 bg-primary text-white rounded-lg">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="p-1.5 bg-gray-100 rounded-lg">
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        task.completed ? 'bg-primary border-primary' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    {/* Title */}
                    <p className={`flex-1 text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </p>

                    {/* Overdue badge */}
                    {task.dueDate && isOverdue(task.dueDate as Date) && !task.completed && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 flex-shrink-0">
                        Overdue: {format(new Date(task.dueDate), 'yyyy-MM-dd')}
                      </span>
                    )}

                    {/* Actions */}
                    <button onClick={() => startEdit(task)} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                      <Pencil className="w-4 h-4 text-gray-400 hover:text-primary" />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </>
                )}
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No tasks found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
