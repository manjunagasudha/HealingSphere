import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertStorySchema, type InsertStory } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, Shield } from "lucide-react";
import { nanoid } from "nanoid";

interface ShareStoryFormProps {
  onSubmitted: () => void;
}

export default function ShareStoryForm({ onSubmitted }: ShareStoryFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertStory>({
    resolver: zodResolver(insertStorySchema),
    defaultValues: {
      sessionId: nanoid(),
      authorName: "",
      title: "",
      content: "",
      healingStage: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertStory) => {
      const response = await apiRequest("POST", "/api/stories", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Story submitted",
        description: "Thank you for sharing. Your story will be reviewed before being published.",
      });
      onSubmitted();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStory) => {
    submitMutation.mutate(data);
  };

  const healingStages = [
    { value: "new-journey", label: "New Journey - Just starting to heal" },
    { value: "healing", label: "Healing - Making progress" },
    { value: "thriving", label: "Thriving - Found strength and purpose" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="text-trust-blue h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Safe Sharing Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your story is completely anonymous</li>
              <li>• All stories are moderated for safety</li>
              <li>• Avoid sharing specific details that could identify you</li>
              <li>• Focus on hope, healing, and support for others</li>
            </ul>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anonymous Display Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Hope Seeker, Brave Survivor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healingStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where are you in your healing journey?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {healingStages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Story Title (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="A brief title for your story"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Story *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={8}
                    placeholder="Share your journey, what you've learned, or words of encouragement for others. Remember to keep personal details anonymous."
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Please remember:</strong> Your story will be reviewed by our moderation team
              before being published to ensure it's safe and supportive for all community members.
              This process typically takes 24-48 hours.
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full bg-trust-blue hover:bg-blue-700 text-white py-4 font-semibold"
          >
            {submitMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting Story...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Share Your Story
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
