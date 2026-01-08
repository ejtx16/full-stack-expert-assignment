import { Search, Filter, X } from 'lucide-react';
import type { TaskFilters as TaskFiltersType } from '../types';
import { cn } from '../utils/cn';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: TaskFiltersType) => void;
}

export default function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const handleClearFilters = () => {
    onFilterChange({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <Search className="w-4 h-4 text-primary-400" strokeWidth={2} />
        </span>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value || undefined })}
          className="input pl-10 py-2.5 text-sm"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-primary-500">
          <Filter className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: (e.target.value || undefined) as TaskFiltersType['status'],
            })
          }
          className={cn(
            'px-2.5 py-1.5 rounded-lg text-xs bg-primary-800/80 border border-primary-600/40 text-primary-300 focus:outline-none focus:border-primary-500 transition-colors',
            filters.status && 'border-primary-500 bg-primary-600/20 text-primary-300'
          )}
        >
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              priority: (e.target.value || undefined) as TaskFiltersType['priority'],
            })
          }
          className={cn(
            'px-2.5 py-1.5 rounded-lg text-xs bg-primary-800/80 border border-primary-600/40 text-primary-300 focus:outline-none focus:border-primary-500 transition-colors',
            filters.priority && 'border-primary-500 bg-primary-600/20 text-primary-300'
          )}
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {/* Sort By */}
        <select
          value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFilterChange({
              ...filters,
              sortBy: sortBy as TaskFiltersType['sortBy'],
              sortOrder: sortOrder as TaskFiltersType['sortOrder'],
            });
          }}
          className="px-2.5 py-1.5 rounded-lg text-xs bg-primary-800/80 border border-primary-600/40 text-primary-300 focus:outline-none focus:border-primary-500 transition-colors"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="dueDate-asc">Due Date (Earliest)</option>
          <option value="dueDate-desc">Due Date (Latest)</option>
          <option value="priority-desc">Priority (High to Low)</option>
          <option value="priority-asc">Priority (Low to High)</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-primary-400 hover:text-primary-300 hover:bg-primary-800/60 transition-colors"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
