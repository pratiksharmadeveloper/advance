import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/UserRole';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user exists (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Authentication required'
      });
    }

    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({
        status: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(403).json({
        status: false,
        message: 'Account deactivated. Please contact system administrator.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error'
    });
  }
}; 