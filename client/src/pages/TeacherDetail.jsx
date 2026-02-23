import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import CourseCard from '../components/CourseCard';

export default function TeacherDetail() {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/auth/users/${id}`).catch(() => ({ data: { data: null } })),
            api.get(`/courses?instructor=${id}&status=active`).catch(() => ({ data: { data: [] } })),
        ]).then(([userRes, courseRes]) => {
            setTeacher(userRes.data.data || userRes.data);
            setCourses(courseRes.data.data || []);
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="preloader"><div className="loader"><svg className="spinner" viewBox="0 0 50 50"><circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle></svg></div></div>;

    return (
        <>
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading"><h2 className="section__title text-white">{teacher?.name || 'Instructor'}</h2></div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><Link to="/teachers" className="text-white">Teachers</Link></li>
                            <li><span className="text-white">{teacher?.name}</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="teacher-detail-area section--padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card card-item text-center">
                                <div className="card-body">
                                    <img src={teacher?.photo || '/images/small-img.jpg'} alt={teacher?.name} className="rounded-full mb-3" style={{ width: 150, height: 150, objectFit: 'cover' }} />
                                    <h4 className="card-title pb-1">{teacher?.name}</h4>
                                    <p className="card-text pb-3">{teacher?.title || 'Instructor'}</p>
                                    <ul className="social-icons social-icons-styled pb-3">
                                        <li className="mr-1"><a href="#" className="facebook-bg"><i className="la la-facebook"></i></a></li>
                                        <li className="mr-1"><a href="#" className="twitter-bg"><i className="la la-twitter"></i></a></li>
                                        <li className="mr-1"><a href="#" className="linkedin-bg"><i className="la la-linkedin"></i></a></li>
                                    </ul>
                                    <ul className="generic-list-item text-left">
                                        <li className="d-flex align-items-center justify-content-between"><span><i className="la la-book mr-1"></i>Courses</span><span>{courses.length}</span></li>
                                        <li className="d-flex align-items-center justify-content-between"><span><i className="la la-envelope mr-1"></i>Email</span><span>{teacher?.email}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <h3 className="fs-24 font-weight-semi-bold pb-3">About {teacher?.name}</h3>
                            <p className="pb-4">{teacher?.bio || 'This instructor is passionate about sharing knowledge and helping students achieve their goals.'}</p>

                            <h3 className="fs-24 font-weight-semi-bold pb-3">Courses by {teacher?.name}</h3>
                            <div className="row">
                                {courses.map(course => (
                                    <div key={course._id} className="col-lg-6 responsive-column-half">
                                        <CourseCard course={course} />
                                    </div>
                                ))}
                                {courses.length === 0 && <div className="col-12"><p className="text-gray">No courses yet.</p></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
