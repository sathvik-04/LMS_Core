import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiDollarSign, FiStar } from 'react-icons/fi';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function InstructorDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/instructor/dashboard').then(res => { setStats(res.data.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <DashboardLayout role="instructor"><div className="spinner" /></DashboardLayout>;

    return (
        <DashboardLayout role="instructor">
            <div className="page-header">
                <h1 className="page-title">Instructor Dashboard</h1>
                <p className="page-subtitle">Overview of your teaching performance</p>
            </div>

            <div className="stat-cards">
                <div className="stat-card"><div className="stat-card-label">Total Courses</div><div className="stat-card-value" style={{ color: 'var(--primary-light)' }}><FiBook /> {stats?.totalCourses || 0}</div></div>
                <div className="stat-card"><div className="stat-card-label">Total Students</div><div className="stat-card-value" style={{ color: 'var(--accent)' }}><FiUsers /> {stats?.totalStudents || 0}</div></div>
                <div className="stat-card"><div className="stat-card-label">Total Earnings</div><div className="stat-card-value" style={{ color: 'var(--success)' }}><FiDollarSign /> ${(stats?.totalEarnings || 0).toFixed(2)}</div></div>
                <div className="stat-card"><div className="stat-card-label">Avg Rating</div><div className="stat-card-value" style={{ color: 'var(--warning)' }}><FiStar /> {(stats?.avgRating || 0).toFixed(1)}</div></div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                <Link to="/instructor/courses/new" className="btn btn-primary">+ Create New Course</Link>
                <Link to="/instructor/courses" className="btn btn-secondary">Manage Courses</Link>
            </div>
        </DashboardLayout>
    );
}
