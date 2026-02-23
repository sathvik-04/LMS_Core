import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

const emptyQuestion = { question: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: 0, explanation: '', points: 1 };

export default function QuizEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        title: '', course: '', passingScore: 70, timeLimit: 0, questions: [{ ...emptyQuestion }],
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const coursesRes = await api.get('/instructor/courses');
                setCourses(coursesRes.data.data || []);

                if (!isNew) {
                    const quizRes = await api.get(`/quizzes/${id}`);
                    const quiz = quizRes.data.data;
                    setForm({
                        title: quiz.title,
                        course: quiz.course,
                        passingScore: quiz.passingScore,
                        timeLimit: quiz.timeLimit,
                        questions: quiz.questions.length > 0 ? quiz.questions : [{ ...emptyQuestion }],
                    });
                }
            } catch { toast.error('Failed to load data'); }
            setLoading(false);
        };
        init();
    }, [id, isNew]);

    const updateQuestion = (index, field, value) => {
        setForm(prev => {
            const questions = [...prev.questions];
            questions[index] = { ...questions[index], [field]: value };
            return { ...prev, questions };
        });
    };

    const updateOption = (qIndex, oIndex, value) => {
        setForm(prev => {
            const questions = [...prev.questions];
            const options = [...questions[qIndex].options];
            options[oIndex] = value;
            questions[qIndex] = { ...questions[qIndex], options };
            return { ...prev, questions };
        });
    };

    const addQuestion = () => {
        setForm(prev => ({ ...prev, questions: [...prev.questions, { ...emptyQuestion, options: ['', '', '', ''] }] }));
    };

    const removeQuestion = (index) => {
        if (form.questions.length <= 1) return toast.error('Quiz must have at least one question');
        setForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
    };

    const addOption = (qIndex) => {
        setForm(prev => {
            const questions = [...prev.questions];
            questions[qIndex] = { ...questions[qIndex], options: [...questions[qIndex].options, ''] };
            return { ...prev, questions };
        });
    };

    const removeOption = (qIndex, oIndex) => {
        setForm(prev => {
            const questions = [...prev.questions];
            const opts = questions[qIndex].options.filter((_, i) => i !== oIndex);
            const correct = questions[qIndex].correctAnswer >= opts.length ? 0 : questions[qIndex].correctAnswer;
            questions[qIndex] = { ...questions[qIndex], options: opts, correctAnswer: correct };
            return { ...prev, questions };
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.course) return toast.error('Please select a course');
        if (!form.title.trim()) return toast.error('Please enter a quiz title');

        // Validate questions
        for (let i = 0; i < form.questions.length; i++) {
            const q = form.questions[i];
            if (!q.question.trim()) return toast.error(`Question ${i + 1} text is empty`);
            if (q.type === 'multiple-choice') {
                const filledOpts = q.options.filter(o => o.trim());
                if (filledOpts.length < 2) return toast.error(`Question ${i + 1} needs at least 2 options`);
            }
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                questions: form.questions.map(q => ({
                    ...q,
                    options: q.type === 'true-false' ? ['True', 'False'] : q.options.filter(o => o.trim()),
                })),
            };

            if (isNew) {
                await api.post('/quizzes', payload);
                toast.success('Quiz created!');
            } else {
                await api.put(`/quizzes/${id}`, payload);
                toast.success('Quiz updated!');
            }
            navigate('/instructor/quizzes');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save quiz');
        }
        setSaving(false);
    };

    if (loading) return <DashboardLayout role="instructor"><div className="spinner" /></DashboardLayout>;

    return (
        <DashboardLayout role="instructor">
            <div className="page-header">
                <h1 className="page-title">{isNew ? 'Create Quiz' : 'Edit Quiz'}</h1>
                <p className="page-subtitle">Add questions to test student knowledge</p>
            </div>

            <form onSubmit={handleSave}>
                {/* Quiz Settings */}
                <div className="card card-body" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quiz Settings</h3>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Quiz Title *</label>
                            <input className="form-input" placeholder="Enter quiz title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Course *</label>
                            <select className="form-select" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required>
                                <option value="">Select a course</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Passing Score (%)</label>
                            <input type="number" className="form-input" min="0" max="100" value={form.passingScore} onChange={e => setForm({ ...form, passingScore: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Time Limit (minutes, 0 = no limit)</label>
                            <input type="number" className="form-input" min="0" value={form.timeLimit} onChange={e => setForm({ ...form, timeLimit: Number(e.target.value) })} />
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Questions ({form.questions.length})</h3>

                {form.questions.map((q, qi) => (
                    <div key={qi} className="card card-body" style={{ marginBottom: 16, border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#7b68ee' }}>Question {qi + 1}</h4>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ fontSize: 12, color: '#999' }}>Points:</span>
                                <input type="number" className="form-input" style={{ width: 60, padding: '4px 8px', fontSize: 13 }} min="1" value={q.points} onChange={e => updateQuestion(qi, 'points', Number(e.target.value))} />
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(qi)}>✕</button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Question Text *</label>
                            <input className="form-input" placeholder="Enter your question" value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Question Type</label>
                            <select className="form-select" value={q.type} onChange={e => {
                                updateQuestion(qi, 'type', e.target.value);
                                if (e.target.value === 'true-false') {
                                    updateQuestion(qi, 'options', ['True', 'False']);
                                    updateQuestion(qi, 'correctAnswer', 0);
                                }
                            }}>
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="true-false">True / False</option>
                            </select>
                        </div>

                        {/* Options */}
                        <div className="form-group">
                            <label className="form-label">Options (select the correct answer)</label>
                            {(q.type === 'true-false' ? ['True', 'False'] : q.options).map((opt, oi) => (
                                <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                    <input
                                        type="radio"
                                        name={`correct-${qi}`}
                                        checked={q.correctAnswer === oi}
                                        onChange={() => updateQuestion(qi, 'correctAnswer', oi)}
                                        style={{ width: 18, height: 18, accentColor: '#7b68ee' }}
                                    />
                                    {q.type === 'true-false' ? (
                                        <span style={{ flex: 1, padding: '8px 12px', background: '#f8f9fa', borderRadius: 6, fontSize: 14 }}>{opt}</span>
                                    ) : (
                                        <input className="form-input" style={{ flex: 1 }} placeholder={`Option ${oi + 1}`} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} />
                                    )}
                                    {q.type === 'multiple-choice' && q.options.length > 2 && (
                                        <button type="button" className="btn btn-sm" style={{ color: '#ef4444', padding: '4px 8px' }} onClick={() => removeOption(qi, oi)}>✕</button>
                                    )}
                                </div>
                            ))}
                            {q.type === 'multiple-choice' && (
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => addOption(qi)} style={{ marginTop: 4 }}>+ Add Option</button>
                            )}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Explanation (shown after answering)</label>
                            <input className="form-input" placeholder="Why this is the correct answer..." value={q.explanation} onChange={e => updateQuestion(qi, 'explanation', e.target.value)} />
                        </div>
                    </div>
                ))}

                <button type="button" className="btn btn-secondary" onClick={addQuestion} style={{ marginBottom: 24 }}>
                    + Add Question
                </button>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/instructor/quizzes')}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : isNew ? 'Create Quiz' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
