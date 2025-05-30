import QuickExitBar from "@/components/quick-exit-bar";
import HeroSection from "@/components/hero-section";
import HelpRequestForm from "@/components/help-request-form";
import ResourceLibrary from "@/components/resource-library";
import CommunityWall from "@/components/community-wall";
import VolunteerSection from "@/components/volunteer-section";
import ProfessionalNetwork from "@/components/professional-network";
import EmergencySOS from "@/components/emergency-sos";
import { useEffect } from "react";

export default function Home() {
  // Quick exit functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.replace('https://www.google.com');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <QuickExitBar />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">HealNet</h1>
                <p className="text-xs text-muted-foreground">Safe Support for Survivors</p>
              </div>
            </div>
            
            <EmergencySOS />
          </div>

          {/* Navigation */}
          <nav className="mt-6 border-t pt-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#help" className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                <span>Get Help</span>
              </a>
              <a href="#resources" className="text-foreground hover:text-primary flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span>Resources</span>
              </a>
              <a href="#community" className="text-foreground hover:text-primary flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>Community</span>
              </a>
              <a href="#volunteer" className="text-foreground hover:text-primary flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Volunteer</span>
              </a>
            </div>
          </nav>
        </div>
      </header>

      <HeroSection />
      <HelpRequestForm />
      <ProfessionalNetwork />
      <ResourceLibrary />
      <CommunityWall />
      <VolunteerSection />

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-lg font-bold">HealNet</h5>
                </div>
              </div>
              <p className="text-background/70 text-sm leading-relaxed">
                A safe, confidential platform connecting abuse survivors with professional support and peer community.
              </p>
            </div>

            <div>
              <h6 className="font-semibold text-background mb-4">Get Help</h6>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Anonymous Chat</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Crisis Support</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Schedule Session</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Safety Planning</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-background mb-4">Resources</h6>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Healing Guides</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Legal Support</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Emergency Contacts</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Community Stories</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-background mb-4">Privacy & Safety</h6>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Report Concern</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-background/70">
                © 2024 HealNet. All rights reserved. Your safety and privacy are our top priorities.
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-background/70">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-background/70">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>HIPAA Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
