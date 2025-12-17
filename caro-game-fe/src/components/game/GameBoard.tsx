'use client';

import React, { FC } from 'react';
import { Game, User } from '@/types';

interface GameBoardProps {
  game: Game;
  currentUser: User | null;
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

export const GameBoard: FC<GameBoardProps> = ({
  game,
  currentUser,
  onCellClick,
  disabled = false,
}) => {
  const { boardState, winningPositions, currentTurnPlayer, status } = game;
  const isMyTurn = currentUser?.id === currentTurnPlayer?.id;
  const isGameOver = status === 'Finished';

  // Check if a cell is part of winning positions
  const isWinningCell = (row: number, col: number): boolean => {
    if (!winningPositions || winningPositions.length === 0) return false;
    return winningPositions.some(([r, c]) => r === row && c === col);
  };

  // Get cell style based on state
  const getCellStyle = (row: number, col: number, cell: string | null) => {
    const isWinner = isWinningCell(row, col);
    const baseStyle = 'w-10 h-10 md:w-12 md:h-12 border border-gray-300 dark:border-gray-600 rounded-md font-bold text-lg transition-all flex items-center justify-center';
    
    if (isWinner) {
      return `${baseStyle} ${
        cell === 'X'
          ? 'bg-blue-500 text-white animate-pulse'
          : 'bg-red-500 text-white animate-pulse'
      }`;
    }

    if (cell === 'X') {
      return `${baseStyle} bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 cursor-not-allowed`;
    }

    if (cell === 'O') {
      return `${baseStyle} bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-not-allowed`;
    }

    if (disabled || isGameOver || !isMyTurn) {
      return `${baseStyle} bg-gray-50 dark:bg-gray-700 cursor-not-allowed`;
    }

    return `${baseStyle} bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer hover:scale-105`;
  };

  const handleCellClick = (row: number, col: number) => {
    if (disabled || isGameOver || !isMyTurn || boardState[row][col]) {
      return;
    }
    onCellClick(row, col);
  };

  return (
    <div className="flex justify-center overflow-auto p-4">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl p-4 border-4 border-amber-600 dark:border-amber-700">
        {/* Board grid */}
        <div 
          className="grid gap-0.5 bg-amber-600 dark:bg-amber-800 p-1 rounded-lg"
          style={{ 
            gridTemplateColumns: `repeat(15, minmax(0, 1fr))`,
          }}
        >
          {boardState.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={disabled || isGameOver || !isMyTurn || !!cell}
                className={getCellStyle(rowIndex, colIndex, cell)}
                title={`Row ${rowIndex}, Col ${colIndex}`}
              >
                {cell && (
                  <span className={isWinningCell(rowIndex, colIndex) ? 'text-2xl' : ''}>
                    {cell}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Turn indicator */}
        <div className="mt-4 text-center">
          {isGameOver ? (
            <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
              Game Over
            </div>
          ) : isMyTurn ? (
            <div className="text-lg font-bold text-green-600 dark:text-green-400 animate-pulse">
              🎯 Your Turn!
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-500 dark:text-gray-400">
              ⏳ Waiting for {currentTurnPlayer?.username}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
