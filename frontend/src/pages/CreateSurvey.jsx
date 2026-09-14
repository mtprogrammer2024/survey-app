import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const emptyQuestion = () => ({ text: '', type: 'single_choice', required: true, options: ['', ''] });

export default function CreateSurvey() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const navigate = useNavigate();

  const updateQuestion = (index, patch) =>
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));

  const updateOption = (qIndex, oIndex, value) =>
    setQuestions((qs) => qs.map((q, i) => {
      if (i !== qIndex) return q;
      const options = [...q.options];
      options[oIndex] = value;
      return { ...q, options };
    }));

  const addOption = (qIndex) =>
    setQuestions((qs) => qs.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ''] } : q)));

  const addQuestion = () => setQuestions((qs) => [...qs, emptyQuestion()]);
  const removeQuestion = (index) => setQuestions((qs) => qs.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title, description,
      questions: questions.map((q) => ({
        ...q,
        options: ['single_choice', 'multiple_choice'].includes(q.type)
          ? q.options.filter((o) => o.trim() !== '')
          : undefined,
      })),
    };
    const res = await api.post('/api/surveys', payload);
    navigate(`/surveys/${res.data.id}/results`);
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', direction: 'rtl' }}>
      <h2>ساخت نظرسنجی جدید</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="عنوان نظرسنجی" value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }} required />
        <textarea placeholder="توضیحات (اختیاری)" value={description} onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 20 }} />

        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>سوال {qIndex + 1}</strong>
              {questions.length > 1 && <button type="button" onClick={() => removeQuestion(qIndex)}>حذف</button>}
            </div>

            <input placeholder="متن سوال" value={q.text} onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
              style={{ width: '100%', padding: 8, margin: '10px 0' }} required />

            <select value={q.type} onChange={(e) => updateQuestion(qIndex, { type: e.target.value })} style={{ padding: 8, marginBottom: 10 }}>
              <option value="single_choice">تک‌انتخابی</option>
              <option value="multiple_choice">چندانتخابی</option>
              <option value="rating">امتیاز (۱ تا ۵)</option>
              <option value="text">پاسخ متنی آزاد</option>
            </select>

            {['single_choice', 'multiple_choice'].includes(q.type) && (
              <div>
                {q.options.map((opt, oIndex) => (
                  <input key={oIndex} placeholder={`گزینه ${oIndex + 1}`} value={opt}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    style={{ width: '100%', padding: 6, marginBottom: 6 }} required />
                ))}
                <button type="button" onClick={() => addOption(qIndex)}>+ افزودن گزینه</button>
              </div>
            )}
          </div>
        ))}

        <button type="button" onClick={addQuestion} style={{ marginBottom: 20 }}>+ افزودن سوال جدید</button>
        <br />
        <button type="submit" style={{ padding: '10px 30px' }}>ذخیره و انتشار نظرسنجی</button>
      </form>
    </div>
  );
}