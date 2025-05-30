import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SOSButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSOSClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmEmergency = () => {
    // In a real implementation, this would:
    // 1. Immediately redirect to emergency services
    // 2. Send location data if available
    // 3. Possibly alert nearby volunteers
    window.open("tel:911", "_self");
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="sos-button">
        <Button
          onClick={handleSOSClick}
          className="bg-emergency-red hover:bg-red-600 text-white w-16 h-16 rounded-full shadow-lg font-bold text-sm transition-all sos-pulse"
        >
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-6 w-6" />
            <span className="text-xs mt-1">SOS</span>
          </div>
        </Button>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-emergency-red flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Emergency Alert
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              This will immediately connect you to emergency services (911).
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">
                  Use this button only in case of immediate physical danger or medical emergency.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2">
            <AlertDialogAction
              onClick={handleConfirmEmergency}
              className="w-full bg-emergency-red hover:bg-red-600 text-white"
            >
              Call 911 Now
            </AlertDialogAction>
            <AlertDialogCancel className="w-full">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
