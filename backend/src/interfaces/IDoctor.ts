import { IUser } from './IUser';
import { IAppointment } from './IAppointment';

export interface IDoctor {
  id: string;
  specialization: string;
  qualifications: string;
  bio?: string;
  isAvailable: boolean;
  rating?: number;
  experienceYears: number;
  licenseNumber?: string;
  workingHours?: object;
  consultationFee?: number;
  user: IUser;
  appointments?: IAppointment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDoctorService {
  createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor>;
  getDoctorById(id: string): Promise<IDoctor | null>;
  getAllDoctors(): Promise<IDoctor[]>;
  updateDoctor(id: string, doctorData: Partial<IDoctor>): Promise<IDoctor | null>;
  deleteDoctor(id: string): Promise<boolean>;
  getDoctorsBySpecialization(specialization: string): Promise<IDoctor[]>;
  getAvailableDoctors(): Promise<IDoctor[]>;
} 