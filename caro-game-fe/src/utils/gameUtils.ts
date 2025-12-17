import { Room, GamePlayer } from '@/types';

export const createMockOpponent = (): GamePlayer => ({
  id: 'opponent-123',
  username: 'Opponent',
  email: 'opponent@example.com',
  symbol: 'O',
});

export const initializeGameState = (room: Room, currentUser: any) => {
  const players = {
    X: { ...room.master, symbol: 'X' as const },
    O: createMockOpponent(),
  };

  return {
    players,
    currentUserSymbol: currentUser.id === players.X.id ? 'X' : 'O',
  };
};

export const checkWinner = (board: (string | null)[], size: number = 15): string | null => {
  const checkLine = (positions: number[]): boolean => {
    const firstCell = board[positions[0]];
    return firstCell !== null && positions.every((pos) => board[pos] === firstCell);
  };

  // Check horizontal, vertical, and diagonals for winning pattern
  // This is a simplified version - implement full logic as needed
  return null;
};
