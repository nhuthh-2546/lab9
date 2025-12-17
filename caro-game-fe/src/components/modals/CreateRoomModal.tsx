import React, { FC } from 'react';

interface CreateRoomModalProps {
  isOpen: boolean;
  roomName: string;
  isLoading: boolean;
  onRoomNameChange: (name: string) => void;
  onCreateRoom: () => void;
  onClose: () => void;
}

export const CreateRoomModal: FC<CreateRoomModalProps> = ({
  isOpen,
  roomName,
  isLoading,
  onRoomNameChange,
  onCreateRoom,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 pointer-events-auto animate-slideUp">
          {/* Content */}
          <div className="px-6 py-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Create New Room
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Enter a name for your game room to start playing with friends
            </p>

            {/* Input */}
            <div className="mb-6">
              <input
                id="roomName"
                type="text"
                placeholder="Enter room name (optional)"
                value={roomName}
                onChange={(e) => onRoomNameChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    onCreateRoom();
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                autoFocus
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onCreateRoom}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
