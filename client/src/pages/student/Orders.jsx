import { useState, useEffect } from 'react';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/my-orders').then(res => { setOrders(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="student">
            <div className="page-header">
                <h1 className="page-title">My Orders</h1>
                <p className="page-subtitle">{orders.length} orders</p>
            </div>
            {loading ? <div className="spinner" /> : orders.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">🧾</div><div className="empty-state-title">No orders yet</div></div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Order ID</th><th>Course</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o._id}>
                                    <td style={{ fontSize: 12, fontFamily: 'monospace' }}>#{o._id.slice(-8)}</td>
                                    <td>{o.course?.title || 'Course'}</td>
                                    <td style={{ fontWeight: 600 }}>${o.totalAmount?.toFixed(2)}</td>
                                    <td><span className={`badge ${o.status === 'completed' ? 'badge-success' : o.status === 'refunded' ? 'badge-error' : 'badge-warning'}`}>{o.status}</span></td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
