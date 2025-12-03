import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  updatePasswordValidation,
  validate,
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfileValidation, validate, updateProfile);
router.put('/updatepassword', protect, updatePasswordValidation, validate, updatePassword);
router.get('/logout', protect, logout);

export default router;
