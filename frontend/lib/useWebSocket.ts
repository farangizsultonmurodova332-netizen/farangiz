import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './auth';
import type { CallSignal } from './types';

interface WebSocketMessage {
  type: 'message' | 'typing' | 'message_updated' | 'message_deleted' | 'call_signal' | 'read_receipt';
  message?: any;
  user_id?: number;
  username?: string;
  signal?: CallSignal;
  room_id?: number;
  reader_id?: number;
}

interface UseWebSocketOptions {
  roomId: number;
  onMessage?: (message: any) => void;
  onMessageUpdated?: (message: any) => void;
  onMessageDeleted?: (message: any) => void;
  onTyping?: (userId: number, username: string) => void;
  onCallSignal?: (signal: CallSignal) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({
  roomId,
  onMessage,
  onMessageUpdated,
  onMessageDeleted,
  onTyping,
  onCallSignal,
  onConnect,
  onDisconnect,
}: UseWebSocketOptions) {
  const { accessToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);
  const maxReconnectAttempts = 5;

  // Store callbacks in refs to avoid re-creating WebSocket on callback changes
  const onMessageRef = useRef(onMessage);
  const onMessageUpdatedRef = useRef(onMessageUpdated);
  const onMessageDeletedRef = useRef(onMessageDeleted);
  const onTypingRef = useRef(onTyping);
  const onCallSignalRef = useRef(onCallSignal);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  // Update refs when callbacks change
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onMessageUpdatedRef.current = onMessageUpdated; }, [onMessageUpdated]);
  useEffect(() => { onMessageDeletedRef.current = onMessageDeleted; }, [onMessageDeleted]);
  useEffect(() => { onTypingRef.current = onTyping; }, [onTyping]);
  useEffect(() => { onCallSignalRef.current = onCallSignal; }, [onCallSignal]);
  useEffect(() => { onConnectRef.current = onConnect; }, [onConnect]);
  useEffect(() => { onDisconnectRef.current = onDisconnect; }, [onDisconnect]);

  const connect = useCallback(() => {
    if (!accessToken || !roomId) return;
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      return;
    }

    // Get WebSocket URL from environment or default
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.NEXT_PUBLIC_WS_URL || 'localhost:8000';
    const wsUrl = `${wsProtocol}//${wsHost}/ws/chat/${roomId}/?token=${accessToken}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onConnectRef.current?.();
      };

      ws.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data);

        if (data.type === 'message' && data.message) {
          onMessageRef.current?.(data.message);
        } else if (data.type === 'message_updated' && data.message) {
          onMessageUpdatedRef.current?.(data.message);
        } else if (data.type === 'message_deleted' && data.message) {
          onMessageDeletedRef.current?.(data.message);
        } else if (data.type === 'typing' && data.user_id && data.username) {
          onTypingRef.current?.(data.user_id, data.username);
        } else if (data.type === 'call_signal' && data.signal) {
          onCallSignalRef.current?.(data.signal);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        onDisconnectRef.current?.();

        // Attempt to reconnect
        if (shouldReconnectRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, timeout);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, [accessToken, roomId]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((body: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        body,
      }));
      return true;
    }
    return false;
  }, []);

  const sendTyping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
      }));
    }
  }, []);

  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    sendTyping,
    disconnect,
    reconnect: connect,
  };
}
