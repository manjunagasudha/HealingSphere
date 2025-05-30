import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertProfessionalSchema, insertVolunteerSchema, insertHelpRequestSchema,
  insertCommunityStorySchema, insertResourceSchema, insertChatSessionSchema
} from "@shared/schema";
import { nanoid } from "nanoid";

interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  timestamp: number;
  sender: 'user' | 'professional' | 'volunteer';
}

const activeChatSessions = new Map<string, {
  userSocket: WebSocket | null;
  professionalSocket: WebSocket | null;
  messages: ChatMessage[];
}>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    let sessionId: string | null = null;
    let userType: 'user' | 'professional' | 'volunteer' = 'user';

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'join':
            if (!message.sessionId) break;
            sessionId = message.sessionId;
            userType = message.userType || 'user';
            
            if (!activeChatSessions.has(sessionId)) {
              activeChatSessions.set(sessionId, {
                userSocket: null,
                professionalSocket: null,
                messages: []
              });
            }

            const session = activeChatSessions.get(sessionId)!;
            if (userType === 'user') {
              session.userSocket = ws;
            } else {
              session.professionalSocket = ws;
            }

            // Send chat history
            ws.send(JSON.stringify({
              type: 'history',
              messages: session.messages
            }));
            break;

          case 'message':
            if (sessionId && activeChatSessions.has(sessionId)) {
              const chatMessage: ChatMessage = {
                id: nanoid(),
                sessionId,
                message: message.content,
                timestamp: Date.now(),
                sender: userType
              };

              const session = activeChatSessions.get(sessionId)!;
              session.messages.push(chatMessage);

              // Broadcast to both participants
              [session.userSocket, session.professionalSocket].forEach(socket => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(JSON.stringify({
                    type: 'message',
                    message: chatMessage
                  }));
                }
              });
            }
            break;

          case 'end':
            if (sessionId) {
              await storage.endChatSession(sessionId);
              activeChatSessions.delete(sessionId);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (sessionId && activeChatSessions.has(sessionId)) {
        const session = activeChatSessions.get(sessionId)!;
        if (session.userSocket === ws) {
          session.userSocket = null;
        } else if (session.professionalSocket === ws) {
          session.professionalSocket = null;
        }
      }
    });
  });

  // Help Requests
  app.post("/api/help-requests", async (req, res) => {
    try {
      const validatedData = insertHelpRequestSchema.parse(req.body);
      const helpRequest = await storage.createHelpRequest(validatedData);
      
      // Auto-assign to available professional if urgent
      if (validatedData.urgency === 'immediate') {
        const availableProfessionals = await storage.getAvailableProfessionals();
        if (availableProfessionals.length > 0) {
          await storage.assignHelpRequest(helpRequest.id, availableProfessionals[0].id);
        }
      }
      
      res.json(helpRequest);
    } catch (error) {
      res.status(400).json({ error: "Invalid help request data" });
    }
  });

  app.get("/api/help-requests", async (req, res) => {
    try {
      const requests = await storage.getHelpRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch help requests" });
    }
  });

  // Professionals
  app.post("/api/professionals", async (req, res) => {
    try {
      const validatedData = insertProfessionalSchema.parse(req.body);
      const professional = await storage.createProfessional(validatedData);
      res.json(professional);
    } catch (error) {
      res.status(400).json({ error: "Invalid professional data" });
    }
  });

  app.get("/api/professionals", async (req, res) => {
    try {
      const professionals = await storage.getProfessionals();
      res.json(professionals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch professionals" });
    }
  });

  app.get("/api/professionals/available", async (req, res) => {
    try {
      const professionals = await storage.getAvailableProfessionals();
      res.json(professionals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available professionals" });
    }
  });

  // Volunteers
  app.post("/api/volunteers", async (req, res) => {
    try {
      const validatedData = insertVolunteerSchema.parse(req.body);
      const volunteer = await storage.createVolunteer(validatedData);
      res.json(volunteer);
    } catch (error) {
      res.status(400).json({ error: "Invalid volunteer data" });
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

  // Community Stories
  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertCommunityStorySchema.parse(req.body);
      const story = await storage.createCommunityStory(validatedData);
      res.json(story);
    } catch (error) {
      res.status(400).json({ error: "Invalid story data" });
    }
  });

  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getApprovedStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  app.post("/api/stories/:id/support", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementStorySupport(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to support story" });
    }
  });

  // Resources
  app.get("/api/resources", async (req, res) => {
    try {
      const category = req.query.category as string;
      const resources = category 
        ? await storage.getResourcesByCategory(category)
        : await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Chat Sessions
  app.post("/api/chat/start", async (req, res) => {
    try {
      const sessionId = nanoid();
      const { professionalId, volunteerId } = req.body;
      
      const sessionData = {
        sessionId,
        professionalId: professionalId || null,
        volunteerId: volunteerId || null
      };

      const session = await storage.createChatSession(sessionData);
      
      activeChatSessions.set(sessionId, {
        userSocket: null,
        professionalSocket: null,
        messages: []
      });

      res.json({ sessionId: session.sessionId });
    } catch (error) {
      res.status(400).json({ error: "Failed to start chat session" });
    }
  });

  // Emergency Contacts
  app.get("/api/emergency-contacts", async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emergency contacts" });
    }
  });

  return httpServer;
}
