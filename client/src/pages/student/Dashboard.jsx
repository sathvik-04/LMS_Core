import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiHeart, FiShoppingBag, FiAward } from 'react-icons/fi';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/enrollments/my-courses').then(res => { setEnrollments(res.data.data?.slice(0, 4) || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="student">
            <div className="page-header">
                <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                <p className="page-subtitle">Track your learning progress</p>
            </div>

            <div className="stat-cards">
                <div className="stat-card"><div className="stat-card-label">Enrolled Courses</div><div className="stat-card-value"><FiBook style={{ color: 'var(--primary-light)' }} /> {enrollments.length}</div></div>
                <div className="stat-card"><div className="stat-card-label">Completed</div><div className="stat-card-value"><FiAward style={{ color: 'var(--success)' }} /> {enrollments.filter(e => e.progress === 100).length}</div></div>
                <div className="stat-card"><div className="stat-card-label">In Progress</div><div className="stat-card-value"><FiBook style={{ color: 'var(--warning)' }} /> {enrollments.filter(e => e.progress > 0 && e.progress < 100).length}</div></div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Continue Learning</h3>
            {loading ? <div className="spinner" /> : enrollments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <div className="empty-state-title">No courses yet</div>
                    <Link to="/courses" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Courses</Link>
                </div>
            ) : (
                <div className="grid grid-2">
                    {enrollments.map(e => (
                        <Link key={e._id} to={`/learn/${e.course?._id}`} className="card" style={{ display: 'flex', gap: 16, padding: 16 }}>
                            <img src={e.course?.image ? (e.course.image.startsWith('http') ? e.course.image : `http://localhost:5000${e.course.image}`) : 'https://via.placeholder.com/100x70/1a1a3e/6366f1?text=Course'}
                                alt="" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{e.course?.title}</h4>
                                <div className="progress-bar" style={{ marginBottom: 4 }}>
                                    <div className="progress-bar-fill" style={{ width: `${e.progress || 0}%` }} />
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.progress || 0}% complete</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
