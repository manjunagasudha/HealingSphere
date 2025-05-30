import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  licenseType: text("license_type").notNull(), // 'psychologist', 'counselor', 'social_worker', 'volunteer'
  licenseNumber: text("license_number"),
  organization: text("organization"),
  yearsExperience: integer("years_experience"),
  specializations: jsonb("specializations").$type<string[]>().default([]),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(false),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const helpRequests = pgTable("help_requests", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(), // Anonymous session identifier
  ageRange: text("age_range"),
  urgencyLevel: text("urgency_level").notNull(), // 'low', 'medium', 'high', 'emergency'
  message: text("message").notNull(),
  status: text("status").default("pending"), // 'pending', 'assigned', 'resolved'
  assignedVolunteerId: integer("assigned_volunteer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'self-help', 'emergency', 'techniques', 'legal'
  content: text("content").notNull(),
  readTime: integer("read_time"), // in minutes
  isVerified: boolean("is_verified").default(false),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(), // Anonymous session identifier
  authorName: text("author_name").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  healingStage: text("healing_stage"), // 'new-journey', 'healing', 'thriving'
  isApproved: boolean("is_approved").default(false),
  supportCount: integer("support_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  volunteerId: integer("volunteer_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  website: text("website"),
  description: text("description"),
  region: text("region"), // Geographic area served
  category: text("category").notNull(), // 'crisis-hotline', 'local-center', 'legal-aid'
  isActive: boolean("is_active").default(true),
});

// Relations
export const helpRequestsRelations = relations(helpRequests, ({ one }) => ({
  assignedVolunteer: one(volunteers, {
    fields: [helpRequests.assignedVolunteerId],
    references: [volunteers.id],
  }),
}));

export const volunteersRelations = relations(volunteers, ({ many }) => ({
  helpRequests: many(helpRequests),
  chatSessions: many(chatSessions),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one }) => ({
  volunteer: one(volunteers, {
    fields: [chatSessions.volunteerId],
    references: [volunteers.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVolunteerSchema = createInsertSchema(volunteers).omit({
  id: true,
  isVerified: true,
  isActive: true,
  createdAt: true,
}).extend({
  password: z.string().min(8),
});

export const insertHelpRequestSchema = createInsertSchema(helpRequests).omit({
  id: true,
  status: true,
  assignedVolunteerId: true,
  createdAt: true,
  respondedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  isVerified: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  isApproved: true,
  supportCount: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  isActive: true,
  createdAt: true,
  endedAt: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  isActive: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type Volunteer = typeof volunteers.$inferSelect;

export type InsertHelpRequest = z.infer<typeof insertHelpRequestSchema>;
export type HelpRequest = typeof helpRequests.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
