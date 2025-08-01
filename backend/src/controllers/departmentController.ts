import { Request, Response } from "express";
import { DepartmentService } from "../services/departmentService";
import { createDepartmentSchema, updateDepartmentSchema } from "../validations/schemas";
import { IDepartment } from "../interfaces";
import { UploadMiddleware } from "../middleware/upload";

export class DepartmentController {
  private departmentService = new DepartmentService();

  createDepartment = async (req: Request, res: Response) => {
    try {
      // Validate request body
      try {
        await createDepartmentSchema.validate(req.body);
      } catch (validationError: any) {
        return res.status(400).json({ 
          status: false, 
          message: "Validation failed", 
          errors: validationError.errors 
        });
      }
      const absoluteFilePath = `${process.env.APP_URL}/uploads/departments/${req.file?.filename}`;
      const departmentData: Partial<IDepartment> = {
        ...req.body,
        imageUrl: absoluteFilePath
      };

      const department = await this.departmentService.createDepartment(departmentData);
      
      return res.status(201).json({ 
        status: true, 
        message: "Department created successfully",
        data: department
      });
    } catch (error: any) {
      console.error('Create department error:', error);
      
      if (error.message === 'Department with this name already exists') {
        return res.status(409).json({ 
          status: false, 
          message: "Department with this name already exists. Please use a different name." 
        });
      }

      return res.status(500).json({ 
        status: false, 
        message: "Failed to create department. Please try again later." 
      });
    }
  };

  getAllDepartments = async (req: Request, res: Response) => {
    try {
      const departments = await this.departmentService.getAllDepartments();
      
      return res.status(200).json({
        status: true,
        message: "Departments retrieved successfully",
        data: departments
      });
    } catch (error: any) {
      console.error('Get all departments error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to retrieve departments. Please try again later." 
      });
    }
  };

  getDepartmentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const department = await this.departmentService.getDepartmentById(id);
      
      if (!department) {
        return res.status(404).json({
          status: false,
          message: "Department not found"
        });
      }

      return res.status(200).json({
        status: true,
        message: "Department retrieved successfully",
        data: department
      });
    } catch (error: any) {
      console.error('Get department by ID error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to retrieve department. Please try again later." 
      });
    }
  };

  updateDepartment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Validate request body
      try {
        await updateDepartmentSchema.validate(req.body);
      } catch (validationError: any) {
        return res.status(400).json({ 
          status: false, 
          message: "Validation failed", 
          errors: validationError.errors 
        });
      }

      const updateData: Partial<IDepartment> = {
        ...req.body
      };

      // Handle image upload if new file is provided
      if (req.file) {
        updateData.imageUrl = UploadMiddleware.getFileUrl(req.file.filename, 'departments');
      }

      const department = await this.departmentService.updateDepartment(id, updateData);
      
      if (!department) {
        return res.status(404).json({
          status: false,
          message: "Department not found"
        });
      }

      return res.status(200).json({
        status: true,
        message: "Department updated successfully",
        data: department
      });
    } catch (error: any) {
      console.error('Update department error:', error);
      
      if (error.message === 'Department with this name already exists') {
        return res.status(409).json({ 
          status: false, 
          message: "Department with this name already exists. Please use a different name." 
        });
      }

      return res.status(500).json({ 
        status: false, 
        message: "Failed to update department. Please try again later." 
      });
    }
  };

  deleteDepartment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.departmentService.deleteDepartment(id);
      
      if (!success) {
        return res.status(404).json({
          status: false,
          message: "Department not found"
        });
      }

      return res.status(200).json({
        status: true,
        message: "Department deleted successfully"
      });
    } catch (error: any) {
      console.error('Delete department error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to delete department. Please try again later." 
      });
    }
  };

  getActiveDepartments = async (req: Request, res: Response) => {
    try {
      const departments = await this.departmentService.getActiveDepartments();
      
      return res.status(200).json({
        status: true,
        message: "Active departments retrieved successfully",
        data: departments
      });
    } catch (error: any) {
      console.error('Get active departments error:', error);
      
      return res.status(500).json({ 
        status: false, 
        message: "Failed to retrieve active departments. Please try again later." 
      });
    }
  };
} 