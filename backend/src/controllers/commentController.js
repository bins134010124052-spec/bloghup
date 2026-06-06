import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tìm thấy' });
    }
    const comment = await Comment.create({
      text: req.body.text,
      author: req.userId,
      post: req.params.postId,
    });
    const populated = await comment.populate('author', 'name avatarUrl');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post');
    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tìm thấy' });
    }
    if (comment.author.toString() !== req.userId && comment.post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
    }
    await comment.deleteOne();
    res.json({ message: 'Xóa bình luận thành công' });
  } catch (error) {
    next(error);
  }
};
