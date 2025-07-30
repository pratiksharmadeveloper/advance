import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { IDepartment } from '../interfaces/IDepartment';

@Entity('departments')
export class Department implements IDepartment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100, unique: true })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' = 'active';

  @Column({ default: 0 })
  doctorCount: number = 0;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 