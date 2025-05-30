import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SafetyAlert {
  type: 'slow_response' | 'inappropriate_content' | 'security_warning';
  message: string;
  actions?: Array<{ label: string; action: () => void }>;
}

export function SafetyMonitor() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [responseTime, setResponseTime] = useState<number>(0);

  // Monitor response times
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      try {
        const response = await originalFetch(...args);
        const endTime = Date.now();
        const duration = endTime - startTime;
        setResponseTime(duration);
        
        // Alert if response is slow
        if (duration > 10000) { // 10 seconds
          setAlerts(prev => [...prev, {
            type: 'slow_response',
            message: 'Our servers are responding slowly. If you need immediate help, please use emergency contacts.',
            actions: [
              { label: 'Emergency Contacts', action: () => setShowEmergencyDialog(true) },
              { label: 'Continue Waiting', action: () => setAlerts(prev => prev.filter(a => a.type !== 'slow_response')) }
            ]
          }]);
        }
        
        return response;
      } catch (error) {
        setAlerts(prev => [...prev, {
          type: 'security_warning',
          message: 'Connection issue detected. Your safety is our priority - try refreshing or use emergency contacts.',
          actions: [
            { label: 'Emergency Help', action: () => setShowEmergencyDialog(true) },
            { label: 'Refresh Page', action: () => window.location.reload() }
          ]
        }]);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const emergencyContacts = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free crisis counseling via text'
    },
    {
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      description: '24/7 confidential support'
    }
  ];

  return (
    <>
      {/* Safety Alerts */}
      {alerts.map((alert, index) => (
        <div key={index} className="fixed top-4 right-4 z-50 max-w-md">
          <Alert className="border-orange-200 bg-orange-50">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <AlertDescription>
              {alert.message}
              {alert.actions && (
                <div className="mt-2 space-x-2">
                  {alert.actions.map((action, actionIndex) => (
                    <Button 
                      key={actionIndex}
                      size="sm" 
                      variant="outline" 
                      onClick={action.action}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      ))}

      {/* Emergency Contacts Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>Emergency Support</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-semibold text-foreground">{contact.name}</div>
                <div className="text-red-600 font-bold text-lg">{contact.number}</div>
                <div className="text-sm text-muted-foreground">{contact.description}</div>
                <Button
                  className="mt-2 w-full"
                  onClick={() => window.open(`tel:${contact.number.replace(/\D/g, '')}`)}
                >
                  Call Now
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Response Time Indicator */}
      {responseTime > 5000 && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
            <span>Connecting... Response time: {(responseTime / 1000).toFixed(1)}s</span>
          </div>
        </div>
      )}
    </>
  );
}