import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">Contact Us</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Contact</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="contact-area section--padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item text-center hover-s">
                                <div className="card-body">
                                    <div className="icon-element mx-auto shadow-sm mb-3"><i className="la la-map-marker fs-35"></i></div>
                                    <h5 className="card-title pb-2">Our Address</h5>
                                    <p className="card-text">Melbourne, Australia<br />105 South Park Avenue</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item text-center hover-s">
                                <div className="card-body">
                                    <div className="icon-element mx-auto shadow-sm mb-3"><i className="la la-phone fs-35"></i></div>
                                    <h5 className="card-title pb-2">Call Us</h5>
                                    <p className="card-text"><a href="tel:+163123788">+163 123 7884</a><br /><a href="tel:+163123788">+163 123 7884</a></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item text-center hover-s">
                                <div className="card-body">
                                    <div className="icon-element mx-auto shadow-sm mb-3"><i className="la la-envelope-o fs-35"></i></div>
                                    <h5 className="card-title pb-2">Email Us</h5>
                                    <p className="card-text"><a href="mailto:support@youtubelms.com">support@youtubelms.com</a><br /><a href="mailto:info@youtubelms.com">info@youtubelms.com</a></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pt-50px">
                        <div className="col-lg-8 mx-auto">
                            <div className="card card-item">
                                <div className="card-body">
                                    <h3 className="card-title fs-24 pb-3">Send Us a Message</h3>
                                    <div className="divider"><span></span></div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="form-group"><input type="text" className="form-control form--control" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group"><input type="email" className="form-control form--control" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                                            </div>
                                        </div>
                                        <div className="form-group"><input type="text" className="form-control form--control" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required /></div>
                                        <div className="form-group"><textarea className="form-control form--control" rows="5" placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required></textarea></div>
                                        <button type="submit" className="btn theme-btn">Send Message <i className="la la-arrow-right icon ml-1"></i></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
