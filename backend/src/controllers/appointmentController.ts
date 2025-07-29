import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';
import { AppointmentStatus } from '../entities/Appointment';

interface AuthRequest extends Request {
  user?: any;
  validatedData?: any;
}

export class AppointmentController {
  private appointmentService = new AppointmentService();

  createAppointment = async (req: AuthRequest, res: Response) => {
    const appointment = await this.appointmentService.createAppointment({
      ...(req.validatedData || req.body),
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: { appointment }
    });
  };

  getAllAppointments = async (req: Request, res: Response) => {
    const appointments = await this.appointmentService.getAllAppointments();
    
    res.json({
      success: true,
      data: { appointments }
    });
  };

  getAppointmentById = async (req: Request, res: Response) => {
    const appointment = await this.appointmentService.getAppointmentById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: { appointment }
    });
  };

  getMyAppointments = async (req: AuthRequest, res: Response) => {
    const appointments = await this.appointmentService.getAppointmentsByUser(req.user.id);
    
    res.json({
      success: true,
      data: { appointments }
    });
  };

  getDoctorAppointments = async (req: Request, res: Response) => {
    const appointments = await this.appointmentService.getAppointmentsByDoctor(req.params.doctorId);
    
    res.json({
      success: true,
      data: { appointments }
    });
  };

  updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
    const { status } = req.validatedData || req.body;
    const appointment = await this.appointmentService.updateAppointmentStatus(req.params.id, status);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: { appointment }
    });
  };

  updateAppointment = async (req: AuthRequest, res: Response) => {
    const appointment = await this.appointmentService.updateAppointment(req.params.id, req.validatedData || req.body);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: { appointment }
    });
  };

  deleteAppointment = async (req: Request, res: Response) => {
    const deleted = await this.appointmentService.deleteAppointment(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  };

  getAppointmentsByStatus = async (req: Request, res: Response) => {
    const { status } = req.params;
    const appointments = await this.appointmentService.getAppointmentsByStatus(status as AppointmentStatus);
    
    res.json({
      success: true,
      data: { appointments }
    });
  };

  getAppointmentsByDateRange = async (req: Request, res: Response) => {
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
  };
}

// Note: Validation is now handled by Yup schemas in the routes 