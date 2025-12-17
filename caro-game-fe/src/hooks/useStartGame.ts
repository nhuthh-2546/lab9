import { useState } from 'react';
import apolloClient from '@/lib/apollo';
import { START_GAME } from '@/lib/graphql/mutations';
import { Game } from '@/types';

interface StartGameResponse {
  startGame: {
    game: Game;
  };
}

interface UseStartGameResult {
  startGame: (roomId: string) => Promise<Game | null>;
  loading: boolean;
  error: any;
}

/**
 * Custom hook for starting a game
 */
export function useStartGame(): UseStartGameResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const startGame = async (roomId: string): Promise<Game | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apolloClient.mutate<StartGameResponse>({
        mutation: START_GAME,
        variables: { 
          input: {
            roomId 
          }
        },
      });

      const game = result.data?.startGame?.game;

      if (game) {
        return game;
      }

      return null;
    } catch (err: any) {
      setError(err);
      
      const errorMessage = err?.graphQLErrors?.[0]?.message || err?.message || 'Failed to start game';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    startGame,
    loading,
    error,
  };
}
