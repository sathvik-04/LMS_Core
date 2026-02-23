import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function InstructorCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchCourses(); }, []);

    const fetchCourses = () => {
        api.get('/courses/my-courses').then(res => { setCourses(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this course?')) return;
        try { await api.delete(`/courses/${id}`); fetchCourses(); toast.success('Course deleted'); } catch { toast.error('Error deleting'); }
    };

    return (
        <DashboardLayout role="instructor">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><h1 className="page-title">My Courses</h1><p className="page-subtitle">{courses.length} courses</p></div>
                <Link to="/instructor/courses/new" className="btn btn-primary"><FiPlus /> New Course</Link>
            </div>
            {loading ? <div className="spinner" /> : courses.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">📝</div><div className="empty-state-title">No courses yet</div><Link to="/instructor/courses/new" className="btn btn-primary" style={{ marginTop: 16 }}>Create Your First Course</Link></div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Course</th><th>Status</th><th>Students</th><th>Rating</th><th>Price</th><th>Actions</th></tr></thead>
                        <tbody>
                            {courses.map(c => (
                                <tr key={c._id}>
                                    <td><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <img src={c.image || 'https://via.placeholder.com/60x40/1a1a3e/6366f1?text=C'} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                        <div><div style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.category?.name}</div></div>
                                    </div></td>
                                    <td><span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span></td>
                                    <td>{c.totalEnrollments || 0}</td>
                                    <td style={{ color: 'var(--warning)' }}>{c.averageRating?.toFixed(1) || '—'}</td>
                                    <td style={{ fontWeight: 600 }}>${c.discountPrice || c.price || 0}</td>
                                    <td><div style={{ display: 'flex', gap: 4 }}>
                                        <Link to={`/instructor/courses/${c._id}/edit`} className="btn btn-sm btn-secondary"><FiEdit2 /></Link>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}><FiTrash2 /></button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
