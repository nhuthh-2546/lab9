'use client';

import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';
const DARK_CLASS = 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const isDarkMode = document.documentElement.classList.contains(DARK_CLASS);
    setTheme(savedTheme || (isDarkMode ? 'dark' : 'light'));
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      html.classList.add(DARK_CLASS);
    } else {
      html.classList.remove(DARK_CLASS);
    }
    
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    setTheme(newTheme);
  }, [theme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    mounted,
  };
}
