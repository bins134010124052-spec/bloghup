import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { z } from 'zod';
import { showToast } from '../components/Toast.jsx';

const commentSchema = z.object({ text: z.string().min(1, 'Nội dung bình luận không được để trống') });

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [postRes, commentRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ]);
        setPost(postRes.data);
        setComments(commentRes.data);
      } catch (err) {
        setError('Không thể tải nội dung bài viết');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${id}/like`);
      setPost((prev) => ({ ...prev, likes: Array(response.data.likes).fill(null) }));
      showToast(response.data.liked ? 'Đã thích bài viết' : 'Bỏ thích bài viết');
    } catch (err) {
      navigate('/login');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const result = commentSchema.safeParse({ text: commentText });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    try {
      setSubmitting(true);
      const response = await api.post(`/posts/${id}/comments`, { text: commentText });
      setComments((prev) => [response.data, ...prev]);
      setCommentText('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi bình luận');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="rounded-3xl bg-rose-50 p-6 text-rose-700">{error}</div>;

  return (
    <section className="space-y-6">
      <article className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{post.category}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>{post.likes?.length || 0} lượt thích</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{post.title}</h1>
        <p className="mt-4 whitespace-pre-line text-slate-600">{post.content}</p>
        {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="mt-6 rounded-3xl object-cover" />}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={handleLike} className="rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">
            Thích / Bỏ thích
          </button>
          {user?.name === post.author?.name && (
            <button onClick={() => navigate(`/edit-post/${id}`)} className="rounded-full border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50">
              Chỉnh sửa
            </button>
          )}
        </div>
      </article>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Bình luận</h2>
          <span className="text-sm text-slate-500">{comments.length} bình luận</span>
        </div>
        {user ? (
          <form onSubmit={handleComment} className="space-y-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="4"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="Viết bình luận của bạn..."
            />
            <button type="submit" disabled={submitting} className="rounded-3xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 disabled:opacity-70">
              Gửi bình luận
            </button>
          </form>
        ) : (
          <p className="text-sm text-slate-600">Vui lòng đăng nhập để bình luận.</p>
        )}
        {comments.length === 0 ? (
          <p className="mt-6 text-slate-600">Chưa có bình luận nào.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-500">
                    <span>{comment.author?.name || 'Người dùng'}</span>
                    <span className="ml-3">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  {(comment.author?._id === user?._id || user?._id === post.author?._id) && (
                    <button
                      onClick={async () => {
                        try {
                          await api.delete(`/comments/${comment._id}`);
                          setComments((prev) => prev.filter((item) => item._id !== comment._id));
                          showToast('Đã xóa bình luận');
                        } catch (err) {
                          showToast('Xóa bình luận thất bại');
                        }
                      }}
                      className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <p className="mt-2 text-slate-700">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
