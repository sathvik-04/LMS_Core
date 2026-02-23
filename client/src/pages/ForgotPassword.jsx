import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message || 'Password reset link sent to your email');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">Forgot Password</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Forgot Password</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="section--padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card card-item login-form">
                                <div className="card-body">
                                    <h3 className="card-title text-center fs-24 lh-35 pb-2">Forgot Password?</h3>
                                    <p className="text-center pb-3">Enter your registered email and we'll send you a link to reset your password.</p>
                                    <div className="section-block"></div>

                                    {error && <div className="alert alert-danger">{error}</div>}
                                    {message && <div className="alert alert-success">{message}</div>}

                                    <form onSubmit={handleSubmit} className="pt-4">
                                        <div className="form-group">
                                            <label className="font-weight-semi-bold">Email Address <span className="text-danger">*</span></label>
                                            <input type="email" className="form-control form--control" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="btn theme-btn w-100" disabled={loading}>
                                            {loading ? 'Sending...' : 'Send Reset Link'} <i className="la la-arrow-right icon ml-1"></i>
                                        </button>
                                    </form>

                                    <p className="text-center pt-4"><Link to="/login" className="text-color font-weight-semi-bold"><i className="la la-arrow-left mr-1"></i> Back to Login</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
