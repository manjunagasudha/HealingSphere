import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertHelpRequestSchema, type InsertHelpRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function HelpRequestForm() {
  const { toast } = useToast();

  const form = useForm<InsertHelpRequest>({
    resolver: zodResolver(insertHelpRequestSchema),
    defaultValues: {
      contactMethod: "",
      urgency: "",
      message: "",
    },
  });

  const submitRequest = useMutation({
    mutationFn: (data: InsertHelpRequest) => 
      apiRequest("POST", "/api/help-requests", data),
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your request has been submitted securely. A trained professional will reach out using your preferred contact method.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "Please try again or use emergency contact options below.",
        variant: "destructive",
      });
    },
  });

  const handleEmergencyContact = () => {
    const confirmed = confirm(
      "This will redirect you to the National Domestic Violence Hotline. Continue?"
    );
    if (confirmed) {
      window.open("https://www.thehotline.org/", "_blank");
    }
  };

  return (
    <section id="help" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Get Immediate Support</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose how you'd like to receive help. All options are confidential and secure.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl">Anonymous Help Request</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    No registration required. Your privacy is completely protected.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => submitRequest.mutate(data))} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-1">
                            <span>Preferred Contact Method</span>
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="chat">Live Chat</SelectItem>
                              <SelectItem value="email">Email (anonymous)</SelectItem>
                              <SelectItem value="call">Phone Call</SelectItem>
                              <SelectItem value="text">Text Message</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-1">
                            <span>Urgency Level</span>
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate (Emergency)</SelectItem>
                              <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                              <SelectItem value="soon">Soon (Within a week)</SelectItem>
                              <SelectItem value="general">General Support</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us how we can help (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share what you're comfortable with. This helps us connect you with the right support..."
                            className="h-32 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Your Safety Comes First</h4>
                        <p className="text-sm text-muted-foreground">
                          This form is completely anonymous. We use encryption to protect your information. 
                          If you're in immediate danger, please call emergency services.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      disabled={submitRequest.isPending}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      {submitRequest.isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleEmergencyContact}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Emergency Contact
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
