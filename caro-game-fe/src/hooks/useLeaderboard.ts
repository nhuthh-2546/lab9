import { useState, useCallback, useEffect } from 'react';
import apolloClient from '@/lib/apollo';
import { GET_LEADERBOARD } from '@/lib/graphql/queries';
import { LeaderboardEntry } from '@/types';

interface GetLeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

interface UseLeaderboardResult {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching leaderboard data
 */
export function useLeaderboard(limit: number = 50): UseLeaderboardResult {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apolloClient.query<GetLeaderboardResponse>({
        query: GET_LEADERBOARD,
        variables: { limit },
        fetchPolicy: 'network-only',
      });

      setLeaderboard(result.data?.leaderboard || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard,
  };
}
