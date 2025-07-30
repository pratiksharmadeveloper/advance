import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { IUserService, IUser } from '../interfaces/IUser';
import { UserRole } from '../interfaces/UserRole';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export class UserService implements IUserService {
  private userRepository = AppDataSource.getRepository(User);
  private doctorRepository = AppDataSource.getRepository(Doctor);
  private patientRepository = AppDataSource.getRepository(Patient);

  async register(userData: IUser): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = this.userRepository.create({
      ...userData,
      role: userData.role || UserRole.PATIENT,
    });

    await this.userRepository.save(user);

    // // Create associated profile based on role
    // if (user.role === UserRole.DOCTOR) {
    //   const doctor = this.doctorRepository.create({ user });
    //   await this.doctorRepository.save(doctor);
    // } else if (user.role === UserRole.PATIENT) {
    //   const patient = this.patientRepository.create({ user });
    //   await this.patientRepository.save(patient);
    // }

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'role', 'isActive']
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt']
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['appointments']
    });
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'phoneNumber', 'address', 'createdAt', 'updatedAt']
    });
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any
    );
  }
} 