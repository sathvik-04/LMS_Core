import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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
                        <div className="section-heading"><h2 className="section__title text-white">Login</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Login</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="login-area section--padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card card-item login-form">
                                <div className="card-body">
                                    <h3 className="card-title text-center fs-24 lh-35 pb-2">Login to Your Account</h3>
                                    <div className="section-block"></div>

                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <form onSubmit={handleSubmit} className="pt-4">
                                        <div className="form-group">
                                            <label className="font-weight-semi-bold">Email <span className="text-danger">*</span></label>
                                            <input type="email" className="form-control form--control" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="font-weight-semi-bold">Password <span className="text-danger">*</span></label>
                                            <input type="password" className="form-control form--control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between pb-3">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="rememberme" />
                                                <label className="custom-control-label fs-14" htmlFor="rememberme">Remember Me</label>
                                            </div>
                                            <Link to="/forgot-password" className="btn-text fs-14">Forgot Password?</Link>
                                        </div>
                                        <button type="submit" className="btn theme-btn w-100" disabled={loading}>
                                            {loading ? 'Logging in...' : 'Login'} <i className="la la-sign-in icon ml-1"></i>
                                        </button>
                                    </form>

                                    <p className="text-center pt-4">Don't have an account? <Link to="/register" className="text-color font-weight-semi-bold">Register</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
