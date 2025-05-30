import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWebSocket } from "@/hooks/use-websocket";
import { Send, MessageCircle, Shield, UserCheck, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  fromRole: 'client' | 'volunteer';
  type?: 'message' | 'system' | 'connection';
}

interface ChatInterfaceProps {
  sessionId: string;
}

export default function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isVolunteerConnected, setIsVolunteerConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { socket, sendMessage, isConnected } = useWebSocket(
    `/ws?sessionId=${sessionId}&role=client`,
    {
      onMessage: (data) => {
        try {
          const message = JSON.parse(data);
          
          if (message.type === 'connection') {
            setConnectionStatus('connected');
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              content: "Connected to secure chat. Waiting for a volunteer to join...",
              timestamp: new Date().toISOString(),
              fromRole: 'client',
              type: 'system'
            }]);
            return;
          }

          if (message.type === 'volunteer_joined') {
            setIsVolunteerConnected(true);
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              content: "A verified volunteer has joined the chat. You can now share what's on your mind.",
              timestamp: new Date().toISOString(),
              fromRole: 'client',
              type: 'system'
            }]);
            return;
          }

          if (message.type === 'volunteer_left') {
            setIsVolunteerConnected(false);
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              content: "The volunteer has left the chat. You can continue waiting for another volunteer or start a new session.",
              timestamp: new Date().toISOString(),
              fromRole: 'client',
              type: 'system'
            }]);
            return;
          }

          // Regular message
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: message.content,
            timestamp: message.timestamp,
            fromRole: message.fromRole,
            type: 'message'
          }]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error",
          description: "Lost connection to chat server. Trying to reconnect...",
          variant: "destructive",
        });
      },
      onClose: () => {
        setConnectionStatus('disconnected');
      }
    }
  );

  useEffect(() => {
    if (isConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  }, [isConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !isConnected) return;

    const messageData = {
      type: 'message',
      content: inputMessage.trim(),
      sessionId,
      timestamp: new Date().toISOString()
    };

    sendMessage(JSON.stringify(messageData));
    
    // Add message to local state immediately
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      fromRole: 'client',
      type: 'message'
    }]);

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-healing-green';
      case 'connecting':
        return 'bg-warm-accent';
      case 'disconnected':
        return 'bg-emergency-red';
      default:
        return 'bg-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected Securely';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Chat Header */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-trust-blue rounded-full flex items-center justify-center">
                  <MessageCircle className="text-white h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Anonymous Support Chat
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Session ID: {sessionId.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className={`${getConnectionStatusColor()} text-white`}>
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  {getConnectionStatusText()}
                </Badge>
                {isVolunteerConnected && (
                  <Badge className="bg-healing-green text-white">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Volunteer Online
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Safety Notice */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="text-trust-blue h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900 mb-1">Your Safety & Privacy</p>
                <p className="text-blue-800">
                  This chat is end-to-end encrypted and completely anonymous. 
                  Only you and the volunteer can see these messages. 
                  You can leave at any time using the exit button.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {connectionStatus === 'connected' 
                      ? "Connected! Waiting for messages..."
                      : "Connecting to secure chat..."
                    }
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id}>
                    {message.type === 'system' ? (
                      <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
                          <Clock className="w-3 h-3 mr-2" />
                          {message.content}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    ) : (
                      <div className={`flex ${message.fromRole === 'client' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.fromRole === 'client'
                            ? 'bg-trust-blue text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.fromRole === 'client' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <Separator />
            
            {/* Message Input */}
            <div className="p-6">
              {connectionStatus === 'disconnected' ? (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center text-emergency-red mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Connection Lost</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Trying to reconnect to the chat server...
                  </p>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      isVolunteerConnected 
                        ? "Type your message..." 
                        : "Waiting for volunteer to join..."
                    }
                    disabled={connectionStatus !== 'connected'}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || connectionStatus !== 'connected'}
                    className="bg-trust-blue hover:bg-blue-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="border-emergency-red text-emergency-red hover:bg-red-50"
            onClick={() => window.history.back()}
          >
            Leave Chat
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Get Additional Resources
          </Button>
        </div>

        {/* Emergency Notice */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-warm-accent h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900 mb-1">Emergency Reminder</p>
                <p className="text-yellow-800">
                  If you're in immediate physical danger, please call 911 or use the SOS button 
                  in the bottom right corner of your screen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
