import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, UserCheck, Users, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertProfessionalSchema, insertVolunteerSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Volunteer() {
  const { toast } = useToast();
  const [activeForm, setActiveForm] = useState<"professional" | "peer" | null>(null);

  const professionalForm = useForm({
    resolver: zodResolver(insertProfessionalSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      licenseNumber: "",
      bio: "",
      specializations: [],
      availability: "",
    },
  });

  const peerForm = useForm({
    resolver: zodResolver(insertVolunteerSchema),
    defaultValues: {
      name: "",
      email: "",
      motivation: "",
      availability: "",
    },
  });

  const professionalMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/professionals", data);
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "You will receive license verification instructions via email.",
      });
      professionalForm.reset();
      setActiveForm(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const peerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/volunteers", data);
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "You will be contacted about our training program.",
      });
      peerForm.reset();
      setActiveForm(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Join Our Support Network</h1>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => window.location.replace("https://www.google.com")}
            >
              Quick Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Support Network</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Licensed professionals and trained volunteers help make this platform a safe space for healing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Professional Registration */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Licensed Professionals</CardTitle>
                  <p className="text-sm text-muted-foreground">Therapists, counselors, social workers</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {[
                  "License verification required",
                  "Background screening process",
                  "Ongoing training and support",
                  "Flexible scheduling options"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {activeForm === "professional" ? (
                <Form {...professionalForm}>
                  <form
                    onSubmit={professionalForm.handleSubmit((data) => professionalMutation.mutate(data))}
                    className="space-y-4"
                  >
                    <FormField
                      control={professionalForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={professionalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Professional Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={professionalForm.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profession</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your profession" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Licensed Clinical Social Worker">Licensed Clinical Social Worker</SelectItem>
                              <SelectItem value="Licensed Professional Counselor">Licensed Professional Counselor</SelectItem>
                              <SelectItem value="Licensed Marriage & Family Therapist">Licensed Marriage & Family Therapist</SelectItem>
                              <SelectItem value="Psychologist">Psychologist</SelectItem>
                              <SelectItem value="Other Licensed Professional">Other Licensed Professional</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={professionalForm.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="License Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveForm(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={professionalMutation.isPending}
                        className="flex-1 primary-button"
                      >
                        {professionalMutation.isPending ? "Submitting..." : "Apply as Professional"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Button
                  onClick={() => setActiveForm("professional")}
                  className="w-full primary-button"
                >
                  Apply as Professional Volunteer
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Peer Support Registration */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Peer Supporters</CardTitle>
                  <p className="text-sm text-muted-foreground">Survivors helping survivors</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {[
                  "Comprehensive training provided",
                  "Ongoing supervision and support",
                  "Commitment to safety protocols",
                  "Community of fellow volunteers"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {activeForm === "peer" ? (
                <Form {...peerForm}>
                  <form
                    onSubmit={peerForm.handleSubmit((data) => peerMutation.mutate(data))}
                    className="space-y-4"
                  >
                    <FormField
                      control={peerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Name (can be anonymous)</FormLabel>
                          <FormControl>
                            <Input placeholder="Preferred Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={peerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Contact Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={peerForm.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Why do you want to volunteer as a peer supporter?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Why do you want to volunteer as a peer supporter?"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={peerForm.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Availability preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Weekday mornings">Weekday mornings</SelectItem>
                              <SelectItem value="Weekday evenings">Weekday evenings</SelectItem>
                              <SelectItem value="Weekends">Weekends</SelectItem>
                              <SelectItem value="Flexible schedule">Flexible schedule</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveForm(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={peerMutation.isPending}
                        className="flex-1 secondary-button"
                      >
                        {peerMutation.isPending ? "Submitting..." : "Apply as Peer Supporter"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Button
                  onClick={() => setActiveForm("peer")}
                  className="w-full secondary-button"
                >
                  Apply as Peer Supporter
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
