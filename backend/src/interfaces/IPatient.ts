import { IUser } from './IUser';
import { IAppointment } from './IAppointment';

export interface IPatient {
  id: string;
  dateOfBirth?: Date;
  gender?: string;
  bloodGroup?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  insuranceInfo?: object;
  user: IUser;
  appointments?: IAppointment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatientService {
  createPatient(patientData: Partial<IPatient>): Promise<IPatient>;
  getPatientById(id: string): Promise<IPatient | null>;
  getAllPatients(): Promise<IPatient[]>;
  updatePatient(id: string, patientData: Partial<IPatient>): Promise<IPatient | null>;
  deletePatient(id: string): Promise<boolean>;
  getPatientsByBloodGroup(bloodGroup: string): Promise<IPatient[]>;
  getPatientsByGender(gender: string): Promise<IPatient[]>;
} 