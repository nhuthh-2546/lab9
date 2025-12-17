// UI Constants
export const BUTTON_VARIANTS = {
  primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white',
  secondary: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200',
} as const;

export const BUTTON_BASE = 'rounded-lg font-semibold transition-all cursor-pointer';
export const BUTTON_DISABLED = 'disabled:opacity-50 disabled:cursor-not-allowed';

// Status Colors
export const STATUS_COLORS = {
  available: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  waiting: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  full: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
} as const;

// Player Avatar Gradients
export const AVATAR_GRADIENTS = {
  master: 'bg-gradient-to-br from-indigo-500 to-purple-500',
  guest: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  default: 'bg-gradient-to-br from-gray-400 to-gray-500',
} as const;

// Room Constants
export const MAX_PLAYERS = 2;
export const MIN_PLAYERS = 1;

// Game Constants
export const BOARD_SIZE = 15;
export const WIN_CONDITION = 5;

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'accessToken',
  USER: 'user',
  THEME: 'theme',
} as const;

// API URLs
export const API_ENDPOINTS = {
  GRAPHQL: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
  WEBSOCKET: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/cable',
} as const;
