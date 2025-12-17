import React, { FC } from 'react';
import { GamePlayer } from '@/types';

interface PlayerInfoProps {
  player: GamePlayer | null;
  isCurrentTurn: boolean;
  isCurrentPlayer: boolean;
}

export const PlayerInfo: FC<PlayerInfoProps> = ({ player, isCurrentTurn, isCurrentPlayer }) => {
  if (!player) return null;

  const isPlayerX = player.symbol === 'X';
  const bgColor = isCurrentTurn
    ? isPlayerX
      ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
      : 'bg-red-100 dark:bg-red-900/30 ring-2 ring-red-500'
    : 'bg-gray-100 dark:bg-gray-700';

  const symbolColor = isPlayerX ? 'bg-blue-600' : 'bg-red-600';

  return (
    <div className={`flex-1 p-3 rounded-lg transition-all ${bgColor}`}>
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 ${symbolColor} text-white rounded-full flex items-center justify-center font-bold text-sm`}
        >
          {player.symbol}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {player.username}
            {isCurrentPlayer && ' (You)'}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {isCurrentTurn ? 'Your turn' : 'Waiting...'}
          </p>
        </div>
      </div>
    </div>
  );
};
