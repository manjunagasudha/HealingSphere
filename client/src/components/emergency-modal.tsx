import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, ExternalLink } from "lucide-react";

interface EmergencyProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Emergency({ isOpen, onClose }: EmergencyProps) {
  const emergencyContacts = [
    {
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      description: "24/7 confidential support",
      action: () => window.open("tel:18007997233")
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free 24/7 crisis support",
      action: () => window.open("sms:741741?body=HOME")
    },
    {
      name: "National Sexual Assault Hotline",
      number: "1-800-656-4673",
      description: "RAINN's 24/7 support",
      action: () => window.open("tel:18006564673")
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Help & Crisis Support
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              🚨 If you are in immediate physical danger, call 911 immediately
            </p>
            <Button 
              className="w-full bg-destructive hover:bg-red-600 text-white"
              onClick={() => window.open("tel:911")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 911 Emergency Services
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">24/7 Crisis Support Lines</h3>
            {emergencyContacts.map((contact) => (
              <Card key={contact.name} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{contact.name}</h4>
                      <p className="text-lg font-bold text-destructive">{contact.number}</p>
                      <p className="text-sm text-muted-foreground">{contact.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={contact.action}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                    >
                      {contact.number.includes("Text") ? (
                        <MessageCircle className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Additional Safety Resources</h4>
            <div className="space-y-2 text-sm">
              <Button
                variant="link"
                className="p-0 h-auto text-primary hover:text-blue-700"
                onClick={() => window.open("https://www.thehotline.org/", "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                National Domestic Violence Hotline Website
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto text-primary hover:text-blue-700 block"
                onClick={() => window.open("https://www.rainn.org/", "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                RAINN - National Sexual Assault Organization
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => window.location.replace("https://www.google.com")}
            >
              Quick Exit to Google
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
