import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function InstructorCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: 10, maxUses: 100, expiresAt: '' });

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = () => {
        api.get('/coupons').then(res => { setCoupons(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/coupons', form);
            toast.success('Coupon created!');
            setShowForm(false);
            setForm({ code: '', discountType: 'percentage', discountValue: 10, maxUses: 100, expiresAt: '' });
            fetchCoupons();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete coupon?')) return;
        try { await api.delete(`/coupons/${id}`); fetchCoupons(); toast.success('Deleted'); } catch { }
    };

    return (
        <DashboardLayout role="instructor">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><h1 className="page-title">Coupons</h1></div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><FiPlus /> New Coupon</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card card-body" style={{ maxWidth: 500, marginBottom: 24 }}>
                    <div className="form-group"><label className="form-label">Coupon Code</label><input className="form-input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}><option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option></select></div>
                        <div className="form-group"><label className="form-label">Value</label><input type="number" className="form-input" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} /></div>
                        <div className="form-group"><label className="form-label">Max Uses</label><input type="number" className="form-input" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} /></div>
                        <div className="form-group"><label className="form-label">Expires At</label><input type="date" className="form-input" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} /></div>
                    </div>
                    <button type="submit" className="btn btn-primary">Create Coupon</button>
                </form>
            )}

            {loading ? <div className="spinner" /> : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Used / Max</th><th>Expires</th><th>Actions</th></tr></thead>
                        <tbody>
                            {coupons.map(c => (
                                <tr key={c._id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.code}</td>
                                    <td><span className="badge badge-primary">{c.discountType}</span></td>
                                    <td>{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                                    <td>{c.usedCount || 0} / {c.maxUses}</td>
                                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                                    <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}><FiTrash2 /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
