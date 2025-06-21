// server/storage.ts
import { nanoid } from 'nanoid';

// Mock data for demo
const mockResources = [
  {
    id: '1',
    title: 'Creating a Safety Plan',
    content: 'A comprehensive guide to developing a personalized safety plan for yourself and your family. Includes emergency contacts, escape routes, and important documents checklist.',
    category: 'safety-planning',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Understanding Trauma Responses',
    content: 'Learn about common trauma responses and how to recognize them. This resource helps you understand your reactions and develop healthy coping mechanisms.',
    category: 'trauma-healing',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Legal Rights and Resources',
    content: 'Information about your legal rights, how to file restraining orders, and access to free legal services for survivors of abuse.',
    category: 'legal-support',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Rebuilding Self-Esteem',
    content: 'Practical exercises and techniques to rebuild your self-esteem and confidence after experiencing abuse. Start your journey to self-love.',
    category: 'rebuilding-life',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Emergency Contact List',
    content: 'A curated list of emergency contacts including domestic violence shelters, legal aid organizations, and mental health crisis lines.',
    category: 'safety-planning',
    createdAt: new Date().toISOString()
  }
];

const mockEmergencyContacts = [
  {
    id: '1',
    name: 'Emergency Services',
    phone: '112',
    description: 'General emergency number for immediate danger',
    available24h: true
  },
  {
    id: '2',
    name: 'Domestic Violence Helpline',
    phone: '1091',
    description: 'Women helpline for domestic violence support',
    available24h: true
  },
  {
    id: '3',
    name: 'Child Helpline',
    phone: '1098',
    description: 'Child protection services and support',
    available24h: true
  },
  {
    id: '4',
    name: 'Mental Health Crisis',
    phone: '988',
    description: 'Suicide prevention and mental health crisis support',
    available24h: true
  }
];

const mockStories = [
  {
    id: '1',
    content: 'After years of feeling trapped, I finally found the courage to leave. The support I received here helped me realize I wasn\'t alone. Today, I\'m rebuilding my life one day at a time.',
    category: 'healing',
    supportCount: 45,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    content: 'Creating a safety plan was the first step in my journey to freedom. This resource helped me understand that I had options and that help was available.',
    category: 'safety',
    supportCount: 32,
    createdAt: new Date().toISOString()
  }
];

export const storage = {
  createHelpRequest: async (data: any) => {
    // Save to database logic here
    return { id: nanoid(), ...data, createdAt: new Date().toISOString() };
  },
  getHelpRequests: async () => [],
  getAvailableProfessionals: async () => [],
  assignHelpRequest: async (requestId: string, professionalId: string) => {},
  createProfessional: async (data: any) => data,
  getProfessionals: async () => [],
  createVolunteer: async (data: any) => data,
  getVolunteers: async () => [],
  createCommunityStory: async (data: any) => ({ 
    id: nanoid(), 
    ...data, 
    supportCount: 0,
    createdAt: new Date().toISOString() 
  }),
  getApprovedStories: async () => mockStories,
  incrementStorySupport: async (id: number) => {},
  getResourcesByCategory: async (category: string) => {
    return mockResources.filter(resource => resource.category === category);
  },
  getAllResources: async () => mockResources,
  createResource: async (data: any) => ({ 
    id: nanoid(), 
    ...data, 
    createdAt: new Date().toISOString() 
  }),
  createChatSession: async (session: any) => session,
  getEmergencyContacts: async () => mockEmergencyContacts,
  endChatSession: async (sessionId: string) => {}
};
