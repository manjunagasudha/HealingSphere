import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { insertVolunteerSchema, type InsertVolunteer } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, X } from "lucide-react";

interface VolunteerApplicationFormProps {
  onSubmitted: () => void;
}

export default function VolunteerApplicationForm({ onSubmitted }: VolunteerApplicationFormProps) {
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const { toast } = useToast();

  const form = useForm<InsertVolunteer>({
    resolver: zodResolver(insertVolunteerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      licenseType: "",
      licenseNumber: "",
      organization: "",
      yearsExperience: 0,
      specializations: [],
      bio: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertVolunteer) => {
      const submitData = { ...data, specializations };
      const response = await apiRequest("POST", "/api/volunteers/register", submitData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted successfully",
        description: "Thank you for your interest in volunteering. We'll review your application and get back to you soon.",
      });
      onSubmitted();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertVolunteer) => {
    submitMutation.mutate(data);
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setSpecializations(specializations.filter(s => s !== spec));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecialization();
    }
  };

  const licenseTypes = [
    { value: "psychologist", label: "Licensed Psychologist" },
    { value: "counselor", label: "Licensed Counselor" },
    { value: "social-worker", label: "Social Worker" },
    { value: "therapist", label: "Therapist" },
    { value: "volunteer", label: "Trained Volunteer" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="your.email@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Create a secure password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="licenseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your credential type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {licenseTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Professional license number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization/Practice</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Current workplace or practice" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>Specializations</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a specialization (e.g., trauma therapy, PTSD)"
              className="flex-1"
            />
            <Button type="button" onClick={addSpecialization} variant="outline">
              Add
            </Button>
          </div>
          {specializations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpecialization(spec)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Brief description of your background, approach, and why you want to volunteer with HealNet"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Verification Process</h4>
          <p className="text-sm text-blue-800">
            All volunteers undergo a thorough verification process including background checks,
            credential verification, and training before being approved to help survivors.
          </p>
        </div>

        <Button
          type="submit"
          disabled={submitMutation.isPending}
          className="w-full bg-healing-green hover:bg-green-600 text-white py-4 font-semibold"
        >
          {submitMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting Application...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Application
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
