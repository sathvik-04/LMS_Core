import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
    const rating = course.averageRating || 0;

    return (
        <div className="card card-item card-preview">
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
                        <span className="rating-number">{rating.toFixed(1)}</span>
                        {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`la la-star${s <= Math.round(rating) ? '' : '-o'}`}></span>
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
    );
}
