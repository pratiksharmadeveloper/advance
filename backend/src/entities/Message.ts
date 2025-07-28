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

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: false })
  isRead: boolean = false;

  @Column({ nullable: true })
  subject: string;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn()
  sender!: User;

  @ManyToOne(() => User, user => user.receivedMessages)
  @JoinColumn()
  receiver!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 