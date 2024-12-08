import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { prisma } from '../lib/prisma.js';
import { upload } from '../lib/upload.js';
import path from 'path';

const router = express.Router();

// Update user profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    console.log('Received profile update request:', {
      body: req.body,
      userId: req.user?.id
    });

    const { name, email, bio } = req.body;
    const userId = req.user.id;

    console.log('Updating user with data:', {
      userId,
      name,
      email,
      bio
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        bio
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profilePicture: true,
        createdAt: true
      }
    });

    console.log('User updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    next(error);
  }
});

// Upload profile picture
router.post('/profile/picture', authenticate, upload.single('profilePicture'), async (req, res, next) => {
  try {
    console.log('Received file upload request:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    // Use relative path for storage in database
    const filePath = `/uploads/${path.basename(req.file.path)}`;

    console.log('Updating user profile picture:', {
      userId,
      filePath
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePicture: filePath
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profilePicture: true,
        createdAt: true
      }
    });

    console.log('Profile picture updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    next(error);
  }
});

// Serve uploaded files
router.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

export const usersRouter = router;