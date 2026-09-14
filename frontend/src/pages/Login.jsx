import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', direction: 'rtl' }}>
      <h2>ورود</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="ایمیل" value={email}
          onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 10 }} required />
        <input type="password" placeholder="رمز عبور" value={password}
          onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 10 }} required />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: 10 }}>ورود</button>
      </form>
      <p>حساب نداری؟ <Link to="/register">ثبت‌نام کن</Link></p>
    </div>
  );
}