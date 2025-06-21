import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket, type RawData } from "ws";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import { authenticateToken, type AuthenticatedRequest } from "./middleware/auth";

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

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // REST API Routes
  app.get('/api/health', (req, res) => {
    res.json({ message: 'HealNet Backend is running!' });
  });

  // Resource Hub APIs
  app.get('/api/resources', async (req, res) => {
    try {
      const category = req.query.category as string;
      const resources = category 
        ? await storage.getResourcesByCategory(category)
        : await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  });

  app.post('/api/resources', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { title, content, category } = req.body;
      if (!title || !content || !category) {
        return res.status(400).json({ error: 'Title, content, and category are required' });
      }
      
      const newResource = await storage.createResource({
        title,
        content,
        category,
        createdBy: req.user?.uid
      });
      
      res.status(201).json(newResource);
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({ error: 'Failed to create resource' });
    }
  });

  // Emergency Help APIs
  app.get('/api/emergency-contacts', async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      res.status(500).json({ error: 'Failed to fetch emergency contacts' });
    }
  });

  app.post('/api/emergency', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { message, urgency, contactMethod } = req.body;
      const helpRequest = await storage.createHelpRequest({
        message,
        urgency: urgency || 'high',
        contactMethod: contactMethod || 'anonymous',
        userId: req.user?.uid
      });
      
      res.status(201).json(helpRequest);
    } catch (error) {
      console.error('Error creating emergency request:', error);
      res.status(500).json({ error: 'Failed to create emergency request' });
    }
  });

  // Community Stories APIs
  app.get('/api/stories', async (req, res) => {
    try {
      const stories = await storage.getApprovedStories();
      res.json(stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  });

  app.post('/api/stories', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { content, category } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }
      
      const story = await storage.createCommunityStory({
        content,
        category: category || 'general',
        authorId: req.user?.uid
      });
      
      res.status(201).json(story);
    } catch (error) {
      console.error('Error creating story:', error);
      res.status(500).json({ error: 'Failed to create story' });
    }
  });

  // WebSocket Chat Logic
  wss.on("connection", (ws: WebSocket) => {
    let sessionId: string | null = null;
    let userType: 'user' | 'professional' | 'volunteer' = 'user';

    ws.on("message", async (data: RawData) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "join":
            sessionId = message.sessionId ?? null;
            userType = message.userType || 'user';

            if (!sessionId) return;

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

            ws.send(JSON.stringify({
              type: 'history',
              messages: session.messages
            }));
            break;

          case "message":
            if (!sessionId || !activeChatSessions.has(sessionId)) return;

            const newMessage: ChatMessage = {
              id: nanoid(),
              sessionId: sessionId,
              message: message.content,
              timestamp: Date.now(),
              sender: userType
            };

            const currentSession = activeChatSessions.get(sessionId)!;
            currentSession.messages.push(newMessage);

            [currentSession.userSocket, currentSession.professionalSocket].forEach(socket => {
              if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                  type: 'message',
                  message: newMessage
                }));
              }
            });
            break;

          case "end":
            if (!sessionId) return;
            await storage.endChatSession(sessionId);
            activeChatSessions.delete(sessionId);
            break;
        }
      } catch (err) {
        console.error("WebSocket Error:", err);
      }
    });

    ws.on("close", () => {
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

  return httpServer;
}


