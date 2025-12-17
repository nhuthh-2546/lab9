'use client';

import { useMemo } from 'react';
import { Room } from '@/types';
import { Users, Lock } from 'lucide-react';
import { 
  STATUS_COLORS, 
  AVATAR_GRADIENTS, 
  MAX_PLAYERS 
} from '@/lib/constants';

interface RoomCardProps {
  room: Room;
  playerCount: number;
  maxPlayers?: number;
  onJoin: (roomId: string) => void;
  isLoading?: boolean;
}

type RoomStatus = 'available' | 'waiting' | 'full';

const CARD_BASE_CLASS = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 overflow-hidden group cursor-pointer';
const HEADER_CLASS = 'bg-gradient-to-r from-indigo-600 to-purple-600 p-4';
const AVATAR_BASE_CLASS = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm';
const BUTTON_BASE_CLASS = 'w-full py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2';

function PlayerAvatar({ username, type }: { username: string; type: 'master' | 'guest' }) {
  const gradientClass = AVATAR_GRADIENTS[type];
  const initial = username[0]?.toUpperCase() || '?';

  return (
    <div className={`${AVATAR_BASE_CLASS} ${gradientClass}`}>
      {initial}
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="flex items-center gap-2 opacity-50">
      <div className={`${AVATAR_BASE_CLASS} bg-gray-300 dark:bg-gray-600`}>
        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Waiting for player...
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RoomStatus }) {
  const labels: Record<RoomStatus, string> = {
    full: 'Full',
    waiting: 'Waiting',
    available: 'Available',
  };

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {labels[status]}
    </div>
  );
}

export function RoomCard({
  room,
  playerCount,
  maxPlayers = MAX_PLAYERS,
  onJoin,
  isLoading = false,
}: RoomCardProps) {
  const status: RoomStatus = useMemo(() => {
    if (playerCount >= maxPlayers) return 'full';
    if (playerCount === 1) return 'waiting';
    return 'available';
  }, [playerCount, maxPlayers]);

  const isFull = status === 'full';
  const isDisabled = isFull || isLoading;

  const buttonClass = useMemo(() => {
    if (isFull) {
      return `${BUTTON_BASE_CLASS} bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed`;
    }
    if (isLoading) {
      return `${BUTTON_BASE_CLASS} bg-indigo-400 dark:bg-indigo-600 text-white cursor-wait`;
    }
    return `${BUTTON_BASE_CLASS} bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/50 cursor-pointer`;
  }, [isFull, isLoading]);

  const handleJoinClick = () => {
    if (!isDisabled) {
      onJoin(room.id);
    }
  };

  return (
    <article className={CARD_BASE_CLASS}>
      {/* Header */}
      <header className={HEADER_CLASS}>
        <h3 className="text-lg font-bold text-white truncate">
          {room.name}
        </h3>
      </header>

      {/* Body */}
      <div className="p-4">
        {/* Players */}
        <div className="space-y-3 mb-4">
          {/* Master */}
          <div className="flex items-center gap-2">
            <PlayerAvatar username={room.master.username} type="master" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {room.master.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Room Master</p>
            </div>
          </div>

          {/* Guest or Empty */}
          {room.guest ? (
            <div className="flex items-center gap-2">
              <PlayerAvatar username={room.guest.username} type="guest" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {room.guest.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Guest Player</p>
              </div>
            </div>
          ) : (
            <EmptySlot />
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {playerCount}/{maxPlayers} Players
            </span>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Action */}
        <button
          onClick={handleJoinClick}
          disabled={isDisabled}
          className={buttonClass}
          aria-label={isFull ? 'Room is full' : isLoading ? 'Joining room' : 'Join room'}
        >
          {isLoading ? (
            <>
              <div 
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" 
                aria-hidden="true"
              />
              Joining...
            </>
          ) : isFull ? (
            <>
              <Lock className="w-4 h-4" aria-hidden="true" />
              Room Full
            </>
          ) : (
            'Join Room'
          )}
        </button>
      </div>
    </article>
  );
}
