import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import LoadingSpinner from '../components/LoadingSpinner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', 'jamesplatinotomes@gmail.com');
    setValue('password', 'Password123');
    setShowDemoHint(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h1 className="mt-6 text-2xl font-semibold text-primary-50 tracking-tight">
            Task Management Application
          </h1>
          <p className="mt-1.5 text-sm text-primary-400">Sign in to continue to your tasks</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary-400" strokeWidth={2} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={cn(
                    'input pl-10 py-2.5 text-sm',
                    errors.email && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  )}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary-400" strokeWidth={2} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={cn(
                    'input pl-10 pr-10 py-2.5 text-sm',
                    errors.password &&
                      'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  )}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-primary-400 hover:text-primary-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5 text-sm font-medium mt-2 group"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-700/50"></div>
            </div>
            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={() => setShowDemoHint(!showDemoHint)}
                className="px-3 py-1 text-xs text-primary-500 bg-primary-950 hover:text-primary-400 transition-colors"
              >
                {showDemoHint ? 'Hide demo' : 'Try demo account'}
              </button>
            </div>
          </div>

          {/* Demo credentials - collapsible */}
          {showDemoHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full p-3 rounded-lg border border-dashed border-primary-600/40 hover:border-primary-500/60 bg-primary-800/20 hover:bg-primary-800/40 transition-all text-left group"
              >
                <p className="text-xs text-primary-400 mb-1">Click to fill demo credentials</p>
                <p className="text-xs font-mono text-primary-300 group-hover:text-primary-200">
                  jamesplatinotomes@gmail.com - Render account
                </p>
              </button>
            </motion.div>
          )}

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-primary-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-300 hover:text-primary-200 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
