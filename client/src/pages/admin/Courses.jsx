import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchCourses(); }, [search]);

    const fetchCourses = () => {
        api.get(`/admin/courses?search=${search}`).then(res => { setCourses(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const toggleFeatured = async (id, featured) => {
        try { await api.put(`/admin/courses/${id}`, { featured: !featured }); fetchCourses(); toast.success('Updated'); } catch { }
    };

    const deleteCourse = async (id) => {
        if (!window.confirm('Delete course?')) return;
        try { await api.delete(`/admin/courses/${id}`); fetchCourses(); toast.success('Deleted'); } catch { }
    };

    return (
        <DashboardLayout role="admin">
            <div className="page-header"><h1 className="page-title">All Courses</h1></div>
            <input type="text" className="form-input" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300, marginBottom: 24 }} />
            {loading ? <div className="spinner" /> : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Course</th><th>Instructor</th><th>Price</th><th>Students</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
                        <tbody>
                            {courses.map(c => (
                                <tr key={c._id}>
                                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{c.instructor?.name}</td>
                                    <td>${c.discountPrice || c.price || 0}</td>
                                    <td>{c.totalEnrollments || 0}</td>
                                    <td><span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span></td>
                                    <td><button className={`btn btn-sm ${c.featured ? 'btn-primary' : 'btn-secondary'}`} onClick={() => toggleFeatured(c._id, c.featured)}>{c.featured ? '★' : '☆'}</button></td>
                                    <td><button className="btn btn-sm btn-danger" onClick={() => deleteCourse(c._id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
