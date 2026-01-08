import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import { useCreateTask } from '../hooks/useTasks';
import type { CreateTaskInput, UpdateTaskInput } from '../types';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const createTask = useCreateTask();

  const handleSubmit = (data: CreateTaskInput | UpdateTaskInput) => {
    createTask.mutate(data as CreateTaskInput, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary-400" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-primary-50">New Task</h1>
            <p className="text-sm text-primary-500">Fill in the details below</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card p-5"
      >
        <TaskForm onSubmit={handleSubmit} isLoading={createTask.isPending} />
      </motion.div>
    </div>
  );
}
