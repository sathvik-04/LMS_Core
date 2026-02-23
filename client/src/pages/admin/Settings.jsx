import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminSettings() {
    const [form, setForm] = useState({ siteName: '', metaTitle: '', metaDescription: '', copyright: '', email: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/settings/site-info').then(res => {
            const d = res.data.data || {};
            setForm({ siteName: d.siteName || '', metaTitle: d.metaTitle || '', metaDescription: d.metaDescription || '', copyright: d.copyright || '', email: d.email || '', phone: d.phone || '' });
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try { await api.put('/settings/site-info', form); toast.success('Settings saved!'); } catch { }
        setSaving(false);
    };

    return (
        <DashboardLayout role="admin">
            <div className="page-header"><h1 className="page-title">Site Settings</h1></div>
            {loading ? <div className="spinner" /> : (
                <form onSubmit={handleSave} style={{ maxWidth: 600 }}>
                    <div className="form-group"><label className="form-label">Site Name</label><input className="form-input" value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Meta Title</label><input className="form-input" value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Meta Description</label><textarea className="form-textarea" value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Copyright</label><input className="form-input" value={form.copyright} onChange={e => setForm({ ...form, copyright: e.target.value })} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                        <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
                </form>
            )}
        </DashboardLayout>
    );
}
