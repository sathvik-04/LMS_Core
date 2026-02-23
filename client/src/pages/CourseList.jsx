import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import CourseCard from '../components/CourseCard';

export default function CourseList() {
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        level: '',
        sort: '-createdAt',
        priceRange: '',
    });

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.data || [])).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.level) params.append('level', filters.level);
        if (filters.sort) params.append('sort', filters.sort);
        params.append('status', 'active');

        api.get(`/courses?${params.toString()}`)
            .then(res => setCourses(res.data.data || []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false));
    }, [filters]);

    return (
        <>
            {/* Breadcrumb */}
            <section className="breadcrumb-area section-padding img-bg-2">
                <div className="overlay"></div>
                <div className="container">
                    <div className="breadcrumb-content d-flex flex-wrap align-items-center justify-content-between">
                        <div className="section-heading">
                            <h2 className="section__title text-white">Courses</h2>
                        </div>
                        <ul className="generic-list-item generic-list-item-arrow d-flex flex-wrap align-items-center">
                            <li><Link to="/" className="text-white">Home</Link></li>
                            <li><span className="text-white">Courses</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Course Filter + Grid */}
            <section className="course-area section--padding">
                <div className="container">
                    <div className="row">
                        {/* Sidebar Filters */}
                        <div className="col-lg-3">
                            <div className="sidebar mb-5">
                                {/* Search */}
                                <div className="card card-item">
                                    <div className="card-body">
                                        <h3 className="card-title fs-18 pb-2">Search</h3>
                                        <div className="divider"><span></span></div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control form--control pl-3"
                                                placeholder="Search courses..."
                                                value={filters.search}
                                                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                                            />
                                            <span className="la la-search search-icon"></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Categories Filter */}
                                <div className="card card-item">
                                    <div className="card-body">
                                        <h3 className="card-title fs-18 pb-2">Categories</h3>
                                        <div className="divider"><span></span></div>
                                        <ul className="generic-list-item">
                                            <li>
                                                <a href="#" className={!filters.category ? 'text-color font-weight-semi-bold' : ''} onClick={e => { e.preventDefault(); setFilters(f => ({ ...f, category: '' })); }}>
                                                    All Categories
                                                </a>
                                            </li>
                                            {categories.map(cat => (
                                                <li key={cat._id}>
                                                    <a href="#" className={filters.category === cat._id ? 'text-color font-weight-semi-bold' : ''} onClick={e => { e.preventDefault(); setFilters(f => ({ ...f, category: cat._id })); }}>
                                                        {cat.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Level Filter */}
                                <div className="card card-item">
                                    <div className="card-body">
                                        <h3 className="card-title fs-18 pb-2">Level</h3>
                                        <div className="divider"><span></span></div>
                                        <ul className="generic-list-item">
                                            {['', 'beginner', 'intermediate', 'advanced'].map(level => (
                                                <li key={level}>
                                                    <a href="#" className={filters.level === level ? 'text-color font-weight-semi-bold' : ''} onClick={e => { e.preventDefault(); setFilters(f => ({ ...f, level })); }}>
                                                        {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'All Levels'}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Sort */}
                                <div className="card card-item">
                                    <div className="card-body">
                                        <h3 className="card-title fs-18 pb-2">Sort By</h3>
                                        <div className="divider"><span></span></div>
                                        <select className="form-control form--control" value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
                                            <option value="-createdAt">Newest First</option>
                                            <option value="createdAt">Oldest First</option>
                                            <option value="price">Price: Low to High</option>
                                            <option value="-price">Price: High to Low</option>
                                            <option value="-averageRating">Highest Rated</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Grid */}
                        <div className="col-lg-9">
                            <div className="d-flex align-items-center justify-content-between pb-3">
                                <p className="fs-15">{loading ? 'Loading...' : `${courses.length} course(s) found`}</p>
                            </div>
                            <div className="row">
                                {courses.map(course => (
                                    <div key={course._id} className="col-lg-4 responsive-column-half">
                                        <CourseCard course={course} />
                                    </div>
                                ))}
                                {!loading && courses.length === 0 && (
                                    <div className="col-12 text-center py-5">
                                        <div className="card card-item">
                                            <div className="card-body py-5">
                                                <i className="la la-search fs-50 text-gray pb-3 d-block"></i>
                                                <h4>No courses found</h4>
                                                <p className="pt-2">Try adjusting your filters or search terms.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
