import express from 'express';
const router = express.Router();
import { isAuthenticated } from '../middlewares/auth.middlewares';
import {
    createUserAccount,
    authenticateUser,
    getCurrentUserProfile,
    logoutUser,
    updateUserProfile,
} from '../controllers/user.controllers';
import upload from '../utils/multer';

router.post('/signup', createUserAccount);
router.post('/signin', authenticateUser);
router.post('/signout', logoutUser);

// profile
router.post('/profile', isAuthenticated, getCurrentUserProfile);
router.patch(
    '/profile',
    isAuthenticated,
    upload.single('avatar'),
    updateUserProfile
);

export default router;
