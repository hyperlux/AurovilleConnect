import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Get user's notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
        read: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: {
        read: true
      }
    });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// Create notification (internal use only)
export async function createNotification(userId, type, title, message, link) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        read: false
      }
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export const notificationsRouter = router; 