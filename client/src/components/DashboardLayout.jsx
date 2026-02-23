import { NavLink, useLocation } from 'react-router-dom';
import { FiGrid, FiBook, FiHeart, FiShoppingBag, FiUser, FiDollarSign, FiTag, FiUsers, FiLayers, FiSliders, FiSettings, FiBarChart2 } from 'react-icons/fi';

const menus = {
    student: [
        { to: '/user/dashboard', icon: <FiGrid />, label: 'Dashboard' },
        { to: '/user/courses', icon: <FiBook />, label: 'My Courses' },
        { to: '/user/quiz-results', icon: <FiBarChart2 />, label: 'Quiz Results' },
        { to: '/user/wishlist', icon: <FiHeart />, label: 'Wishlist' },
        { to: '/user/orders', icon: <FiShoppingBag />, label: 'Orders' },
        { to: '/user/profile', icon: <FiUser />, label: 'Profile' },
    ],
    instructor: [
        { to: '/instructor/dashboard', icon: <FiGrid />, label: 'Dashboard' },
        { to: '/instructor/courses', icon: <FiBook />, label: 'My Courses' },
        { to: '/instructor/quizzes', icon: <FiBarChart2 />, label: 'Quizzes' },
        { to: '/instructor/coupons', icon: <FiTag />, label: 'Coupons' },
        { to: '/instructor/earnings', icon: <FiDollarSign />, label: 'Earnings' },
        { to: '/user/profile', icon: <FiUser />, label: 'Profile' },
    ],
    admin: [
        { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
        { to: '/admin/courses', icon: <FiBook />, label: 'Courses' },
        { to: '/admin/categories', icon: <FiLayers />, label: 'Categories' },
        { to: '/admin/students', icon: <FiUsers />, label: 'Students' },
        { to: '/admin/instructors', icon: <FiUsers />, label: 'Instructors' },
        { to: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
        { to: '/admin/sliders', icon: <FiSliders />, label: 'Sliders' },
        { to: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
    ],
};

export default function DashboardLayout({ role, children }) {
    const location = useLocation();
    const items = menus[role] || menus.student;

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-heading">{role === 'admin' ? 'Administration' : role === 'instructor' ? 'Instructor Panel' : 'My Account'}</div>
                <ul className="sidebar-nav">
                    {items.map(item => (
                        <li className="sidebar-item" key={item.to}>
                            <NavLink to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                                {item.icon} {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="dashboard-content">{children}</main>
        </div>
    );
}
