import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Heart, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoryForm } from "@/components/story-form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
  const { toast } = useToast();
  const { data: stories = [] } = useQuery({
    queryKey: ["/api/community-stories"],
  });

  const supportStoryMutation = useMutation({
    mutationFn: async (storyId: number) => {
      return apiRequest("POST", `/api/community-stories/${storyId}/support`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-stories"] });
      toast({
        title: "Support added",
        description: "Thank you for showing support to a fellow survivor.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add support. Please try again.",
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
              <h1 className="text-xl font-semibold">Community Stories</h1>
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Stories of Hope & Healing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Anonymous stories of strength, healing, and hope from survivors like you.
            <span className="block mt-2 text-sm text-muted-foreground">
              All posts are moderated for safety and support.
            </span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Story Submission Form */}
          <Card className="mb-8 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Share Your Story (Anonymous)</CardTitle>
            </CardHeader>
            <CardContent>
              <StoryForm />
            </CardContent>
          </Card>

          {/* Stories List */}
          <div className="space-y-6">
            {stories.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No stories have been shared yet. Be the first to inspire others.</p>
                </CardContent>
              </Card>
            ) : (
              stories.map((story) => (
                <Card key={story.id} className="story-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{story.authorName}</div>
                          <div className="text-sm text-muted-foreground">
                            Shared {new Date(story.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-success/20 text-success">
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
                        onClick={() => supportStoryMutation.mutate(story.id)}
                        disabled={supportStoryMutation.isPending}
                        className="p-0 h-auto text-muted-foreground hover:text-destructive"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{story.supportCount}</span>
                      </Button>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>Supportive community</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {stories.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View More Stories
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
