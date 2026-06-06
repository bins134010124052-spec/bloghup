import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinkClass = ({ isActive }) =>
  isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-sky-600">
          BlogHub
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={navLinkClass} end>
            Trang chủ
          </NavLink>
          {user ? (
            <>
              <NavLink to="/create-post" className={navLinkClass}>
                Tạo bài
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                {user.name}
              </NavLink>
              <button onClick={logout} className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Đăng nhập
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Đăng ký
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
