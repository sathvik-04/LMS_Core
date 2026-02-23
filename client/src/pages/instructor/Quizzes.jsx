import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/instructor/courses').then(res => {
            const myCourses = res.data.data || [];
            setCourses(myCourses);
            // Fetch quizzes for all instructor courses
            return Promise.all(myCourses.map(c =>
                api.get(`/quizzes/course/${c._id}`).then(r => r.data.data || []).catch(() => [])
            ));
        }).then(allQuizzes => {
            setQuizzes(allQuizzes.flat());
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const deleteQuiz = async (id) => {
        if (!window.confirm('Delete this quiz?')) return;
        try {
            await api.delete(`/quizzes/${id}`);
            setQuizzes(prev => prev.filter(q => q._id !== id));
            toast.success('Quiz deleted');
        } catch { toast.error('Failed to delete quiz'); }
    };

    const getCourseName = (courseId) => {
        const c = courses.find(c => c._id === courseId);
        return c ? c.title : 'Unknown Course';
    };

    if (loading) return <DashboardLayout role="instructor"><div className="spinner" /></DashboardLayout>;

    return (
        <DashboardLayout role="instructor">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Quizzes</h1>
                    <p className="page-subtitle">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} created</p>
                </div>
                <Link to="/instructor/quizzes/new" className="btn btn-primary"><i className="la la-plus mr-1"></i> Create Quiz</Link>
            </div>

            {quizzes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <div className="empty-state-title">No quizzes yet</div>
                    <p style={{ marginBottom: 16 }}>Create quizzes to test your students' knowledge</p>
                    <Link to="/instructor/quizzes/new" className="btn btn-primary">Create Your First Quiz</Link>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Quiz Title</th>
                                <th>Course</th>
                                <th>Questions</th>
                                <th>Pass Score</th>
                                <th>Time Limit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map(quiz => (
                                <tr key={quiz._id}>
                                    <td style={{ fontWeight: 600 }}>{quiz.title}</td>
                                    <td style={{ fontSize: 13, color: '#666' }}>{getCourseName(quiz.course)}</td>
                                    <td>{quiz.questions?.length || 0}</td>
                                    <td>{quiz.passingScore}%</td>
                                    <td>{quiz.timeLimit > 0 ? `${quiz.timeLimit} min` : 'No limit'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Link to={`/instructor/quizzes/${quiz._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteQuiz(quiz._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
