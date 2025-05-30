import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Shield, Brain, Scale, Sprout, Phone, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Resources() {
  const { data: resources = [] } = useQuery({
    queryKey: ["/api/resources"],
  });

  const resourceCategories = [
    {
      icon: Shield,
      title: "Safety Planning",
      description: "Create personalized safety plans and learn protective strategies.",
      color: "bg-primary/10 text-primary",
      category: "safety"
    },
    {
      icon: Brain,
      title: "Trauma & Healing",
      description: "Understanding trauma responses and evidence-based healing approaches.",
      color: "bg-secondary/10 text-secondary",
      category: "trauma"
    },
    {
      icon: Scale,
      title: "Legal Support",
      description: "Know your rights and access legal resources and referrals.",
      color: "bg-accent/10 text-accent",
      category: "legal"
    },
    {
      icon: Sprout,
      title: "Rebuilding Life",
      description: "Tools for rebuilding confidence, relationships, and purpose.",
      color: "bg-success/10 text-success",
      category: "rebuilding"
    }
  ];

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
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-semibold text-xl">Resource Library</span>
              </div>
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
          <h1 className="text-3xl font-bold text-foreground mb-4">Resource Library</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Verified articles, guides, and tools to support your healing journey.
          </p>
        </div>

        {/* Resource Categories */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
          {resourceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.category} className="resource-card hover:border-primary/50 cursor-pointer">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  <div className="text-sm text-muted-foreground mb-4">
                    {Math.floor(Math.random() * 20) + 5} articles
                  </div>
                  <Button variant="link" className="text-primary hover:text-blue-700 p-0 h-auto font-medium text-sm">
                    Explore resources →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency Contacts */}
        <Card className="border-l-4 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-destructive" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="font-semibold text-foreground">National Domestic Violence Hotline</div>
                <div className="text-destructive font-bold text-lg">1-800-799-7233</div>
                <div className="text-sm text-muted-foreground">24/7 confidential support</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Crisis Text Line</div>
                <div className="text-destructive font-bold text-lg">Text HOME to 741741</div>
                <div className="text-sm text-muted-foreground">Free 24/7 crisis support</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">National Sexual Assault Hotline</div>
                <div className="text-destructive font-bold text-lg">1-800-656-4673</div>
                <div className="text-sm text-muted-foreground">RAINN's 24/7 support</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources List */}
        {resources.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Latest Resources</h2>
            <div className="space-y-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                        <p className="text-muted-foreground mb-3">{resource.content}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-primary">{resource.category}</span>
                          {resource.isVerified && (
                            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
