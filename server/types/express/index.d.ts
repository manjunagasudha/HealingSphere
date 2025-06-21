// server/types/express/index.d.ts
import 'express';

declare module 'express' {
  interface Request {
    user?: any; // or a more specific type if available
  }
}
