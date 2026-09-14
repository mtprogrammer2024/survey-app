import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function PublicSurvey() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/public/surveys/${id}`).then((res) => setSurvey(res.data));
  }, [id]);

  const setAnswer = (questionId, value) => setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const toggleMultipleChoice = (questionId, optionId) => {
    setAnswers((prev) => {
      const current = prev[questionId]?.question_option_ids || [];
      const next = current.includes(optionId) ? current.filter((o) => o !== optionId) : [...current, optionId];
      return { ...prev, [questionId]: { question_option_ids: next } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      answers: survey.questions.map((q) => {
        const a = answers[q.id] || {};
        return {
          question_id: q.id,
          question_option_id: a.question_option_id || null,
          question_option_ids: a.question_option_ids || null,
          text_value: a.text_value || null,
          rating_value: a.rating_value || null,
        };
      }),
    };
    try {
      await api.post(`/api/public/surveys/${id}/submit`, payload);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'خطایی پیش اومد');
    }
  };

  if (!survey) return <p>در حال بارگذاری...</p>;
  if (submitted) return <div style={{ textAlign: 'center', marginTop: 60 }}><h2>ممنون از شرکتت! 🙏</h2></div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', direction: 'rtl' }}>
      <h2>{survey.title}</h2>
      <p>{survey.description}</p>
      <form onSubmit={handleSubmit}>
        {survey.questions.map((q) => (
          <div key={q.id} style={{ marginBottom: 24 }}>
            <p style={{ fontWeight: 'bold' }}>{q.text}</p>

            {q.type === 'single_choice' && q.options.map((opt) => (
              <label key={opt.id} style={{ display: 'block', marginBottom: 6 }}>
                <input type="radio" name={`q-${q.id}`} required={q.required}
                  onChange={() => setAnswer(q.id, { question_option_id: opt.id })} /> {opt.text}
              </label>
            ))}

            {q.type === 'multiple_choice' && q.options.map((opt) => (
              <label key={opt.id} style={{ display: 'block', marginBottom: 6 }}>
                <input type="checkbox" onChange={() => toggleMultipleChoice(q.id, opt.id)} /> {opt.text}
              </label>
            ))}

            {q.type === 'rating' && (
              <div>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} style={{ marginLeft: 12 }}>
                    <input type="radio" name={`q-${q.id}`} required={q.required}
                      onChange={() => setAnswer(q.id, { rating_value: n })} /> {n}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'text' && (
              <textarea required={q.required} onChange={(e) => setAnswer(q.id, { text_value: e.target.value })}
                style={{ width: '100%', padding: 8 }} />
            )}
          </div>
        ))}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 30px' }}>ارسال پاسخ</button>
      </form>
    </div>
  );
}