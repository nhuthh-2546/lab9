import { useState, useCallback, useEffect } from 'react';
import apolloClient from '@/lib/apollo';
import { GET_ME, GET_GAME_HISTORY } from '@/lib/graphql/queries';
import { User, GameHistory } from '@/types';

interface GetMeResponse {
  me: User;
}

interface GetGameHistoryResponse {
  gameHistory: GameHistory[];
}

interface UseProfileResult {
  user: User | null;
  gameHistory: GameHistory[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching user profile and game history
 */
export function useProfile(userId?: string): UseProfileResult {
  const [user, setUser] = useState<User | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current user
      const userResult = await apolloClient.query<GetMeResponse>({
        query: GET_ME,
        fetchPolicy: 'network-only',
      });

      const currentUser = userResult.data?.me;
      setUser(currentUser || null);

      // Fetch game history if we have a user ID
      if (currentUser?.id || userId) {
        const historyResult = await apolloClient.query<GetGameHistoryResponse>({
          query: GET_GAME_HISTORY,
          variables: { userId: userId || currentUser?.id },
          fetchPolicy: 'network-only',
        });

        setGameHistory(historyResult.data?.gameHistory || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    gameHistory,
    loading,
    error,
    refetch: fetchProfile,
  };
}
