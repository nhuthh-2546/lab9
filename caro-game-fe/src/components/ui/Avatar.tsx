'use client';

import { User } from 'lucide-react';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outlined' | 'gradient';
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

export function Avatar({
  name = 'User',
  src,
  size = 'md',
  variant = 'default',
  status,
  className = '',
}: AvatarProps) {
  const getSizeClasses = () => {
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-2xl',
    };
    return sizes[size];
  };

  const getStatusSize = () => {
    const sizes = {
      xs: 'w-2 h-2',
      sm: 'w-2.5 h-2.5',
      md: 'w-3 h-3',
      lg: 'w-3.5 h-3.5',
      xl: 'w-4 h-4',
    };
    return sizes[size];
  };

  const getVariantClasses = () => {
    const variants = {
      default: 'bg-indigo-100 dark:bg-indigo-900/30',
      outlined: 'bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-400',
      gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white',
    };
    return variants[variant];
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block">
      <div
        className={`flex items-center justify-center rounded-full font-semibold overflow-hidden ${getSizeClasses()} ${getVariantClasses()} ${className}`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : variant === 'gradient' ? (
          initials
        ) : (
          <span
            className={`text-indigo-600 dark:text-indigo-400 ${
              variant === 'outlined' ? '' : ''
            }`}
          >
            {initials}
          </span>
        )}
      </div>

      {status && (
        <div
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900 ${getStatusSize()} ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'away'
                ? 'bg-yellow-500'
                : 'bg-gray-500'
          }`}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarGroup({ avatars, max = 3, size = 'md' }: AvatarGroupProps) {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {displayed.map((avatar, idx) => (
        <div key={idx} className="ring-2 ring-white dark:ring-gray-900">
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`flex items-center justify-center rounded-full font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-2 ring-white dark:ring-gray-900`}
          style={{
            width: size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '48px' : '64px',
            height: size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '48px' : '64px',
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
