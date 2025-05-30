import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profession: text("profession").notNull(),
  licenseNumber: text("license_number").notNull(),
  specializations: text("specializations").array(),
  isVerified: boolean("is_verified").default(false),
  availability: text("availability").default("offline"), // online, offline, busy
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  motivation: text("motivation"),
  availability: text("availability"),
  isApproved: boolean("is_approved").default(false),
  trainingCompleted: boolean("training_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const helpRequests = pgTable("help_requests", {
  id: serial("id").primaryKey(),
  contactMethod: text("contact_method").notNull(),
  urgency: text("urgency").notNull(),
  message: text("message"),
  status: text("status").default("pending"), // pending, assigned, completed
  assignedTo: integer("assigned_to").references(() => professionals.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityStories = pgTable("community_stories", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").default("general"),
  isApproved: boolean("is_approved").default(false),
  supportCount: integer("support_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // safety-planning, trauma-healing, legal-support, rebuilding-life
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  professionalId: integer("professional_id").references(() => professionals.id),
  volunteerId: integer("volunteer_id").references(() => volunteers.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  description: text("description"),
  available24h: boolean("available_24h").default(false),
});

// Relations
export const helpRequestsRelations = relations(helpRequests, ({ one }) => ({
  assignedProfessional: one(professionals, {
    fields: [helpRequests.assignedTo],
    references: [professionals.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one }) => ({
  professional: one(professionals, {
    fields: [chatSessions.professionalId],
    references: [professionals.id],
  }),
  volunteer: one(volunteers, {
    fields: [chatSessions.volunteerId],
    references: [volunteers.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
  isVerified: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
});

export const insertVolunteerSchema = createInsertSchema(volunteers).omit({
  id: true,
  isApproved: true,
  trainingCompleted: true,
  createdAt: true,
});

export const insertHelpRequestSchema = createInsertSchema(helpRequests).omit({
  id: true,
  status: true,
  assignedTo: true,
  createdAt: true,
});

export const insertCommunityStorySchema = createInsertSchema(communityStories).omit({
  id: true,
  isApproved: true,
  supportCount: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  isVerified: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;
export type Professional = typeof professionals.$inferSelect;

export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type Volunteer = typeof volunteers.$inferSelect;

export type InsertHelpRequest = z.infer<typeof insertHelpRequestSchema>;
export type HelpRequest = typeof helpRequests.$inferSelect;

export type InsertCommunityStory = z.infer<typeof insertCommunityStorySchema>;
export type CommunityStory = typeof communityStories.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
