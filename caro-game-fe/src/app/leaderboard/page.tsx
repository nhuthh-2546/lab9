'use client';

import { Trophy, Medal, Award, TrendingUp, Target, Crown } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuth } from '@/contexts/AuthContext';

export default function LeaderboardPage() {
  const { leaderboard, loading, error } = useLeaderboard(50);
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-amber-700" />;
    return <span className="text-2xl font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Leaderboard
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Rank</th>
                <th className="px-6 py-4 text-left">Player</th>
                <th className="px-6 py-4 text-center">Points</th>
                <th className="px-6 py-4 text-center">W/L/D</th>
                <th className="px-6 py-4 text-center">Games</th>
                <th className="px-6 py-4 text-center">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => {
                const isCurrentUser = user && player.username === user.username;
                return (
                  <tr 
                    key={player.id} 
                    className={`border-b dark:border-gray-700 transition-colors ${
                      isCurrentUser 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <td className="px-6 py-4">{getRankIcon(index + 1)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isCurrentUser && (
                          <Crown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        )}
                        <span className={`font-semibold ${
                          isCurrentUser 
                            ? 'text-indigo-700 dark:text-indigo-300' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {player.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-center font-semibold ${
                      isCurrentUser ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'
                    }`}>
                      {player.points}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      <span className="text-green-600 dark:text-green-400 font-medium">{player.wins}</span>/
                      <span className="text-red-600 dark:text-red-400 font-medium">{player.losses}</span>/
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">{player.draws}</span>
                    </td>
                    <td className={`px-6 py-4 text-center ${
                      isCurrentUser ? 'text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-900 dark:text-white'
                    }`}>
                      {player.totalGames}
                    </td>
                    <td className={`px-6 py-4 text-center ${
                      isCurrentUser ? 'text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-900 dark:text-white'
                    }`}>
                      {player.winRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
