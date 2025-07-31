import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Appointment } from '../entities/Appointment';
import { User } from '../entities/User';
import { Doctor } from '../entities/Doctor';
import { IAppointment, IAppointmentService } from '../interfaces/IAppointment';
import { AppointmentStatus, AppointmentType } from '../interfaces/AppointmentStatus';
import { validateOrReject } from 'class-validator';

export class AppointmentService implements IAppointmentService {
  private appointmentRepository: Repository<Appointment> = AppDataSource.getRepository(Appointment);
  private userRepository: Repository<User> = AppDataSource.getRepository(User);
  private doctorRepository: Repository<Doctor> = AppDataSource.getRepository(Doctor);

  async createAppointment(appointmentData: Partial<IAppointment>): Promise<IAppointment> {
    const { user, doctor: doctorId, appointmentDate, type, symptoms, notes, fee, promocode, paymentStatus } = appointmentData;

    if (!user || !doctorId) {
      throw new Error('User ID and Doctor are required');
    }


    const appointment = this.appointmentRepository.create({
      appointmentDate,
      type: type || AppointmentType.CONSULTATION,
      symptoms,
      notes,
      fee,
      promocode,
      paymentStatus: paymentStatus as 'paid' | 'unpaid',
      user,
      doctor: doctorId,
      status: AppointmentStatus.PENDING,
    });

    // await validateOrReject(appointment); // Validate using class-validator
    return this.appointmentRepository.save(appointment);
  }


  async getAppointmentById(id: string): Promise<IAppointment | null> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        id: true,
        appointmentDate: true,
        status: true,
        type: true,
        symptoms: true,
        diagnosis: true,
        prescription: true,
        notes: true,
        fee: true,
        uploadedReport: true,
        promocode: true,
        paymentStatus: true,
        doctor: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, firstName: true, lastName: true, email: true },
      },
    });
    if (!appointment) throw new Error('Appointment not found');
    return appointment;
  }

  async getAppointmentsByUser(userId: string): Promise<IAppointment[]> {
    return this.appointmentRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      select: {
        id: true,
        appointmentDate: true,
        status: true,
        type: true,
        symptoms: true,
        diagnosis: true,
        prescription: true,
        notes: true,
        fee: true,
        uploadedReport: true,
        promocode: true,
        paymentStatus: true,
        doctor: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, firstName: true, lastName: true, email: true },
      },
    });
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<IAppointment[]> {
    return this.appointmentRepository.find({
      where: { doctor: doctorId },
      relations: ['user'],
      select: {
        id: true,
        appointmentDate: true,
        status: true,
        type: true,
        symptoms: true,
        diagnosis: true,
        prescription: true,
        notes: true,
        fee: true,
        uploadedReport: true,
        promocode: true,
        paymentStatus: true,
        doctor: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, firstName: true, lastName: true, email: true },
      },
    });
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<IAppointment | null> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    appointment.status = status;
    // await validateOrReject(appointment);
    return this.appointmentRepository.save(appointment);
  }

  async updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<IAppointment | null> {
    const appointment = await this.appointmentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (updateData.user?.id && updateData.user.id !== appointment.user.id) {
      const user = await this.userRepository.findOne({ where: { id: updateData.user.id } });
      if (!user) throw new Error('Patient not found');
      appointment.user = user;
    }

    if (updateData.doctor) {
      // const doctor = await this.doctorRepository.findOne({ where: { id: updateData.doctor } });
      // if (!doctor) throw new Error('Doctor not found');
      appointment.doctor = updateData.doctor;
    }

    Object.assign(appointment, {
      appointmentDate: updateData.appointmentDate,
      type: updateData.type,
      symptoms: updateData.symptoms,
      diagnosis: updateData.diagnosis,
      prescription: updateData.prescription,
      notes: updateData.notes,
      fee: updateData.fee,
      uploadedReport: updateData.uploadedReport,
      promocode: updateData.promocode,
      paymentStatus: updateData.paymentStatus,
    });

    await validateOrReject(appointment);
    return this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await this.appointmentRepository.delete(id);
    if (!result.affected) throw new Error('Appointment not found');
    return result.affected > 0;
  }

  async getAppointmentsByStatus(status: AppointmentStatus): Promise<IAppointment[]> {
    return this.appointmentRepository.find({
      where: { status },
      relations: ['user'],
      select: {
        id: true,
        appointmentDate: true,
        status: true,
        type: true,
        symptoms: true,
        diagnosis: true,
        prescription: true,
        notes: true,
        fee: true,
        uploadedReport: true,
        promocode: true,
        paymentStatus: true,
        doctor: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, firstName: true, lastName: true, email: true },
      },
    });
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<IAppointment[]> {
    return this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .where('appointment.appointmentDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select([
        'appointment.id',
        'appointment.appointmentDate',
        'appointment.status',
        'appointment.type',
        'appointment.symptoms',
        'appointment.diagnosis',
        'appointment.prescription',
        'appointment.notes',
        'appointment.fee',
        'appointment.uploadedReport',
        'appointment.promocode',
        'appointment.paymentStatus',
        'appointment.doctor',
        'appointment.createdAt',
        'appointment.updatedAt',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
      ])
      .getMany();
  }
}