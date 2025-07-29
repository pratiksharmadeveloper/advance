import { VacancyStatus } from './VacancyStatus';
import { IUser } from './IUser';

export interface IVacancy {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  status: VacancyStatus;
  requirements?: string;
  responsibilities?: string;
  salary?: number;
  experienceRequired?: number;
  benefits?: string[];
  deadline?: Date;
  postedBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVacancyService {
  createVacancy(vacancyData: Partial<IVacancy>): Promise<IVacancy>;
  getVacancyById(id: string): Promise<IVacancy | null>;
  getAllVacancies(): Promise<IVacancy[]>;
  getOpenVacancies(): Promise<IVacancy[]>;
  updateVacancy(id: string, vacancyData: Partial<IVacancy>): Promise<IVacancy | null>;
  deleteVacancy(id: string): Promise<boolean>;
  getVacanciesByDepartment(department: string): Promise<IVacancy[]>;
  getVacanciesByLocation(location: string): Promise<IVacancy[]>;
  updateVacancyStatus(id: string, status: VacancyStatus): Promise<IVacancy | null>;
} 