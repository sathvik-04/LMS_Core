import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminSliders() {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: '', subtitle: '', buttonText: 'Browse Courses', buttonLink: '/courses' });

    useEffect(() => { fetchSliders(); }, []);

    const fetchSliders = () => {
        api.get('/admin/sliders').then(res => { setSliders(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/sliders', form);
            toast.success('Slider added!');
            setForm({ title: '', subtitle: '', buttonText: 'Browse Courses', buttonLink: '/courses' });
            fetchSliders();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete slider?')) return;
        try { await api.delete(`/admin/sliders/${id}`); fetchSliders(); toast.success('Deleted'); } catch { }
    };

    return (
        <DashboardLayout role="admin">
            <div className="page-header"><h1 className="page-title">Sliders</h1></div>

            <form onSubmit={handleSubmit} className="card card-body" style={{ maxWidth: 500, marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Add Slider</h3>
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group"><label className="form-label">Button Text</label><input className="form-input" value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Button Link</label><input className="form-input" value={form.buttonLink} onChange={e => setForm({ ...form, buttonLink: e.target.value })} /></div>
                </div>
                <button type="submit" className="btn btn-primary"><FiPlus /> Add Slider</button>
            </form>

            {loading ? <div className="spinner" /> : (
                <div className="grid grid-3">
                    {sliders.map(s => (
                        <div key={s._id} className="card card-body" style={{ position: 'relative' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{s.title}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{s.subtitle}</p>
                            <span className="badge badge-primary">{s.buttonText}</span>
                            <button className="btn btn-sm btn-danger" style={{ position: 'absolute', top: 12, right: 12 }} onClick={() => handleDelete(s._id)}><FiTrash2 /></button>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
