import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await registerUser(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Đăng ký</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm text-slate-700">Tên</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Mật khẩu</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        {error && <div className="rounded-3xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <button type="submit" disabled={loading} className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700 disabled:opacity-70">
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Đã có tài khoản? <Link to="/login" className="text-sky-600">Đăng nhập</Link>
      </p>
    </section>
  );
}
