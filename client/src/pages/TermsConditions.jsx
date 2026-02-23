import { Link } from 'react-router-dom';

export default function TermsConditions() {
    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">Terms & Conditions</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Terms & Conditions</span></li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="section--padding">
                <div className="container">
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-24 font-weight-semi-bold pb-3">Terms & Conditions</h3>
                            <div className="divider"><span></span></div>
                            <p className="pb-3">Welcome to YouTubeLMS. These terms and conditions outline the rules and regulations for the use of our platform.</p>
                            <h5 className="pb-2">1. Acceptance of Terms</h5>
                            <p className="pb-3">By accessing and using this platform, you accept and agree to be bound by these terms.</p>
                            <h5 className="pb-2">2. User Accounts</h5>
                            <p className="pb-3">You are responsible for maintaining the confidentiality of your account and password.</p>
                            <h5 className="pb-2">3. Course Content</h5>
                            <p className="pb-3">All courses are provided for educational purposes only. Content is owned by the respective instructors.</p>
                            <h5 className="pb-2">4. Payment & Refunds</h5>
                            <p className="pb-3">We offer a 30-day refund policy for all purchased courses.</p>
                            <h5 className="pb-2">5. Intellectual Property</h5>
                            <p className="pb-3">Course materials are protected by copyright and may not be redistributed without permission.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
