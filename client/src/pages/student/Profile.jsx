import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '', expertise: user?.expertise || '', phone: user?.phone || '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const role = user?.role === 'admin' ? 'admin' : user?.role === 'instructor' ? 'instructor' : 'student';

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/users/profile', form);
            updateUser(res.data.data);
            toast.success('Profile updated!');
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
        setLoading(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast.error('Passwords do not match');
        try {
            await api.put('/auth/change-password', passwordForm);
            toast.success('Password changed!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    return (
        <DashboardLayout role={role}>
            <div className="page-header">
                <h1 className="page-title">Profile Settings</h1>
            </div>

            <div style={{ maxWidth: 600 }}>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" value={form.email} disabled style={{ opacity: 0.5 }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea className="form-textarea" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                    </div>
                    {user?.role === 'instructor' && (
                        <div className="form-group">
                            <label className="form-label">Expertise</label>
                            <input className="form-input" value={form.expertise} onChange={e => setForm({ ...form, expertise: e.target.value })} />
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                </form>

                <div style={{ borderTop: '1px solid var(--border)', marginTop: 32, paddingTop: 32 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-input" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-input" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-input" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn btn-secondary">Change Password</button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
