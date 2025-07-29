import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';
import { registerSchema } from '@/validations/schemas';


export class UserController {
  private userService = new UserService();

  register = asyncHandler(async (req: Request, res: Response) => {

  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await this.userService.login(email, password);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          address: user.address
        },
        token
      }
    });
  });

  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await this.userService.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          address: user.address,
          profileImage: user.profileImage
        }
      }
    });
  });

  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updatedUser = await this.userService.updateUser(req.user.id, req.validatedData || req.body);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          phoneNumber: updatedUser.phoneNumber,
          address: updatedUser.address,
          profileImage: updatedUser.profileImage
        }
      }
    });
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    
    res.json({
      success: true,
      data: { users }
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: { user }
    });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await this.userService.deleteUser(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  });
}

// Note: Validation is now handled by Yup schemas in the routes 