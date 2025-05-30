import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const emergencyOptions = [
  {
    title: "Call 911",
    description: "For immediate physical danger",
    action: () => window.open("tel:911"),
    icon: "🚨",
    urgent: true
  },
  {
    title: "National Domestic Violence Hotline",
    description: "1-800-799-7233",
    action: () => window.open("tel:18007997233"),
    icon: "📞"
  },
  {
    title: "Crisis Text Line",
    description: "Text HOME to 741741",
    action: () => window.open("sms:741741?body=HOME"),
    icon: "💬"
  },
  {
    title: "National Sexual Assault Hotline",
    description: "1-800-656-4673",
    action: () => window.open("tel:18006564673"),
    icon: "🆘"
  },
  {
    title: "Quick Exit Website",
    description: "Leave this site immediately",
    action: () => window.location.replace("https://www.google.com"),
    icon: "🚪"
  }
];

export default function EmergencySOS() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="emergency-pulse bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-3 rounded-lg font-semibold shadow-lg"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Emergency Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Emergency Help Options</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {emergencyOptions.map((option, index) => (
            <div key={index}>
              <Button
                onClick={option.action}
                variant={option.urgent ? "destructive" : "outline"}
                className={`w-full justify-start h-auto p-4 ${option.urgent ? 'border-2 border-destructive' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{option.title}</div>
                    <div className="text-sm opacity-80">{option.description}</div>
                  </div>
                </div>
              </Button>
              {index < emergencyOptions.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4">
          Your safety is our priority. These contacts are available 24/7.
        </div>
      </DialogContent>
    </Dialog>
  );
}
