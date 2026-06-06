import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const listPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const search = req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const filter = { ...search, ...category };

    const total = await Post.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const posts = await Post.find(filter)
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ posts, total, totalPages, currentPage: page });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatarUrl');
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tìm thấy' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.userId,
    });
    const created = await post.populate('author', 'name avatarUrl');
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tìm thấy' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa bài viết này' });
    }
    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tìm thấy' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Không có quyền xóa bài viết này' });
    }
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: 'Xóa bài viết thành công' });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tìm thấy' });
    }
    const userIndex = post.likes.findIndex((id) => id.toString() === req.userId);
    if (userIndex >= 0) {
      post.likes.splice(userIndex, 1);
    } else {
      post.likes.push(req.userId);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: userIndex < 0 });
  } catch (error) {
    next(error);
  }
};
