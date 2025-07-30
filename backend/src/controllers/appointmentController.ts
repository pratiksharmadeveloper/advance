import { Request, Response } from "express";
import { AppointmentService } from "../services/appointmentService";
import { IAppointment } from "../interfaces/IAppointment";
import {
  AppointmentStatus,
  AppointmentType,
} from "../interfaces/AppointmentStatus";
import { UserRole } from "../interfaces/UserRole";
import * as Yup from "yup";
import { AppDataSource } from "../config/database";
import { Appointment } from "../entities";

// Validation schema for creating/updating appointments
const appointmentSchema = Yup.object().shape({
  userId: Yup.string().uuid().required("Patient ID is required"),
  doctorId: Yup.string().uuid().required("Doctor ID is required"),
  appointmentDate: Yup.date()
    .required("Appointment date is required")
    .min(new Date(), "Appointment date must be in the future"),
  type: Yup.string()
    .oneOf(Object.values(AppointmentType), "Invalid appointment type")
    .required("Appointment type is required"),
  symptoms: Yup.string().optional(),
  diagnosis: Yup.string().optional(),
  prescription: Yup.string().optional(),
  notes: Yup.string().optional(),
  fee: Yup.number().optional().min(0, "Fee must be a positive number"),
  uploadedReport: Yup.string().optional(),
  promocode: Yup.string().optional(),
  paymentStatus: Yup.string()
    .oneOf(["paid", "unpaid"], "Invalid payment status")
    .optional(),
});

// Validation schema for updating appointment status
const statusSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(Object.values(AppointmentStatus), "Invalid appointment status")
    .required("Status is required"),
});

// Validation schema for date range query
const dateRangeSchema = Yup.object().shape({
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
});

export class AppointmentController {
  private appointmentService = new AppointmentService();

