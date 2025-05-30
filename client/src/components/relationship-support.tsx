import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const relationshipResources = [
  {
    title: "Breakup Recovery",
    description: "Professional guidance for processing heartbreak and moving forward",
    topics: ["Emotional healing", "Self-worth rebuilding", "Moving forward"],
    urgency: "normal",
    icon: "💔"
  },
  {
    title: "Relationship Counseling", 
    description: "Work through relationship issues with trained counselors",
    topics: ["Communication", "Trust issues", "Conflict resolution"],
    urgency: "normal",
    icon: "💑"
  },
  {
    title: "Love & Dating Support",
    description: "Navigate dating challenges and build healthy relationships",
    topics: ["Dating anxiety", "Attachment issues", "Boundaries"],
    urgency: "normal", 
    icon: "💝"
  },
  {
    title: "Toxic Relationship Recovery",
    description: "Heal from emotional abuse and manipulation",
    topics: ["Gaslighting recovery", "Rebuilding confidence", "Red flag recognition"],
    urgency: "high",
    icon: "🚨"
  }
];

const supportTypes = [
  {
    type: "Immediate Chat",
    description: "Connect with a counselor right now",
    availability: "Available 24/7",
    waitTime: "Usually under 5 minutes"
  },
  {
    type: "Scheduled Session",
    description: "Book a longer session with a specialist", 
    availability: "Book up to 1 week ahead",
    waitTime: "50-minute sessions available"
  },
  {
    type: "Group Support",
    description: "Join others going through similar experiences",
    availability: "Multiple sessions daily",
    waitTime: "Open groups available now"
  }
];

export default function RelationshipSupport() {
  const handleGetSupport = (resourceType: string, urgency: string) => {
    if (urgency === "high") {
      alert(`Connecting you to specialized support for ${resourceType}. You'll be prioritized for immediate assistance.`);
    } else {
      alert(`Finding the right counselor for ${resourceType}. We'll match you based on your specific needs.`);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-accent/10 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Relationship & Emotional Support</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Whether you're dealing with heartbreak, relationship issues, or emotional challenges, 
            our trained counselors understand that relationship pain is real and valid. You deserve support.
          </p>
        </div>

        {/* Support Types */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {supportTypes.map((support, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg mb-3">{support.type}</h4>
                <p className="text-muted-foreground text-sm mb-4">{support.description}</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>{support.availability}</div>
                  <div className="font-medium">{support.waitTime}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resource Categories */}
        <div className="grid lg:grid-cols-2 gap-8">
          {relationshipResources.map((resource, index) => (
            <Card key={index} className={`${resource.urgency === 'high' ? 'border-l-4 border-l-orange-500' : ''}`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{resource.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      {resource.urgency === 'high' && (
                        <Badge variant="destructive" className="text-xs">Priority Support</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">We help with:</h5>
                    <div className="flex flex-wrap gap-2">
                      {resource.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => handleGetSupport(resource.title, resource.urgency)}
                      className={`flex-1 ${resource.urgency === 'high' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-primary hover:bg-primary/90'}`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      Get Support Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Validation Message */}
        <div className="mt-12 text-center">
          <Card className="bg-secondary/10 border-secondary">
            <CardContent className="p-8">
              <h4 className="text-xl font-semibold text-foreground mb-4">Your Feelings Are Valid</h4>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Relationship pain, heartbreak, and emotional struggles are real and significant. 
                Whether it's a recent breakup, ongoing relationship issues, or past relationship trauma, 
                you deserve compassionate support. Our counselors are trained to help you process these feelings 
                and develop healthy coping strategies.
              </p>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <div>💚 Judgement-free environment</div>
                <div>🔒 Complete confidentiality</div>
                <div>🤝 Specialized relationship counselors</div>
                <div>⏰ Available when you need us</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}