import { 
  users, 
  volunteers, 
  helpRequests, 
  resources, 
  stories, 
  chatSessions, 
  emergencyContacts,
  type User, 
  type InsertUser,
  type Volunteer,
  type InsertVolunteer,
  type HelpRequest,
  type InsertHelpRequest,
  type Resource,
  type InsertResource,
  type Story,
  type InsertStory,
  type ChatSession,
  type InsertChatSession,
  type EmergencyContact,
  type InsertEmergencyContact
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Volunteer methods
  createVolunteer(volunteer: Omit<InsertVolunteer, 'password'>): Promise<Volunteer>;
  getVolunteers(): Promise<Volunteer[]>;
  getVerifiedVolunteers(): Promise<Volunteer[]>;
  verifyVolunteer(id: number): Promise<Volunteer>;

  // Help Request methods
  createHelpRequest(request: InsertHelpRequest): Promise<HelpRequest>;
  getHelpRequests(): Promise<HelpRequest[]>;
  assignHelpRequest(id: number, volunteerId: number): Promise<HelpRequest>;

  // Resource methods
  getResources(category?: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Story methods
  getApprovedStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  incrementStorySupport(id: number): Promise<Story>;
  approveStory(id: number): Promise<Story>;

  // Chat Session methods
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getActiveChatSessions(): Promise<ChatSession[]>;
  endChatSession(sessionId: string): Promise<ChatSession>;

  // Emergency Contact methods
  getEmergencyContacts(region?: string, category?: string): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Volunteer methods
  async createVolunteer(volunteer: Omit<InsertVolunteer, 'password'>): Promise<Volunteer> {
    const [newVolunteer] = await db
      .insert(volunteers)
      .values(volunteer)
      .returning();
    return newVolunteer;
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return await db.select().from(volunteers).orderBy(desc(volunteers.createdAt));
  }

  async getVerifiedVolunteers(): Promise<Volunteer[]> {
    return await db
      .select()
      .from(volunteers)
      .where(eq(volunteers.isVerified, true))
      .orderBy(desc(volunteers.createdAt));
  }

  async verifyVolunteer(id: number): Promise<Volunteer> {
    const [volunteer] = await db
      .update(volunteers)
      .set({ isVerified: true, isActive: true })
      .where(eq(volunteers.id, id))
      .returning();
    return volunteer;
  }

  // Help Request methods
  async createHelpRequest(request: InsertHelpRequest): Promise<HelpRequest> {
    const [helpRequest] = await db
      .insert(helpRequests)
      .values(request)
      .returning();
    return helpRequest;
  }

  async getHelpRequests(): Promise<HelpRequest[]> {
    return await db
      .select()
      .from(helpRequests)
      .orderBy(desc(helpRequests.createdAt));
  }

  async assignHelpRequest(id: number, volunteerId: number): Promise<HelpRequest> {
    const [helpRequest] = await db
      .update(helpRequests)
      .set({ 
        assignedVolunteerId: volunteerId, 
        status: "assigned",
        respondedAt: new Date()
      })
      .where(eq(helpRequests.id, id))
      .returning();
    return helpRequest;
  }

  // Resource methods
  async getResources(category?: string): Promise<Resource[]> {
    const query = db.select().from(resources).where(eq(resources.isVerified, true));
    
    if (category) {
      return await query.where(and(eq(resources.isVerified, true), eq(resources.category, category)));
    }
    
    return await query.orderBy(desc(resources.createdAt));
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return newResource;
  }

  // Story methods
  async getApprovedStories(): Promise<Story[]> {
    return await db
      .select()
      .from(stories)
      .where(eq(stories.isApproved, true))
      .orderBy(desc(stories.createdAt));
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db
      .insert(stories)
      .values(story)
      .returning();
    return newStory;
  }

  async incrementStorySupport(id: number): Promise<Story> {
    const [story] = await db
      .update(stories)
      .set({ supportCount: (stories.supportCount + 1) })
      .where(eq(stories.id, id))
      .returning();
    return story;
  }

  async approveStory(id: number): Promise<Story> {
    const [story] = await db
      .update(stories)
      .set({ isApproved: true })
      .where(eq(stories.id, id))
      .returning();
    return story;
  }

  // Chat Session methods
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [chatSession] = await db
      .insert(chatSessions)
      .values(session)
      .returning();
    return chatSession;
  }

  async getActiveChatSessions(): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.isActive, true))
      .orderBy(desc(chatSessions.createdAt));
  }

  async endChatSession(sessionId: string): Promise<ChatSession> {
    const [chatSession] = await db
      .update(chatSessions)
      .set({ isActive: false, endedAt: new Date() })
      .where(eq(chatSessions.sessionId, sessionId))
      .returning();
    return chatSession;
  }

  // Emergency Contact methods
  async getEmergencyContacts(region?: string, category?: string): Promise<EmergencyContact[]> {
    let query = db.select().from(emergencyContacts).where(eq(emergencyContacts.isActive, true));
    
    if (region && category) {
      query = query.where(
        and(
          eq(emergencyContacts.isActive, true),
          eq(emergencyContacts.region, region),
          eq(emergencyContacts.category, category)
        )
      );
    } else if (region) {
      query = query.where(
        and(eq(emergencyContacts.isActive, true), eq(emergencyContacts.region, region))
      );
    } else if (category) {
      query = query.where(
        and(eq(emergencyContacts.isActive, true), eq(emergencyContacts.category, category))
      );
    }
    
    return await query;
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [emergencyContact] = await db
      .insert(emergencyContacts)
      .values(contact)
      .returning();
    return emergencyContact;
  }
}

export const storage = new DatabaseStorage();
