import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', icon: '', description: '' });
    const [editing, setEditing] = useState(null);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = () => {
        api.get('/categories').then(res => { setCategories(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await api.put(`/categories/${editing}`, form); toast.success('Updated'); }
            else { await api.post('/categories', form); toast.success('Created'); }
            setForm({ name: '', icon: '', description: '' }); setEditing(null); fetchCategories();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleEdit = (cat) => { setForm({ name: cat.name, icon: cat.icon || '', description: cat.description || '' }); setEditing(cat._id); };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete category?')) return;
        try { await api.delete(`/categories/${id}`); fetchCategories(); toast.success('Deleted'); } catch (err) { toast.error('Error'); }
    };

    return (
        <DashboardLayout role="admin">
            <div className="page-header"><h1 className="page-title">Categories</h1></div>

            <form onSubmit={handleSubmit} className="card card-body" style={{ maxWidth: 500, marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{editing ? 'Edit' : 'Add'} Category</h3>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                    <div className="form-group"><label className="form-label">Icon (emoji)</label><input className="form-input" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
                    {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(null); setForm({ name: '', icon: '', description: '' }); }}>Cancel</button>}
                </div>
            </form>

            {loading ? <div className="spinner" /> : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Icon</th><th>Name</th><th>Description</th><th>Slug</th><th>Actions</th></tr></thead>
                        <tbody>
                            {categories.map(c => (
                                <tr key={c._id}>
                                    <td style={{ fontSize: 24 }}>{c.icon}</td>
                                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.description}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.slug}</td>
                                    <td><div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(c)}><FiEdit2 /></button>
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
