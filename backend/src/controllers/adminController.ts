import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { DepartmentService } from "../services/departmentService";
import { loginSchema } from "../validations/schemas";
import { UserRole } from "../interfaces/UserRole";

export class AdminController {
  private userService = new UserService();
  private departmentService = new DepartmentService();

  adminLogin = async (req: Request, res: Response) => {
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
      const { user, token } = await this.userService.login(email, password);

      // Check if user is admin
      if (user.role !== UserRole.ADMIN) {
        return res.status(403).json({ 
          status: false, 
          message: "Access denied. Admin privileges required." 
        });
      }

      return res.status(200).json({
        status: true,
        message: "Admin login successful",
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
      console.error('Admin login error:', error);
      
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
          message: "Account not found. Please check your email or contact system administrator." 
        });
      }
      
      if (error.message === 'Account deactivated') {
        return res.status(403).json({ 
          status: false, 
          message: "Your account has been deactivated. Please contact system administrator." 
        });
      }

      return res.status(500).json({ 
        status: false, 
        message: "Login failed. Please try again later." 
      });
    }
  };

  getAdminDashboard = async (req: Request, res: Response) => {
    try {
      // Get dashboard statistics
      const [
        totalUsers,
        totalDepartments,
        activeDepartments,
        totalDoctors,
        totalPatients
      ] = await Promise.all([
        this.userService.getAllUsers({}),
        this.departmentService.getAllDepartments(),
        this.departmentService.getActiveDepartments(),
        this.userService.getUsersByRole(UserRole.DOCTOR),
        this.userService.getUsersByRole(UserRole.PATIENT)
      ]);

      const dashboardStats = {
        totalUsers: totalUsers.length,
        totalDepartments: totalDepartments.length,
        activeDepartments: activeDepartments.length,
        totalDoctors: totalDoctors.length,
        totalPatients: totalPatients.length,
        recentDepartments: totalDepartments.slice(0, 5), // Get 5 most recent departments
        systemHealth: 'healthy'
      };

      return res.status(200).json({
        status: true,
        message: "Dashboard data retrieved successfully",
        data: dashboardStats
      });
    } catch (error: any) {
      console.error('Get admin dashboard error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to retrieve dashboard data. Please try again later." 
      });
    }
  };

  getAllAdmins = async (req: Request, res: Response) => {
    try {
      const admins = await this.userService.getUsersByRole(UserRole.ADMIN);
      
      return res.status(200).json({
        status: true,
        message: "Admin users retrieved successfully",
        data: admins.map(admin => ({
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          isActive: admin.isActive,
          phoneNumber: admin.phoneNumber,
          address: admin.address,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt
        }))
      });
    } catch (error: any) {
      console.error('Get all admins error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to retrieve admin users. Please try again later." 
      });
    }
  };

  createAdmin = async (req: Request, res: Response) => {
    try {
      const adminData = {
        ...req.body,
        role: UserRole.ADMIN
      };

      const { user, token } = await this.userService.register(adminData);
      
      return res.status(201).json({ 
        status: true, 
        message: "Admin user created successfully",
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
      console.error('Create admin error:', error);
      
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({ 
          status: false, 
          message: "Admin with this email already exists." 
        });
      }

      return res.status(500).json({ 
        status: false, 
        message: "Failed to create admin user. Please try again later." 
      });
    }
  };

  updateAdmin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Ensure the user being updated is an admin
      const existingUser = await this.userService.getUserById(id);
      if (!existingUser || existingUser.role !== UserRole.ADMIN) {
        return res.status(404).json({
          status: false,
          message: "Admin user not found"
        });
      }

      const updatedUser = await this.userService.updateUser(id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          message: "Admin user not found"
        });
      }

      return res.status(200).json({
        status: true,
        message: "Admin user updated successfully",
        data: {
          user: {
            id: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            address: updatedUser.address,
            isActive: updatedUser.isActive
          }
        }
      });
    } catch (error: any) {
      console.error('Update admin error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to update admin user. Please try again later." 
      });
    }
  };

  deactivateAdmin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Prevent deactivating self
      if (req.user?.id === id) {
        return res.status(400).json({
          status: false,
          message: "You cannot deactivate your own account"
        });
      }

      const updatedUser = await this.userService.updateUser(id, { isActive: false });
      
      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          message: "Admin user not found"
        });
      }

      return res.status(200).json({
        status: true,
        message: "Admin user deactivated successfully",
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            isActive: updatedUser.isActive
          }
        }
      });
    } catch (error: any) {
      console.error('Deactivate admin error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to deactivate admin user. Please try again later." 
      });
    }
  };

  activateAdmin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const updatedUser = await this.userService.updateUser(id, { isActive: true });
      
      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          message: "Admin user not found"
        });
      }

      return res.status(200).json({
        status: true,
        message: "Admin user activated successfully",
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            isActive: updatedUser.isActive
          }
        }
      });
    } catch (error: any) {
      console.error('Activate admin error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to activate admin user. Please try again later." 
      });
    }
  };
} 