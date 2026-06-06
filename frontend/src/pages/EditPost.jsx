import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(5, 'Tiêu đề ít nhất 5 ký tự'),
  content: z.string().min(20, 'Nội dung ít nhất 20 ký tự'),
  category: z.string().min(1, 'Chọn danh mục'),
  imageUrl: z.string().optional(),
});

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setForm({
          title: response.data.title,
          content: response.data.content,
          category: response.data.category,
          imageUrl: response.data.imageUrl || '',
        });
      } catch (err) {
        setError('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const result = schema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    try {
      setLoading(true);
      await api.put(`/posts/${id}`, form);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="rounded-3xl bg-white p-8 shadow-sm">Đang tải...</div>;

  return (
    <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Chỉnh sửa bài viết</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm text-slate-700">Tiêu đề</span>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Danh mục</span>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Hình ảnh (URL)</span>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Nội dung</span>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows="8"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        {error && <div className="rounded-3xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <button type="submit" className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700">
          Lưu thay đổi
        </button>
      </form>
    </section>
  );
}
