import cors from 'cors';
import "./loadEnv";
import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  const host = process.env.HOST || "0.0.0.0";

  const server = await registerRoutes(app);

  // ✅ Add root route to avoid "Cannot GET /"
  app.get("/", (_req, res) => {
    res.send("Welcome to HealingSphere backend!");
  });


  // ✅ Test route
  app.get("/ping", (_req, res) => {
    res.send("pong");
  });

  // Error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // 🚫 TEMPORARILY DISABLED: Vite setup
  // if (app.get("env") === "development") {
  //   await setupVite(app, server);
  // } else {
  //   serveStatic(app);
  // }
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});
  server.listen(
    {
      port,
      host: "localhost", // Force localhost
    },
    () => {
      log(`🚀 Server running at http://localhost:${port}`);
    }
  );
})();

