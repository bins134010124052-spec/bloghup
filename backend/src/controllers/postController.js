import Post from '../models/Post.js';

export const listPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatarUrl')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatarUrl email')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatarUrl' }
      });
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.create({
      title,
      content,
      category,
      author: req.userId
    });
    await post.populate('author', 'name avatarUrl');
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa' });
    }
    
    Object.assign(post, req.body);
    await post.save();
    await post.populate('author', 'name avatarUrl');
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa bài viết thành công' });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }

    const likeIndex = post.likes.indexOf(req.userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.userId);
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};
