import { useState, useCallback, useEffect } from 'react';
import apolloClient from '@/lib/apollo';
import { GET_ROOMS } from '@/lib/graphql/queries';
import {
  ROOM_CREATED_SUBSCRIPTION,
  ROOM_UPDATED_SUBSCRIPTION,
  ROOM_DELETED_SUBSCRIPTION,
} from '@/lib/graphql/subscriptions';
import { useActionCableSubscription } from './useActionCableSubscription';
import { Room } from '@/types';

interface GetRoomsResponse {
  rooms: Room[];
}

interface UseRoomsResult {
  rooms: Room[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing rooms data with real-time updates via ActionCable
 * Fetches initial rooms data and subscribes to real-time updates
 */
export function useRooms(): UseRoomsResult {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Fetch rooms function
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apolloClient.query<GetRoomsResponse>({
        query: GET_ROOMS,
        fetchPolicy: 'network-only',
      });
      setRooms(result.data?.rooms || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handle room created - add new room at the beginning
  const handleRoomCreated = useCallback((subscriptionData: any) => {
    const roomCreatedData = subscriptionData.roomCreated;
    if (roomCreatedData) {
      const room = roomCreatedData.room;
      setRooms((prevRooms) => {
        const exists = prevRooms.some((r) => r.id === room.id);
        if (exists) {
          return prevRooms;
        }
        return [room, ...prevRooms];
      });
    }
  }, []);

  // Handle room updated
  const handleRoomUpdated = useCallback((subscriptionData: any) => {
    const roomUpdatedData = subscriptionData.roomUpdated;
    if (roomUpdatedData) {
      const updatedRoom = roomUpdatedData.room;
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === updatedRoom.id ? updatedRoom : room
        )
      );
    }
  }, []);

  // Handle room deleted
  const handleRoomDeleted = useCallback((subscriptionData: any) => {
    const deletedRoomId = subscriptionData.roomDeleted?.id;
    if (deletedRoomId) {
      setRooms((prevRooms) =>
        prevRooms.filter((room) => room.id !== deletedRoomId)
      );
    }
  }, []);

  // Subscribe to room created events
  useActionCableSubscription({
    query: ROOM_CREATED_SUBSCRIPTION,
    operationName: 'RoomCreated',
    onData: handleRoomCreated,
  });

  // Subscribe to room updated events
  useActionCableSubscription({
    query: ROOM_UPDATED_SUBSCRIPTION,
    operationName: 'RoomUpdated',
    onData: handleRoomUpdated,
  });

  // Subscribe to room deleted events
  useActionCableSubscription({
    query: ROOM_DELETED_SUBSCRIPTION,
    operationName: 'RoomDeleted',
    onData: handleRoomDeleted,
  });

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
  };
}
