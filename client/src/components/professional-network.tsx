import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Professional } from "@shared/schema";

export default function ProfessionalNetwork() {
  const { data: professionals, isLoading } = useQuery<Professional[]>({
    queryKey: ["/api/professionals"],
  });

  const handleBookSession = (professionalId: number) => {
    alert(`Opening booking system for professional ID: ${professionalId}`);
  };

  const handleStartChat = (professionalId: number) => {
    alert(`Starting secure chat with professional ID: ${professionalId}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Verified Professional Network</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Connect with licensed therapists, counselors, and trained volunteers who specialize in trauma and abuse recovery
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-4 w-32 mx-auto mb-2" />
                  <Skeleton className="h-3 w-24 mx-auto mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Verified Professional Network</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Connect with licensed therapists, counselors, and trained volunteers who specialize in trauma and abuse recovery
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {professionals?.slice(0, 3).map((professional) => (
            <Card key={professional.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="text-center mb-4">
                  <h4 className="font-semibold text-foreground mb-1">{professional.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{professional.profession}</p>
                  <div className="flex items-center justify-center">
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Professional
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {professional.specializations?.slice(0, 2).map((spec, index) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{spec}</span>
                    </div>
                  ))}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className={professional.availability === 'online' ? 'text-green-600' : 'text-gray-500'}>
                      {professional.availability === 'online' ? 'Available Now' : 'Offline'}
                    </span>
                  </div>
                  {professional.rating > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{(professional.rating / 10).toFixed(1)}/5 Rating ({professional.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleBookSession(professional.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Book Session
                  </Button>
                  <Button 
                    onClick={() => handleStartChat(professional.id)}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="link" className="text-primary font-medium">
            View All Professionals →
          </Button>
        </div>
      </div>
    </section>
  );
}
