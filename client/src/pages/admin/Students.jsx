import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchStudents(); }, [search]);

    const fetchStudents = () => {
        api.get(`/admin/students?search=${search}`).then(res => { setStudents(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const toggleStatus = async (id, status) => {
        try { await api.put(`/admin/students/${id}`, { status: status === 'active' ? 'blocked' : 'active' }); fetchStudents(); toast.success('Updated'); } catch { }
    };

    return (
        <DashboardLayout role="admin">
            <div className="page-header"><h1 className="page-title">Students</h1></div>
            <input type="text" className="form-input" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300, marginBottom: 24 }} />
            {loading ? <div className="spinner" /> : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s._id}>
                                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                                    <td><span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-error'}`}>{s.status}</span></td>
                                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                                    <td><button className={`btn btn-sm ${s.status === 'active' ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(s._id, s.status)}>{s.status === 'active' ? 'Block' : 'Activate'}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
