'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const BUTTON_BASE_CLASS = 'p-2.5 rounded-lg transition-colors cursor-pointer';
const BUTTON_COLOR_CLASS = 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
const SKELETON_CLASS = 'w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse';
const ICON_CLASS = 'w-5 h-5';

export function ThemeSwitcher() {
  const { isDark, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className={SKELETON_CLASS} aria-hidden="true" />;
  }

  const buttonLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={toggleTheme}
      className={`${BUTTON_BASE_CLASS} ${BUTTON_COLOR_CLASS}`}
      title={buttonLabel}
      aria-label={buttonLabel}
    >
      {isDark ? (
        <Sun className={`${ICON_CLASS} text-yellow-500`} aria-hidden="true" />
      ) : (
        <Moon className={`${ICON_CLASS} text-gray-700`} aria-hidden="true" />
      )}
    </button>
  );
}
