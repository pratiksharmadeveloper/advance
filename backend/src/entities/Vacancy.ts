import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';

export enum VacancyStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  FILLED = 'filled'
}

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ length: 100 })
  department!: string;

  @Column({ length: 50 })
  location!: string;

  @Column({ type: 'enum', enum: VacancyStatus, default: VacancyStatus.OPEN })
  status: VacancyStatus = VacancyStatus.OPEN;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ nullable: true })
  salary: number;

  @Column({ nullable: true })
  experienceRequired: number;

  @Column({ type: 'json', nullable: true })
  benefits: string[];

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  postedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 