import { motion } from 'framer-motion';
import { Inbox, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
}

export default function EmptyState({
  title = 'No tasks yet',
  description = 'Get started by creating your first task',
  showAction = true,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary-800/50 flex items-center justify-center mb-6">
        <Inbox className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-primary-50 mb-2">{title}</h3>
      <p className="text-primary-400 text-center max-w-sm mb-6">{description}</p>
      {showAction && (
        <Link to="/tasks/new" className="btn-primary btn-md">
          <Plus className="w-4 h-4" />
          Create Task
        </Link>
      )}
    </motion.div>
  );
}

