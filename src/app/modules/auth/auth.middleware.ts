import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { UserModel } from './auth.model';
import axios from 'axios';
import config from '../../config';

export interface AuthRequest extends Request {
  user?: { id: string };
}

const JWT_SECRET = config.JWT_SECRET;


export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
    if (token.startsWith("ya29.")) { 
      // Google Access Token Verification

      const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
      const googleUser = googleResponse.data;

      if (!googleUser.user_id) {
        throw new Error("Invalid Google access token");
      }

      console.log("Google Token Decoded Payload:", googleUser);
      req.user = { id: googleUser.user_id };  // Use Google user ID

    } else if (token.startsWith("gho_")) { 
      // GitHub Access Token Verification
      
      const githubResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const githubUser = githubResponse.data;
      if (!githubUser.id) {
        throw new Error("Invalid GitHub token");
      }

      console.log("GitHub Token Decoded Payload:", githubUser);
      req.user = { id: githubUser.id };  // Use GitHub user ID

    } else { 
      // Regular JWT verification (For own login system)
      const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string };
      req.user = { id: decoded.id };
    }

    next();
  } catch (error: any) {
    console.error("Error verifying token:", error.message);
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
