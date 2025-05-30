import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertHelpRequestSchema, 
  insertVolunteerSchema, 
  insertStorySchema,
  insertResourceSchema,
  insertEmergencyContactSchema
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Help Requests API
  app.post("/api/help-requests", async (req, res) => {
    try {
      const data = insertHelpRequestSchema.parse(req.body);
      const helpRequest = await storage.createHelpRequest(data);
      res.json(helpRequest);
    } catch (error) {
      res.status(400).json({ error: "Invalid help request data" });
    }
  });

  app.get("/api/help-requests", async (req, res) => {
    try {
      const helpRequests = await storage.getHelpRequests();
      res.json(helpRequests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch help requests" });
    }
  });

  app.patch("/api/help-requests/:id/assign", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { volunteerId } = req.body;
      const helpRequest = await storage.assignHelpRequest(id, volunteerId);
      res.json(helpRequest);
    } catch (error) {
      res.status(400).json({ error: "Failed to assign help request" });
    }
  });

  // Volunteers API
  app.post("/api/volunteers/register", async (req, res) => {
    try {
      const data = insertVolunteerSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const volunteerData = { ...data, password: hashedPassword };
      delete volunteerData.password; // Remove password from volunteer data
      const volunteer = await storage.createVolunteer(volunteerData);
      res.json(volunteer);
    } catch (error) {
      res.status(400).json({ error: "Invalid volunteer registration data" });
    }
  });

  app.get("/api/volunteers", async (req, res) => {
    try {
      const volunteers = await storage.getVolunteers();
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch volunteers" });
    }
  });

  app.get("/api/volunteers/verified", async (req, res) => {
    try {
      const volunteers = await storage.getVerifiedVolunteers();
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch verified volunteers" });
    }
  });

  app.patch("/api/volunteers/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const volunteer = await storage.verifyVolunteer(id);
      res.json(volunteer);
    } catch (error) {
      res.status(400).json({ error: "Failed to verify volunteer" });
    }
  });

  // Resources API
  app.get("/api/resources", async (req, res) => {
    try {
      const { category } = req.query;
      const resources = await storage.getResources(category as string);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const data = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(data);
      res.json(resource);
    } catch (error) {
      res.status(400).json({ error: "Invalid resource data" });
    }
  });

  // Stories API
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getApprovedStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const data = insertStorySchema.parse(req.body);
      const story = await storage.createStory(data);
      res.json(story);
    } catch (error) {
      res.status(400).json({ error: "Invalid story data" });
    }
  });

  app.patch("/api/stories/:id/support", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.incrementStorySupport(id);
      res.json(story);
    } catch (error) {
      res.status(400).json({ error: "Failed to support story" });
    }
  });

  app.patch("/api/stories/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.approveStory(id);
      res.json(story);
    } catch (error) {
      res.status(400).json({ error: "Failed to approve story" });
    }
  });

  // Emergency Contacts API
  app.get("/api/emergency-contacts", async (req, res) => {
    try {
      const { region, category } = req.query;
      const contacts = await storage.getEmergencyContacts(region as string, category as string);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emergency contacts" });
    }
  });

  app.post("/api/emergency-contacts", async (req, res) => {
    try {
      const data = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(data);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid emergency contact data" });
    }
  });

  // Chat Sessions API
  app.post("/api/chat-sessions", async (req, res) => {
    try {
      const { sessionId, volunteerId } = req.body;
      const chatSession = await storage.createChatSession({ sessionId, volunteerId });
      res.json(chatSession);
    } catch (error) {
      res.status(400).json({ error: "Failed to create chat session" });
    }
  });

  app.get("/api/chat-sessions/active", async (req, res) => {
    try {
      const sessions = await storage.getActiveChatSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active sessions" });
    }
  });

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const activeSessions = new Map<string, { client: WebSocket, volunteer?: WebSocket }>();

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const sessionId = url.searchParams.get('sessionId');
    const role = url.searchParams.get('role'); // 'client' or 'volunteer'

    if (!sessionId) {
      ws.close(1000, 'Session ID required');
      return;
    }

    console.log(`WebSocket connected: ${role} for session ${sessionId}`);

    if (!activeSessions.has(sessionId)) {
      activeSessions.set(sessionId, { client: ws });
    } else {
      const session = activeSessions.get(sessionId)!;
      if (role === 'volunteer') {
        session.volunteer = ws;
      } else {
        session.client = ws;
      }
    }

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        const session = activeSessions.get(sessionId);
        
        if (session) {
          // Forward message to the other participant
          const targetWs = role === 'client' ? session.volunteer : session.client;
          
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
              ...message,
              timestamp: new Date().toISOString(),
              fromRole: role
            }));
          }
        }
      } catch (error) {
        console.error('Invalid message format:', error);
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket disconnected: ${role} for session ${sessionId}`);
      const session = activeSessions.get(sessionId);
      
      if (session) {
        if (role === 'volunteer') {
          session.volunteer = undefined;
        } else if (role === 'client') {
          session.client = undefined;
        }
        
        // Clean up if both participants have left
        if (!session.client && !session.volunteer) {
          activeSessions.delete(sessionId);
        }
      }
    });

    // Send connection confirmation
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected successfully',
        sessionId,
        role
      }));
    }
  });

  return httpServer;
}
