import { IUser } from './IUser';

export interface IMessage {
  id: string;
  content: string;
  isRead: boolean;
  subject?: string;
  sender: IUser;
  receiver: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageService {
  createMessage(messageData: Partial<IMessage>): Promise<IMessage>;
  getMessageById(id: string): Promise<IMessage | null>;
  getMessagesByUser(userId: string): Promise<IMessage[]>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<IMessage[]>;
  updateMessage(id: string, messageData: Partial<IMessage>): Promise<IMessage | null>;
  deleteMessage(id: string): Promise<boolean>;
  markAsRead(id: string): Promise<IMessage | null>;
  getUnreadMessages(userId: string): Promise<IMessage[]>;
} 