# RentEase - Peer-to-Peer Rental Platform

RentEase is a modern, portfolio-quality, full-stack peer-to-peer property and asset rental platform. It enables users to browse, list, rent, book, review properties and goods dynamically, complete with verification, OTP protection, and map search.

Designed using clean coding practices, modern architectures, and industry standards, this repository serves as a showcase of a production-ready React + Spring Boot web application.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- **JWT Authentication:** Secure user authentication using JSON Web Tokens with automatic inactivity logout.
- **Social Sign-In:** Google OAuth2 client integration for single-click sign-in.
- **Two-Factor OTP Security:** OTP verification for registration, password reset, and sensitive actions via Spring Mail.

### 🏠 Listing & Booking
- **Product Management:** Complete CRUD actions for property listings with image upload support.
- **Dynamic Search & Filtering:** Distance-based location sorting (Haversine formula) and text search.
- **Interactive Maps:** Leaflet maps integration to view and select properties geographically.
- **Bookings & Reviews:** Seamless renting workflow with review stars and user feedback.

### 🛡️ Identity & Payment
- **Aadhaar Verification:** Simulated official identity checks for security.
- **Payment Gateway:** Secure checkout simulations.

---

## 🛠️ Tech Stack

### Frontend
- **Core Library:** React 18 (Migrated from CRA to Vite for optimized, sub-second builds)
- **Styling:** TailwindCSS & PostCSS
- **Navigation:** React Router Dom v6
- **Maps:** Leaflet & React-Leaflet
- **HTTP Client:** Axios / Fetch API

### Backend
- **Framework:** Spring Boot 3.x (Java 17)
- **Security:** Spring Security & OAuth2 Client
- **Authentication:** JJWT (JSON Web Token)
- **Data Persistence:** Spring Data MongoDB (NoSQL)
- **Mailing:** Spring Boot Starter Mail (SMTP)
- **Documentation:** Springdoc OpenAPI (Swagger UI)

---

## 📂 Project Architecture & Folder Structure

### Frontend Structure (`rentease-frontend/src`)
```text
src/
 ├── assets/          # Static assets (images, icons)
 ├── components/      # Reusable presentation and utility components
 │    ├── Auth/       # Authentication-specific components (LogoutButton)
 │    ├── MapView.jsx # Leaflet map integration
 │    ├── Navbar.jsx  # Main navigation header
 │    └── ProtectedRoute.jsx # Client-side route protector
 ├── context/         # AuthContext.jsx handles global states & session monitoring
 ├── hooks/           # Custom React hooks (for potential future extensions)
 ├── layouts/         # Page layout skeletons
 ├── pages/           # Page-level components
 ├── routes/          # Centrally defined routing configuration
 ├── services/        # Service layer (api.js, authService.js)
 ├── utils/           # Utility files (session.js for token tracking)
 ├── App.jsx          # React root application & Activity Tracker
 └── main.jsx         # Vite entry point
```

### Backend Structure (`backend/src/main/java/com/rentease`)
```text
com.rentease/
 ├── config/          # Configurations (SecurityConfig, OpenApiConfig)
 ├── controller/      # Controllers handling HTTP requests
 ├── dto/             # Data Transfer Objects (LoginRequest, JwtResponse, ErrorResponse)
 ├── exception/       # Centralized Exception Handling (GlobalExceptionHandler, Custom Exceptions)
 ├── model/           # MongoDB Entities/Models (User, Product, Booking, Review, Otp)
 ├── repository/      # Spring Data MongoDB Repositories
 ├── security/        # JWT Filters, OAuth Success/Failure Handlers, Custom User Details
 └── service/         # Business Logic Layer (UserService, ProductService, OtpService, EmailService)
```

---

## 🏁 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher)
- **Java JDK** (v17 or higher)
- **Maven** (v3.8 or higher)
- **MongoDB** (Local instance or Atlas cloud URI)

---

### 🔧 Configuration

#### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Copy `.env.example` to `.env` (or configure your environment variables):
   ```bash
   cp .env.example .env
   ```
3. Fill in your database URI, mail settings, Google Client credentials, and JWT secret key.
4. Build the application using Maven:
   ```bash
   mvn clean package -DskipTests
   ```
5. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

#### 2. Frontend Setup
1. Navigate to the `rentease-frontend` directory:
   ```bash
   cd rentease-frontend
   ```
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Run npm install to fetch required modules:
   ```bash
   npm install
   ```
4. Launch the local development server:
   ```bash
   npm run dev
   ```

---

## 📖 API Documentation (Swagger)

Once the backend is running, the interactive OpenAPI documentation can be accessed at:
- **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
- **API Spec:** `http://localhost:8080/v3/api-docs`

---

## 💡 Future Enhancements
- [ ] Integration of real-time WebSockets notifications for booking updates.
- [ ] Integration of a real payment provider (e.g., Stripe, Razorpay).
- [ ] Advanced recommendation algorithms for products based on user views.
- [ ] AWS S3 integration for robust, production-grade image uploads.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
