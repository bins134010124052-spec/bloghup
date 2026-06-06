import express from 'express';
import { body } from 'express-validator';
import {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} from '../controllers/postController.js';
import authMiddleware from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/', listPosts);
router.get('/:id', getPostById);
router.post(
  '/',
  authMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Tiêu đề là bắt buộc'),
    body('content').trim().notEmpty().withMessage('Nội dung là bắt buộc'),
    body('category').trim().notEmpty().withMessage('Danh mục là bắt buộc'),
  ],
  validateRequest,
  createPost
);
router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().trim().notEmpty().withMessage('Tiêu đề không hợp lệ'),
    body('content').optional().trim().notEmpty().withMessage('Nội dung không hợp lệ'),
    body('category').optional().trim().notEmpty().withMessage('Danh mục không hợp lệ'),
  ],
  validateRequest,
  updatePost
);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/like', authMiddleware, toggleLike);

export default router;
