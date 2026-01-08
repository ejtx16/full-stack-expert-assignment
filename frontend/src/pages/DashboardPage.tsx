import { useState } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, Clock, CheckCircle, LayoutGrid, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTasks, useTaskStats } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import type { TaskFilters as TaskFiltersType } from '../types';
import TaskCard from '../components/TaskCard';
import TaskFiltersComponent from '../components/TaskFilters';
import Pagination from '../components/Pagination';
import StatsCard from '../components/StatsCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TaskFiltersType>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: tasksData, isLoading: tasksLoading } = useTasks({
    page,
    limit: 10,
    ...filters,
  });

  const { data: stats, isLoading: statsLoading } = useTaskStats();

  const handleFilterChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-primary-50">
            Welcome back, <span className="text-primary-300">{firstName}</span>
          </h1>
          <p className="mt-1 text-sm text-primary-500">Here's an overview of your tasks</p>
        </div>
        <Link
          to="/tasks/new"
          className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New Task
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {statsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-14 bg-primary-700/50 rounded" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatsCard
              title="Total"
              value={stats.total}
              icon={LayoutGrid}
              color="primary"
              index={0}
            />
            <StatsCard title="To Do" value={stats.todo} icon={ListTodo} color="slate" index={1} />
            <StatsCard
              title="In Progress"
              value={stats.inProgress}
              icon={Clock}
              color="amber"
              index={2}
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle}
              color="emerald"
              index={3}
            />
          </div>
        ) : null}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="card p-4"
      >
        <TaskFiltersComponent filters={filters} onFilterChange={handleFilterChange} />
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {tasksLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : tasksData?.data && tasksData.data.length > 0 ? (
          <>
            <div className="grid gap-3">
              {tasksData.data.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
            </div>

            {tasksData.pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  page={tasksData.pagination.page}
                  totalPages={tasksData.pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title={
              filters.search || filters.status || filters.priority
                ? 'No tasks found'
                : 'No tasks yet'
            }
            description={
              filters.search || filters.status || filters.priority
                ? 'Try adjusting your filters'
                : 'Get started by creating your first task'
            }
            showAction={!filters.search && !filters.status && !filters.priority}
          />
        )}
      </motion.div>
    </div>
  );
}
