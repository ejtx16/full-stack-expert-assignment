import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'primary' | 'amber' | 'emerald' | 'slate';
  index?: number;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-600/20',
    text: 'text-primary-300',
    icon: 'text-primary-400',
  },
  amber: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    icon: 'text-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    icon: 'text-emerald-500',
  },
  slate: {
    bg: 'bg-primary-600/15',
    text: 'text-primary-300',
    icon: 'text-primary-400',
  },
};

export default function StatsCard({ title, value, icon: Icon, color, index = 0 }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="card p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-primary-500 mb-0.5">{title}</p>
          <p className={cn('text-2xl font-semibold', colors.text)}>{value}</p>
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.icon)} strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  );
}
