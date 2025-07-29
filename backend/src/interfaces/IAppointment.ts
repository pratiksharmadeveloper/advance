import { AppointmentStatus, AppointmentType } from './AppointmentStatus';
import { IUser } from './IUser';
import { IDoctor } from './IDoctor';
import { IPatient } from './IPatient';

export interface IAppointment {
  id: string;
  appointmentDate: Date;
  status: AppointmentStatus;
  type: AppointmentType;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  fee?: number;
  user: IUser;
  doctor: IDoctor;
  patient: IPatient;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointmentService {
  createAppointment(appointmentData: Partial<IAppointment>): Promise<IAppointment>;
  getAppointmentById(id: string): Promise<IAppointment | null>;
  getAllAppointments(): Promise<IAppointment[]>;
  getAppointmentsByUser(userId: string): Promise<IAppointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<IAppointment[]>;
  updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<IAppointment | null>;
  updateAppointment(id: string, appointmentData: Partial<IAppointment>): Promise<IAppointment | null>;
  deleteAppointment(id: string): Promise<boolean>;
  getAppointmentsByStatus(status: AppointmentStatus): Promise<IAppointment[]>;
  getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<IAppointment[]>;
} 