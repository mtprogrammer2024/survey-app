import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [surveys, setSurveys] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/api/surveys').then((res) => setSurveys(res.data));
  }, []);

  const publicLink = (id) => `${window.location.origin}/s/${id}`;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>سلام {user?.name} 👋</h2>
        <button onClick={logout}>خروج</button>
      </div>

      <Link to="/surveys/new"><button style={{ padding: '10px 20px', marginBottom: 20 }}>+ ساخت نظرسنجی جدید</button></Link>

      {surveys.length === 0 && <p>هنوز نظرسنجی‌ای نساختی.</p>}

      {surveys.map((s) => (
        <div key={s.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <h3>{s.title}</h3>
          <p>{s.responses_count} پاسخ</p>
          <p style={{ fontSize: 13, color: '#666' }}>لینک عمومی: <code>{publicLink(s.id)}</code></p>
          <Link to={`/surveys/${s.id}/results`}><button>مشاهده نتایج زنده</button></Link>
        </div>
      ))}
    </div>
  );
}