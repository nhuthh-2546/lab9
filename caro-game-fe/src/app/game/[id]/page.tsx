'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { GameBoard } from '@/components/game/GameBoard';
import { useGame } from '@/hooks/useGame';
import { GET_ME } from '@/lib/graphql/queries';
import apolloClient from '@/lib/apollo';
import { ArrowLeft, Loader2, Trophy, Flag, Clock, Target } from 'lucide-react';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { game, loading, error, makeMove, forfeitGame } = useGame(resolvedParams.id);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const result = await apolloClient.query<{ me: User }>({
          query: GET_ME,
          fetchPolicy: 'network-only',
        });
        setCurrentUser(result.data?.me || null);
      } catch (err) {
        // Silent error - user not critical for game
      }
    };

    fetchCurrentUser();
  }, []);

  const handleCellClick = async (row: number, col: number) => {
    try {
      await makeMove(row, col);
    } catch (err: any) {
      alert(err.message || 'Failed to make move');
    }
  };

  const handleForfeit = async () => {
    if (!confirm('Are you sure you want to forfeit? You will lose the game.')) {
      return;
    }

    try {
      await forfeitGame();
      alert('You have forfeited the game');
      router.push('/browse');
    } catch (err: any) {
      alert(err.message || 'Failed to forfeit game');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Game Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The game you are looking for does not exist.'}
          </p>
          <button
            onClick={() => router.push('/browse')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const isGameOver = game.status === 'Finished';
  const isMyTurn = currentUser?.id === game.currentTurnPlayer?.id;
  const amIPlayer1 = currentUser?.id === game.player1?.id;
  const amIPlayer2 = currentUser?.id === game.player2?.id;
  const mySymbol = amIPlayer1 ? 'X' : amIPlayer2 ? 'O' : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/browse')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lobby
        </button>

        {/* Game status banner */}
        {isGameOver && (
          <div className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-center shadow-lg">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-white" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {game.winner ? (
                game.winner.id === currentUser?.id ? (
                  '🎉 You Won!'
                ) : (
                  `${game.winner.username} Won!`
                )
              ) : (
                "It's a Draw!"
              )}
            </h2>
            <p className="text-white/90">
              {game.resultType === 'Forfeit' && 'Game ended by forfeit'}
              {game.resultType === 'Win' && 'Victory by 5 in a row!'}
              {game.resultType === 'Draw' && 'No more moves available'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Players info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Player 1 */}
            <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 ${
              game.currentTurnPlayer?.id === game.player1?.id && !isGameOver
                ? 'border-blue-500 shadow-lg shadow-blue-500/50'
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold">
                  X
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {game.player1?.username}
                    {game.player1?.id === currentUser?.id && ' (You)'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Player 1</p>
                </div>
              </div>
              {game.currentTurnPlayer?.id === game.player1?.id && !isGameOver && (
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                  ● Thinking...
                </div>
              )}
            </div>

            {/* Player 2 */}
            <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 ${
              game.currentTurnPlayer?.id === game.player2?.id && !isGameOver
                ? 'border-red-500 shadow-lg shadow-red-500/50'
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xl font-bold">
                  O
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {game.player2?.username}
                    {game.player2?.id === currentUser?.id && ' (You)'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Player 2</p>
                </div>
              </div>
              {game.currentTurnPlayer?.id === game.player2?.id && !isGameOver && (
                <div className="text-xs text-red-600 dark:text-red-400 font-semibold animate-pulse">
                  ● Thinking...
                </div>
              )}
            </div>

            {/* Game stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Game Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Turn:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {game.turnNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Your Symbol:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {mySymbol || 'Spectator'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-semibold ${
                    isGameOver
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {isGameOver ? 'Finished' : 'Playing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isGameOver && (amIPlayer1 || amIPlayer2) && (
              <button
                onClick={handleForfeit}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flag className="w-5 h-5" />
                Forfeit Game
              </button>
            )}
          </div>

          {/* Main game board */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Caro Game Board (15x15)
              </h2>
              
              <GameBoard
                game={game}
                currentUser={currentUser}
                onCellClick={handleCellClick}
                disabled={isGameOver}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
