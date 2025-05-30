import { Button } from "@/components/ui/button";

export default function QuickExitBar() {
  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <div className="safety-indicator text-white text-center py-2 text-sm">
      <div className="container mx-auto flex justify-between items-center px-4">
        <span className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>You're browsing safely & anonymously</span>
        </span>
        <Button
          onClick={handleQuickExit}
          variant="secondary"
          size="sm"
          className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
          </svg>
          Quick Exit
        </Button>
      </div>
    </div>
  );
}
