import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/dashboard');
    } catch {
      setError('ثبت‌نام ناموفق بود، اطلاعات رو چک کن');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', direction: 'rtl' }}>
      <h2>ثبت‌نام</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="نام" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} required />
        <input name="email" type="email" placeholder="ایمیل" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} required />
        <input name="password" type="password" placeholder="رمز عبور" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} required />
        <input name="password_confirmation" type="password" placeholder="تکرار رمز عبور" value={form.password_confirmation} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} required />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: 10 }}>ثبت‌نام</button>
      </form>
      <p>حساب داری؟ <Link to="/login">وارد شو</Link></p>
    </div>
  );
}