import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Layers, RotateCcw, Info } from "lucide-react";
import { insertHelpRequestSchema, type InsertHelpRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

export default function HelpRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertHelpRequest>({
    resolver: zodResolver(insertHelpRequestSchema),
    defaultValues: {
      sessionId: nanoid(),
      ageRange: "",
      urgencyLevel: "medium",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertHelpRequest) => {
      const response = await apiRequest("POST", "/api/help-requests", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: "Request submitted successfully",
        description: "A trained volunteer will respond within 2-4 hours. You'll receive a secure link to continue the conversation.",
      });
      form.reset();
    },
    onError: () => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit help request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertHelpRequest) => {
    setIsSubmitting(true);
    submitMutation.mutate(data);
  };

  const handleClearForm = () => {
    form.reset();
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-trust-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Anonymous Help Request</h3>
              <p className="text-gray-600">Your privacy is protected. No personal information required.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Age Range (Optional)
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Prefer not to say" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Prefer not to say</SelectItem>
                            <SelectItem value="under-18">Under 18</SelectItem>
                            <SelectItem value="18-25">18-25</SelectItem>
                            <SelectItem value="26-35">26-35</SelectItem>
                            <SelectItem value="36-50">36-50</SelectItem>
                            <SelectItem value="over-50">Over 50</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="urgencyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Urgency Level
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">I can wait for response</SelectItem>
                            <SelectItem value="medium">Need help soon</SelectItem>
                            <SelectItem value="high">This is urgent</SelectItem>
                            <SelectItem value="emergency">Emergency situation</SelectItem>
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
                      <FormLabel>How can we help you today?</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="Share what's happening and how we can support you. Remember, this is completely confidential."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-start space-x-3">
                  <Checkbox id="safety-check" defaultChecked />
                  <label htmlFor="safety-check" className="text-sm text-gray-600 leading-relaxed">
                    I understand this platform is for support and resources. In case of immediate danger,
                    I will contact emergency services (911) or use the SOS button.
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-trust-blue hover:bg-blue-700 text-white py-4 font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Layers className="mr-2 h-5 w-5" />
                        Submit Request Securely
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClearForm}
                    className="py-4 font-semibold"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Clear Form
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="text-trust-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>What happens next:</strong> A trained volunteer will review your request and respond within 2-4 hours.
                  All communications are encrypted and anonymous. You'll receive a secure link to continue the conversation.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
