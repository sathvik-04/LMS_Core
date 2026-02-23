import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">Privacy Policy</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Privacy Policy</span></li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="section--padding">
                <div className="container">
                    <div className="card card-item">
                        <div className="card-body">
                            <h3 className="fs-24 font-weight-semi-bold pb-3">Privacy Policy</h3>
                            <div className="divider"><span></span></div>
                            <p className="pb-3">Your privacy is important to us. This privacy policy explains what personal data we collect and how we use it.</p>
                            <h5 className="pb-2">1. Information We Collect</h5>
                            <p className="pb-3">We collect personal information such as your name, email address, and payment details when you register or make a purchase.</p>
                            <h5 className="pb-2">2. How We Use Your Information</h5>
                            <p className="pb-3">Your information is used to provide and improve our services, process payments, and communicate with you about your account.</p>
                            <h5 className="pb-2">3. Data Security</h5>
                            <p className="pb-3">We implement industry-standard security measures to protect your personal information.</p>
                            <h5 className="pb-2">4. Cookies</h5>
                            <p className="pb-3">We use cookies to enhance your browsing experience and analyze website traffic.</p>
                            <h5 className="pb-2">5. Contact Us</h5>
                            <p className="pb-3">If you have any questions about this privacy policy, please contact us at support@youtubelms.com.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
