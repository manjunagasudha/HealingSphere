import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResourceCard from "@/components/resources/resource-card";
import { Search, Phone, Heart, Shield } from "lucide-react";
import type { Resource, EmergencyContact } from "@shared/schema";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: resources = [], isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources", selectedCategory],
  });

  const { data: emergencyContacts = [], isLoading: contactsLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "self-help", label: "Self-Help Guides" },
    { value: "emergency", label: "Emergency Resources" },
    { value: "techniques", label: "Healing Techniques" },
    { value: "legal", label: "Legal Information" },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Healing Resources</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verified articles, techniques, and tools to support your healing journey.
          </p>
        </div>

        {/* Emergency Contacts Banner */}
        <Card className="mb-12 bg-emergency-red bg-opacity-10 border-emergency-red">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Phone className="h-8 w-8 text-emergency-red mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contactsLoading ? (
                <p className="text-gray-600">Loading emergency contacts...</p>
              ) : (
                emergencyContacts.slice(0, 3).map((contact) => (
                  <div key={contact.id} className="bg-white rounded-lg p-4 border border-emergency-red">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="text-emergency-red font-bold">
                        {contact.phone}
                      </a>
                    )}
                    {contact.website && (
                      <a 
                        href={contact.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-trust-blue hover:underline text-sm"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Resources Grid */}
        {resourcesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <Shield className="h-16 w-16 text-trust-blue mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Support?</h3>
          <p className="text-gray-600 mb-6">
            If you're in crisis or need immediate help, please don't wait.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-emergency-red hover:bg-red-600 text-white">
              <Phone className="mr-2 h-5 w-5" />
              Call Crisis Line: 988
            </Button>
            <Button variant="outline" className="border-trust-blue text-trust-blue hover:bg-blue-50">
              <Heart className="mr-2 h-5 w-5" />
              Start Anonymous Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
