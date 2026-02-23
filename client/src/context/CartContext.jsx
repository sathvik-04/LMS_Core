import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const guestToken = localStorage.getItem('guestToken');
            const res = await api.get(`/cart${!user && guestToken ? `?guestToken=${guestToken}` : ''}`);
            setItems(res.data.data || []);
        } catch { setItems([]); }
        finally { setLoading(false); }
    }, [user]);

    useEffect(() => { fetchCart(); }, [fetchCart]);

    const addToCart = async (course) => {
        try {
            const res = await api.post('/cart', {
                course: course._id, price: course.discountPrice || course.price,
                instructor: course.instructor?._id || course.instructor,
                guestToken: localStorage.getItem('guestToken'),
            });
            if (res.data.guestToken) localStorage.setItem('guestToken', res.data.guestToken);
            await fetchCart();
            return true;
        } catch { return false; }
    };

    const removeFromCart = async (itemId) => {
        try { await api.delete(`/cart/${itemId}`); await fetchCart(); } catch { }
    };

    const mergeCart = async () => {
        const guestToken = localStorage.getItem('guestToken');
        if (guestToken) {
            try { await api.post('/cart/merge', { guestToken }); localStorage.removeItem('guestToken'); await fetchCart(); } catch { }
        }
    };

    const clearCart = async () => {
        try { await api.delete('/cart'); setItems([]); } catch { }
    };

    const total = items.reduce((sum, item) => sum + (item.price || item.course?.discountPrice || item.course?.price || 0), 0);

    return (
        <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, mergeCart, clearCart, fetchCart, total, count: items.length }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
