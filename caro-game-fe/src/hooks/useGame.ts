import { useState, useCallback, useEffect } from 'react';
import apolloClient from '@/lib/apollo';
import { GET_GAME } from '@/lib/graphql/queries';
import { START_GAME, MAKE_MOVE, FORFEIT_GAME } from '@/lib/graphql/mutations';
import { GAME_UPDATED_SUBSCRIPTION } from '@/lib/graphql/subscriptions';
import { useActionCableSubscription } from './useActionCableSubscription';
import { Game, Move, User, MakeMoveResponse } from '@/types';

interface GetGameResponse {
  game: Game;
}

interface StartGameResponse {
  startGame: {
    game: Game;
  };
}

interface ForfeitGameResponse {
  forfeitGame: {
    game: Game;
  };
}

interface UseGameResult {
  game: Game | null;
  loading: boolean;
  error: any;
  startGame: (roomId: string) => Promise<Game | null>;
  makeMove: (row: number, col: number) => Promise<boolean>;
  forfeitGame: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing game state with real-time updates
 */
export function useGame(gameId?: string): UseGameResult {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Fetch game data
  const fetchGame = useCallback(async () => {
    if (!gameId) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await apolloClient.query<GetGameResponse>({
        query: GET_GAME,
        variables: { id: gameId },
        fetchPolicy: 'network-only',
      });

      setGame(result.data?.game || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  // Fetch game on mount and when gameId changes
  useEffect(() => {
    if (gameId) {
      fetchGame();
    }
  }, [gameId, fetchGame]);

  // Start game mutation
  const startGame = useCallback(async (roomId: string): Promise<Game | null> => {
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

      const newGame = result.data?.startGame?.game;
      if (newGame) {
        setGame(newGame);
        return newGame;
      }

      return null;
    } catch (err: any) {
      setError(err);
      throw new Error(err?.graphQLErrors?.[0]?.message || 'Failed to start game');
    } finally {
      setLoading(false);
    }
  }, []);

  // Make move mutation
  const makeMove = useCallback(async (row: number, col: number): Promise<boolean> => {
    if (!game) return false;

    try {
      setLoading(true);
      setError(null);

      const result = await apolloClient.mutate<MakeMoveResponse>({
        mutation: MAKE_MOVE,
        variables: { 
          input: {
            gameId: game.id, 
            row, 
            col 
          }
        },
      });

      const moveData = result.data?.makeMove;
      if (moveData) {
        setGame(moveData.game);
        return true;
      }

      return false;
    } catch (err: any) {
      setError(err);
      throw new Error(err?.graphQLErrors?.[0]?.message || 'Failed to make move');
    } finally {
      setLoading(false);
    }
  }, [game]);

  // Forfeit game mutation
  const forfeitGame = useCallback(async (): Promise<boolean> => {
    if (!game) return false;

    try {
      setLoading(true);
      setError(null);

      const result = await apolloClient.mutate<ForfeitGameResponse>({
        mutation: FORFEIT_GAME,
        variables: { 
          input: {
            gameId: game.id 
          }
        },
      });

      const forfeitData = result.data?.forfeitGame?.game;
      if (forfeitData) {
        setGame(forfeitData);
        return true;
      }

      return false;
    } catch (err: any) {
      setError(err);
      throw new Error(err?.graphQLErrors?.[0]?.message || 'Failed to forfeit game');
    } finally {
      setLoading(false);
    }
  }, [game]);

  // Handle game updates from subscription
  const handleGameUpdated = useCallback((subscriptionData: any) => {
    const gameUpdateData = subscriptionData.gameUpdated;
    if (gameUpdateData) {
      const updatedGame = gameUpdateData.game;
      setGame(updatedGame);
    }
  }, []);

  // Subscribe to game updates
  useActionCableSubscription({
    query: GAME_UPDATED_SUBSCRIPTION,
    variables: gameId ? { gameId } : undefined,
    operationName: 'GameUpdated',
    onData: handleGameUpdated,
    skip: !gameId,
  });

  return {
    game,
    loading,
    error,
    startGame,
    makeMove,
    forfeitGame,
    refetch: fetchGame,
  };
}
