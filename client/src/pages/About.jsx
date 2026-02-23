import { Link } from 'react-router-dom';

export default function About() {
    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading">
                            <h2 className="section__title text-white">About Us</h2>
                        </div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">About Us</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="about-area section--padding">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="about-content pr-5">
                                <div className="section-heading">
                                    <h5 className="ribbon ribbon-lg mb-2">About Us</h5>
                                    <h2 className="section__title pb-3">The Leader in Online Learning</h2>
                                    <p className="section__desc pb-3">YouTubeLMS is an online learning platform that offers anyone, anywhere access to courses provided by expert instructors from around the world.</p>
                                    <p className="section__desc pb-3">Whether you want to learn a new skill, advance your career, or simply explore a new hobby, we have thousands of courses to choose from across a variety of subjects.</p>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-sm-6 responsive-column-half">
                                        <div className="info-box">
                                            <div className="icon-element mx-auto shadow-sm"><i className="la la-users fs-35"></i></div>
                                            <h3 className="info__title">40,000+ Students</h3>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 responsive-column-half">
                                        <div className="info-box">
                                            <div className="icon-element mx-auto shadow-sm"><i className="la la-book fs-35"></i></div>
                                            <h3 className="info__title">500+ Courses</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-img">
                                <img src="/images/about-img.jpg" alt="About" className="img-fluid rounded lazy" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-area pt-60px pb-90px bg-gray">
                <div className="container">
                    <div className="section-heading text-center">
                        <h5 className="ribbon ribbon-lg mb-2">Meet Our Team</h5>
                        <h2 className="section__title">Our Expert Instructors</h2>
                        <span className="section-divider"></span>
                    </div>
                    <div className="row pt-50px">
                        {[
                            { name: 'Dr. Sarah Wilson', role: 'Web Development', img: '/images/small-img.jpg' },
                            { name: 'Prof. John Carter', role: 'Data Science', img: '/images/small-img.jpg' },
                            { name: 'Emma Davis', role: 'UI/UX Design', img: '/images/small-img.jpg' },
                            { name: 'Michael Brown', role: 'Business', img: '/images/small-img.jpg' },
                        ].map((member, i) => (
                            <div key={i} className="col-lg-3 responsive-column-half">
                                <div className="card card-item text-center hover-s">
                                    <div className="card-body">
                                        <img src={member.img} alt={member.name} className="rounded-full mb-3" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                        <h5 className="card-title">{member.name}</h5>
                                        <p className="card-text">{member.role}</p>
                                        <ul className="social-icons social-icons-styled pt-3">
                                            <li className="mr-1"><a href="#" className="facebook-bg"><i className="la la-facebook"></i></a></li>
                                            <li className="mr-1"><a href="#" className="twitter-bg"><i className="la la-twitter"></i></a></li>
                                            <li className="mr-1"><a href="#" className="linkedin-bg"><i className="la la-linkedin"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
