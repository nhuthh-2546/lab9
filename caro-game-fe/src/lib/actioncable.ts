import { createConsumer } from '@rails/actioncable';

// Create ActionCable consumer
const createCableConsumer = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // WebSocket URL for ActionCable
  const wsUrl = `ws://localhost:3000/cable?token=${token}`;

  return createConsumer(wsUrl);
};

export default createCableConsumer;
