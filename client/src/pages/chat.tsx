import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Send, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/chat-interface";

export default function Chat() {
  const { sessionId } = useParams();
  const [, setLocation] = useLocation();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);

  const startNewSession = async () => {
    try {
      const response = await fetch("/api/chat-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAnonymous: true }),
      });
      const { sessionId: newSessionId } = await response.json();
      setCurrentSessionId(newSessionId);
      setLocation(`/chat/${newSessionId}`);
    } catch (error) {
      console.error("Failed to start chat session:", error);
    }
  };

  useEffect(() => {
    if (!currentSessionId) {
      startNewSession();
    }
  }, [currentSessionId]);

  if (!currentSessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Starting secure chat session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-success" />
                <span className="font-medium">Secure Anonymous Chat</span>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Encrypted
                </Badge>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => window.location.replace("https://www.google.com")}
            >
              Quick Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-6">
        <ChatInterface sessionId={currentSessionId} />
      </div>
    </div>
  );
}
