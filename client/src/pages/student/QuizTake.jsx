import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';

export default function QuizTake() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQ, setCurrentQ] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/quizzes/${quizId}`).then(res => {
            const q = res.data.data;
            setQuiz(q);
            if (q.timeLimit > 0) setTimeLeft(q.timeLimit * 60);
            setLoading(false);
        }).catch(() => { toast.error('Quiz not found'); navigate(-1); });
    }, [quizId, navigate]);

    // Timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || result) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, result]);

    // Auto-submit when time runs out
    const handleSubmit = useCallback(async () => {
        if (submitting || result) return;
        setSubmitting(true);
        try {
            const answerArray = quiz.questions.map((_, i) => ({
                questionIndex: i,
                selectedAnswer: answers[i] !== undefined ? answers[i] : -1,
            }));
            const timeTaken = quiz.timeLimit > 0 ? (quiz.timeLimit * 60 - (timeLeft || 0)) : 0;
            const res = await api.post(`/quizzes/${quizId}/submit`, { answers: answerArray, timeTaken });
            setResult(res.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit quiz');
        }
        setSubmitting(false);
    }, [submitting, result, quiz, answers, timeLeft, quizId]);

    useEffect(() => {
        if (timeLeft === 0 && !result) handleSubmit();
    }, [timeLeft, result, handleSubmit]);

    const selectAnswer = (qIndex, optIndex) => {
        if (result) return;
        setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;
    if (!quiz) return null;

    const question = quiz.questions[currentQ];
    const totalAnswered = Object.keys(answers).length;

    // Result screen
    if (result) {
        return (
            <>
                <section className="breadcrumb-area section-padding img-bg-2">
                    <div className="overlay"></div>
                    <div className="container">
                        <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                            <div className="section-heading"><h2 className="section__title text-white">Quiz Results</h2></div>
                            <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                                <li><Link to="/" className="text-white">Home</Link></li>
                                <li><span className="text-white">Quiz Result</span></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="section--padding">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                {/* Score Card */}
                                <div className="card card-item text-center" style={{ marginBottom: 24 }}>
                                    <div className="card-body" style={{ padding: 40 }}>
                                        <div style={{ fontSize: 72, fontWeight: 800, color: result.passed ? '#22c55e' : '#ef4444', lineHeight: 1 }}>
                                            {result.percentage}%
                                        </div>
                                        <h3 className="fs-24 font-weight-semi-bold pt-3 pb-2">
                                            {result.passed ? '🎉 Congratulations! You Passed!' : '😔 You Did Not Pass'}
                                        </h3>
                                        <p className="pb-3">Score: {result.score} / {result.totalPoints} points • Pass score: {quiz.passingScore}%</p>
                                        {result.timeTaken > 0 && <p className="text-gray">Time taken: {formatTime(result.timeTaken)}</p>}
                                    </div>
                                </div>

                                {/* Answers Review */}
                                <h3 className="fs-20 font-weight-semi-bold pb-3">Answer Review</h3>
                                {quiz.questions.map((q, qi) => {
                                    const userAnswer = result.answers?.find(a => a.questionIndex === qi);
                                    return (
                                        <div key={qi} className="card card-item" style={{ marginBottom: 12 }}>
                                            <div className="card-body">
                                                <div className="d-flex align-items-start justify-content-between pb-2">
                                                    <h5 className="fs-15 font-weight-semi-bold">Q{qi + 1}. {q.question}</h5>
                                                    <span className={`badge ${userAnswer?.isCorrect ? 'badge-success' : 'badge-error'}`} style={{ padding: '4px 10px', borderRadius: 50, fontSize: 11, fontWeight: 700, background: userAnswer?.isCorrect ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: userAnswer?.isCorrect ? '#22c55e' : '#ef4444' }}>
                                                        {userAnswer?.isCorrect ? 'Correct' : 'Wrong'}
                                                    </span>
                                                </div>
                                                {q.options?.map((opt, oi) => {
                                                    const isSelected = userAnswer?.selectedAnswer === oi;
                                                    const isCorrect = oi === q.correctAnswer;
                                                    let bg = '#f8f9fa'; let border = '1px solid #eee'; let color = '#333';
                                                    if (isCorrect) { bg = 'rgba(34,197,94,0.1)'; border = '1px solid #22c55e'; color = '#16a34a'; }
                                                    if (isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.1)'; border = '1px solid #ef4444'; color = '#dc2626'; }
                                                    return (
                                                        <div key={oi} style={{ padding: '8px 14px', borderRadius: 6, marginBottom: 6, background: bg, border, color, fontSize: 14 }}>
                                                            {isSelected && <strong>Your answer: </strong>}
                                                            {isCorrect && <strong>✓ </strong>}
                                                            {opt}
                                                        </div>
                                                    );
                                                })}
                                                {q.explanation && <p className="text-gray fs-14 pt-2"><i className="la la-lightbulb mr-1"></i>{q.explanation}</p>}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="text-center pt-3">
                                    <button className="btn theme-btn" onClick={() => navigate(-1)}>
                                        <i className="la la-arrow-left mr-1"></i> Back to Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    // Quiz taking screen
    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">{quiz.title}</h2></div>
                        {timeLeft !== null && (
                            <div style={{ background: timeLeft < 60 ? '#ef4444' : 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 20 }}>
                                <i className="la la-clock mr-1"></i>{formatTime(timeLeft)}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="section--padding">
                <div className="container">
                    <div className="row">
                        {/* Question Panel */}
                        <div className="col-lg-8">
                            <div className="card card-item">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between pb-3">
                                        <span className="badge" style={{ background: 'rgba(123,104,238,0.12)', color: '#7b68ee', padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 700 }}>
                                            Question {currentQ + 1} of {quiz.questions.length}
                                        </span>
                                        <span className="fs-14 text-gray">{question.points} point{question.points !== 1 ? 's' : ''}</span>
                                    </div>
                                    <h4 className="fs-20 font-weight-semi-bold pb-4">{question.question}</h4>

                                    {question.options?.map((opt, oi) => (
                                        <div key={oi}
                                            onClick={() => selectAnswer(currentQ, oi)}
                                            style={{
                                                padding: '14px 18px', borderRadius: 8, marginBottom: 10, cursor: 'pointer',
                                                border: answers[currentQ] === oi ? '2px solid #7b68ee' : '1px solid #e0e0e0',
                                                background: answers[currentQ] === oi ? 'rgba(123,104,238,0.08)' : '#fff',
                                                transition: 'all 0.2s', fontSize: 15,
                                            }}>
                                            <div className="d-flex align-items-center">
                                                <div style={{
                                                    width: 24, height: 24, borderRadius: '50%', marginRight: 14, flexShrink: 0,
                                                    border: answers[currentQ] === oi ? '7px solid #7b68ee' : '2px solid #ccc',
                                                    transition: 'all 0.2s',
                                                }}></div>
                                                {opt}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Navigation */}
                                    <div className="d-flex justify-content-between align-items-center pt-4">
                                        <button className="btn theme-btn theme-btn-white" disabled={currentQ === 0}
                                            onClick={() => setCurrentQ(prev => prev - 1)}>
                                            <i className="la la-arrow-left mr-1"></i> Previous
                                        </button>

                                        {currentQ < quiz.questions.length - 1 ? (
                                            <button className="btn theme-btn" onClick={() => setCurrentQ(prev => prev + 1)}>
                                                Next <i className="la la-arrow-right ml-1"></i>
                                            </button>
                                        ) : (
                                            <button className="btn theme-btn" onClick={handleSubmit} disabled={submitting}
                                                style={{ background: '#22c55e' }}>
                                                {submitting ? 'Submitting...' : 'Submit Quiz'} <i className="la la-check ml-1"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Question Navigator Sidebar */}
                        <div className="col-lg-4">
                            <div className="card card-item">
                                <div className="card-body">
                                    <h5 className="card-title fs-16 pb-3">Questions Overview</h5>
                                    <p className="fs-14 text-gray pb-3">{totalAnswered} of {quiz.questions.length} answered</p>
                                    <div className="progress-bar-custom" style={{ marginBottom: 16 }}>
                                        <div className="progress-bar-custom-fill" style={{ width: `${(totalAnswered / quiz.questions.length) * 100}%` }}></div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                                        {quiz.questions.map((_, qi) => (
                                            <button key={qi} onClick={() => setCurrentQ(qi)}
                                                style={{
                                                    width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer',
                                                    fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                                                    background: qi === currentQ ? '#7b68ee' : answers[qi] !== undefined ? 'rgba(34,197,94,0.15)' : '#f0f0f0',
                                                    color: qi === currentQ ? '#fff' : answers[qi] !== undefined ? '#16a34a' : '#666',
                                                }}>
                                                {qi + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-3" style={{ display: 'flex', gap: 16, fontSize: 12, color: '#999' }}>
                                        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#7b68ee', borderRadius: 3, marginRight: 4 }}></span> Current</span>
                                        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'rgba(34,197,94,0.3)', borderRadius: 3, marginRight: 4 }}></span> Answered</span>
                                        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#f0f0f0', borderRadius: 3, marginRight: 4 }}></span> Pending</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
