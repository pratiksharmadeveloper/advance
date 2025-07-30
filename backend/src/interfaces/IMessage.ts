import { IUser } from './IUser';

export interface IMessage {
  id: string;
  content: string;
  isRead: boolean;
  subject?: string;
  emailOrPhone?: string;
  attachment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageService {
  createMessage(messageData: Partial<IMessage>): Promise<IMessage>;
  getMessageById(id: string): Promise<IMessage | null>;
  deleteMessage(id: string): Promise<boolean>;
  markAsRead(id: string): Promise<IMessage | null>;
  getUnreadMessages(userId: string): Promise<IMessage[]>;
} 