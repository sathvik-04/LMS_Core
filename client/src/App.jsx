import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CartPage from './pages/CartPage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Teachers from './pages/Teachers';
import TeacherDetail from './pages/TeacherDetail';
import NotFound from './pages/NotFound';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Dashboard pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/MyCourses';
import StudentProfile from './pages/student/Profile';
import StudentWishlist from './pages/student/Wishlist';
import StudentOrders from './pages/student/Orders';
import CourseLearn from './pages/student/CourseLearn';
import QuizTake from './pages/student/QuizTake';
import QuizResults from './pages/student/QuizResults';

import InstructorDashboard from './pages/instructor/Dashboard';
import InstructorCourses from './pages/instructor/Courses';
import InstructorCourseEdit from './pages/instructor/CourseEdit';
import InstructorCoupons from './pages/instructor/Coupons';
import InstructorEarnings from './pages/instructor/Earnings';
import InstructorQuizzes from './pages/instructor/Quizzes';
import InstructorQuizEdit from './pages/instructor/QuizEdit';

import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminInstructors from './pages/admin/Instructors';
import AdminCourses from './pages/admin/Courses';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminSettings from './pages/admin/Settings';
import AdminSliders from './pages/admin/Sliders';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/course/:slug" element={<CourseDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/teachers/:id" element={<TeacherDetail />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Student */}
      <Route path="/user/dashboard" element={<ProtectedRoute roles={['user']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/user/courses" element={<ProtectedRoute roles={['user']}><StudentCourses /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute roles={['user', 'instructor', 'admin']}><StudentProfile /></ProtectedRoute>} />
      <Route path="/user/wishlist" element={<ProtectedRoute roles={['user']}><StudentWishlist /></ProtectedRoute>} />
      <Route path="/user/orders" element={<ProtectedRoute roles={['user']}><StudentOrders /></ProtectedRoute>} />
      <Route path="/learn/:courseId" element={<ProtectedRoute><CourseLearn /></ProtectedRoute>} />
      <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizTake /></ProtectedRoute>} />
      <Route path="/user/quiz-results" element={<ProtectedRoute roles={['user']}><QuizResults /></ProtectedRoute>} />

      {/* Instructor */}
      <Route path="/instructor/dashboard" element={<ProtectedRoute roles={['instructor']}><InstructorDashboard /></ProtectedRoute>} />
      <Route path="/instructor/courses" element={<ProtectedRoute roles={['instructor']}><InstructorCourses /></ProtectedRoute>} />
      <Route path="/instructor/courses/:id/edit" element={<ProtectedRoute roles={['instructor']}><InstructorCourseEdit /></ProtectedRoute>} />
      <Route path="/instructor/courses/new" element={<ProtectedRoute roles={['instructor']}><InstructorCourseEdit /></ProtectedRoute>} />
      <Route path="/instructor/coupons" element={<ProtectedRoute roles={['instructor']}><InstructorCoupons /></ProtectedRoute>} />
      <Route path="/instructor/earnings" element={<ProtectedRoute roles={['instructor']}><InstructorEarnings /></ProtectedRoute>} />
      <Route path="/instructor/quizzes" element={<ProtectedRoute roles={['instructor']}><InstructorQuizzes /></ProtectedRoute>} />
      <Route path="/instructor/quizzes/new" element={<ProtectedRoute roles={['instructor']}><InstructorQuizEdit /></ProtectedRoute>} />
      <Route path="/instructor/quizzes/:id/edit" element={<ProtectedRoute roles={['instructor']}><InstructorQuizEdit /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute roles={['admin']}><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/instructors" element={<ProtectedRoute roles={['admin']}><AdminInstructors /></ProtectedRoute>} />
      <Route path="/admin/courses" element={<ProtectedRoute roles={['admin']}><AdminCourses /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute roles={['admin']}><AdminCategories /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/sliders" element={<ProtectedRoute roles={['admin']}><AdminSliders /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <AppRoutes />
          <Footer />
          <ToastContainer position="top-right" theme="dark" autoClose={3000} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
