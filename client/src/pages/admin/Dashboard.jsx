import { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard').then(res => { setStats(res.data.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <DashboardLayout role="admin"><div className="spinner" /></DashboardLayout>;

    return (
        <DashboardLayout role="admin">
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Platform overview & analytics</p>
            </div>

            <div className="stat-cards">
                <div className="stat-card"><div className="stat-card-label">Total Students</div><div className="stat-card-value" style={{ color: 'var(--primary-light)' }}><FiUsers /> {stats?.totalStudents || 0}</div></div>
                <div className="stat-card"><div className="stat-card-label">Total Instructors</div><div className="stat-card-value" style={{ color: 'var(--accent)' }}><FiUsers /> {stats?.totalInstructors || 0}</div></div>
                <div className="stat-card"><div className="stat-card-label">Total Courses</div><div className="stat-card-value" style={{ color: 'var(--warning)' }}><FiBook /> {stats?.totalCourses || 0}</div></div>
                <div className="stat-card"><div className="stat-card-label">Total Revenue</div><div className="stat-card-value" style={{ color: 'var(--success)' }}><FiDollarSign /> ${(stats?.totalRevenue || 0).toFixed(2)}</div></div>
                <div className="stat-card"><div className="stat-card-label">Total Orders</div><div className="stat-card-value"><FiShoppingBag /> {stats?.totalOrders || 0}</div></div>
                <div className="stat-card"><div className="stat-card-label">Total Enrollments</div><div className="stat-card-value" style={{ color: 'var(--accent)' }}>{stats?.totalEnrollments || 0}</div></div>
            </div>

            {/* Revenue Chart Placeholder */}
            {stats?.revenueByMonth?.length > 0 && (
                <div className="card card-body" style={{ marginTop: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Monthly Revenue</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
                        {stats.revenueByMonth.map((m, i) => {
                            const maxVal = Math.max(...stats.revenueByMonth.map(x => x.total));
                            const height = maxVal > 0 ? (m.total / maxVal) * 180 : 0;
                            return (
                                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>${m.total?.toFixed(0)}</div>
                                    <div style={{ height, background: 'var(--gradient-primary)', borderRadius: '4px 4px 0 0', minHeight: 4, transition: 'height 0.5s ease' }} />
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{m._id?.month}/{m._id?.year}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
