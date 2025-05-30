import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import type { Story } from "@shared/schema";

interface StoryCardProps {
  story: Story;
  onSupport: () => void;
  isSupporting: boolean;
}

export default function StoryCard({ story, onSupport, isSupporting }: StoryCardProps) {
  const getHealingStageColor = (stage: string | null) => {
    switch (stage) {
      case "new-journey":
        return "bg-trust-blue text-white";
      case "healing":
        return "bg-healing-green text-white";
      case "thriving":
        return "bg-warm-accent text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getHealingStageLabel = (stage: string | null) => {
    switch (stage) {
      case "new-journey":
        return "New Journey";
      case "healing":
        return "Healing";
      case "thriving":
        return "Thriving";
      default:
        return "Survivor";
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-pink-400 to-purple-500",
      "from-blue-400 to-indigo-500",
      "from-green-400 to-teal-500",
      "from-yellow-400 to-orange-500",
      "from-purple-400 to-pink-500",
      "from-indigo-400 to-blue-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(story.authorName)} rounded-full flex items-center justify-center mr-3`}>
            <span className="text-white font-semibold text-sm">
              {story.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{story.authorName}</p>
            <p className="text-sm text-gray-500">
              {story.createdAt ? formatTimeAgo(new Date(story.createdAt)) : "Recently"}
            </p>
          </div>
        </div>

        <div className="mb-4">
          {story.healingStage && (
            <Badge className={`${getHealingStageColor(story.healingStage)} mb-3`}>
              {getHealingStageLabel(story.healingStage)}
            </Badge>
          )}
          {story.title && (
            <h3 className="font-semibold text-gray-900 mb-2">{story.title}</h3>
          )}
          <p className="text-gray-700 leading-relaxed line-clamp-6">
            {story.content}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSupport}
            disabled={isSupporting}
            className="flex items-center hover:text-healing-green transition-colors p-0"
          >
            <Heart className="mr-1 h-4 w-4" />
            <span>{story.supportCount || 0} supports</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center hover:text-trust-blue transition-colors p-0"
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            Share hope
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
