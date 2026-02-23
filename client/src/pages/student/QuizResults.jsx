import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function QuizResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/quizzes/results/me').then(res => {
            setResults(res.data.data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <DashboardLayout role="student"><div className="spinner" /></DashboardLayout>;

    return (
        <DashboardLayout role="student">
            <div className="page-header">
                <h1 className="page-title">Quiz Results</h1>
                <p className="page-subtitle">{results.length} quiz attempt{results.length !== 1 ? 's' : ''}</p>
            </div>

            {results.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <div className="empty-state-title">No quiz attempts yet</div>
                    <p>Take quizzes in your enrolled courses to see results here</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Quiz</th>
                                <th>Course</th>
                                <th>Score</th>
                                <th>Percentage</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(r => (
                                <tr key={r._id}>
                                    <td style={{ fontWeight: 600 }}>{r.quiz?.title || 'Quiz'}</td>
                                    <td style={{ fontSize: 13, color: '#666' }}>
                                        <Link to={`/course/${r.course?._id}`} style={{ color: '#7b68ee' }}>{r.course?.title || 'Course'}</Link>
                                    </td>
                                    <td>{r.score} / {r.totalPoints}</td>
                                    <td style={{ fontWeight: 700 }}>{r.percentage}%</td>
                                    <td>
                                        <span className={`badge ${r.passed ? 'badge-success' : 'badge-error'}`}>
                                            {r.passed ? 'Passed' : 'Failed'}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 13, color: '#999' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
