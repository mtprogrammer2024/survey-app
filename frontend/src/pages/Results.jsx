import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import echo from '../api/echo';

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const fetchResults = useCallback(() => {
    api.get(`/api/surveys/${id}/results`).then((res) => setData(res.data));
  }, [id]);

  useEffect(() => {
    fetchResults();
    const channel = echo.channel(`survey.${id}`);
    channel.listen('.SurveyResponseSubmitted', () => fetchResults());
    return () => echo.leaveChannel(`survey.${id}`);
  }, [id, fetchResults]);

  if (!data) return <p>در حال بارگذاری...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', direction: 'rtl' }}>
      <h2>نتایج زنده</h2>
      <p>مجموع پاسخ‌ها: <strong>{data.total_responses}</strong> <span style={{ color: 'green' }}>● زنده</span></p>

      {data.questions.map((q) => (
        <div key={q.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <h4>{q.text}</h4>

          {['single_choice', 'multiple_choice'].includes(q.type) && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={q.options} layout="vertical">
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="text" width={140} />
                <Tooltip />
                <Bar dataKey="votes" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {q.type === 'rating' && <p>میانگین امتیاز: <strong>{q.average} / 5</strong></p>}
          {q.type === 'text' && <ul>{q.answers.map((a, i) => <li key={i}>{a}</li>)}</ul>}
        </div>
      ))}
    </div>
  );
}