'use client';

import { useState } from 'react';
import { Room } from '@/types';
import { Search, RefreshCw, Plus, Filter, Users } from 'lucide-react';
import { useRooms } from '@/hooks/useRooms';
import { useJoinRoom } from '@/hooks/useJoinRoom';
import { useRouter } from 'next/navigation';
import { RoomCard } from './RoomCard';

interface RoomListingProps {
  onCreateRoom?: () => void;
}

export function RoomListing({
  onCreateRoom = () => {},
}: RoomListingProps) {
  // Fetch rooms with real-time updates
  const { rooms: apiRooms, loading: isLoading, error, refetch } = useRooms();
  const { joinRoom, loading: joiningLoading } = useJoinRoom();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'waiting' | 'full'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'players' | 'name'>('recent');
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  // Use API rooms
  const rooms = apiRooms;
  const displayRooms = rooms;

  // Get player count from room data
  // Room has master (1 player) + guest (if exists, 1 player) = max 2 players
  const getPlayerCount = (roomId: string) => {
    const room = rooms.find((r: Room) => r.id === roomId);
    if (!room) return 0;
    // Master always exists (1) + guest (if exists, 1)
    return room.guest ? 2 : 1;
  };

  // Filter rooms
  let filteredRooms = displayRooms.filter((room: Room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.master.username.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;

    const playerCount = getPlayerCount(room.id);
    if (filterStatus === 'available') return playerCount < 2;
    if (filterStatus === 'waiting') return playerCount === 1;
    if (filterStatus === 'full') return playerCount >= 2;

    return true;
  });

  // Sort rooms
  filteredRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'players') {
      return getPlayerCount(b.id) - getPlayerCount(a.id);
    }
    // 'recent' - maintain original order
    return 0;
  });

  const handleJoinRoom = async (roomId: string) => {
    setJoiningRoomId(roomId);
    try {
      const room = await joinRoom(roomId);
      
      if (room) {
        router.push(`/room/${roomId}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to join room');
    } finally {
      setJoiningRoomId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Browse Games
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Join an existing room or create your own Caro match
          </p>
        </div>

        {/* Controls section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search bar */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search rooms by name or player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Create room button */}
          <button
            onClick={onCreateRoom}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Room
          </button>
        </div>

        {/* Filter and sort options */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Filter:</span>
            </div>
            {(['all', 'available', 'waiting', 'full'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status === 'all' && 'All Rooms'}
                {status === 'available' && 'Available'}
                {status === 'waiting' && 'Waiting'}
                {status === 'full' && 'Full'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                <option value="recent">Recent</option>
                <option value="players">Most Players</option>
                <option value="name">Room Name</option>
              </select>
            </div>
            <button
              onClick={refetch}
              disabled={isLoading}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Refresh room list"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${
                  isLoading ? 'animate-spin' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Rooms grid or empty state */}
        {isLoading && !displayRooms.length ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-spin" />
                  <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">Loading rooms...</p>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                {searchQuery || filterStatus !== 'all'
                  ? 'No rooms found matching your criteria'
                  : 'No rooms available yet'}
              </p>
              <button
                onClick={onCreateRoom}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-indigo-500/50 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Create First Room
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                playerCount={getPlayerCount(room.id)}
                maxPlayers={2}
                onJoin={handleJoinRoom}
                isLoading={joiningRoomId === room.id}
              />
            ))}
          </div>
        )}

        {/* Stats footer */}
        {filteredRooms.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {displayRooms.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Rooms</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {displayRooms.filter((r) => getPlayerCount(r.id) < 2).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Available</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {displayRooms.filter((r) => getPlayerCount(r.id) === 1).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Waiting</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {displayRooms.filter((r) => getPlayerCount(r.id) >= 2).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Full</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
