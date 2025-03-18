import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from './auth.model';

export interface AuthRequest extends Request {
  user?: { id: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify token
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// Middleware to check for user roles
export const authorizeRoles = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(403).json({ success: false, message: 'Access Denied' });
        return;
      }

      const user = await UserModel.findById(req.user.id);
      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }
      
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};
