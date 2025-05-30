import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HelpRequestForm from "@/components/forms/help-request-form";
import { Heart, MessageCircle, Calendar, FileText, Shield, Lock, UserX, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                You Are Not Alone.<br />
                <span className="text-trust-blue">Healing Starts Here.</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                A safe, confidential platform connecting abuse survivors with verified counselors,
                supportive community, and essential resources for healing and rebuilding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/chat">
                  <Button className="bg-trust-blue hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Get Help Now
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline" className="border-2 border-trust-blue text-trust-blue hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg">
                    <FileText className="mr-2 h-5 w-5" />
                    Explore Resources
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Lock className="text-healing-green mr-2 h-4 w-4" />
                  <span>End-to-End Encrypted</span>
                </div>
                <div className="flex items-center">
                  <UserX className="text-healing-green mr-2 h-4 w-4" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-healing-green mr-2 h-4 w-4" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Peaceful counseling environment"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-healing-green rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">
                    <span className="font-bold text-trust-blue">247</span> counselors online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section id="help" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Right Now?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No registration required. Get immediate support through our anonymous help system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-trust-blue to-blue-600 text-white border-0">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
                  <MessageCircle className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Anonymous Chat</h3>
                <p className="text-blue-100 mb-6">Connect instantly with trained volunteers for immediate support and guidance.</p>
                <Link href="/chat">
                  <Button className="bg-white text-trust-blue hover:bg-gray-50 w-full font-semibold">
                    Start Chat Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-healing-green to-green-600 text-white border-0">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
                  <Calendar className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Book Counselor</h3>
                <p className="text-green-100 mb-6">Schedule sessions with licensed psychologists and trained counselors.</p>
                <Link href="/volunteer">
                  <Button className="bg-white text-healing-green hover:bg-gray-50 w-full font-semibold">
                    Book Session
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warm-accent to-yellow-600 text-white border-0">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Help Request</h3>
                <p className="text-yellow-100 mb-6">Submit a confidential help request and get personalized support resources.</p>
                <Button className="bg-white text-warm-accent hover:bg-gray-50 w-full font-semibold">
                  Request Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Request Form */}
      <HelpRequestForm />

      {/* Safety Notice */}
      <section className="py-12 bg-blue-50 border-t border-blue-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-trust-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Safety & Privacy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Lock className="text-trust-blue h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">End-to-End Encryption</h4>
                  <p className="text-sm text-gray-600">All communications are encrypted and secure. No one can access your conversations.</p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <UserX className="text-trust-blue h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Complete Anonymity</h4>
                  <p className="text-sm text-gray-600">Use the platform without providing personal information. Your identity stays protected.</p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Shield className="text-trust-blue h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">No Data Tracking</h4>
                  <p className="text-sm text-gray-600">We don't track your browsing or store unnecessary data. Your privacy is paramount.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
