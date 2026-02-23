import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchInstructors(); }, [search]);

    const fetchInstructors = () => {
        api.get(`/admin/instructors?search=${search}`).then(res => { setInstructors(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const toggleStatus = async (id, status) => {
        try { await api.put(`/admin/instructors/${id}`, { status: status === 'active' ? 'blocked' : 'active' }); fetchInstructors(); toast.success('Updated'); } catch { }
    };

    return (
        <DashboardLayout role="admin">
            <div className="page-header"><h1 className="page-title">Instructors</h1></div>
            <input type="text" className="form-input" placeholder="Search instructors..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300, marginBottom: 24 }} />
            {loading ? <div className="spinner" /> : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Courses</th><th>Earnings</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {instructors.map(i => (
                                <tr key={i._id}>
                                    <td style={{ fontWeight: 600 }}>{i.name}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{i.email}</td>
                                    <td>{i.totalCourses || 0}</td>
                                    <td style={{ color: 'var(--success)' }}>${(i.totalEarnings || 0).toFixed(2)}</td>
                                    <td><span className={`badge ${i.status === 'active' ? 'badge-success' : 'badge-error'}`}>{i.status}</span></td>
                                    <td><button className={`btn btn-sm ${i.status === 'active' ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(i._id, i.status)}>{i.status === 'active' ? 'Block' : 'Activate'}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
