import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { registerSchema } from "../validations/schemas";

export class UserController {
  private userService = new UserService();

  register = async (req: Request, res: Response) => {
    try {
      const error = await registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: false, message: error });
      }
      const { user, token } = await this.userService.register(req.body);
      return res.json({ status: true, data: { user, token } });
    } catch (error) {
      return res.status(500).json({ status: false, message: "Internal server error" });
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await this.userService.login(email, password);

    return res.json({
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
        },
        token,
      },
    });
  };

  getProfile = async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
          profileImage: user.profileImage,
        },
      },
    });
  };

  updateProfile = async (req: Request, res: Response) => {
    
  };

  getAllUsers = async (req: Request, res: Response) => {
    
  };

  getUserById = async (req: Request, res: Response) => {
   
  };

  deleteUser = async (req: Request, res: Response) => {
    
  };
}

// Note: Validation is now handled by Yup schemas in the routes
