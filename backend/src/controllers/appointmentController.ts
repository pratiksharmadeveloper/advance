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
import { Appointment, User } from "../entities";

// Validation schema for creating/updating appointments
const appointmentSchema = Yup.object().shape({
  doctorId: Yup.string().required("Doctor ID is required"),
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

const appointmentService = new AppointmentService();
export class AppointmentController {
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
      const userRepository = AppDataSource.getRepository(User);
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
        promocode,
        paymentStatus,
      } = req.body;
      let appointmentUser = null;
      // Restrict to patient (own appointment), admin, or doctor
      if (req.user?.role === UserRole.ADMIN) {
        appointmentUser = await userRepository.findOne({
          where: { id: userId },
        });
      } else {
        appointmentUser = req.user;
      }
      console.log("Uploaded file:", req.file);
      // report file upload handling and path determination
      let reportPath: string | undefined;
      // report file
      if (req.file && req.file.path) {
        reportPath = `${process.env.APP_URL}/uploads/patient_reports/${req.file.filename}`;
      }
      const appointmentData: Partial<IAppointment> = {
        user: appointmentUser,
        doctor: doctorId,
        appointmentDate: new Date(appointmentDate),
        type: type as AppointmentType,
        symptoms,
        diagnosis,
        prescription,
        notes,
        fee,
        uploadedReport: reportPath,
        promocode,
        paymentStatus: paymentStatus as "paid" | "unpaid",
      };

      const appointment = await appointmentService.createAppointment(
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

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;

      const appointmentRepo = AppDataSource.getRepository(Appointment);

      // --------------------------------------------
      // 1️⃣ Fetch today's appointment stats
      // --------------------------------------------
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(now.setHours(23, 59, 59, 999));

      const todayStatsQuery = appointmentRepo
        .createQueryBuilder("appointment")
        .where("appointment.appointmentDate BETWEEN :start AND :end", {
          start: startOfToday,
          end: endOfToday,
        });

      const todaysAppointments = await todayStatsQuery.getMany();

      const stats = {
        total: todaysAppointments.length,
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

      // --------------------------------------------
      // 2️⃣ Fetch filtered & paginated appointments
      // --------------------------------------------
      const mainQuery = appointmentRepo.createQueryBuilder("appointment");

      if (doctorId) {
        mainQuery.andWhere("appointment.doctor = :doctorId", { doctorId });
      }
      if (status) {
        mainQuery.andWhere("appointment.status = :status", { status });
      }
      if (startDate && endDate) {
        mainQuery.andWhere(
          "appointment.appointmentDate BETWEEN :startDate AND :endDate",
          {
            startDate,
            endDate,
          }
        );
      }
      if (departmentId) {
        mainQuery.andWhere("appointment.departmentId = :departmentId", {
          departmentId,
        });
      }
      if (paymentStatus) {
        mainQuery.andWhere("appointment.paymentStatus = :paymentStatus", {
          paymentStatus,
        });
      }

      const total = await mainQuery.getCount();

      const appointments = await mainQuery
        .skip((pageNum - 1) * limitNum)
        .take(limitNum)
        .getMany();

      // --------------------------------------------
      // ✅ Final response
      // --------------------------------------------
      return res.status(200).json({
        status: true,
        message: "Appointments retrieved successfully",
        data: {
          stats, // today's stats
          appointments, // filtered & paginated list
          total_pages: Math.ceil(total / limitNum), // total from filtered list
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
      const appointment = await appointmentService.getAppointmentById(id);

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
      const appointment = await appointmentService.getAppointmentById(id);
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
        await appointmentService.updateAppointmentStatus(
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
      const appointment = await appointmentService.getAppointmentById(id);
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

      const updatedAppointment = await appointmentService.updateAppointment(
        id,
        updateData
      );

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

  async deleteAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Restrict to appointment owner or admin
      const appointment = await appointmentService.getAppointmentById(id);
      if (
        req.user?.role !== UserRole.ADMIN &&
        req.user?.id !== appointment.user.id
      ) {
        return res.status(403).json({
          status: false,
          message: "Access denied. You can only delete your own appointments.",
        });
      }

      await appointmentService.deleteAppointment(id);

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

      const appointments = await appointmentService.getAppointmentsByUser(
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
  async changeAppointmentStatus(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      // Validate request body
      try {
        await statusSchema.validate(req.params, { abortEarly: false });
      } catch (validationError: any) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: validationError.errors,
        });
      }

      const { id } = req.params;
      const { status } = req.params;

      // Restrict to admin or doctor
      const appointment = await appointmentService.getAppointmentById(id);
     // restrict to admin or self (user)
      if (
        req.user?.role !== UserRole.ADMIN &&
        req.user?.role !== UserRole.PATIENT
      ) {
        return res.status(403).json({
          status: false,
          message:
            "Access denied. Only admin or the patient can change appointment status.",
        });
      }

      const updatedAppointment =
        await appointmentService.updateAppointmentStatus(
          id,
          status as AppointmentStatus
        );

      return res.status(200).json({
        status: true,
        message: "Appointment status changed successfully",
        data: updatedAppointment,
      });
    } catch (error: any) {
      console.error("Change appointment status error:", error);

      if (error.message === "Appointment not found") {
        return res.status(404).json({
          status: false,
          message: "Appointment not found.",
        });
      }

      return res.status(500).json({
        status: false,
        message: "Failed to change appointment status. Please try again later.",
      });
    }
  }
}
