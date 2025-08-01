import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { registerSchema, loginSchema } from "../validations/schemas";
import { IUser } from "../interfaces";
import * as bcrypt from "bcryptjs";

export class UserController {
  private userService = new UserService();

  register = async (req: Request, res: Response) => {
    const registerData: IUser = req.body;
    try {
      // Validate request body
      try {
        await registerSchema.validate(req.body);
      } catch (validationError: any) {
        return res.status(400).json({ 
          status: false, 
          message: "Validation failed", 
          errors: validationError.errors 
        });
      }

      const { user, token } = await this.userService.register(registerData);
      
      return res.status(201).json({ 
        status: true, 
        message: "Registration successful",
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
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error types
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({ 
          status: false, 
          message: "Email already registered. Please use a different email or try logging in." 
        });
      }
      
      if (error.message === 'Invalid role') {
        return res.status(400).json({ 
          status: false, 
          message: "Invalid user role specified." 
        });
      }

      return res.status(500).json({ 
        status: false, 
        message: "Registration failed. Please try again later." 
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      // Validate request body
      try {
        await loginSchema.validate(req.body);
      } catch (validationError: any) {
        return res.status(400).json({ 
          status: false, 
          message: "Validation failed", 
          errors: validationError.errors 
        });
      }

      const { email, password } = req.body;
      console.log("hashed password", await bcrypt.hash(password, 12));
      const { user, token } = await this.userService.login(email, password);

      return res.status(200).json({
        status: true,
        message: "Login successful",
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
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ 
          status: false, 
          message: "Invalid email or password. Please check your credentials and try again." 
        });
      }
      
      if (error.message === 'Account not found') {
        return res.status(404).json({ 
          status: false, 
          message: "Account not found. Please check your email or register a new account." 
        });
      }
      
      if (error.message === 'Account deactivated') {
        return res.status(403).json({ 
          status: false, 
          message: "Your account has been deactivated. Please contact support for assistance." 
        });
      }

      return res.status(500).json({ 
        status: false, 
        message: "Login failed. Please try again later." 
      });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.user!.id);

      if (!user) {
        return res.status(404).json({ 
          status: false,
          message: "User profile not found" 
        });
      }

      res.status(200).json({
        status: true,
        message: "Profile retrieved successfully",
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
    } catch (error: any) {
      console.error('Get profile error:', error);
      return res.status(500).json({ 
        status: false, 
        message: "Failed to retrieve profile. Please try again later." 
      });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const updatedUser = await this.userService.updateUser(req.user!.id, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ 
          status: false,
          message: "User not found" 
        });
      }

      res.status(200).json({
        status: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            address: updatedUser.address,
            profileImage: updatedUser.profileImage,
          },
        },
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      return res.status(500).json({ 
        status: false, 
        message: "Failed to update profile. Please try again later." 
      });
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const {search, page = 1, limit = 10} = req.query;
      const users = await this.userService.getAllUsers({
        search: search ? String(search) : undefined,
        page: Number(page),
        limit: Number(limit),
      });
      const formatedUsers = users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        appointmentCount: user.appointments ? user.appointments.length : 0, // Count appointments
      }));
      res.status(200).json({
        status: true,
        message: "Users retrieved successfully",
        data: { users: formatedUsers},
      });
    } catch (error: any) {
      console.error('Get all users error:', error);
      return res.status(500).json({ 
        status: false, 
        message: "Failed to retrieve users. Please try again later." 
      });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ 
          status: false,
          message: "User not found" 
        });
      }

      res.status(200).json({
        status: true,
        message: "User retrieved successfully",
        data: { user }
      });
    } catch (error: any) {
      console.error('Get user by ID error:', error);
      return res.status(500).json({ 
        status: false, 
        message: "Failed to retrieve user. Please try again later." 
      });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const deleted = await this.userService.deleteUser(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ 
          status: false,
          message: "User not found" 
        });
      }

      res.status(200).json({
        status: true,
        message: "User deleted successfully"
      });
    } catch (error: any) {
      console.error('Delete user error:', error);
      return res.status(500).json({ 
        status: false, 
        message: "Failed to delete user. Please try again later." 
      });
    }
  };
}
