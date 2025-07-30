import { Request, Response } from 'express';
import { MessageService } from '../services/messageService';
import { IMessage } from '../interfaces/IMessage';
import { UserRole } from '../interfaces/UserRole';
import * as Yup from 'yup';

// Validation schema for creating a message
const createMessageSchema = Yup.object().shape({
  content: Yup.string().required('Content is required'),
  subject: Yup.string().optional(),
  emailOrPhone: Yup.string()
    .optional()
    .test(
      'email-or-phone',
      'Must be a valid email or phone number',
      (value) => {
        if (!value) return true; // optional
        const emailValid = Yup.string().email().isValidSync(value);
        const phoneValid = /^\+?[1-9]\d{1,14}$/.test(value);
        return emailValid || phoneValid;
      }
    ),
  attachment: Yup.string().url('Must be a valid URL').optional(),
  senderId: Yup.string().uuid('Invalid sender ID').required('Sender ID is required'),
});

export class MessageController {
  private messageService = new MessageService();

  async createMessage(req: Request, res: Response) {
    try {
      // Validate request body
      try {
        await createMessageSchema.validate(req.body, { abortEarly: false });
      } catch (validationError: any) {
        return res.status(400).json({
          status: false,
          message: 'Validation failed',
          errors: validationError.errors,
        });
      }

      const { content, subject, emailOrPhone, attachment } = req.body;

      const messageData: Partial<IMessage> = {
        content,
        subject,
        emailOrPhone,
        attachment,
      };

      const message = await this.messageService.createMessage(messageData);

      return res.status(201).json({
        status: true,
        message: 'Message created successfully',
        data: message,
      });
    } catch (error: any) {
      console.error('Create message error:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to create message. Please try again later.',
      });
    }
  }

  async getMessageById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await this.messageService.getMessageById(id);

      if (!message) {
        return res.status(404).json({
          status: false,
          message: 'Message not found.',
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Message retrieved successfully',
        data: message,
      });
    } catch (error: any) {
      console.error('Get message by ID error:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to retrieve message. Please try again later.',
      });
    }
  }

  async deleteMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await this.messageService.getMessageById(id);

      if (!message) {
        return res.status(404).json({
          status: false,
          message: 'Message not found.',
        });
      }


      const success = await this.messageService.deleteMessage(id);

      if (!success) {
        return res.status(404).json({
          status: false,
          message: 'Message not found.',
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Message deleted successfully',
        data: null,
      });
    } catch (error: any) {
      console.error('Delete message error:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to delete message. Please try again later.',
      });
    }
  }

    async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await this.messageService.getMessageById(id);

      if (!message) {
        return res.status(404).json({
          status: false,
          message: 'Message not found.',
        });
      }

      const updatedMessage = await this.messageService.markAsRead(id);

      if (!updatedMessage) {
        return res.status(404).json({
          status: false,
          message: 'Message not found.',
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Message marked as read successfully',
        data: updatedMessage,
      });
    } catch (error: any) {
      console.error('Mark as read error:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to mark message as read. Please try again later.',
      });
    }
  }

  async getUnreadMessages(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      // Restrict to own messages or admin
      if (req.user?.role !== UserRole.ADMIN && req.user?.id !== userId) {
        return res.status(403).json({
          status: false,
          message: 'Access denied. You can only view your own unread messages.',
        });
      }

      const messages = await this.messageService.getUnreadMessages(userId);

      return res.status(200).json({
        status: true,
        message: 'Unread messages retrieved successfully',
        data: messages,
      });
    } catch (error: any) {
      console.error('Get unread messages error:', error);
      return res.status(500).json({
        status: false,
        message: 'Failed to retrieve unread messages. Please try again later.',
      });
    }
  }
}