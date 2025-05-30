import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import VolunteerApplicationForm from "@/components/forms/volunteer-application";
import { CheckCircle, Heart, Shield, Clock, Award, Users } from "lucide-react";
import type { Volunteer } from "@shared/schema";

export default function VolunteerPage() {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const { data: volunteers = [], isLoading } = useQuery<Volunteer[]>({
    queryKey: ["/api/volunteers/verified"],
  });

  const requirements = [
    {
      icon: Award,
      title: "Licensed Professionals",
      description: "Psychologists, counselors, social workers, and therapists"
    },
    {
      icon: Users,
      title: "Trained Volunteers",
      description: "Crisis intervention training and peer support certification"
    },
    {
      icon: Shield,
      title: "Verification Process",
      description: "Thorough background checks and credential verification"
    }
  ];

  const benefits = [
    "Make a meaningful impact in survivors' lives",
    "Flexible scheduling to fit your availability",
    "Ongoing training and professional development",
    "Safe, encrypted communication platform",
    "Supportive volunteer community network"
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Professional counseling environment"
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Join Our Support Network</h1>
            <p className="text-lg text-gray-600 mb-8">
              Are you a licensed counselor, psychologist, or trained volunteer?
              Help us create a safer world by joining our verified support network.
            </p>

            <div className="space-y-4 mb-8">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-healing-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-white h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{req.title}</h4>
                    <p className="text-gray-600">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-healing-green hover:bg-green-600 text-white font-semibold">
                    <Heart className="mr-2 h-5 w-5" />
                    Apply to Volunteer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      Volunteer Application
                    </DialogTitle>
                  </DialogHeader>
                  <VolunteerApplicationForm 
                    onSubmitted={() => setIsApplicationOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">
              Why Volunteer with HealNet?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="text-healing-green h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Volunteers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Verified Volunteers</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No verified volunteers yet</h3>
              <p className="text-gray-600">Be among the first to join our support network.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.slice(0, 6).map((volunteer) => (
                <Card key={volunteer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-healing-green rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-semibold text-lg">
                          {volunteer.fullName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{volunteer.fullName}</h3>
                        <Badge variant="secondary" className="bg-healing-green text-white">
                          {volunteer.licenseType.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    {volunteer.specializations && volunteer.specializations.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {volunteer.specializations.slice(0, 3).map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {volunteer.yearsExperience && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{volunteer.yearsExperience} years experience</span>
                      </div>
                    )}
                    
                    {volunteer.bio && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {volunteer.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-br from-trust-blue to-blue-600 rounded-2xl p-12 text-white">
          <Heart className="h-16 w-16 mx-auto mb-6 text-white" />
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of dedicated professionals and volunteers committed to supporting abuse survivors.
          </p>
          <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-white text-trust-blue hover:bg-gray-100 font-semibold">
                <Heart className="mr-2 h-5 w-5" />
                Start Your Application
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
