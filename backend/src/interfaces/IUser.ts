import { UserRole } from './UserRole';
import { IAppointment } from './IAppointment';
import { IMessage } from './IMessage';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // optional when selecting from DB
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  appointments?: IAppointment[];
  sentMessages?: IMessage[];
  receivedMessages?: IMessage[];
}
export interface IUserService {
  register(userData: Partial<IUser>): Promise<{ user: IUser; token: string }>;
  login(email: string, password: string): Promise<{ user: IUser; token: string }>;
  getUserById(id: string): Promise<IUser | null>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<IUser[]>;
}