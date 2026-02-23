import { useState, useEffect } from 'react';
import { FiDollarSign, FiArrowUp } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';
import DashboardLayout from '../../components/DashboardLayout';

export default function Earnings() {
    const [stats, setStats] = useState(null);
    const [withdrawals, setWithdrawals] = useState([]);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/instructor/dashboard'),
            api.get('/instructor/withdrawals'),
        ]).then(([s, w]) => { setStats(s.data.data); setWithdrawals(w.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const requestWithdrawal = async () => {
        try {
            await api.post('/instructor/withdrawals', { amount: Number(withdrawAmount) });
            toast.success('Withdrawal requested!');
            setWithdrawAmount('');
            const w = await api.get('/instructor/withdrawals');
            setWithdrawals(w.data.data || []);
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    if (loading) return <DashboardLayout role="instructor"><div className="spinner" /></DashboardLayout>;

    return (
        <DashboardLayout role="instructor">
            <div className="page-header"><h1 className="page-title">Earnings & Withdrawals</h1></div>

            <div className="stat-cards">
                <div className="stat-card"><div className="stat-card-label">Total Earnings</div><div className="stat-card-value" style={{ color: 'var(--success)' }}>${(stats?.totalEarnings || 0).toFixed(2)}</div></div>
                <div className="stat-card"><div className="stat-card-label">Available Balance</div><div className="stat-card-value" style={{ color: 'var(--primary-light)' }}>${(stats?.balance || 0).toFixed(2)}</div></div>
                <div className="stat-card"><div className="stat-card-label">Total Withdrawn</div><div className="stat-card-value" style={{ color: 'var(--accent)' }}>${(stats?.totalWithdrawn || 0).toFixed(2)}</div></div>
            </div>

            <div className="card card-body" style={{ maxWidth: 400, marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Request Withdrawal</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" className="form-input" placeholder="Amount" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} min="10" step="0.01" />
                    <button className="btn btn-primary" onClick={requestWithdrawal} disabled={!withdrawAmount}><FiArrowUp /> Withdraw</button>
                </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Withdrawal History</h3>
            <div className="table-wrapper">
                <table>
                    <thead><tr><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                        {withdrawals.map(w => (
                            <tr key={w._id}>
                                <td style={{ fontWeight: 600 }}>${w.amount?.toFixed(2)}</td>
                                <td><span className={`badge ${w.status === 'approved' ? 'badge-success' : w.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>{w.status}</span></td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(w.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
