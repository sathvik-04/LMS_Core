import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const { items, count } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.data || [])).catch(() => { });
    }, []);

    const handleLogout = () => { logout(); navigate('/'); };

    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'instructor') return '/instructor/dashboard';
        return '/user/dashboard';
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    const cartTotal = items.reduce((sum, item) => sum + (item.discountPrice || item.price || 0), 0);

    return (
        <header className="header-menu-area bg-white">
            {/* Header Top Bar */}
            <div className="header-top pr-150px pl-150px border-bottom border-bottom-gray py-1">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="header-widget">
                                <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14">
                                    <li className="d-flex align-items-center pr-3 mr-3 border-right border-right-gray"><i className="la la-phone mr-1"></i><a href="tel:00123456789"> (00) 123 456 789</a></li>
                                    <li className="d-flex align-items-center"><i className="la la-envelope-o mr-1"></i><a href="mailto:contact@youtubelms.com"> contact@youtubelms.com</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="header-widget d-flex flex-wrap align-items-center justify-content-end">
                                {isAuthenticated ? (
                                    <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14">
                                        <li className="d-flex align-items-center pr-3 mr-3 border-right border-right-gray">
                                            <i className="la la-user mr-1"></i>
                                            <Link to={getDashboardPath()}>Dashboard</Link>
                                        </li>
                                        <li className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                                            <i className="la la-sign-out mr-1"></i> Logout
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="generic-list-item d-flex flex-wrap align-items-center fs-14">
                                        <li className="d-flex align-items-center pr-3 mr-3 border-right border-right-gray"><i className="la la-sign-in mr-1"></i><Link to="/login"> Login</Link></li>
                                        <li className="d-flex align-items-center"><i className="la la-user mr-1"></i><Link to="/register"> Register</Link></li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="header-menu-content pr-150px pl-150px bg-white">
                <div className="container-fluid">
                    <div className="main-menu-content">
                        <div className="row align-items-center">
                            <div className="col-lg-2">
                                <div className="logo-box">
                                    <Link to="/" className="logo" style={{ fontSize: 24, fontWeight: 800, color: '#333', textDecoration: 'none' }}>YouTubeLMS</Link>
                                    <div className="user-btn-action">
                                        <div className="search-menu-toggle icon-element icon-element-sm shadow-sm mr-2" data-toggle="tooltip" data-placement="top" title="Search">
                                            <i className="la la-search"></i>
                                        </div>
                                        <div className="off-canvas-menu-toggle cat-menu-toggle icon-element icon-element-sm shadow-sm mr-2" data-toggle="tooltip" data-placement="top" title="Category menu">
                                            <i className="la la-th-large"></i>
                                        </div>
                                        <div className="off-canvas-menu-toggle main-menu-toggle icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="top" title="Main menu">
                                            <i className="la la-bars"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-10">
                                <div className="menu-wrapper">
                                    {/* Category Dropdown */}
                                    <div className="menu-category">
                                        <ul>
                                            <li>
                                                <a href="#">Categories <i className="la la-angle-down fs-12"></i></a>
                                                <ul className="cat-dropdown-menu">
                                                    {categories.map(cat => (
                                                        <li key={cat._id}>
                                                            <Link to={`/courses?category=${cat._id}`}>{cat.name}</Link>
                                                        </li>
                                                    ))}
                                                    {categories.length === 0 && <li><a href="#">Loading...</a></li>}
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Search */}
                                    <form onSubmit={handleSearch}>
                                        <div className="form-group mb-0">
                                            <input className="form-control form--control pl-3" type="text" name="search" placeholder="Search for anything" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                            <span className="la la-search search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }}></span>
                                        </div>
                                    </form>

                                    {/* Main Nav */}
                                    <nav className="main-menu">
                                        <ul>
                                            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
                                            <li>
                                                <Link to="/courses" className={location.pathname.startsWith('/courses') ? 'active' : ''}>Courses</Link>
                                            </li>
                                            <li>
                                                <a href="#">Pages <i className="la la-angle-down fs-12"></i></a>
                                                <ul className="dropdown-menu-item">
                                                    <li><Link to="/about">About</Link></li>
                                                    <li><Link to="/teachers">Teachers</Link></li>
                                                    <li><Link to="/faq">FAQs</Link></li>
                                                    <li><Link to="/contact">Contact</Link></li>
                                                    <li><Link to="/terms">Terms & Conditions</Link></li>
                                                    <li><Link to="/privacy">Privacy Policy</Link></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>

                                    {/* Cart Icon */}
                                    <div className="shop-cart mr-4">
                                        <ul>
                                            <li>
                                                <Link to="/cart" className="shop-cart-btn d-flex align-items-center">
                                                    <i className="la la-shopping-cart"></i>
                                                    <span className="product-count">{count}</span>
                                                </Link>
                                                {items.length > 0 && (
                                                    <ul className="cart-dropdown-menu">
                                                        {items.slice(0, 3).map(item => (
                                                            <li className="media media-card" key={item._id || item.course}>
                                                                <Link to={`/courses/${item.slug || item.course}`} className="media-img">
                                                                    <img src={item.image || '/images/small-img.jpg'} alt="Cart" />
                                                                </Link>
                                                                <div className="media-body">
                                                                    <h5><Link to={`/courses/${item.slug || item.course}`}>{item.title}</Link></h5>
                                                                    <p className="text-black font-weight-semi-bold lh-18">${item.discountPrice || item.price || 0}</p>
                                                                </div>
                                                            </li>
                                                        ))}
                                                        <li className="media media-card">
                                                            <div className="media-body fs-16">
                                                                <p className="text-black font-weight-semi-bold lh-18">Total: <span className="cart-total">${cartTotal.toFixed(2)}</span></p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <Link to="/cart" className="btn theme-btn w-100">Go to cart <i className="la la-arrow-right icon ml-1"></i></Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Dashboard / Auth Button */}
                                    <div className="nav-right-button">
                                        {isAuthenticated ? (
                                            <Link to={getDashboardPath()} className="btn theme-btn d-none d-lg-inline-block">
                                                <i className="la la-user mr-1"></i> {user?.name?.split(' ')[0]}
                                            </Link>
                                        ) : (
                                            <Link to="/register" className="btn theme-btn d-none d-lg-inline-block">
                                                <i className="la la-user-plus mr-1"></i> Join Free
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Off-canvas mobile menu */}
            <div className="off-canvas-menu custom-scrollbar-styled main-off-canvas-menu">
                <div className="off-canvas-menu-close main-menu-close icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="left" title="Close menu">
                    <i className="la la-times"></i>
                </div>
                <ul className="generic-list-item off-canvas-menu-list pt-90px">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/courses">Courses</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/teachers">Teachers</Link></li>
                    <li><Link to="/faq">FAQs</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    {isAuthenticated ? (
                        <>
                            <li><Link to={getDashboardPath()}>Dashboard</Link></li>
                            <li><a href="#" onClick={handleLogout}>Logout</a></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>

            {/* Mobile category menu */}
            <div className="off-canvas-menu custom-scrollbar-styled category-off-canvas-menu">
                <div className="off-canvas-menu-close cat-menu-close icon-element icon-element-sm shadow-sm" data-toggle="tooltip" data-placement="left" title="Close menu">
                    <i className="la la-times"></i>
                </div>
                <ul className="generic-list-item off-canvas-menu-list pt-90px">
                    {categories.map(cat => (
                        <li key={cat._id}><Link to={`/courses?category=${cat._id}`}>{cat.name}</Link></li>
                    ))}
                </ul>
            </div>

            {/* Mobile search */}
            <div className="mobile-search-form">
                <div className="d-flex align-items-center">
                    <form onSubmit={handleSearch} className="flex-grow-1 mr-3">
                        <div className="form-group mb-0">
                            <input className="form-control form--control pl-3" type="text" placeholder="Search for anything" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                            <span className="la la-search search-icon"></span>
                        </div>
                    </form>
                    <div className="search-bar-close icon-element icon-element-sm shadow-sm">
                        <i className="la la-times"></i>
                    </div>
                </div>
            </div>
            <div className="body-overlay"></div>
        </header>
    );
}
