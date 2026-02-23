import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useState } from 'react';

export default function CartPage() {
    const { items, removeFromCart, total } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(null);
    const [checkingOut, setCheckingOut] = useState(false);

    const applyCoupon = async () => {
        try {
            const res = await api.post('/coupons/apply', { code: couponCode, courseIds: items.map(i => i.course?._id || i.course), totalAmount: total });
            setDiscount(res.data.data);
            toast.success('Coupon applied!');
        } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
    };

    const handleCheckout = async () => {
        if (!user) return navigate('/login');
        setCheckingOut(true);
        try {
            const checkoutItems = items.map(i => ({
                courseId: i.course?._id || i.course,
                courseTitle: i.course?.title || 'Course',
                price: i.price || i.course?.discountPrice || i.course?.price,
                instructorId: i.instructor || i.course?.instructor?._id,
            }));
            const res = await api.post('/orders/checkout', {
                items: checkoutItems,
                couponCode: discount?.code,
                discountAmount: discount?.discount || 0,
            });
            window.location.href = res.data.url;
        } catch (err) { toast.error(err.response?.data?.message || 'Checkout failed'); }
        setCheckingOut(false);
    };

    const finalTotal = discount ? total - discount.discount : total;

    return (
        <>
            {/* Breadcrumb */}
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">Shopping Cart</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Cart</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Cart Content */}
            <section className="cart-area section--padding">
                <div className="container">
                    {items.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="pb-4"><i className="la la-shopping-cart" style={{ fontSize: 80, color: '#ddd' }}></i></div>
                            <h3 className="fs-24 font-weight-semi-bold pb-2">Your cart is empty</h3>
                            <p className="pb-4">Browse courses and add them to your cart</p>
                            <Link to="/courses" className="btn theme-btn">Explore Courses <i className="la la-arrow-right icon ml-1"></i></Link>
                        </div>
                    ) : (
                        <div className="row">
                            {/* Cart Items */}
                            <div className="col-lg-8">
                                <div className="card card-item">
                                    <div className="card-body">
                                        <h3 className="card-title fs-20 pb-2">{items.length} Course{items.length !== 1 ? 's' : ''} in Cart</h3>
                                        <div className="divider"><span></span></div>
                                        {items.map(item => {
                                            const c = item.course || {};
                                            return (
                                                <div key={item._id} className="media media-card py-3 border-bottom border-bottom-gray">
                                                    <Link to={`/courses/${c.slug || c._id}`} className="media-img d-block mr-3">
                                                        <img src={c.image || '/images/img-loading.png'} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                                                    </Link>
                                                    <div className="media-body">
                                                        <h5 className="fs-15 font-weight-semi-bold pb-1">
                                                            <Link to={`/courses/${c.slug || c._id}`}>{c.title}</Link>
                                                        </h5>
                                                        <p className="text-gray fs-14 lh-20">By {c.instructor?.name || 'Instructor'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="card-price text-black font-weight-bold fs-18">${(item.price || 0).toFixed(2)}</p>
                                                        <button className="btn-text text-color-2 fs-14 pt-1" onClick={() => removeFromCart(item._id)}>
                                                            <i className="la la-times mr-1"></i>Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="col-lg-4">
                                <div className="card card-item">
                                    <div className="card-body">
                                        <h3 className="card-title fs-20 pb-2">Order Summary</h3>
                                        <div className="divider"><span></span></div>
                                        <ul className="generic-list-item pb-3">
                                            <li className="d-flex align-items-center justify-content-between font-weight-semi-bold">
                                                <span>Subtotal</span><span>${total.toFixed(2)}</span>
                                            </li>
                                            {discount && (
                                                <li className="d-flex align-items-center justify-content-between text-success font-weight-semi-bold">
                                                    <span>Discount ({discount.code})</span><span>-${discount.discount.toFixed(2)}</span>
                                                </li>
                                            )}
                                        </ul>
                                        <div className="section-block"></div>
                                        <div className="d-flex align-items-center justify-content-between pt-3 pb-3">
                                            <h3 className="fs-20 font-weight-bold">Total</h3>
                                            <h3 className="fs-20 font-weight-bold text-color">${finalTotal.toFixed(2)}</h3>
                                        </div>

                                        {/* Coupon */}
                                        <div className="input-group pb-3">
                                            <input type="text" className="form-control form--control" placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                                            <div className="input-group-append">
                                                <button className="btn theme-btn" type="button" onClick={applyCoupon}>Apply</button>
                                            </div>
                                        </div>

                                        <button className="btn theme-btn w-100" onClick={handleCheckout} disabled={checkingOut}>
                                            {checkingOut ? 'Processing...' : 'Checkout'} <i className="la la-arrow-right icon ml-1"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
