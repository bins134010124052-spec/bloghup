import express from 'express';
import { body } from 'express-validator';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';
import authMiddleware from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/posts/:postId/comments', getComments);
router.post(
  '/posts/:postId/comments',
  authMiddleware,
  [body('text').trim().notEmpty().withMessage('Nội dung bình luận không được để trống')],
  validateRequest,
  createComment
);
router.delete('/:id', authMiddleware, deleteComment);

export default router;
