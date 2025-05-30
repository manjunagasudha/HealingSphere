import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  timestamp: number;
  sender: 'user' | 'professional' | 'volunteer';
}

interface WebSocketMessage {
  type: 'join' | 'message' | 'history' | 'end';
  sessionId?: string;
  userType?: 'user' | 'professional' | 'volunteer';
  content?: string;
  messages?: ChatMessage[];
  message?: ChatMessage;
}

export function useWebSocket(sessionId?: string, userType: 'user' | 'professional' | 'volunteer' = 'user') {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!sessionId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setSocket(ws);
        
        // Join the session
        ws.send(JSON.stringify({
          type: 'join',
          sessionId,
          userType
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          switch (data.type) {
            case 'history':
              if (data.messages) {
                setMessages(data.messages);
              }
              break;
            case 'message':
              if (data.message) {
                setMessages(prev => [...prev, data.message!]);
              }
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [sessionId, userType]);

  const sendMessage = (content: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'message',
        content
      }));
    }
  };

  const endSession = () => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'end'
      }));
      socket.close();
    }
  };

  return {
    messages,
    isConnected,
    sendMessage,
    endSession
  };
}
