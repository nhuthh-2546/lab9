import { useState } from 'react';
import apolloClient from '@/lib/apollo';
import { CREATE_ROOM } from '@/lib/graphql/mutations';
import { Room } from '@/types';

interface CreateRoomResponse {
  createRoom: {
    room: Room;
  };
}

interface UseCreateRoomResult {
  createRoom: (name: string) => Promise<Room | null>;
  loading: boolean;
  error: any;
}

/**
 * Custom hook for creating a room
 * Calls the Rails GraphQL backend mutation: createRoom(input: { name: String! })
 */
export function useCreateRoom(): UseCreateRoomResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createRoom = async (name: string): Promise<Room | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apolloClient.mutate<CreateRoomResponse>({
        mutation: CREATE_ROOM,
        variables: { 
          input: {
            name: name || 'New Room'
          }
        },
      });

      const room = result.data?.createRoom?.room;

      if (room) {
        return room;
      }

      return null;
    } catch (err: any) {
      setError(err);
      
      const errorMessage = err?.graphQLErrors?.[0]?.message || err?.message || 'Failed to create room';
      throw new Error(errorMessage);
        } finally {
      setLoading(false);
    }
  };

  return {
    createRoom,
    loading,
    error,
  };
}

