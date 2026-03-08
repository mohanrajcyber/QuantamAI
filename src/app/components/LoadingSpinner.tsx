import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'default' | 'quantum';
}

export function LoadingSpinner({ size = 'md', text, variant = 'default' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  if (variant === 'quantum') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative">
          {/* Outer rotating ring */}
          <div className={`${sizeClasses[size]} border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin`}></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'} text-purple-400 animate-pulse`} />
          </div>
          
          {/* Outer glow */}
          <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse`}></div>
        </div>
        
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-300 font-medium animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin`} />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-400`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full page loading overlay
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a2539] border border-gray-700 rounded-xl p-8 shadow-2xl">
        <LoadingSpinner size="xl" text={text} variant="quantum" />
      </div>
    </div>
  );
}

// Inline loading skeleton
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton rounded-lg ${className}`}></div>
  );
}

// Button loading state
export function ButtonSpinner() {
  return (
    <Loader2 className="w-4 h-4 animate-spin" />
  );
}
