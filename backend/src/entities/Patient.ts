import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Appointment } from './Appointment';
import { User } from './User';
import { IPatient } from '../interfaces/IPatient';

@Entity('patients')
export class Patient implements IPatient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({ length: 20, nullable: true })
  bloodGroup: string;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', nullable: true })
  currentMedications: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({ type: 'json', nullable: true })
  insuranceInfo: object;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 