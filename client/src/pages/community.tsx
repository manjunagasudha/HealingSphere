import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StoryCard from "@/components/community/story-card";
import ShareStoryForm from "@/components/community/share-story-form";
import { Plus, Heart, MessageCircle, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Story } from "@shared/schema";

export default function Community() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const supportStoryMutation = useMutation({
    mutationFn: async (storyId: number) => {
      const response = await apiRequest("PATCH", `/api/stories/${storyId}/support`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({
        title: "Support sent",
        description: "Your support has been added to this story.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send support. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSupportStory = (storyId: number) => {
    supportStoryMutation.mutate(storyId);
  };

  const handleStorySubmitted = () => {
    setIsShareDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
    toast({
      title: "Story submitted",
      description: "Your story has been submitted for moderation. Thank you for sharing.",
    });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Stories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Anonymous stories of hope, healing, and strength from our community.
            All posts are moderated for safety.
          </p>
        </div>

        {/* Safety Notice */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="text-trust-blue h-6 w-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Guidelines</h3>
                <p className="text-sm text-blue-800">
                  This is a safe space for sharing healing journeys. All stories are anonymous and moderated.
                  Please be respectful and supportive in your interactions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your healing journey.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onSupport={() => handleSupportStory(story.id)}
                isSupporting={supportStoryMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Share Story CTA */}
        <Card className="border-2 border-dashed border-gray-300 bg-white">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-trust-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-trust-blue h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Your Story</h3>
              <p className="text-gray-600 mb-6">
                Your experience can help others feel less alone. All stories are anonymous and moderated.
              </p>
              <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-trust-blue hover:bg-blue-700 text-white font-semibold">
                    <Plus className="mr-2 h-5 w-5" />
                    Share Anonymously
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      Share Your Story
                    </DialogTitle>
                  </DialogHeader>
                  <ShareStoryForm onSubmitted={handleStorySubmitted} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Support Resources */}
        <div className="mt-16 text-center bg-healing-green bg-opacity-10 rounded-2xl p-8">
          <Heart className="h-16 w-16 text-healing-green mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Support?</h3>
          <p className="text-gray-600 mb-6">
            Reading stories can bring up emotions. If you need someone to talk to, we're here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-healing-green hover:bg-green-600 text-white">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Anonymous Chat
            </Button>
            <Button variant="outline" className="border-trust-blue text-trust-blue hover:bg-blue-50">
              Browse Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
