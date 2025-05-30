import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function QuickExit() {
  const handleQuickExit = () => {
    // Clear browsing history and redirect to a safe site
    if (window.history.replaceState) {
      window.history.replaceState(null, "Google", "https://www.google.com");
    }
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="safe-exit">
      <Button
        onClick={handleQuickExit}
        variant="secondary"
        className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium"
      >
        <X className="mr-2 h-4 w-4" />
        Quick Exit
      </Button>
    </div>
  );
}
