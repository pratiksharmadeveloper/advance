
import express from 'express';
import { MessageController } from '../controllers/messageController';
import { adminAuth } from '@/middleware/adminAuth';
import { UploadMiddleware } from '@/middleware/upload';

const router = express.Router();
const messageController = new MessageController();


// Message routes
router.post('/', UploadMiddleware.imageUpload("image", 10 * 1024 * 1024), messageController.createMessage);
router.get('/:id', messageController.getMessageById);
router.delete('/:id', adminAuth, messageController.deleteMessage);
router.patch('/:id/read', adminAuth, messageController.markAsRead);
router.get('/unread/:userId', adminAuth, messageController.getUnreadMessages);

export default router;
