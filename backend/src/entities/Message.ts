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
import { IMessage } from '../interfaces/IMessage';

@Entity('messages')
export class Message implements IMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: false })
  isRead: boolean = false;

  @Column({ nullable: true })
  emailOrPhone: string;

  @Column({ nullable: true })
  subject: string;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn()
  sender!: User;

  @Column({nullable: true})
  attachment: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 