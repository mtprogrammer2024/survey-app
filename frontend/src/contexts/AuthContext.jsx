import { createContext, useContext, useState, useEffect } from 'react';
import api, { getCsrfCookie } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    await getCsrfCookie();
    await api.post('/api/login', { email, password });
    const res = await api.get('/api/me');
    setUser(res.data);
  };

  const register = async (name, email, password, password_confirmation) => {
    await getCsrfCookie();
    await api.post('/api/register', { name, email, password, password_confirmation });
    const res = await api.get('/api/me');
    setUser(res.data);
  };

  const logout = async () => {
    await api.post('/api/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);