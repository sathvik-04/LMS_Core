import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CourseDetail() {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get(`/courses/${id}`),
            api.get(`/sections/course/${id}`).catch(() => ({ data: { data: [] } })),
            api.get(`/reviews/course/${id}`).catch(() => ({ data: { data: [] } })),
        ]).then(([courseRes, secRes, revRes]) => {
            setCourse(courseRes.data.data || courseRes.data);
            setSections(secRes.data.data || []);
            setReviews(revRes.data.data || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addToCart(course._id);
        } catch (err) {
            if (!isAuthenticated) navigate('/login');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return navigate('/login');
        try {
            await api.post(`/reviews/course/${id}`, reviewForm);
            const revRes = await api.get(`/reviews/course/${id}`);
            setReviews(revRes.data.data || []);
            setReviewForm({ rating: 5, comment: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <div className="preloader"><div className="loader"><svg className="spinner" viewBox="0 0 50 50"><circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle></svg></div></div>;
    if (!course) return <div className="container py-5 text-center"><h3>Course not found</h3><Link to="/courses" className="btn theme-btn mt-3">Browse Courses</Link></div>;

    const totalLectures = sections.reduce((sum, s) => sum + (s.lectures?.length || 0), 0);

    return (
        <>
            {/* Course Header */}
            <section className="breadcrumb-area pt-50px pb-50px bg-dark position-relative" style={{ backgroundImage: 'url(/images/img18.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center pb-2">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><Link to="/courses" className="text-white">Courses</Link></li>
                            <li><span className="text-white">{course.title}</span></li>
                        </ul>
                        <div className="section-heading">
                            <h2 className="section__title text-white fs-34 lh-45 pb-2">{course.title}</h2>
                            <p className="section__desc text-white-50 lh-26 pb-3">{course.shortDescription || course.description?.substring(0, 200)}</p>
                        </div>
                        <div className="d-flex flex-wrap align-items-center pb-2">
                            {course.averageRating > 0 && (
                                <div className="rating-wrap d-flex flex-wrap align-items-center mr-3">
                                    <span className="ribbon fs-14 mr-2">{course.status === 'active' ? 'Bestseller' : ''}</span>
                                    <div className="review-stars">
                                        <span className="rating-number text-white">{(course.averageRating || 0).toFixed(1)}</span>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} className={`la la-star${s <= Math.round(course.averageRating || 0) ? '' : '-o'} text-warning`}></span>
                                        ))}
                                    </div>
                                    <span className="rating-total text-white pl-1">({course.totalReviews || reviews.length} ratings)</span>
                                </div>
                            )}
                            <p className="text-white-50 pr-3 d-flex align-items-center">
                                <i className="la la-users mr-1 text-white"></i> {course.totalStudents || 0} students
                            </p>
                        </div>
                        <p className="text-white-50 d-flex align-items-center pb-1">
                            <i className="la la-user mr-1 text-white"></i> Created by <Link to={`/teachers/${course.instructor?._id}`} className="text-white font-weight-semi-bold ml-1">{course.instructor?.name || 'Instructor'}</Link>
                        </p>
                        <div className="d-flex flex-wrap align-items-center">
                            <p className="text-white-50 d-flex align-items-center mr-3">
                                <i className="la la-globe mr-1 text-white"></i> {course.language || 'English'}
                            </p>
                            <p className="text-white-50 d-flex align-items-center">
                                <i className="la la-calendar mr-1 text-white"></i> Last updated {new Date(course.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Content */}
            <section className="course-details-area pt-30px pb-90px">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 pb-5">
                            {/* Tabs */}
                            <div className="course-details-tab mb-4">
                                <ul className="nav nav-tabs generic--tab" role="tablist">
                                    {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
                                        <li className="nav-item" key={tab}>
                                            <a className={`nav-link ${activeTab === tab ? 'active' : ''}`} href="#" onClick={e => { e.preventDefault(); setActiveTab(tab); }}>
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="course-overview-card">
                                    <h3 className="fs-24 font-weight-semi-bold pb-3">About This Course</h3>
                                    <div className="course-description pb-4" dangerouslySetInnerHTML={{ __html: course.description || '<p>No description available.</p>' }} />

                                    {course.goals?.length > 0 && (
                                        <div className="pb-4">
                                            <h3 className="fs-24 font-weight-semi-bold pb-3">What you'll learn</h3>
                                            <ul className="generic-list-item">
                                                {course.goals.map((g, i) => (
                                                    <li key={i}><i className="la la-check mr-1 text-black"></i> {g}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {course.requirements?.length > 0 && (
                                        <div className="pb-4">
                                            <h3 className="fs-24 font-weight-semi-bold pb-3">Requirements</h3>
                                            <ul className="generic-list-item generic-list-item-bullet">
                                                {course.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {course.targetAudience?.length > 0 && (
                                        <div className="pb-4">
                                            <h3 className="fs-24 font-weight-semi-bold pb-3">Who this course is for</h3>
                                            <ul className="generic-list-item generic-list-item-bullet">
                                                {course.targetAudience.map((t, i) => <li key={i}>{t}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Curriculum Tab */}
                            {activeTab === 'curriculum' && (
                                <div className="curriculum-content">
                                    <div className="d-flex align-items-center justify-content-between pb-3">
                                        <h3 className="fs-24 font-weight-semi-bold">Course Content</h3>
                                        <p>{sections.length} sections • {totalLectures} lectures</p>
                                    </div>
                                    <div className="accordion generic-accordion" id="courseAccordion">
                                        {sections.map((section, si) => (
                                            <div className="card" key={section._id}>
                                                <div className="card-header" id={`heading${si}`}>
                                                    <button className="btn d-flex align-items-center justify-content-between w-100" type="button" data-toggle="collapse" data-target={`#collapse${si}`}>
                                                        <span className="font-weight-semi-bold text-black"><i className="la la-folder-open mr-1"></i> {section.title}</span>
                                                        <span className="fs-14 text-gray">{section.lectures?.length || 0} lectures</span>
                                                    </button>
                                                </div>
                                                <div id={`collapse${si}`} className={`collapse ${si === 0 ? 'show' : ''}`} data-parent="#courseAccordion">
                                                    <div className="card-body">
                                                        <ul className="generic-list-item">
                                                            {(section.lectures || []).map(lecture => (
                                                                <li key={lecture._id} className="d-flex align-items-center justify-content-between">
                                                                    <span><i className="la la-play-circle mr-1"></i> {lecture.title}</span>
                                                                    <span className="fs-14 text-gray">{lecture.duration || ''}</span>
                                                                </li>
                                                            ))}
                                                            {(!section.lectures || section.lectures.length === 0) && (
                                                                <li className="text-gray">No lectures in this section yet</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {sections.length === 0 && <p className="text-gray">No curriculum available yet.</p>}
                                    </div>
                                </div>
                            )}

                            {/* Instructor Tab */}
                            {activeTab === 'instructor' && course.instructor && (
                                <div className="instructor-content">
                                    <div className="media media-card">
                                        <div className="instructor-img mr-4">
                                            <img src={course.instructor.photo || '/images/small-img.jpg'} alt="" className="rounded-full" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                        </div>
                                        <div className="media-body">
                                            <h5><Link to={`/teachers/${course.instructor._id}`}>{course.instructor.name}</Link></h5>
                                            <p className="text-gray pb-3">{course.instructor.title || 'Instructor'}</p>
                                            <p>{course.instructor.bio || 'Passionate educator sharing knowledge with students worldwide.'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div className="review-content">
                                    <h3 className="fs-24 font-weight-semi-bold pb-3">Student Reviews ({reviews.length})</h3>

                                    {reviews.map(review => (
                                        <div key={review._id} className="media media-card border-bottom border-bottom-gray pb-4 mb-4">
                                            <div className="media-img mr-4">
                                                <img src={review.user?.photo || '/images/small-img.jpg'} alt="" className="rounded-full" style={{ width: 50, height: 50 }} />
                                            </div>
                                            <div className="media-body">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <h5>{review.user?.name || 'Student'}</h5>
                                                    <p className="fs-14 text-gray">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="review-stars pb-2">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <span key={s} className={`la la-star${s <= review.rating ? '' : '-o'}`}></span>
                                                    ))}
                                                </div>
                                                <p>{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Review Form */}
                                    {isAuthenticated && (
                                        <div className="pt-4">
                                            <h3 className="fs-24 font-weight-semi-bold pb-3">Leave a Review</h3>
                                            <form onSubmit={handleReviewSubmit}>
                                                <div className="form-group">
                                                    <label className="font-weight-semi-bold">Rating</label>
                                                    <select className="form-control form--control" value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                                                        {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} Star{v > 1 ? 's' : ''}</option>)}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="font-weight-semi-bold">Your Review</label>
                                                    <textarea className="form-control form--control" rows="4" placeholder="Write your review..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}></textarea>
                                                </div>
                                                <button type="submit" className="btn theme-btn">Submit Review <i className="la la-arrow-right icon ml-1"></i></button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <div className="card card-item course-sidebar-card" style={{ position: 'sticky', top: 20 }}>
                                <div className="card-body">
                                    {course.image && <img src={course.image} alt={course.title} className="img-fluid rounded pb-3" />}

                                    <div className="course-price-wrap d-flex align-items-center pb-3">
                                        {course.discountPrice ? (
                                            <>
                                                <h3 className="card-price text-black font-weight-bold fs-34">${course.discountPrice}</h3>
                                                <span className="before-price fs-20 ml-2">${course.price}</span>
                                            </>
                                        ) : course.price > 0 ? (
                                            <h3 className="card-price text-black font-weight-bold fs-34">${course.price}</h3>
                                        ) : (
                                            <h3 className="card-price text-black font-weight-bold fs-34">Free</h3>
                                        )}
                                    </div>

                                    <div className="btn-box w-100 pb-3">
                                        <button className="btn theme-btn w-100 mb-2" onClick={handleAddToCart}>
                                            <i className="la la-shopping-cart mr-1"></i> Add to Cart
                                        </button>
                                        <Link to="/cart" className="btn theme-btn theme-btn-white w-100">
                                            <i className="la la-shopping-basket mr-1"></i> Buy Now
                                        </Link>
                                    </div>

                                    <div className="course-info-list">
                                        <ul className="generic-list-item">
                                            <li className="d-flex align-items-center justify-content-between">
                                                <span><i className="la la-clock mr-1"></i>Duration</span>
                                                <span>{course.duration || 'Self-paced'}</span>
                                            </li>
                                            <li className="d-flex align-items-center justify-content-between">
                                                <span><i className="la la-play-circle mr-1"></i>Lectures</span>
                                                <span>{totalLectures}</span>
                                            </li>
                                            <li className="d-flex align-items-center justify-content-between">
                                                <span><i className="la la-file mr-1"></i>Sections</span>
                                                <span>{sections.length}</span>
                                            </li>
                                            <li className="d-flex align-items-center justify-content-between">
                                                <span><i className="la la-signal mr-1"></i>Level</span>
                                                <span>{course.level || 'All Levels'}</span>
                                            </li>
                                            <li className="d-flex align-items-center justify-content-between">
                                                <span><i className="la la-language mr-1"></i>Language</span>
                                                <span>{course.language || 'English'}</span>
                                            </li>
                                            <li className="d-flex align-items-center justify-content-between">
                                                <span><i className="la la-certificate mr-1"></i>Certificate</span>
                                                <span>Yes</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {course.tags?.length > 0 && (
                                        <div className="pt-3">
                                            <h5 className="pb-2">Tags</h5>
                                            <div className="d-flex flex-wrap">
                                                {course.tags.map((tag, i) => (
                                                    <Link key={i} to={`/courses?search=${tag}`} className="badge badge-gray mr-2 mb-2 p-2">{tag}</Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
