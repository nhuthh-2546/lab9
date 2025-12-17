import React from 'react';
import { Trophy } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full" />
          <Trophy className="absolute inset-6 w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <p className="mt-8 text-gray-600 dark:text-gray-400 text-lg font-medium">Loading...</p>
      <div className="mt-4 flex justify-center gap-1">
        <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" />
        <div
          className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce"
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </div>
  </div>
);
