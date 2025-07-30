
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Message } from '../entities/Message';
import { IMessage, IMessageService } from '../interfaces/IMessage';
import { IUser } from '../interfaces/IUser';

export class MessageService implements IMessageService {
  getMessagesByUser(userId: string): Promise<IMessage[]> {
      throw new Error('Method not implemented.');
  }
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<IMessage[]> {
      throw new Error('Method not implemented.');
  }
  updateMessage(id: string, messageData: Partial<IMessage>): Promise<IMessage | null> {
      throw new Error('Method not implemented.');
  }
  private messageRepository: Repository<Message> = AppDataSource.getRepository(Message);

  async createMessage(messageData: Partial<IMessage>): Promise<IMessage> {
    const message = this.messageRepository.create({
      ...messageData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.messageRepository.save(message);
  }

  async getMessageById(id: string): Promise<IMessage | null> {
    return await this.messageRepository.findOneBy({ id });
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await this.messageRepository.delete(id);
    return result.affected !== 0;
  }

  async markAsRead(id: string): Promise<IMessage | null> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) return null;
    message.isRead = true;
    message.updatedAt = new Date();
    return await this.messageRepository.save(message);
  }

  async getUnreadMessages(userId: string): Promise<IMessage[]> {
    return await this.messageRepository.find({
      where: { sender: { id: userId }, isRead: false },
      relations: ['sender'],
    });
  }
}
