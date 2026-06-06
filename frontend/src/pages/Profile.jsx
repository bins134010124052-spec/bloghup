import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { showToast } from '../components/Toast.jsx';

export default function Profile() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMyPosts = async () => {
      try {
        const response = await api.get('/posts', { params: { limit: 20 } });
        setPosts(response.data.posts.filter((post) => post.author?._id === user?._id));
      } catch (err) {
        setError('Không thể tải bài viết của bạn');
      } finally {
        setLoading(false);
      }
    };
    loadMyPosts();
  }, [user]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Trang cá nhân</h1>
        <p className="mt-2 text-slate-600">{user?.name}</p>
        <p className="text-slate-500">{user?.email}</p>
        <button onClick={logout} className="mt-4 rounded-3xl bg-slate-100 px-4 py-3 text-slate-700 hover:bg-slate-200">
          Đăng xuất
        </button>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Bài viết của tôi</h2>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="rounded-3xl bg-rose-50 p-4 text-rose-700">{error}</div>
        ) : posts.length === 0 ? (
          <p className="mt-4 text-slate-600">Bạn chưa có bài viết nào.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-slate-500">{post.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/edit-post/${post._id}`} className="rounded-full border border-sky-600 px-4 py-2 text-sm text-sky-600">
                      Chỉnh sửa
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await api.delete(`/posts/${post._id}`);
                          setPosts((prev) => prev.filter((item) => item._id !== post._id));
                          showToast('Đã xóa bài viết');
                        } catch (err) {
                          showToast('Xóa bài viết thất bại');
                        }
                      }}
                      className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