  async createAppointment(req: Request, res: Response) {
    try {
      // Validate request body
      try {
        await appointmentSchema.validate(req.body, { abortEarly: false });
      } catch (validationError: any) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: validationError.errors,
        });
      }

      const {
        userId,
        doctorId,
        appointmentDate,
        type,
        symptoms,
        diagnosis,
        prescription,
        notes,
        fee,
        uploadedReport,
        promocode,
        paymentStatus,
      } = req.body;

      // Restrict to patient (own appointment), admin, or doctor
      if (req.user?.role !== UserRole.ADMIN && req.user?.id !== userId) {
        return res.status(403).json({
          status: false,
          message:
            "Access denied. You can only create appointments for yourself or as an admin.",
        });
      }

      const appointmentData: Partial<IAppointment> = {
        user: req.user,
        doctor: doctorId,
        appointmentDate: new Date(appointmentDate),
        type: type as AppointmentType,
        symptoms,
        diagnosis,
        prescription,
        notes,
        fee,
        uploadedReport,
        promocode,
        paymentStatus: paymentStatus as "paid" | "unpaid",
      };

      const appointment = await this.appointmentService.createAppointment(
        appointmentData
      );

      return res.status(201).json({
        status: true,
        message: "Appointment created successfully",
        data: appointment,
      });
    } catch (error: any) {
      console.error("Create appointment error:", error);

      if (error.message === "User ID and Doctor are required") {
        return res.status(400).json({
          status: false,
          message: "Patient ID and Doctor ID are required.",
        });
      }
      if (error.message === "Patient not found") {
        return res.status(404).json({
          status: false,
          message: "Patient not found.",
        });
      }
      if (error.message === "Doctor not found") {
        return res.status(404).json({
          status: false,
          message: "Doctor not found.",
        });
      }

      return res.status(500).json({
        status: false,
        message: "Failed to create appointment. Please try again later.",
      });
    }
  }

  async getAllAppointments(req: Request, res: Response) {
    try {
      const requestSchema = Yup.object().shape({
        doctorId: Yup.string().uuid().optional(),
        status: Yup.string().oneOf(Object.values(AppointmentStatus)).optional(),
        startDate: Yup.date().optional(),
        endDate: Yup.date().optional(),
        departmentId: Yup.number().optional(),
        page: Yup.number().integer().min(1).default(1),
        limit: Yup.number().integer().min(1).default(10),
        paymentStatus: Yup.string().oneOf(["paid", "unpaid"]).optional(),
      });
      await requestSchema.validate(req.query, { abortEarly: false });

      const {
        doctorId,
        status,
        startDate,
        endDate,
        departmentId,
        page,
        limit,
        paymentStatus,
      } = req.query;

      // Convert page and limit to numbers with defaults
      const pageNum = page ? Number(page) : 1;
      const limitNum = limit ? Number(limit) : 10;

      const appointmentRepo = AppDataSource.getRepository(Appointment);
      // create query builder
      const query = appointmentRepo.createQueryBuilder("appointment");

      if (doctorId) {
        query.andWhere("appointment.doctor = :doctorId", { doctorId });
      }
      if (status) {
        query.andWhere("appointment.status = :status", { status });
      }
      if (startDate && endDate) {
        query.andWhere(
          "appointment.appointmentDate BETWEEN :startDate AND :endDate",
          { startDate, endDate }
        );
      }
      if (departmentId) {
        query.andWhere("appointment.departmentId = :departmentId", {
          departmentId,
        });
      }
      if (paymentStatus) {
        query.andWhere("appointment.paymentStatus = :paymentStatus", {
          paymentStatus,
        });
      }
      const todaysAppointments = await query
        .where("appointment.appointmentDate = CURDATE()")
        .getRawMany();
      query.skip((pageNum - 1) * limitNum).take(limitNum);
      const stats: {
        total: number;
        confirmed: number;
        cancelled: number;
        pending: number;
      } = {
       total: todaysAppointments.map((a) => a.appointmentDate).length,
        confirmed: todaysAppointments.filter(
          (a) => a.status === AppointmentStatus.CONFIRMED
        ).length,
        cancelled: todaysAppointments.filter(
          (a) => a.status === AppointmentStatus.CANCELLED
        ).length,
        pending: todaysAppointments.filter(
          (a) => a.status === AppointmentStatus.PENDING
        ).length,
      };
      const [appointments, total] = await query.getManyAndCount();
      return res.status(200).json({
        status: true,
        message: "Appointments retrieved successfully",
        data: {
          stats,
          appointments,
          total,
          page: pageNum,
          limit: limitNum,
        },
      });
    } catch (error: any) {
      console.error("Get all appointments error:", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve appointments. Please try again later.",
      });
    }
  }

  async getAppointmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const appointment = await this.appointmentService.getAppointmentById(id);

      // Restrict to appointment owner, doctor, or admin
      if (
        req.user?.role !== UserRole.ADMIN &&
        req.user?.id !== appointment.user.id &&
        req.user?.id !== appointment.doctor
      ) {
        return res.status(403).json({
          status: false,
          message:
            "Access denied. You can only view your own appointments or assigned appointments.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Appointment retrieved successfully",
        data: appointment,
      });
    } catch (error: any) {
      console.error("Get appointment by ID error:", error);

      if (error.message === "Appointment not found") {
        return res.status(404).json({
          status: false,
          message: "Appointment not found.",
        });
      }

      return res.status(500).json({
        status: false,
        message: "Failed to retrieve appointment. Please try again later.",
      });
    }
  }

  async updateAppointmentStatus(req: Request, res: Response) {
    try {
      // Validate request body
      try {
        await statusSchema.validate(req.body, { abortEarly: false });
      } catch (validationError: any) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: validationError.errors,
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Restrict to doctor or admin
      const appointment = await this.appointmentService.getAppointmentById(id);
      if (
        req.user?.role !== UserRole.ADMIN &&
        req.user?.id !== appointment.doctor
      ) {
        return res.status(403).json({
          status: false,
          message:
            "Access denied. Only the assigned doctor or admin can update appointment status.",
        });
      }

      const updatedAppointment =
        await this.appointmentService.updateAppointmentStatus(
          id,
          status as AppointmentStatus
        );

      return res.status(200).json({
        status: true,
        message: "Appointment status updated successfully",
        data: updatedAppointment,
      });
    } catch (error: any) {
      console.error("Update appointment status error:", error);

      if (error.message === "Appointment not found") {
        return res.status(404).json({
          status: false,
          message: "Appointment not found.",
        });
      }

      return res.status(500).json({
        status: false,
        message: "Failed to update appointment status. Please try again later.",
      });
    }
  }

  async updateAppointment(req: Request, res: Response) {
    try {
      // Validate request body
      try {
        await appointmentSchema.validate(req.body, { abortEarly: false });
      } catch (validationError: any) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: validationError.errors,
        });
      }

      const { id } = req.params;
      const {
        userId,
        doctorId,
        appointmentDate,
        type,
        symptoms,
        diagnosis,
        prescription,
        notes,
        fee,
        uploadedReport,
        promocode,
        paymentStatus,
      } = req.body;

      // Restrict to appointment owner, doctor, or admin
      const appointment = await this.appointmentService.getAppointmentById(id);
      if (
        req.user?.role !== UserRole.ADMIN &&
        req.user?.id !== appointment.user.id &&
        req.user?.id !== appointment.doctor
      ) {
        return res.status(403).json({
          status: false,
          message:
            "Access denied. You can only update your own or assigned appointments.",
        });
      }

      const updateData: Partial<IAppointment> = {
        user: req.user,
        doctor: doctorId,
        appointmentDate: appointmentDate
          ? new Date(appointmentDate)
          : undefined,
        type: type as AppointmentType,
        symptoms,
        diagnosis,
        prescription,
        notes,
        fee,
        uploadedReport,
        promocode,
        paymentStatus: paymentStatus as "paid" | "unpaid",
      };

      const updatedAppointment =
        await this.appointmentService.updateAppointment(id, updateData);

      return res.status(200).json({
        status: true,
        message: "Appointment updated successfully",
        data: updatedAppointment,
      });
    } catch (error: any) {
      console.error("Update appointment error:", error);

      if (error.message === "Appointment not found") {
        return res.status(404).json({
          status: false,
          message: "Appointment not found.",
        });
      }
      if (error.message === "Patient not found") {
        return res.status(404).json({
          status: false,
          message: "Patient not found.",
        });
      }
      if (error.message === "Doctor not found") {
        return res.status(404).json({
          status: false,
          message: "Doctor not found.",
        });
      }

      return res.status(500).json({
        status: false,
        message: "Failed to update appointment. Please try again later.",
      });
    }
  }

  async deleteAppointment(req: Request, res: Response){
    try {
      const { id } = req.params;

      // Restrict to appointment owner or admin
      const appointment = await this.appointmentService.getAppointmentById(id);
      if (
        req.user?.role !== UserRole.ADMIN &&
        req.user?.id !== appointment.user.id
      ) {
        return res.status(403).json({
          status: false,
          message: "Access denied. You can only delete your own appointments.",
        });
      }

      await this.appointmentService.deleteAppointment(id);

      return res.status(200).json({
        status: true,
        message: "Appointment deleted successfully",
        data: null,
      });
    } catch (error: any) {
      console.error("Delete appointment error:", error);

      if (error.message === "Appointment not found") {
        return res.status(404).json({
          status: false,
          message: "Appointment not found.",
        });
      }

      return res.status(500).json({
        status: false,
        message: "Failed to delete appointment. Please try again later.",
      });
    }
  }

  // get my appointments
  async getMyAppointments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          status: false,
          message: "User ID is required.",
        });
      }

      const appointments = await this.appointmentService.getAppointmentsByUser(
        userId
      );

      return res.status(200).json({
        status: true,
        message: "My appointments retrieved successfully",
        data: appointments,
      });
    } catch (error: any) {
      console.error("Get my appointments error:", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve appointments. Please try again later.",
      });
    }
  }

}
