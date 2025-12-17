'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room, User } from '@/types';
import apolloClient from '@/lib/apollo';
import { GET_ROOM, GET_ME } from '@/lib/graphql/queries';
import { ROOM_UPDATED_BY_ID_SUBSCRIPTION } from '@/lib/graphql/subscriptions';
import { useStartGame } from '@/hooks/useStartGame';
import { useActionCableSubscription } from '@/hooks/useActionCableSubscription';
import { Shield, Users, ArrowLeft, Loader2, Play } from 'lucide-react';

interface GetRoomResponse {
  room: Room;
}

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinNotification, setJoinNotification] = useState<string | null>(null);
  const { startGame, loading: startingGame } = useStartGame();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch room and current user in parallel
        const [roomResult, userResult] = await Promise.all([
          apolloClient.query<GetRoomResponse>({
            query: GET_ROOM,
            variables: { 
              roomId: resolvedParams.id
            },
            fetchPolicy: 'network-only',
          }),
          apolloClient.query<{ me: User }>({
            query: GET_ME,
            fetchPolicy: 'network-only',
          }),
        ]);

        setRoom(roomResult.data?.room || null);
        setCurrentUser(userResult.data?.me || null);
      } catch (err: any) {
        setError(err.message || 'Failed to load room');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchData();
    }
  }, [resolvedParams.id]);

  // Subscribe to room_updated to get real-time updates
  // Handles: player_joined, player_left, game_started, room_deleted
  useActionCableSubscription({
    query: ROOM_UPDATED_BY_ID_SUBSCRIPTION,
    operationName: 'RoomUpdatedById',
    variables: { roomId: resolvedParams.id },
    skip: !resolvedParams.id,
    onData: (data) => {
      if (data.roomUpdated?.room) {
        const previousRoom = room;
        const newRoom = data.roomUpdated.room;
        const eventType = data.roomUpdated.eventType;
        const updatedBy = data.roomUpdated.updatedBy;
        
        setRoom(newRoom);
        
        // Handle different event types
        switch (eventType) {
          case 'player_joined':
            if (!previousRoom?.guest && newRoom.guest && updatedBy) {
              setJoinNotification(`${updatedBy.username} joined the room! 🎉`);
              setTimeout(() => setJoinNotification(null), 5000);
            }
            break;
            
          case 'player_left':
            if (updatedBy) {
              setJoinNotification(`${updatedBy.username} left the room`);
              setTimeout(() => setJoinNotification(null), 5000);
            }
            break;
            
          case 'game_started':
            if (newRoom.game?.id) {
              router.push(`/game/${newRoom.game.id}`);
            }
            break;
            
          case 'room_deleted':
            setJoinNotification('Room has been deleted');
            setTimeout(() => {
              router.push('/browse');
            }, 2000);
            break;
        }
      }
    },
  });

  const handleStartGame = async () => {
    if (!room) return;

    try {
      const game = await startGame(room.id);
      if (game) {
        router.push(`/game/${game.id}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to start game');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Room Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The room you are looking for does not exist.'}
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

  const playerCount = room.guest ? 2 : 1;
  const isWaiting = !room.guest;
  const isMaster = currentUser?.id === room.master.id;
  const canStartGame = !isWaiting && isMaster;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Join notification toast */}
        {joinNotification && (
          <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border border-emerald-300">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <p className="font-semibold text-lg">{joinNotification}</p>
            </div>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => router.push('/browse')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Browse
        </button>

        {/* Room header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {room.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Room ID: <span className="font-mono">{room.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-indigo-900 dark:text-indigo-300">
                {playerCount}/2 Players
              </span>
            </div>
          </div>

          {/* Waiting status */}
          {isWaiting && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-300 font-medium text-center">
                ⏳ Waiting for opponent to join...
              </p>
            </div>
          )}

          {/* Ready to start */}
          {canStartGame && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-800 dark:text-green-300 font-medium text-center">
                ✅ Ready to start! Both players are in the room.
              </p>
            </div>
          )}

          {/* Players grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Master player */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Room Master
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {room.master.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {room.master.username}
                    {currentUser?.id === room.master.id && ' (You)'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {room.master.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest player or empty slot */}
            <div className={`rounded-lg p-6 border-2 ${
              room.guest
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-gray-50 dark:bg-gray-900/20 border-dashed border-gray-300 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Users className={`w-6 h-6 ${
                  room.guest
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-600'
                }`} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Guest Player
                </h3>
              </div>
              {room.guest ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                    {room.guest.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {room.guest.username}
                      {currentUser?.id === room.guest.id && ' (You)'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {room.guest.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    Waiting for player to join...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex gap-4">
            {canStartGame && (
              <button 
                onClick={handleStartGame}
                disabled={startingGame}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg hover:shadow-emerald-500/50 text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {startingGame ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Starting Game...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Game
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all cursor-pointer"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
