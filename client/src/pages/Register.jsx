import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return setError('Passwords do not match');
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/register', form);
            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                        <div className="section-heading"><h2 className="section__title text-white">Register</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Register</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="register-area section--padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card card-item login-form">
                                <div className="card-body">
                                    <h3 className="card-title text-center fs-24 lh-35 pb-2">Create an Account</h3>
                                    <div className="section-block"></div>

                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <form onSubmit={handleSubmit} className="pt-4">
                                        <div className="form-group">
                                            <label className="font-weight-semi-bold">Full Name <span className="text-danger">*</span></label>
                                            <input type="text" className="form-control form--control" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="font-weight-semi-bold">Email <span className="text-danger">*</span></label>
                                            <input type="email" className="form-control form--control" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="font-weight-semi-bold">Password <span className="text-danger">*</span></label>
                                            <input type="password" className="form-control form--control" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="font-weight-semi-bold">Confirm Password <span className="text-danger">*</span></label>
                                            <input type="password" className="form-control form--control" placeholder="Confirm password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="font-weight-semi-bold">Register as</label>
                                            <select className="form-control form--control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                                <option value="user">Student</option>
                                                <option value="instructor">Instructor</option>
                                            </select>
                                        </div>
                                        <div className="custom-control custom-checkbox pb-3">
                                            <input type="checkbox" className="custom-control-input" id="agreeTerms" required />
                                            <label className="custom-control-label fs-14" htmlFor="agreeTerms">I agree to the <Link to="/terms">Terms & Conditions</Link></label>
                                        </div>
                                        <button type="submit" className="btn theme-btn w-100" disabled={loading}>
                                            {loading ? 'Creating Account...' : 'Register'} <i className="la la-user-plus icon ml-1"></i>
                                        </button>
                                    </form>

                                    <p className="text-center pt-4">Already have an account? <Link to="/login" className="text-color font-weight-semi-bold">Login</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
