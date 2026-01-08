import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import type { UpdateTaskInput } from '../types';
import { formatDateTime } from '../utils/date';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useTask(id!);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleSubmit = (data: UpdateTaskInput) => {
    updateTask.mutate(
      { id: id!, data },
      {
        onSuccess: () => {
          navigate('/dashboard');
        },
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(id!, {
        onSuccess: () => {
          navigate('/dashboard');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-primary-50 mb-2">Task not found</h2>
        <p className="text-primary-400 mb-4">The task you're looking for doesn't exist or has been deleted.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary btn-md">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-400 hover:text-primary-50 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-50">Edit Task</h1>
            <p className="mt-1 text-primary-400">
              Created {formatDateTime(task.createdAt)}
              {task.updatedAt !== task.createdAt && (
                <> · Updated {formatDateTime(task.updatedAt)}</>
              )}
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="btn-danger btn-md"
          >
            {deleteTask.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <TaskForm task={task} onSubmit={handleSubmit} isLoading={updateTask.isPending} />
      </motion.div>
    </div>
  );
}

