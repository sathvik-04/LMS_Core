import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <section className="footer-area pt-100px">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 responsive-column-half">
                            <div className="footer-item">
                                <Link to="/">
                                    <img src="/images/logo.png" alt="footer logo" className="footer__logo" />
                                </Link>
                                <ul className="generic-list-item pt-4">
                                    <li><a href="tel:+1631237884">+163 123 7884</a></li>
                                    <li><a href="mailto:support@youtubelms.com">support@youtubelms.com</a></li>
                                    <li>Melbourne, Australia, 105 South Park Avenue</li>
                                </ul>
                                <h3 className="fs-20 font-weight-semi-bold pt-4 pb-2">We are on</h3>
                                <ul className="social-icons social-icons-styled">
                                    <li className="mr-1"><a href="#" className="facebook-bg"><i className="la la-facebook"></i></a></li>
                                    <li className="mr-1"><a href="#" className="twitter-bg"><i className="la la-twitter"></i></a></li>
                                    <li className="mr-1"><a href="#" className="instagram-bg"><i className="la la-instagram"></i></a></li>
                                    <li className="mr-1"><a href="#" className="linkedin-bg"><i className="la la-linkedin"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 responsive-column-half">
                            <div className="footer-item">
                                <h3 className="fs-20 font-weight-semi-bold">Company</h3>
                                <span className="section-divider section--divider"></span>
                                <ul className="generic-list-item">
                                    <li><Link to="/about">About us</Link></li>
                                    <li><Link to="/contact">Contact us</Link></li>
                                    <li><Link to="/teachers">Become a Teacher</Link></li>
                                    <li><Link to="/faq">FAQs</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 responsive-column-half">
                            <div className="footer-item">
                                <h3 className="fs-20 font-weight-semi-bold">Courses</h3>
                                <span className="section-divider section--divider"></span>
                                <ul className="generic-list-item">
                                    <li><Link to="/courses">All Courses</Link></li>
                                    <li><Link to="/courses?search=web">Web Development</Link></li>
                                    <li><Link to="/courses?search=design">Design</Link></li>
                                    <li><Link to="/courses?search=marketing">Marketing</Link></li>
                                    <li><Link to="/courses?search=business">Business</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 responsive-column-half">
                            <div className="footer-item">
                                <h3 className="fs-20 font-weight-semi-bold">Download App</h3>
                                <span className="section-divider section--divider"></span>
                                <div className="mobile-app">
                                    <p className="pb-3 lh-24">Download our mobile app and learn on the go.</p>
                                    <a href="#" className="d-block mb-2 hover-s"><img src="/images/appstore.png" alt="App store" className="img-fluid" /></a>
                                    <a href="#" className="d-block hover-s"><img src="/images/googleplay.png" alt="Google play store" className="img-fluid" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-block"></div>
                <div className="copyright-content py-4">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <p className="copy-desc">&copy; {new Date().getFullYear()} YouTubeLMS. All Rights Reserved.</p>
                            </div>
                            <div className="col-lg-6">
                                <div className="d-flex flex-wrap align-items-center justify-content-end">
                                    <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14">
                                        <li className="mr-3"><Link to="/terms">Terms & Conditions</Link></li>
                                        <li className="mr-3"><Link to="/privacy">Privacy Policy</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scroll to top */}
            <div id="scroll-top">
                <i className="la la-arrow-up" title="Go top"></i>
            </div>
        </>
    );
}
