import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/auth/me');
      // normalize to always expose _id
      const u = response.data;
      if (u.id && !u._id) u._id = u.id;
      setUser(u);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      // normalize user shape (some endpoints return `id` instead of `_id`)
      const u = response.data.user || {};
      if (u.id && !u._id) u._id = u.id;
      setUser(u);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', payload);
      localStorage.setItem('token', response.data.token);
      const u = response.data.user || {};
      if (u.id && !u._id) u._id = u.id;
      setUser(u);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng ký');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
