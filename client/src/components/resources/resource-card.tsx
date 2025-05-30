import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, ExternalLink, Shield, Phone, Heart, Users } from "lucide-react";
import type { Resource } from "@shared/schema";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'self-help':
        return BookOpen;
      case 'emergency':
        return Phone;
      case 'techniques':
        return Heart;
      case 'legal':
        return Shield;
      default:
        return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'self-help':
        return 'bg-healing-green';
      case 'emergency':
        return 'bg-emergency-red';
      case 'techniques':
        return 'bg-purple-500';
      case 'legal':
        return 'bg-warm-accent';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'self-help':
        return 'Self-Help Guide';
      case 'emergency':
        return 'Emergency Resource';
      case 'techniques':
        return 'Healing Technique';
      case 'legal':
        return 'Legal Information';
      default:
        return 'Resource';
    }
  };

  const handleViewResource = () => {
    // In a real implementation, this would open the full resource content
    // For now, we'll show a simple alert with the content
    const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resource.title} - HealNet</title>
          <style>
            body {
              font-family: 'Inter', system-ui, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              color: #374151;
            }
            .header {
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 1rem;
              margin-bottom: 2rem;
            }
            .title {
              font-size: 2rem;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 0.5rem;
            }
            .category {
              display: inline-block;
              background: #3b82f6;
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.875rem;
              font-weight: 500;
            }
            .content {
              white-space: pre-wrap;
              font-size: 1.1rem;
              line-height: 1.8;
            }
            .footer {
              margin-top: 2rem;
              padding-top: 1rem;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 0.875rem;
            }
            .verified-badge {
              background: #10b981;
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.75rem;
              margin-left: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${resource.title}</h1>
            <span class="category">${getCategoryLabel(resource.category)}</span>
            ${resource.isVerified ? '<span class="verified-badge">✓ Verified Resource</span>' : ''}
          </div>
          <div class="content">${resource.content}</div>
          <div class="footer">
            <p>This resource is provided by HealNet - Safe Support Platform</p>
            <p>If you're in crisis, please call 911 or contact the Crisis Lifeline at 988</p>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const CategoryIcon = getCategoryIcon(resource.category);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 ${getCategoryColor(resource.category)} rounded-lg flex items-center justify-center mr-3`}>
            <CategoryIcon className="text-white h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{resource.title}</h3>
            <p className="text-sm text-gray-500">{getCategoryLabel(resource.category)}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <p className="text-gray-600 line-clamp-3 leading-relaxed">
            {resource.content.length > 150 
              ? `${resource.content.substring(0, 150)}...`
              : resource.content
            }
          </p>
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            {resource.readTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{resource.readTime} min read</span>
              </div>
            )}
            {resource.isVerified && (
              <div className="flex items-center text-healing-green">
                <Shield className="h-4 w-4 mr-1" />
                <span>Verified</span>
              </div>
            )}
          </div>
          <Button
            onClick={handleViewResource}
            variant="ghost"
            size="sm"
            className="text-trust-blue hover:text-blue-700 hover:bg-blue-50 font-medium"
          >
            Read More
            <ExternalLink className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
