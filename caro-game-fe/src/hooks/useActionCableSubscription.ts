import { useEffect, useRef } from 'react';
import createCableConsumer from '@/lib/actioncable';

interface UseActionCableSubscriptionOptions {
  query: string;
  operationName: string;
  variables?: Record<string, any>;
  onData: (data: any) => void;
  onError?: (error: any) => void;
  skip?: boolean; // Add skip option to conditionally disable subscription
}

/**
 * Custom hook for ActionCable GraphQL subscriptions
 * Uses stable callback references to prevent re-subscription on callback changes
 */
export function useActionCableSubscription({
  query,
  operationName,
  variables = {},
  onData,
  onError,
  skip = false,
}: UseActionCableSubscriptionOptions) {
  // Store callbacks in refs to keep them stable
  const onDataRef = useRef(onData);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (skip) {
      return;
    }

    const cable = createCableConsumer();
    
    const subscription = cable.subscriptions.create('GraphqlChannel', {
      connected() {
        this.perform('execute', {
          query,
          variables,
          operationName,
        });
      },

      disconnected() {
        // Connection closed
      },

      received(data: any) {
        if (data.errors) {
          if (onErrorRef.current) {
            onErrorRef.current(data.errors);
          }
        } else if (data.result?.data) {
          onDataRef.current(data.result.data);
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [query, operationName, JSON.stringify(variables), skip]);
}
