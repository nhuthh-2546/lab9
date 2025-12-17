import React, { FC } from 'react';
import Link from 'next/link';
import { Gamepad2, Trophy, LogOut, History } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  username?: string;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar: FC<NavbarProps> = ({ username, isAuthenticated, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/50 transition-all">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Caro
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated && (
              <>
                <Link
                  href="/browse"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  Browse
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-1"
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </Link>
                <Link
                  href="/history"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-1"
                >
                  <History className="w-4 h-4" />
                  History
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
                  {username || 'User'}
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
