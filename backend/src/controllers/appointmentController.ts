import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';
import { asyncHandler } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';
import { AppointmentStatus, AppointmentType } from '../entities/Appointment';

interface AuthRequest extends Request {
  user?: any;
}

export class AppointmentController {
  private appointmentService = new AppointmentService();

  createAppointment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await this.appointmentService.createAppointment({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: { appointment }
    });
  });

  getAllAppointments = asyncHandler(async (req: Request, res: Response) => {
    const appointments = await this.appointmentService.getAllAppointments();
    
    res.json({
      success: true,
      data: { appointments }
    });
  });

  getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
    const appointment = await this.appointmentService.getAppointmentById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: { appointment }
    });
  });

  getMyAppointments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const appointments = await this.appointmentService.getAppointmentsByUser(req.user.id);
    
    res.json({
      success: true,
      data: { appointments }
    });
  });

  getDoctorAppointments = asyncHandler(async (req: Request, res: Response) => {
    const appointments = await this.appointmentService.getAppointmentsByDoctor(req.params.doctorId);
    
    res.json({
      success: true,
      data: { appointments }
    });
  });

  updateAppointmentStatus = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const appointment = await this.appointmentService.updateAppointmentStatus(req.params.id, status);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: { appointment }
    });
  });

  updateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await this.appointmentService.updateAppointment(req.params.id, req.body);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: { appointment }
    });
  });

  deleteAppointment = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await this.appointmentService.deleteAppointment(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  });

  getAppointmentsByStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.params;
    const appointments = await this.appointmentService.getAppointmentsByStatus(status as AppointmentStatus);
    
    res.json({
      success: true,
      data: { appointments }
    });
  });

  getAppointmentsByDateRange = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const appointments = await this.appointmentService.getAppointmentsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    
    res.json({
      success: true,
      data: { appointments }
    });
  });
}

// Validation middleware
export const validateCreateAppointment = [
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('type').isIn(Object.values(AppointmentType)).withMessage('Valid appointment type is required'),
  body('doctorId').isUUID().withMessage('Valid doctor ID is required'),
  body('patientId').isUUID().withMessage('Valid patient ID is required')
];

export const validateUpdateAppointmentStatus = [
  body('status').isIn(Object.values(AppointmentStatus)).withMessage('Valid status is required')
]; 