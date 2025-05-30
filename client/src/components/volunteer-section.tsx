import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertProfessionalSchema, insertVolunteerSchema, type InsertProfessional, type InsertVolunteer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function VolunteerSection() {
  const { toast } = useToast();

  const professionalForm = useForm<InsertProfessional>({
    resolver: zodResolver(insertProfessionalSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      licenseNumber: "",
      specializations: [],
    },
  });

  const volunteerForm = useForm<InsertVolunteer>({
    resolver: zodResolver(insertVolunteerSchema),
    defaultValues: {
      name: "",
      email: "",
      motivation: "",
      availability: "",
    },
  });

  const submitProfessional = useMutation({
    mutationFn: (data: InsertProfessional) => 
      apiRequest("POST", "/api/professionals", data),
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "You will receive license verification instructions via email.",
      });
      professionalForm.reset();
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const submitVolunteer = useMutation({
    mutationFn: (data: InsertVolunteer) => 
      apiRequest("POST", "/api/volunteers", data),
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "You will be contacted about our training program.",
      });
      volunteerForm.reset();
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return (
    <section id="volunteer" className="py-16 bg-gradient-to-br from-secondary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Join Our Support Network</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Licensed professionals and trained volunteers help make this platform a safe space for healing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Professional Registration */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground">Licensed Professionals</h4>
                  <p className="text-sm text-muted-foreground">Therapists, counselors, social workers</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  "License verification required",
                  "Background screening process", 
                  "Ongoing training and support",
                  "Flexible scheduling options"
                ].map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>

              <Form {...professionalForm}>
                <form onSubmit={professionalForm.handleSubmit((data) => submitProfessional.mutate(data))} className="space-y-4">
                  <FormField
                    control={professionalForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
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
                        <FormControl>
                          <Input placeholder="License Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={submitProfessional.isPending}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {submitProfessional.isPending ? "Submitting..." : "Apply as Professional Volunteer"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Peer Support Registration */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground">Peer Supporters</h4>
                  <p className="text-sm text-muted-foreground">Survivors helping survivors</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  "Comprehensive training provided",
                  "Ongoing supervision and support",
                  "Commitment to safety protocols",
                  "Community of fellow volunteers"
                ].map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>

              <Form {...volunteerForm}>
                <form onSubmit={volunteerForm.handleSubmit((data) => submitVolunteer.mutate(data))} className="space-y-4">
                  <FormField
                    control={volunteerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Preferred Name (can be anonymous)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={volunteerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="email" placeholder="Contact Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={volunteerForm.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Why do you want to volunteer as a peer supporter?"
                            rows={3}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={volunteerForm.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
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
                  <Button 
                    type="submit" 
                    disabled={submitVolunteer.isPending}
                    className="w-full bg-secondary hover:bg-secondary/90"
                  >
                    {submitVolunteer.isPending ? "Submitting..." : "Apply as Peer Supporter"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
