# 🎓 LMS Core — Learning Management System

A full-featured **Learning Management System** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Supports course creation, enrollment, payments, quizzes, and admin management — all in a responsive, modern UI powered by the **Aduca Bootstrap Theme**.

---

## ✨ Features

### 🌐 Public Website
- Dynamic hero slider, featured courses, category showcase, testimonials, and partner logos
- Course catalog with filtering by category, subcategory, level, and sorting options
- Detailed course pages with curriculum, instructor info, reviews, and related courses
- Static pages: About, Contact (with email integration), FAQ, Instructors, Terms, Privacy, 404

### 🔐 Authentication & Security
- Email/password registration & login with **JWT tokens**
- **Google OAuth** single sign-on
- Email verification, forgot password, and password reset flows
- Role-based access control (Student, Instructor, Admin) with protected routes

### 🎓 Student Dashboard
- Enrolled courses with progress tracking
- YouTube-embedded video player with collapsible curriculum sidebar
- PDF certificate download on course completion
- Timed quizzes with instant grading and answer review
- Wishlist, order history, and profile management

### 👨‍🏫 Instructor Dashboard
- Course creation with curriculum builder (sections, lectures, YouTube URLs)
- Revenue stats, earnings overview, and withdrawal management
- Coupon creation with usage tracking
- Quiz builder with multiple-choice and true/false questions

### 🛡️ Admin Dashboard
- Platform analytics with monthly revenue charts
- User management (students & instructors)
- Course moderation and approval system
- Category/subcategory management
- Homepage slider, site settings, and content management

### 🛒 E-Commerce
- Shopping cart with coupon system
- **Stripe** checkout integration
- Automatic enrollment on successful payment
- Support for free and paid courses with discount badges

---

## 🛠️ Tech Stack

| Layer        | Technology                                                        |
|--------------|-------------------------------------------------------------------|
| **Frontend** | React 19, Vite, React Router, Axios, React Toastify, Stripe.js  |
| **Backend**  | Node.js, Express 5, Mongoose, JWT, Passport (Google OAuth)       |
| **Database** | MongoDB (Atlas or local)                                          |
| **Payments** | Stripe                                                            |
| **Email**    | Nodemailer (SMTP)                                                 |
| **Uploads**  | Multer                                                            |
| **PDF**      | PDFKit (certificates)                                             |
| **Theme**    | Aduca Bootstrap Theme                                             |

---

## 📁 Project Structure

```
mern/
├── client/                  # React frontend (Vite)
│   ├── public/              # Static assets, fonts, theme CSS/JS
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── pages/           # Page components organized by role
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── instructor/  # Instructor dashboard pages
│   │   │   ├── student/     # Student dashboard pages
│   │   │   └── ...          # Public pages
│   │   └── App.jsx          # Routes & layout
│   └── package.json
│
├── server/                  # Express backend
│   ├── models/              # 22 Mongoose models
│   ├── routes/              # 19 RESTful API route files
│   ├── middleware/           # Auth & role-based middleware
│   ├── utils/               # Email service, helpers
│   ├── uploads/             # User-uploaded files
│   ├── seed.js              # Database seeder
│   ├── index.js             # Server entry point
│   └── package.json
│
├── .gitignore
├── FEATURES.md              # Detailed feature documentation
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** (Atlas cloud or local instance)
- **Stripe** account (for payment integration)

### 1. Clone the Repository

```bash
git clone https://github.com/sathvik-04/LMS_Core.git
cd LMS_Core
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@yourlms.com
FROM_NAME=LMS Core

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database (Optional)

```bash
npm run seed
```

### 4. Setup the Client

```bash
cd ../client
npm install
```

### 5. Run the Application

Start both the server and client in separate terminals:

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📊 Project Stats

| Metric              | Count |
|----------------------|-------|
| Frontend Pages       | 38    |
| Backend Models       | 22    |
| API Route Files      | 19    |
| User Roles           | 3     |
| Dashboard Panels     | 3     |

---

## 🔑 API Routes Overview

| Route File         | Endpoint Prefix          | Description                    |
|--------------------|--------------------------|--------------------------------|
| `auth.js`          | `/api/auth`              | Login, register, OAuth, verify |
| `courses.js`       | `/api/courses`           | Course CRUD & catalog          |
| `enrollments.js`   | `/api/enrollments`       | Student enrollments & progress |
| `orders.js`        | `/api/orders`            | Order processing & history     |
| `quizzes.js`       | `/api/quizzes`           | Quiz CRUD & submissions        |
| `reviews.js`       | `/api/reviews`           | Course reviews & ratings       |
| `categories.js`    | `/api/categories`        | Category management            |
| `subcategories.js` | `/api/subcategories`     | Subcategory management         |
| `cart.js`          | `/api/cart`              | Shopping cart operations        |
| `wishlist.js`      | `/api/wishlist`          | Wishlist management            |
| `coupons.js`       | `/api/coupons`           | Coupon CRUD & validation       |
| `instructor.js`    | `/api/instructor`        | Instructor dashboard & stats   |
| `admin.js`         | `/api/admin`             | Admin dashboard & management   |
| `settings.js`      | `/api/settings`          | Site settings & CMS            |
| `users.js`         | `/api/users`             | User profile management        |
| `sections.js`      | `/api/sections`          | Course sections/modules        |
| `lectures.js`      | `/api/lectures`          | Section lectures               |
| `upload.js`        | `/api/upload`            | File uploads                   |
| `staticPages.js`   | `/api/static-pages`      | Static page content            |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Sathvik Shetty** — [@sathvik-04](https://github.com/sathvik-04)
