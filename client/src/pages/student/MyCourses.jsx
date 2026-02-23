import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/enrollments/my-courses').then(res => { setEnrollments(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="student">
            <div className="page-header">
                <h1 className="page-title">My Courses</h1>
                <p className="page-subtitle">{enrollments.length} enrolled courses</p>
            </div>
            {loading ? <div className="spinner" /> : enrollments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <div className="empty-state-title">No courses yet</div>
                    <Link to="/courses" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Courses</Link>
                </div>
            ) : (
                <div className="grid grid-3">
                    {enrollments.map(e => (
                        <Link key={e._id} to={`/learn/${e.course?._id}`} className="card course-card">
                            <div className="course-card-image">
                                <img src={e.course?.image ? (e.course.image.startsWith('http') ? e.course.image : `http://localhost:5000${e.course.image}`) : 'https://via.placeholder.com/400x220/1a1a3e/6366f1?text=Course'} alt="" />
                                {e.progress === 100 && <span className="course-card-badge" style={{ background: 'var(--success)' }}>Completed</span>}
                            </div>
                            <div className="course-card-body">
                                <h3 className="course-card-title">{e.course?.title}</h3>
                                <div className="course-card-instructor">{e.course?.instructor?.name}</div>
                                <div className="progress-bar" style={{ marginTop: 'auto' }}>
                                    <div className="progress-bar-fill" style={{ width: `${e.progress || 0}%` }} />
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{e.progress || 0}% complete</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
