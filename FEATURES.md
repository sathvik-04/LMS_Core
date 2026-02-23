# YouTubeLMS — Feature Overview

A full-stack Learning Management System built with the **MERN stack** (MongoDB, Express.js, React, Node.js) featuring the **Aduca Bootstrap Theme** for a professional, polished UI.

---

## 🏠 Public Website

### Homepage
- **Hero Slider** — Dynamic banner carousel with customizable slides (managed from admin panel)
- **Info Boxes** — Configurable feature highlights (e.g., "Expert Instructors", "Lifetime Access")
- **Category Showcase** — Browse courses by category with icons and course counts
- **Featured Courses** — Grid of course cards with ratings, prices, discount badges, and instructor info
- **Fun Facts Counter** — Animated statistics (students, courses, instructors, countries)
- **Registration CTA** — Call-to-action section encouraging new signups
- **Testimonials** — Student review carousel with star ratings
- **Partner Logos** — Trusted-by section with partner/brand logos
- **Get Started Section** — Onboarding steps for new users

### Course Catalog
- **Browse & Filter** — Filter courses by category, subcategory, and skill level
- **Sort Options** — Sort by newest, price (low/high), popularity, and rating
- **Search** — Global search bar in the navigation for finding courses
- **Course Cards** — Rich cards showing thumbnail, title, instructor, star rating, review count, price, and discount badge

### Course Detail Page
- **Overview Tab** — Course description, what you'll learn, requirements, and target audience
- **Curriculum Tab** — Expandable sections with lecture list, duration, and preview indicators
- **Instructor Profile** — Instructor bio, photo, course count, and social links
- **Reviews & Ratings** — Star-based rating system with written reviews from enrolled students
- **Add to Cart / Buy Now** — Seamless purchase flow with cart integration
- **Related Courses** — Suggested courses based on category

### Static Pages
- **About Us** — Platform mission, student/course statistics, and team section
- **Contact Us** — Contact information cards + contact form with email integration
- **FAQ** — Expandable accordion with common questions and answers
- **Teachers / Instructors** — Grid of instructor profiles with photos, titles, and social links
- **Teacher Detail** — Individual instructor page with bio, stats, and their courses
- **Terms & Conditions** — Legal terms page
- **Privacy Policy** — Data privacy information page
- **404 Not Found** — Custom error page with navigation back to home

---

## 🔐 Authentication & Security

- **User Registration** — Name, email, password with role selection (Student or Instructor)
- **User Login** — Email/password authentication with JWT tokens
- **Google OAuth** — One-click Google sign-in integration
- **Email Verification** — Verification email sent on registration with secure token
- **Forgot Password** — Password reset via email with time-limited reset token
- **Change Password** — In-dashboard password change with current password verification
- **Role-Based Access Control** — Three roles: Student, Instructor, Admin
- **Protected Routes** — Client-side route guards + server-side middleware for role enforcement
- **JWT Token Management** — Automatic token attachment to API requests; 401 auto-logout

---

## 🎓 Student Dashboard

### My Dashboard
- **Enrollment Count** — Total courses enrolled
- **Completion Stats** — Courses completed vs. in-progress
- **Quick Navigation** — Links to courses, wishlist, orders, and profile

### My Courses
- **Enrolled Courses List** — All purchased/enrolled courses with progress bars
- **Continue Learning** — Quick access to resume where you left off

### Course Learning Interface
- **Video Player** — YouTube-embedded video player with full-screen support
- **Curriculum Sidebar** — Collapsible section list with lecture navigation
- **Progress Tracking** — Mark lectures as complete, visual progress percentage
- **Certificate Download** — PDF certificate generation upon 100% course completion
- **Course Quizzes** — Access and take quizzes directly from the learning interface

### Quiz Results
- **Results History** — View all quiz attempts with scores, percentages, and pass/fail status
- **Course Links** — Quick navigation to the related course from results

### Wishlist
- **Save for Later** — Heart-icon to save courses to wishlist
- **Wishlist Management** — View and remove wishlisted courses

### Order History
- **Purchase Records** — Complete order history with course names, prices, dates, and status
- **Payment Details** — Order ID, payment method, and transaction status

### Profile Management
- **Edit Profile** — Update name, bio, photo, title, and social links
- **Account Settings** — Email display, role information

---

## 👨‍🏫 Instructor Dashboard

### Dashboard Overview
- **Revenue Stats** — Total earnings, available balance, total withdrawn
- **Course Performance** — Number of courses, total students, and enrollments
- **Quick Metrics** — At-a-glance performance summary

### Course Management
- **Create Course** — Multi-field form: title, description, category, subcategory, price, discount price, level, thumbnail, and requirements
- **Edit Course** — Full course editing with all fields
- **Course Curriculum Builder**
  - **Add Sections** — Create course sections/modules
  - **Add Lectures** — Add lectures with title, YouTube URL, duration, description, and preview toggle
  - **Reorder & Delete** — Manage sections and lectures
- **Course Status** — Draft, pending review, active, and inactive states

