import express from 'express';
import { register, login, googleAuth, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

export default router;
