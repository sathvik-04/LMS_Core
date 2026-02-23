import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sliders, setSliders] = useState([]);
    const [infoBoxes, setInfoBoxes] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/categories').catch(() => ({ data: { data: [] } })),
            api.get('/courses?limit=8&status=active').catch(() => ({ data: { data: [] } })),
            api.get('/settings/sliders').catch(() => ({ data: { data: [] } })),
            api.get('/settings/info-boxes').catch(() => ({ data: { data: [] } })),
            api.get('/settings/partners').catch(() => ({ data: { data: [] } })),
        ]).then(([catRes, courseRes, sliderRes, infoRes, partnerRes]) => {
            setCategories(catRes.data.data || []);
            setCourses(courseRes.data.data || courseRes.data.courses || []);
            setSliders(sliderRes.data.data || []);
            setInfoBoxes(infoRes.data.data || []);
            setPartners(partnerRes.data.data || []);
            setLoading(false);
        });
    }, []);

    // Re-init owl carousel on data change
    useEffect(() => {
        if (!loading && typeof window !== 'undefined' && window.jQuery) {
            setTimeout(() => {
                try {
                    window.jQuery('.hero-slider').trigger('destroy.owl.carousel').owlCarousel({
                        items: 1, loop: true, nav: true, dots: true, autoplay: true, autoplayTimeout: 5000,
                        navText: ['<i class="la la-arrow-left"></i>', '<i class="la la-arrow-right"></i>']
                    });
                    window.jQuery('.client-logo-carousel').trigger('destroy.owl.carousel').owlCarousel({
                        items: 5, loop: true, autoplay: true, autoplayTimeout: 3000, margin: 30,
                        responsive: { 0: { items: 2 }, 576: { items: 3 }, 992: { items: 5 } }
                    });
                    window.jQuery('.lazy').lazy();
                    window.jQuery('.counter').counterUp({ delay: 10, time: 1000 });
                } catch (e) { /* carousel libs not loaded yet */ }
            }, 500);
        }
    }, [loading]);

    const defaultSliders = [
        { title: 'We Help You Learn What You Love', description: 'Explore amazing courses from expert instructors around the world.', bgClass: 'hero-bg-1' },
        { title: 'Join YouTubeLMS & Get Your Free Courses!', description: 'Start learning today with thousands of free and paid courses.', bgClass: 'hero-bg-2' },
        { title: 'Learn Anything, Anytime, Anywhere', description: 'Access courses on your desktop, tablet, or mobile device.', bgClass: 'hero-bg-3' },
    ];

    const defaultInfoBoxes = [
        { icon: 'la-users', title: 'Expert Teachers', text: 'Learn from industry experts who are passionate about teaching.' },
        { icon: 'la-paper-plane', title: 'Easy Communication', text: 'Reach out to your instructors and fellow students easily.' },
        { icon: 'la-certificate', title: 'Get Certificates', text: 'Earn certificates to showcase your new skills.' },
    ];

    const displaySliders = sliders.length > 0 ? sliders : defaultSliders;
    const displayInfoBoxes = infoBoxes.length > 0 ? infoBoxes : defaultInfoBoxes;

    return (
        <main>
            {/* ======== HERO SLIDER ======== */}
            <section className="hero-area">
                <div className="hero-slider owl-action-styled">
                    {displaySliders.map((slide, i) => (
                        <div key={i} className={`hero-slider-item ${slide.bgClass || 'hero-bg-' + ((i % 3) + 1)}`}>
                            <div className="container">
                                <div className={`hero-content ${i === 1 ? 'text-center' : i === 2 ? 'text-right' : ''}`}>
                                    <div className="section-heading">
                                        <h2 className="section__title text-white fs-65 lh-80 pb-3">{slide.title}</h2>
                                        <p className="section__desc text-white pb-4">{slide.description}</p>
                                    </div>
                                    <div className={`hero-btn-box d-flex flex-wrap align-items-center pt-1 ${i === 1 ? 'justify-content-center' : i === 2 ? 'justify-content-end' : ''}`}>
                                        <Link to="/courses" className="btn theme-btn mr-4 mb-4">Explore Courses <i className="la la-arrow-right icon ml-1"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ======== FEATURE / INFO BOXES ======== */}
            <section className="feature-area pb-90px">
                <div className="container">
                    <div className="row feature-content-wrap">
                        {displayInfoBoxes.map((info, i) => (
                            <div key={i} className="col-lg-4 responsive-column-half">
                                <div className="info-box">
                                    <div className="info-overlay"></div>
                                    <div className="icon-element mx-auto shadow-sm">
                                        <i className={`la ${info.icon || 'la-book'} fs-35`}></i>
                                    </div>
                                    <h3 className="info__title">{info.title}</h3>
                                    <p className="info__text">{info.text || info.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== CATEGORIES ======== */}
            <section className="category-area pb-90px">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-9">
                            <div className="category-content-wrap">
                                <div className="section-heading">
                                    <h5 className="ribbon ribbon-lg mb-2">Categories</h5>
                                    <h2 className="section__title">Popular Categories</h2>
                                    <span className="section-divider"></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="category-btn-box text-right">
                                <Link to="/courses" className="btn theme-btn">All Categories <i className="la la-arrow-right icon ml-1"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="category-wrapper mt-30px">
                        <div className="row">
                            {categories.slice(0, 6).map((cat, i) => (
                                <div key={cat._id} className="col-lg-4 responsive-column-half">
                                    <div className="category-item">
                                        <img className="cat__img lazy" src="/images/img-loading.png" data-src={cat.image || `/images/img${(i % 6) + 1}.jpg`} alt={cat.name} />
                                        <div className="category-content">
                                            <div className="category-inner">
                                                <h3 className="cat__title"><Link to={`/courses?category=${cat._id}`}>{cat.name}</Link></h3>
                                                <p className="cat__meta">{cat.courseCount || 0} courses</p>
                                                <Link to={`/courses?category=${cat._id}`} className="btn theme-btn theme-btn-sm theme-btn-white">Explore<i className="la la-arrow-right icon ml-1"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== COURSE AREA ======== */}
            <section className="course-area pb-90px">
                <div className="container">
                    <div className="section-heading text-center">
                        <h5 className="ribbon ribbon-lg mb-2">Grow Your Skill</h5>
                        <h2 className="section__title">Our Featured Courses</h2>
                        <span className="section-divider"></span>
                    </div>
                    <div className="row pt-30px">
                        {courses.map(course => (
                            <div key={course._id} className="col-lg-4 responsive-column-half">
                                <div className="card card-item card-preview" data-tooltip-content={`#tooltip_${course._id}`}>
                                    <div className="card-image">
                                        <Link to={`/courses/${course.slug || course._id}`} className="d-block">
                                            <img className="card-img-top lazy" src="/images/img-loading.png" data-src={course.image || '/images/img8.jpg'} alt={course.title} />
                                        </Link>
                                        {course.discountPrice && course.price > course.discountPrice && (
                                            <div className="course-badge-label">
                                                <div className="course-badge">{Math.round(100 - (course.discountPrice / course.price) * 100)}% off</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-body">
                                        <h6 className="ribbon ribbon-blue-bg fs-14 mb-3">{course.level || 'All Levels'}</h6>
                                        <h5 className="card-title"><Link to={`/courses/${course.slug || course._id}`}>{course.title}</Link></h5>
                                        <p className="card-text"><Link to={`/teachers/${course.instructor?._id || '#'}`}>{course.instructor?.name || 'Instructor'}</Link></p>
                                        <div className="rating-wrap d-flex align-items-center py-2">
                                            <div className="review-stars">
                                                <span className="rating-number">{course.averageRating?.toFixed(1) || '0.0'}</span>
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <span key={s} className={`la la-star${s <= Math.round(course.averageRating || 0) ? '' : '-o'}`}></span>
                                                ))}
                                            </div>
                                            <span className="rating-total pl-1">({course.totalReviews || 0})</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            {course.discountPrice ? (
                                                <p className="card-price text-black font-weight-bold">${course.discountPrice} <span className="before-price font-weight-medium">${course.price}</span></p>
                                            ) : course.price > 0 ? (
                                                <p className="card-price text-black font-weight-bold">${course.price}</p>
                                            ) : (
                                                <p className="card-price text-black font-weight-bold">Free</p>
                                            )}
                                            <div className="icon-element icon-element-sm shadow-sm cursor-pointer" title="Add to Wishlist"><i className="la la-heart-o"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && !loading && (
                            <div className="col-12 text-center py-5">
                                <p className="fs-18">No courses available yet. Check back soon!</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center pt-3">
                        <Link to="/courses" className="btn theme-btn">Browse All Courses <i className="la la-arrow-right icon ml-1"></i></Link>
                    </div>
                </div>
            </section>

            {/* ======== FUN FACTS / COUNTER ======== */}
            <section className="funfact-area pt-60px pb-60px bg-dark overflow-hidden">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 responsive-column-half">
                            <div className="funfact-item d-flex flex-wrap">
                                <div className="icon-element flex-shrink-0 mr-3"><i className="la la-users"></i></div>
                                <div className="funfact-content">
                                    <h4 className="counter text-white">15000</h4>
                                    <p className="text-white-50">Enrolled Learners</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 responsive-column-half">
                            <div className="funfact-item d-flex flex-wrap">
                                <div className="icon-element flex-shrink-0 mr-3"><i className="la la-graduation-cap"></i></div>
                                <div className="funfact-content">
                                    <h4 className="counter text-white">500</h4>
                                    <p className="text-white-50">Available Courses</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 responsive-column-half">
                            <div className="funfact-item d-flex flex-wrap">
                                <div className="icon-element flex-shrink-0 mr-3"><i className="la la-certificate"></i></div>
                                <div className="funfact-content">
                                    <h4 className="counter text-white">12000</h4>
                                    <p className="text-white-50">Certificates Issued</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 responsive-column-half">
                            <div className="funfact-item d-flex flex-wrap">
                                <div className="icon-element flex-shrink-0 mr-3"><i className="la la-user"></i></div>
                                <div className="funfact-content">
                                    <h4 className="counter text-white">200</h4>
                                    <p className="text-white-50">Expert Instructors</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== REGISTER CTA ======== */}
            <section className="register-area pt-90px pb-90px position-relative overflow-hidden" style={{ backgroundImage: 'url(/images/img18.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="section-heading">
                                <h2 className="section__title text-white pb-3 lh-50">Join Us and Start Learning Today</h2>
                                <p className="section__desc text-white pb-4">Join a community of millions of learners from around the world. We offer thousands of courses taught by industry experts.</p>
                                <div className="hero-btn-box">
                                    <Link to="/register" className="btn theme-btn mr-3"><i className="la la-user-plus mr-1"></i>Register Now</Link>
                                    <Link to="/courses" className="btn theme-btn theme-btn-white"><i className="la la-book mr-1"></i>Browse Courses</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== TESTIMONIALS ======== */}
            <section className="testimonial-area pt-90px pb-90px text-center">
                <div className="container">
                    <div className="section-heading text-center">
                        <h5 className="ribbon ribbon-lg mb-2">Testimonial</h5>
                        <h2 className="section__title">What Our Students Say</h2>
                        <span className="section-divider"></span>
                    </div>
                    <div className="row pt-50px">
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item">
                                <div className="card-body">
                                    <div className="d-flex align-items-center pb-3">
                                        <img src="/images/small-img.jpg" alt="" className="rounded-full" style={{ width: 60 }} />
                                        <div className="pl-3 text-left">
                                            <h5 className="card-title">John Doe</h5>
                                            <p className="card-text">Web Developer</p>
                                        </div>
                                    </div>
                                    <div className="review-stars pb-2">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="la la-star"></span>)}
                                    </div>
                                    <p className="card-text">"YouTubeLMS has transformed my career. The courses are well-structured and the instructors are top-notch!"</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item">
                                <div className="card-body">
                                    <div className="d-flex align-items-center pb-3">
                                        <img src="/images/small-img.jpg" alt="" className="rounded-full" style={{ width: 60 }} />
                                        <div className="pl-3 text-left">
                                            <h5 className="card-title">Jane Smith</h5>
                                            <p className="card-text">UI Designer</p>
                                        </div>
                                    </div>
                                    <div className="review-stars pb-2">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="la la-star"></span>)}
                                    </div>
                                    <p className="card-text">"I love the quality of teaching here. Every course I've taken has been incredibly valuable for my professional growth."</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item">
                                <div className="card-body">
                                    <div className="d-flex align-items-center pb-3">
                                        <img src="/images/small-img.jpg" alt="" className="rounded-full" style={{ width: 60 }} />
                                        <div className="pl-3 text-left">
                                            <h5 className="card-title">Alex Johnson</h5>
                                            <p className="card-text">Data Scientist</p>
                                        </div>
                                    </div>
                                    <div className="review-stars pb-2">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="la la-star"></span>)}
                                    </div>
                                    <p className="card-text">"The best online learning platform I've used. The community support and course quality are amazing!"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== PARTNER LOGOS ======== */}
            {partners.length > 0 && (
                <section className="client-logo-area pt-60px pb-60px bg-gray">
                    <div className="container">
                        <div className="client-logo-carousel owl-carousel">
                            {partners.map((partner, i) => (
                                <div key={partner._id || i} className="client-logo-item">
                                    <img src={partner.image || partner.logo} alt={partner.name || 'Partner'} className="img-fluid" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ======== GET STARTED ======== */}
            <section className="get-started-area pt-30px pb-90px position-relative">
                <span className="ring-shape ring-shape-1"></span>
                <span className="ring-shape ring-shape-2"></span>
                <span className="ring-shape ring-shape-3"></span>
                <span className="ring-shape ring-shape-4"></span>
                <span className="ring-shape ring-shape-5"></span>
                <span className="ring-shape ring-shape-6"></span>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item hover-s text-center">
                                <div className="card-body">
                                    <img src="/images/small-img-2.jpg" alt="Become Instructor" className="img-fluid rounded-full lazy" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                    <h5 className="card-title pt-4 pb-2">Become an Instructor</h5>
                                    <p className="card-text">Teach what you love. YouTubeLMS gives you the tools to create a course.</p>
                                    <div className="btn-box mt-20px">
                                        <Link to="/register" className="btn theme-btn theme-btn-sm theme-btn-white lh-30"><i className="la la-user mr-1"></i>Start Teaching</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item hover-s text-center">
                                <div className="card-body">
                                    <img src="/images/small-img-3.jpg" alt="Become Learner" className="img-fluid rounded-full lazy" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                    <h5 className="card-title pt-4 pb-2">Become a Learner</h5>
                                    <p className="card-text">Learn what you love! Transform your life through education.</p>
                                    <div className="btn-box mt-20px">
                                        <Link to="/courses" className="btn theme-btn theme-btn-sm theme-btn-white lh-30"><i className="la la-file-text-o mr-1"></i>Start Learning</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 responsive-column-half">
                            <div className="card card-item hover-s text-center">
                                <div className="card-body">
                                    <img src="/images/small-img-4.jpg" alt="For Business" className="img-fluid rounded-full lazy" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                    <h5 className="card-title pt-4 pb-2">YouTubeLMS for Business</h5>
                                    <p className="card-text">Get unlimited access to top courses for your team.</p>
                                    <div className="btn-box mt-20px">
                                        <Link to="/contact" className="btn theme-btn theme-btn-sm theme-btn-white lh-30"><i className="la la-briefcase mr-1"></i>Get for Business</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
