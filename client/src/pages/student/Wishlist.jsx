import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api';
import { useCart } from '../../context/CartContext';
import DashboardLayout from '../../components/DashboardLayout';

export default function Wishlist() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => { fetchWishlist(); }, []);

    const fetchWishlist = () => {
        api.get('/wishlist').then(res => { setItems(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleRemove = async (id) => {
        try { await api.delete(`/wishlist/${id}`); fetchWishlist(); toast.success('Removed'); } catch { }
    };

    const handleMoveToCart = async (item) => {
        const ok = await addToCart(item.course);
        if (ok) { await api.delete(`/wishlist/${item._id}`); fetchWishlist(); toast.success('Moved to cart'); }
    };

    return (
        <DashboardLayout role="student">
            <div className="page-header">
                <h1 className="page-title">My Wishlist</h1>
                <p className="page-subtitle">{items.length} courses saved</p>
            </div>
            {loading ? <div className="spinner" /> : items.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">💖</div><div className="empty-state-title">Your wishlist is empty</div></div>
            ) : (
                <div className="grid grid-3">
                    {items.map(item => (
                        <div key={item._id} className="card course-card">
                            <div className="course-card-image">
                                <img src={item.course?.image || 'https://via.placeholder.com/400x220/1a1a3e/6366f1?text=Course'} alt="" />
                            </div>
                            <div className="course-card-body">
                                <Link to={`/course/${item.course?.slug}`}><h3 className="course-card-title">{item.course?.title}</h3></Link>
                                <div className="course-card-instructor">{item.course?.instructor?.name}</div>
                                <div className="course-card-footer">
                                    <span className="course-card-price">${item.course?.discountPrice || item.course?.price || 0}</span>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn btn-sm btn-primary" onClick={() => handleMoveToCart(item)}>Add to Cart</button>
                                        <button className="btn btn-sm btn-icon" style={{ color: 'var(--error)', background: 'none' }} onClick={() => handleRemove(item._id)}><FiTrash2 /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
