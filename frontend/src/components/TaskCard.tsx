import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { cn } from '../utils/cn';
import { formatRelativeDate, isOverdue } from '../utils/date';
import { useUpdateTask, useDeleteTask } from '../hooks/useTasks';

interface TaskCardProps {
  task: Task;
  index?: number;
}

const statusConfig: Record<TaskStatus, { label: string; className: string; icon: typeof Circle }> = {
  TODO: { label: 'To Do', className: 'badge-todo', icon: Circle },
  IN_PROGRESS: { label: 'In Progress', className: 'badge-in-progress', icon: Clock },
  COMPLETED: { label: 'Completed', className: 'badge-completed', icon: CheckCircle },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'badge-low' },
  MEDIUM: { label: 'Medium', className: 'badge-medium' },
  HIGH: { label: 'High', className: 'badge-high' },
};

export default function TaskCard({ task, index = 0 }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;
  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'COMPLETED';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask.mutate({ id: task.id, data: { status: newStatus } });
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(task.id);
    }
    setShowMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card-hover p-5 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <Link
            to={`/tasks/${task.id}`}
            className="block text-lg font-semibold text-white hover:text-primary-400 transition-colors truncate"
          >
            {task.title}
          </Link>

          {/* Description */}
          {task.description && (
            <p className="mt-1 text-sm text-primary-400 line-clamp-2">{task.description}</p>
          )}

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Status Badge */}
            <span className={cn('flex items-center gap-1.5', status.className)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </span>

            {/* Priority Badge */}
            <span className={priority.className}>{priority.label}</span>

            {/* Due Date */}
            {task.dueDate && (
              <span
                className={cn(
                  'flex items-center gap-1.5 text-xs',
                  overdue ? 'text-red-400' : 'text-primary-400'
                )}
              >
                {overdue ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <Calendar className="w-3.5 h-3.5" />
                )}
                {formatRelativeDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-primary-400 hover:text-primary-50 hover:bg-primary-700 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-full mt-1 w-48 py-2 rounded-xl bg-primary-800 border border-primary-600/50 shadow-xl z-10"
            >
              <Link
                to={`/tasks/${task.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-primary-300 hover:bg-primary-700 hover:text-primary-50"
              >
                <Edit className="w-4 h-4" />
                Edit Task
              </Link>

              <div className="border-t border-primary-600/50 my-2" />

              <p className="px-4 py-1 text-xs text-primary-400/70 font-medium">Change Status</p>
              {Object.entries(statusConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key as TaskStatus)}
                  disabled={task.status === key}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2 text-sm text-primary-300 hover:bg-primary-700 hover:text-primary-50 disabled:opacity-50 disabled:cursor-not-allowed',
                    task.status === key && 'bg-primary-700/50'
                  )}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label}
                </button>
              ))}

              <div className="border-t border-primary-600/50 my-2" />

              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete Task
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

