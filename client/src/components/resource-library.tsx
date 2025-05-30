import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const resourceCategories = [
  {
    icon: "🛡️",
    title: "Safety Planning",
    description: "Create personalized safety plans and learn protective strategies.",
    articleCount: 12,
    category: "safety-planning"
  },
  {
    icon: "🧠",
    title: "Trauma & Healing", 
    description: "Understanding trauma responses and evidence-based healing approaches.",
    articleCount: 18,
    category: "trauma-healing"
  },
  {
    icon: "⚖️",
    title: "Legal Support",
    description: "Know your rights and access legal resources and referrals.",
    articleCount: 8,
    category: "legal-support"
  },
  {
    icon: "🌱",
    title: "Rebuilding Life",
    description: "Tools for rebuilding confidence, relationships, and purpose.",
    articleCount: 15,
    category: "rebuilding-life"
  }
];

const emergencyContacts = [
  {
    name: "National Domestic Violence Hotline",
    phone: "1-800-799-7233",
    description: "24/7 confidential support"
  },
  {
    name: "Crisis Text Line", 
    phone: "Text HOME to 741741",
    description: "Free 24/7 crisis support"
  },
  {
    name: "National Sexual Assault Hotline",
    phone: "1-800-656-4673", 
    description: "RAINN's 24/7 support"
  }
];

export default function ResourceLibrary() {
  return (
    <section id="resources" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Resource Library</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Verified articles, guides, and tools to support your healing journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {resourceCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">{category.icon}</div>
                <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {category.title}
                </h4>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <div className="text-sm text-muted-foreground mb-4">
                  {category.articleCount} articles
                </div>
                <div className="text-primary hover:text-primary/80 font-medium text-sm flex items-center space-x-1 group-hover:underline">
                  <span>Explore resources</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contacts */}
        <div className="mt-12">
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-8">
              <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Emergency Contacts</span>
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                {emergencyContacts.map((contact, index) => (
                  <div key={index}>
                    <div className="font-semibold text-foreground">{contact.name}</div>
                    <div className="text-destructive font-bold text-lg">{contact.phone}</div>
                    <div className="text-sm text-muted-foreground">{contact.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
