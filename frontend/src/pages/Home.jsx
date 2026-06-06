import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import PostCard from '../components/PostCard.jsx';

const categories = ['', 'Technology', 'Business', 'Life', 'Education'];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [meta, setMeta] = useState({ total: 0, totalPages: 0, currentPage: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const query = useMemo(() => ({ page, limit, search, category }), [page, limit, search, category]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (query.page) params.page = query.page;
        if (query.limit) params.limit = query.limit;
        if (query.search) params.search = query.search;
        if (query.category) params.category = query.category;
        const response = await api.get('/posts', { params });
        const postsData = Array.isArray(response.data) ? response.data : response.data.posts || [];
        setPosts(postsData);
        setMeta({ 
          total: response.data.total || postsData.length, 
          totalPages: response.data.totalPages || 1, 
          currentPage: response.data.currentPage || 1 
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [query]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Danh sách bài viết</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <option value="">Tất cả danh mục</option>
            {categories.filter(Boolean).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <button onClick={() => setPage(1)} className="rounded-3xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700">
            Áp dụng
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="rounded-3xl bg-rose-50 p-6 text-rose-700">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-3 rounded-3xl bg-white p-6 shadow-sm sm:flex-row">
        <p className="text-sm text-slate-600">{meta.total} bài viết - Trang {meta.currentPage} / {meta.totalPages}</p>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </section>
  );
}
