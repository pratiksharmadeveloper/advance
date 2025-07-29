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
import { INews } from '../interfaces/INews';

@Entity('news')
export class News implements INews {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ length: 500, nullable: true })
  summary: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isPublished: boolean = true;

  @Column({ default: 0 })
  views: number = 0;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @ManyToOne(() => User)
  @JoinColumn()
  author!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 