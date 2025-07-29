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
import { IDoctor } from '../interfaces/IDoctor';

@Entity('doctors')
export class Doctor implements IDoctor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  specialization!: string;

  @Column({ length: 500 })
  qualifications!: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: true })
  isAvailable: boolean = true;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rating: number;

  @Column({ default: 0 })
  experienceYears: number = 0;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ type: 'json', nullable: true })
  workingHours: object;

  @Column({ nullable: true })
  consultationFee: number;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 