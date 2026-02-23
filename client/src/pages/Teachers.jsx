import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/users?role=instructor').catch(() =>
            api.get('/admin/instructors').catch(() => ({ data: { data: [] } }))
        ).then(res => {
            setTeachers(res.data.data || res.data.users || []);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">Our Teachers</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Teachers</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="teacher-area section--padding">
                <div className="container">
                    <div className="section-heading text-center pb-40px">
                        <h5 className="ribbon ribbon-lg mb-2">Instructors</h5>
                        <h2 className="section__title">Our Expert Instructors</h2>
                        <span className="section-divider"></span>
                    </div>
                    <div className="row">
                        {teachers.map(teacher => (
                            <div key={teacher._id} className="col-lg-3 responsive-column-half">
                                <div className="card card-item text-center hover-s">
                                    <div className="card-body">
                                        <img src={teacher.photo || '/images/small-img.jpg'} alt={teacher.name} className="rounded-full mb-3 lazy" style={{ width: 120, height: 120, objectFit: 'cover' }} />
                                        <h5 className="card-title"><Link to={`/teachers/${teacher._id}`}>{teacher.name}</Link></h5>
                                        <p className="card-text pb-2">{teacher.title || 'Instructor'}</p>
                                        <div className="review-stars pb-2">
                                            {[1, 2, 3, 4, 5].map(s => <span key={s} className="la la-star"></span>)}
                                        </div>
                                        <ul className="social-icons social-icons-styled pt-2">
                                            <li className="mr-1"><a href="#" className="facebook-bg"><i className="la la-facebook"></i></a></li>
                                            <li className="mr-1"><a href="#" className="twitter-bg"><i className="la la-twitter"></i></a></li>
                                            <li className="mr-1"><a href="#" className="linkedin-bg"><i className="la la-linkedin"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!loading && teachers.length === 0 && (
                            <div className="col-12 text-center py-5">
                                <p className="fs-18">No instructors found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
