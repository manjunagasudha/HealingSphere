import { Request, Response, NextFunction } from 'express';

// Content moderation and filtering
const inappropriatePatterns = [
  // Explicit content
  /\b(fuck|shit|damn|bitch|asshole|bastard)\b/gi,
  // Harmful content
  /\b(kill yourself|suicide|end it all|hurt yourself)\b/gi,
  // Spam patterns
  /\b(click here|buy now|limited time|act now)\b/gi,
  // XSS patterns
  /script\s*[>=]/i,
  /<iframe/i,
  /javascript:/i,
  /vbscript:/i,
  /onload\s*=/i,
  /onerror\s*=/i,
  /onclick\s*=/i,
];

const encouragingAlternatives = {
  'kill yourself': 'reach out for support',
  'suicide': 'crisis support',
  'end it all': 'find help',
  'hurt yourself': 'seek professional help',
};

export const contentModerationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const checkContent = (text: string): { isInappropriate: boolean; suggestion?: string } => {
    for (const pattern of inappropriatePatterns) {
      if (pattern.test(text)) {
        // Check if it's harmful content and provide support
        for (const [harmful, alternative] of Object.entries(encouragingAlternatives)) {
          if (text.toLowerCase().includes(harmful)) {
            return { 
              isInappropriate: true, 
              suggestion: `We noticed your message contains concerning content. Please consider reaching out for professional support. We're here to help you find healthier ways to cope.` 
            };
          }
        }
        return { isInappropriate: true };
      }
    }
    return { isInappropriate: false };
  };

  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        const result = checkContent(value);
        if (result.isInappropriate) {
          return res.status(400).json({
            error: 'Content moderation flagged your message',
            message: result.suggestion || 'Please review our community guidelines and try again with appropriate content.',
            resources: [
              { name: 'Crisis Text Line', contact: 'Text HOME to 741741' },
              { name: 'National Suicide Prevention Lifeline', contact: '988' },
              { name: 'National Domestic Violence Hotline', contact: '1-800-799-7233' }
            ]
          });
        }
      }
    }
  }

  next();
};

// Input sanitization to prevent XSS
export const sanitizeInputMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript protocols
        .replace(/vbscript:/gi, '')
        .replace(/data:/gi, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  next();
};

// Rate limiting tracker
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitMiddleware = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    const clientData = requestCounts.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please wait before making more requests. If you need immediate help, use our emergency contacts.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
};

// Response timeout with helpful fallback
export const timeoutMiddleware = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let timeoutId: NodeJS.Timeout;
    
    const timeout = () => {
      if (!res.headersSent) {
        res.status(504).json({
          error: 'Response timeout',
          message: 'Our servers are experiencing high load. Your request is important to us.',
          alternatives: [
            'Please try again in a few minutes',
            'Use our emergency contacts for immediate help',
            'Check our resource library for immediate support'
          ],
          emergencyContacts: [
            { name: 'Crisis Text Line', contact: 'Text HOME to 741741' },
            { name: 'National Domestic Violence Hotline', contact: '1-800-799-7233' }
          ]
        });
      }
    };

    timeoutId = setTimeout(timeout, timeoutMs);

    res.on('finish', () => clearTimeout(timeoutId));
    res.on('close', () => clearTimeout(timeoutId));

    next();
  };
};

// Support category detection for routing appropriate help
export const supportCategoryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.message) {
    const message = req.body.message.toLowerCase();
    
    // Detect relationship/breakup related content
    const relationshipKeywords = ['breakup', 'break up', 'relationship', 'boyfriend', 'girlfriend', 'partner', 'love', 'dating', 'heartbreak', 'cheating', 'divorce'];
    const abuseKeywords = ['abuse', 'violence', 'hit', 'hurt', 'threatened', 'scared', 'unsafe', 'stalking', 'controlling'];
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'hopeless', 'crisis'];
    
    let detectedCategory = 'general';
    let priority = 'normal';
    
    if (relationshipKeywords.some(keyword => message.includes(keyword))) {
      detectedCategory = 'relationship';
    }
    
    if (abuseKeywords.some(keyword => message.includes(keyword))) {
      detectedCategory = 'abuse';
      priority = 'high';
    }
    
    if (crisisKeywords.some(keyword => message.includes(keyword))) {
      detectedCategory = 'crisis';
      priority = 'urgent';
    }
    
    // Add metadata to request for proper routing
    req.body.detectedCategory = detectedCategory;
    req.body.priority = priority;
  }
  
  next();
};