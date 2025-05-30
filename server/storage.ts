import { 
  users, professionals, volunteers, helpRequests, communityStories, 
  resources, chatSessions, emergencyContacts,
  type User, type InsertUser, type Professional, type InsertProfessional,
  type Volunteer, type InsertVolunteer, type HelpRequest, type InsertHelpRequest,
  type CommunityStory, type InsertCommunityStory, type Resource, type InsertResource,
  type ChatSession, type InsertChatSession, type EmergencyContact
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Professionals
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  getProfessionals(): Promise<Professional[]>;
  getAvailableProfessionals(): Promise<Professional[]>;
  updateProfessionalAvailability(id: number, availability: string): Promise<void>;
  verifyProfessional(id: number): Promise<void>;

  // Volunteers
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  getVolunteers(): Promise<Volunteer[]>;
  approveVolunteer(id: number): Promise<void>;

  // Help Requests
  createHelpRequest(request: InsertHelpRequest): Promise<HelpRequest>;
  getHelpRequests(): Promise<HelpRequest[]>;
  assignHelpRequest(id: number, professionalId: number): Promise<void>;
  updateHelpRequestStatus(id: number, status: string): Promise<void>;

  // Community Stories
  createCommunityStory(story: InsertCommunityStory): Promise<CommunityStory>;
  getApprovedStories(): Promise<CommunityStory[]>;
  approveStory(id: number): Promise<void>;
  incrementStorySupport(id: number): Promise<void>;

  // Resources
  createResource(resource: InsertResource): Promise<Resource>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getAllResources(): Promise<Resource[]>;

  // Chat Sessions
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  endChatSession(sessionId: string): Promise<void>;

  // Emergency Contacts
  getEmergencyContacts(): Promise<EmergencyContact[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
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

  // Professionals
  async createProfessional(professional: InsertProfessional): Promise<Professional> {
    const [result] = await db
      .insert(professionals)
      .values(professional)
      .returning();
    return result;
  }

  async getProfessionals(): Promise<Professional[]> {
    return await db.select().from(professionals).where(eq(professionals.isVerified, true));
  }

  async getAvailableProfessionals(): Promise<Professional[]> {
    return await db.select().from(professionals)
      .where(and(eq(professionals.isVerified, true), eq(professionals.availability, "online")));
  }

  async updateProfessionalAvailability(id: number, availability: string): Promise<void> {
    await db.update(professionals)
      .set({ availability })
      .where(eq(professionals.id, id));
  }

  async verifyProfessional(id: number): Promise<void> {
    await db.update(professionals)
      .set({ isVerified: true })
      .where(eq(professionals.id, id));
  }

  // Volunteers
  async createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer> {
    const [result] = await db
      .insert(volunteers)
      .values(volunteer)
      .returning();
    return result;
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return await db.select().from(volunteers).where(eq(volunteers.isApproved, true));
  }

  async approveVolunteer(id: number): Promise<void> {
    await db.update(volunteers)
      .set({ isApproved: true })
      .where(eq(volunteers.id, id));
  }

  // Help Requests
  async createHelpRequest(request: InsertHelpRequest): Promise<HelpRequest> {
    const [result] = await db
      .insert(helpRequests)
      .values(request)
      .returning();
    return result;
  }

  async getHelpRequests(): Promise<HelpRequest[]> {
    return await db.select().from(helpRequests).orderBy(desc(helpRequests.createdAt));
  }

  async assignHelpRequest(id: number, professionalId: number): Promise<void> {
    await db.update(helpRequests)
      .set({ assignedTo: professionalId, status: "assigned" })
      .where(eq(helpRequests.id, id));
  }

  async updateHelpRequestStatus(id: number, status: string): Promise<void> {
    await db.update(helpRequests)
      .set({ status })
      .where(eq(helpRequests.id, id));
  }

  // Community Stories
  async createCommunityStory(story: InsertCommunityStory): Promise<CommunityStory> {
    const [result] = await db
      .insert(communityStories)
      .values(story)
      .returning();
    return result;
  }

  async getApprovedStories(): Promise<CommunityStory[]> {
    return await db.select().from(communityStories)
      .where(eq(communityStories.isApproved, true))
      .orderBy(desc(communityStories.createdAt));
  }

  async approveStory(id: number): Promise<void> {
    await db.update(communityStories)
      .set({ isApproved: true })
      .where(eq(communityStories.id, id));
  }

  async incrementStorySupport(id: number): Promise<void> {
    const [story] = await db.select().from(communityStories).where(eq(communityStories.id, id));
    if (story) {
      await db.update(communityStories)
        .set({ supportCount: story.supportCount + 1 })
        .where(eq(communityStories.id, id));
    }
  }

  // Resources
  async createResource(resource: InsertResource): Promise<Resource> {
    const [result] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return result;
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db.select().from(resources)
      .where(and(eq(resources.category, category), eq(resources.isVerified, true)));
  }

  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.isVerified, true));
  }

  // Chat Sessions
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [result] = await db
      .insert(chatSessions)
      .values(session)
      .returning();
    return result;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions)
      .where(eq(chatSessions.sessionId, sessionId));
    return session || undefined;
  }

  async endChatSession(sessionId: string): Promise<void> {
    await db.update(chatSessions)
      .set({ isActive: false })
      .where(eq(chatSessions.sessionId, sessionId));
  }

  // Emergency Contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return await db.select().from(emergencyContacts);
  }
}

export const storage = new DatabaseStorage();
