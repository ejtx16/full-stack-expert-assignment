import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Type, AlignLeft, ListTodo, Flag, ArrowRight } from 'lucide-react';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types';
import { cn } from '../utils/cn';
import { toInputDateString } from '../utils/date';
import LoadingSpinner from './LoadingSpinner';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional().nullable(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void;
  isLoading?: boolean;
}

export default function TaskForm({ task, onSubmit, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'TODO',
      priority: task?.priority || 'MEDIUM',
      dueDate: task?.dueDate ? toInputDateString(task.dueDate) : '',
    },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    const submitData: CreateTaskInput | UpdateTaskInput = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="label">
          Title <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Type className="w-4 h-4 text-primary-400" strokeWidth={2} />
          </span>
          <input
            id="title"
            type="text"
            placeholder="What needs to be done?"
            className={cn(
              'input pl-10 py-2.5 text-sm',
              errors.title && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            )}
            {...register('title')}
          />
        </div>
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-3 z-10 pointer-events-none">
            <AlignLeft className="w-4 h-4 text-primary-400" strokeWidth={2} />
          </span>
          <textarea
            id="description"
            rows={3}
            placeholder="Add more details (optional)"
            className={cn(
              'input pl-10 py-2.5 text-sm resize-none',
              errors.description && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            )}
            {...register('description')}
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="status" className="label">
            Status
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <ListTodo className="w-4 h-4 text-primary-400" strokeWidth={2} />
            </span>
            <select id="status" className="input pl-10 py-2.5 text-sm" {...register('status')}>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="label">
            Priority
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <Flag className="w-4 h-4 text-primary-400" strokeWidth={2} />
            </span>
            <select id="priority" className="input pl-10 py-2.5 text-sm" {...register('priority')}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="label">
          Due Date
        </label>
        <div className="relative">
          {/* <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Calendar className="w-4 h-4 text-primary-400" strokeWidth={2} />
          </span> */}
          <input
            id="dueDate"
            type="date"
            className="input pl-1 py-2.5 text-sm color-primary-400"
            style={{ color: 'var(--color-primary-400)' }}
            {...register('dueDate')}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary py-2.5 px-5 text-sm font-medium group"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              {task ? 'Save Changes' : 'Create Task'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
