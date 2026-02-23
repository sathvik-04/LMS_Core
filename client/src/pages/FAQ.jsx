import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
    { q: 'How do I create an account?', a: 'Click the "Register" button on the top right corner, fill in your details, and you\'re all set!' },
    { q: 'How do I enroll in a course?', a: 'Browse our courses, click on one you like, and click "Add to Cart" or "Buy Now" to enroll.' },
    { q: 'Can I get a refund?', a: 'Yes, we offer a 30-day money-back guarantee on all courses.' },
    { q: 'How do I become an instructor?', a: 'Register as a user, then apply to become an instructor through your dashboard.' },
    { q: 'Are certificates provided?', a: 'Yes, you receive a certificate upon completing any course.' },
    { q: 'Can I access courses on mobile?', a: 'Yes, our platform is fully responsive and works on all devices.' },
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions.' },
    { q: 'Is there a free trial?', a: 'Many courses offer free preview lectures. Some courses are completely free!' },
];

export default function FAQ() {
    const [open, setOpen] = useState(0);

    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">FAQs</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">FAQs</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="faq-area section--padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <div className="section-heading text-center pb-40px">
                                <h5 className="ribbon ribbon-lg mb-2">FAQ</h5>
                                <h2 className="section__title">Frequently Asked Questions</h2>
                                <span className="section-divider"></span>
                            </div>
                            <div className="accordion generic-accordion" id="faqAccordion">
                                {faqs.map((faq, i) => (
                                    <div className="card" key={i}>
                                        <div className="card-header" id={`faqH${i}`}>
                                            <button className={`btn d-flex align-items-center justify-content-between w-100 ${open !== i ? 'collapsed' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
                                                <span className="font-weight-semi-bold text-black">{faq.q}</span>
                                                <i className={`la ${open === i ? 'la-minus' : 'la-plus'}`}></i>
                                            </button>
                                        </div>
                                        {open === i && (
                                            <div className="card-body">
                                                <p>{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
