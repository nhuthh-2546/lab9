'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { RoomListing } from '@/components/ui/RoomListing';
import { CreateRoomModal } from '@/components/modals/CreateRoomModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateRoom } from '@/hooks/useCreateRoom';

export default function BrowsePage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const { createRoom, loading: isCreatingRoom } = useCreateRoom();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleCreateRoom = () => {
    setIsCreateModalOpen(true);
    setRoomName(''); // Reset room name
  };

  const handleCreateRoomSubmit = async () => {
    try {
      const room = await createRoom(roomName);
      if (room) {
        setIsCreateModalOpen(false);
        setRoomName('');
        router.push(`/room/${room.id}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create room');
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setRoomName('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar username={user?.username} isAuthenticated={isAuthenticated} onLogout={logout} />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="inline-block">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-spin" />
                <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar username={user?.username} isAuthenticated={isAuthenticated} onLogout={logout} />
      <RoomListing
        onCreateRoom={handleCreateRoom}
      />
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        roomName={roomName}
        isLoading={isCreatingRoom}
        onRoomNameChange={setRoomName}
        onCreateRoom={handleCreateRoomSubmit}
        onClose={handleCloseModal}
      />
    </div>
  );
}
