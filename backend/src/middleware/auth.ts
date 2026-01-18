import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userEmail?: string;
}

interface JwtPayload {
  email: string;
  role: string;
}

export const verifyAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not set');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Check if user has admin role
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }

    // Attach user email to request
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
    } else {
      console.error('Auth error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
};
