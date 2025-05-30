import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertCommunityStorySchema, type InsertCommunityStory, type CommunityStory } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function CommunityWall() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stories, isLoading } = useQuery<CommunityStory[]>({
    queryKey: ["/api/stories"],
  });

  const form = useForm<InsertCommunityStory & { consent: boolean }>({
    resolver: zodResolver(insertCommunityStorySchema.extend({
      consent: z.boolean().refine(val => val === true, "You must agree to the moderation policy")
    })),
    defaultValues: {
      content: "",
      category: "general",
      consent: false,
    },
  });

  const submitStory = useMutation({
    mutationFn: (data: InsertCommunityStory) => 
      apiRequest("POST", "/api/stories", data),
    onSuccess: () => {
      toast({
        title: "Story Submitted",
        description: "Thank you for sharing. Your story will be reviewed and posted anonymously within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const supportStory = useMutation({
    mutationFn: (id: number) => 
      apiRequest("POST", `/api/stories/${id}/support`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
    },
  });

  return (
    <section id="community" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Community Stories</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Anonymous stories of strength, healing, and hope from survivors like you.
            <span className="block mt-2 text-sm">All posts are moderated for safety and support.</span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Story Submission Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Share Your Story (Anonymous)</h4>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => {
                  const { consent, ...storyData } = data;
                  submitStory.mutate(storyData);
                })} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Share your story, a moment of strength, or words of encouragement for others..."
                            rows={4}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-muted-foreground">
                            I understand this will be reviewed before posting
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={submitStory.isPending}
                      className="bg-secondary hover:bg-secondary/90"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      {submitStory.isPending ? "Submitting..." : "Share Anonymously"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Stories Display */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading stories...</div>
            ) : stories?.length === 0 ? (
              <div className="text-center text-muted-foreground">No stories yet. Be the first to share!</div>
            ) : (
              stories?.map((story) => (
                <Card key={story.id} className="border-l-4 border-l-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Anonymous Survivor</div>
                          <div className="text-sm text-muted-foreground">
                            Shared {formatDistanceToNow(new Date(story.createdAt!), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    </div>
                    <p className="text-foreground leading-relaxed mb-4">
                      {story.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => supportStory.mutate(story.id)}
                        disabled={supportStory.isPending}
                        className="flex items-center space-x-1 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{story.supportCount}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View More Stories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
