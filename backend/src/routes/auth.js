import express from 'express';
import { body } from 'express-validator';
import { login, register, getCurrentUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Tên là bắt buộc'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu ít nhất 6 ký tự'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').exists().withMessage('Mật khẩu là bắt buộc'),
  ],
  validateRequest,
  login
);

router.get('/me', authMiddleware, getCurrentUser);

export default router;