### Coupon Management
- **Create Coupons** — Discount codes with percentage or fixed amount
- **Coupon Settings** — Expiry date, usage limits, minimum purchase amount
- **Coupon Analytics** — Track usage and redemption

### Earnings & Withdrawals
- **Earnings Overview** — Total earnings, available balance, and withdrawn amount
- **Withdrawal Requests** — Request withdrawal with amount specification
- **Withdrawal History** — Track past withdrawals with status (pending, approved, rejected)

### Quiz Management
- **Create Quizzes** — Build quizzes for any course with multiple question types
- **Question Editor** — Multiple-choice and true/false questions with dynamic options
- **Quiz Settings** — Configurable passing score, time limit, and point values per question
- **Answer Explanations** — Add explanations shown to students after answering
- **Quiz List** — View, edit, and delete quizzes across all courses

---

## 🛡️ Admin Dashboard

### Dashboard Analytics
- **Platform Statistics** — Total students, instructors, courses, orders, enrollments, revenue
- **Monthly Revenue Chart** — Visual bar chart showing revenue trends by month

### User Management
- **Student Management** — View, search, activate/deactivate student accounts
- **Instructor Management** — Approve/reject instructor applications, manage instructor accounts

### Course Administration
- **Course Moderation** — Review and approve/reject instructor-submitted courses
- **Course Management** — Edit, activate, or deactivate any course on the platform

### Category Management
- **Categories** — Create, edit, and delete course categories with icons
- **Subcategories** — Nested subcategories under parent categories

### Order Management
- **All Orders** — View and manage all platform orders
- **Order Status** — Track payment status and fulfillment

### Content Management
- **Slider Management** — Create, edit, reorder homepage hero slider slides
- **Site Settings** — Configure site name, logo, contact info, info boxes, partner logos, and social links

---

## 🛒 E-Commerce

- **Shopping Cart** — Add/remove courses, view subtotal
- **Coupon System** — Apply discount codes at checkout with validation
- **Stripe Integration** — Secure payment processing via Stripe Checkout
- **Order Processing** — Automatic enrollment upon successful payment
- **Price Display** — Original price, discount price, and percentage-off badges
- **Free Courses** — Support for free course enrollment without payment
---

## 📝 Quiz & Assessment System

- **Multiple Question Types** — Multiple-choice (2-6+ options) and true/false
- **Timed Quizzes** — Optional countdown timer with auto-submit on expiry
- **Question Navigation** — Jump between questions via grid sidebar with answered/pending indicators
- **Progress Bar** — Visual progress indicator showing answered questions count
- **Instant Results** — Score, percentage, pass/fail status displayed immediately after submission
- **Answer Review** — Per-question breakdown showing correct answers, user selections, and explanations
- **Score Tracking** — Points-based scoring with configurable passing thresholds
- **Result History** — Students can review all past quiz attempts

---

## ⚙️ Technical Architecture

### Frontend (React + Vite)
- **38 Page Components** across public, student, instructor, and admin areas
- **Aduca Bootstrap Theme** — Professional, responsive design with 30+ CSS/JS assets
- **React Router** — Client-side routing with role-based protected routes
- **Context API** — AuthContext for authentication state, CartContext for shopping cart
- **Axios Interceptors** — Automatic token management and error handling
- **Owl Carousel** — Smooth sliders for hero, testimonials, and partners
- **Line Awesome Icons** — Icon set for UI elements
- **React Toastify** — Toast notifications for user feedback
- **Lazy Loading** — Image lazy loading for performance

### Backend (Node.js + Express)
- **22 Database Models** — User, Course, Section, Lecture, Category, Subcategory, Enrollment, Order, Cart, Wishlist, Review, Quiz, QuizResult, Coupon, Payment, Withdrawal, Slider, InfoBox, Partner, SiteInfo, StaticPage, QuestionAnswer
- **19 API Route Files** — RESTful endpoints for all resources
- **JWT Authentication** — Secure token-based authentication middleware
- **Role-Based Middleware** — Route protection by user role
- **File Upload** — Image/file upload support
- **Email Service** — Transactional emails (verification, password reset, welcome)
- **Aggregation Pipelines** — MongoDB aggregations for dashboard analytics and revenue reports

### Database (MongoDB)
- **Mongoose ODM** — Schema validation, middleware hooks, and virtual fields
- **Password Hashing** — bcrypt-based secure password storage
- **Indexed Queries** — Optimized queries for search, filtering, and sorting

---

## 📱 Responsive Design

- Fully responsive across desktop, tablet, and mobile
- Mobile navigation with off-canvas menu
- Adaptive grid layouts for course cards and dashboard components
- Touch-friendly carousel sliders

---

## 📊 Summary

| Area | Count |
|------|-------|
| Frontend Pages | 38 |
| Backend Models | 22 |
| API Route Files | 19 |
| User Roles | 3 (Student, Instructor, Admin) |
| Dashboard Panels | 3 (Student, Instructor, Admin) |
| Public Pages | 15 |
| Quiz Features | Timed quizzes, instant grading, answer review |
| Authentication Methods | 3 (Email, Google OAuth, Forgot Password) |
