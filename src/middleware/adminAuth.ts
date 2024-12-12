import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const bypassKey = req.headers['x-admin-bypass'] as string;
  const authToken = req.headers.authorization?.split(' ')[1];
  const authService = AuthService.getInstance();

  // Check for bypass key first
  if (bypassKey && process.env.NODE_ENV !== 'production') {
    try {
      const adminToken = authService.adminLogin({ 
        username: 'bypass', 
        password: 'bypass', 
        bypassKey 
      });
      req.headers.authorization = `Bearer ${adminToken}`;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid bypass key' });
    }
  }

  // Check normal admin token
  if (!authToken || !authService.verifyAdminToken(authToken)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
} 