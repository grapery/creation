import { useEffect, useRef } from 'react';
import { getApiBaseUrl } from '../lib/apiBase';

export interface SSEMessage {
  event?: string;
  type?: string;
  data?: string;
  messageId?: string;
  content?: string;
  isComplete?: boolean;
  threadId?: string;
  status?: string;
}

/**
 * Hook for Server-Sent Events (SSE) connection
 * Used for real-time chat updates and notifications
 */
export function useChatSSE(threadId: string, onMessage: (message: SSEMessage) => void) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!threadId) return;

    const baseUrl = getApiBaseUrl('chat');
    const url = `${baseUrl}/sse/chat/${threadId}`;
    
    // Get auth token
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found for SSE connection');
      return;
    }

    // Create EventSource with auth token in URL (some servers support this)
    // Note: EventSource doesn't support custom headers, so we may need to pass token in URL
    const eventSource = new EventSource(`${url}?token=${encodeURIComponent(token)}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEMessage;
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      // EventSource will automatically reconnect
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [threadId, onMessage]);

  return () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };
}

/**
 * Hook for notification SSE
 */
export function useNotificationSSE(onMessage: (message: SSEMessage) => void) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const baseUrl = getApiBaseUrl('server');
    const url = `${baseUrl}/sse/notifications`;
    
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const eventSource = new EventSource(`${url}?token=${encodeURIComponent(token)}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEMessage;
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [onMessage]);

  return () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };
}

/**
 * Hook for activity feed SSE
 */
export function useActivitySSE(onMessage: (message: SSEMessage) => void) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const baseUrl = getApiBaseUrl('server');
    const url = `${baseUrl}/sse/activities`;
    
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const eventSource = new EventSource(`${url}?token=${encodeURIComponent(token)}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEMessage;
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [onMessage]);

  return () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };
}

