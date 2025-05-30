import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "@/components/chat/chat-interface";
import { MessageCircle, Shield, Users, Clock } from "lucide-react";
import { nanoid } from "nanoid";

export default function Chat() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Generate a unique session ID for this chat
    setSessionId(nanoid());
  }, []);

  const handleStartChat = () => {
    setIsConnected(true);
  };

  if (isConnected && sessionId) {
    return <ChatInterface sessionId={sessionId} />;
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Anonymous Support Chat</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect instantly with trained volunteers for confidential support and guidance.
          </p>
        </div>

        {/* Safety Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-trust-blue bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-trust-blue h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">End-to-End Encrypted</h3>
              <p className="text-sm text-gray-600">Your conversations are completely private and secure</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-healing-green bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-healing-green h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Volunteers</h3>
              <p className="text-sm text-gray-600">All volunteers are background-checked and trained</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-warm-accent bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="text-warm-accent h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Available</h3>
              <p className="text-sm text-gray-600">Support is available whenever you need it</p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Starter */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-trust-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-white h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Ready to Connect?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Before you start:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Your chat is completely anonymous and encrypted</li>
                  <li>• You can leave the conversation at any time</li>
                  <li>• Our volunteers are here to listen and support</li>
                  <li>• For emergencies, please call 911 or use the SOS button</li>
                </ul>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Badge className="bg-healing-green text-white">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  12 volunteers online
                </Badge>
                <Badge variant="outline">
                  Average wait time: &lt; 2 minutes
                </Badge>
              </div>

              <Button 
                onClick={handleStartChat}
                className="w-full bg-trust-blue hover:bg-blue-700 text-white py-4 text-lg font-semibold"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Anonymous Chat
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By starting a chat, you acknowledge that this service is for support and guidance only.
                In case of immediate danger, please contact emergency services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Other Ways to Get Support</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-healing-green text-healing-green hover:bg-green-50">
              Browse Resources
            </Button>
            <Button variant="outline" className="border-warm-accent text-warm-accent hover:bg-yellow-50">
              Submit Help Request
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-50">
              Read Community Stories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
