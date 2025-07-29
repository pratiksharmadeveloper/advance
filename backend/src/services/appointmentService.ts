import { AppDataSource } from '../config/database';
import { Appointment } from '../entities/Appointment';
import { User } from '../entities/User';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { IAppointmentService, IAppointment } from '../interfaces/IAppointment';
import { AppointmentStatus, AppointmentType } from '../interfaces/AppointmentStatus';

export class AppointmentService implements IAppointmentService {
  private appointmentRepository = AppDataSource.getRepository(Appointment);
  private userRepository = AppDataSource.getRepository(User);
  private doctorRepository = AppDataSource.getRepository(Doctor);
  private patientRepository = AppDataSource.getRepository(Patient);

  async createAppointment(appointmentData: {
    appointmentDate: Date;
    type: AppointmentType;
    symptoms?: string;
    userId: string;
    doctorId: string;
    patientId: string;
    notes?: string;
    fee?: number;
  }): Promise<Appointment> {
    const user = await this.userRepository.findOne({ where: { id: appointmentData.userId } });
    const doctor = await this.doctorRepository.findOne({ where: { id: appointmentData.doctorId } });
    const patient = await this.patientRepository.findOne({ where: { id: appointmentData.patientId } });

    if (!user || !doctor || !patient) {
      throw new Error('User, doctor, or patient not found');
    }

    const appointment = this.appointmentRepository.create({
      ...appointmentData,
      user,
      doctor,
      patient,
      status: AppointmentStatus.PENDING
    });

    return this.appointmentRepository.save(appointment);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['user', 'doctor', 'patient', 'doctor.user', 'patient.user']
    });
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'doctor', 'patient', 'doctor.user', 'patient.user']
    });
  }

  async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { user: { id: userId } },
      relations: ['doctor', 'patient', 'doctor.user', 'patient.user']
    });
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['user', 'patient', 'patient.user']
    });
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      return null;
    }

    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  async updateAppointment(id: string, updateData: Partial<Appointment>): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      return null;
    }

    Object.assign(appointment, updateData);
    return this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await this.appointmentRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async getAppointmentsByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { status },
      relations: ['user', 'doctor', 'patient', 'doctor.user', 'patient.user']
    });
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('patient.user', 'patientUser')
      .where('appointment.appointmentDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();
  }
} 