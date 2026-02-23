import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = () => {
        api.get('/admin/orders').then(res => { setOrders(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleRefund = async (orderId) => {
        if (!window.confirm('Issue refund for this order?')) return;
        try { await api.put(`/admin/orders/${orderId}/refund`); fetchOrders(); toast.success('Refunded'); } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    return (
        <DashboardLayout role="admin">
            <div className="page-header"><h1 className="page-title">Orders</h1></div>
            {loading ? <div className="spinner" /> : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Order ID</th><th>Student</th><th>Course</th><th>Amount</th><th>Commission</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o._id}>
                                    <td style={{ fontSize: 12, fontFamily: 'monospace' }}>#{o._id.slice(-8)}</td>
                                    <td>{o.user?.name || 'User'}</td>
                                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.course?.title || 'Course'}</td>
                                    <td style={{ fontWeight: 600 }}>${(o.totalAmount || 0).toFixed(2)}</td>
                                    <td style={{ color: 'var(--success)', fontSize: 13 }}>${(o.platformCommission || 0).toFixed(2)}</td>
                                    <td><span className={`badge ${o.status === 'completed' ? 'badge-success' : o.status === 'refunded' ? 'badge-error' : 'badge-warning'}`}>{o.status}</span></td>
                                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td>{o.status === 'completed' && <button className="btn btn-sm btn-danger" onClick={() => handleRefund(o._id)}>Refund</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
