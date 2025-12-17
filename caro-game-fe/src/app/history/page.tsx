'use client';

import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { Trophy, Target, Clock, ArrowLeft, Calendar } from 'lucide-react';
import { GameHistory } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const { user, gameHistory, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading history...</p>
          </div>
        </div>
      </div>
    );
  }

  const getResultBadge = (game: GameHistory) => {
    if (!game.winner) {
      return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold">Draw</span>;
    }
    
    const isWinner = game.winner.id === user?.id;
    return isWinner ? (
      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">Win</span>
    ) : (
      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-semibold">Loss</span>
    );
  };

  const getOpponent = (game: GameHistory) => {
    if (game.player1.id === user?.id) {
      return game.player2;
    }
    return game.player1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/browse')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Browse
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <Clock className="w-20 h-20 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Game History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your past {gameHistory.length} games
          </p>
        </div>

        {/* Game history list */}
        {gameHistory.length === 0 ? (
          <div className="text-center py-20">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No games played yet. Start playing to build your history!
            </p>
            <button
              onClick={() => router.push('/browse')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Opponent</th>
                    <th className="px-6 py-4 text-center">Result</th>
                    <th className="px-6 py-4 text-center">Type</th>
                    <th className="px-6 py-4 text-left">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((game, index) => {
                    const opponent = getOpponent(game);
                    const formattedDate = new Date(game.startedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr
                        key={game.id}
                        className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'
                        }`}
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formattedDate}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {opponent.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {opponent.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getResultBadge(game)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm ${
                            game.resultType === 'Forfeit'
                              ? 'text-red-600 dark:text-red-400'
                              : game.resultType === 'Draw'
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-green-600 dark:text-green-400'
                          }`}>
                            {game.resultType || 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {game.winner ? (
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {game.winner.username}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">No winner</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats summary */}
        {gameHistory.length > 0 && user && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">Total Games</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.totalGames || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">Wins</span>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {user.wins || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-red-500" />
                <span className="text-gray-600 dark:text-gray-400">Losses</span>
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {user.losses || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-indigo-500" />
                <span className="text-gray-600 dark:text-gray-400">Win Rate</span>
              </div>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {user.winRate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
