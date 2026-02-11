# Doctor Management System

A comprehensive full-stack application for managing doctor appointments, built with React and Node.js.

## 🚀 Overview

This application facilitates the interaction between patients and doctors. Patients can search for doctors, view their available slots, and book appointments. Doctors can manage their availability and view upcoming appointments.

The project is structured as a monorepo containing both the `frontend` and `backend` codebases.

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Routing:** React Router DOM v7
- **State Management:** React Context API
- **Icons:** Lucide React
- **Date Handling:** Date-fns
- **Styling:** CSS Modules / Vanilla CSS

### Backend
- **Runtime:** Node.js
- **Framework:** Express v5
- **Database:** PostgreSQL
- **Authentication:** JWT & Bcrypt
- **Validation:** Zod

## ✨ Key Features

- **User Authentication:** Secure login and registration for both patients and doctors.
- **Role-Based Access:** Distinct portals and features for different user roles.
- **Doctor Availability:** Doctors can set their working hours and slot durations.
- **Appointment Booking:** Real-time checking of slot availability and booking.
- **Dashboard:** Personalized dashboard for users to manage their appointments.

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/) (v13+)

## 🔧 Installation & Setup

### 1. Database Setup

Create a PostgreSQL database (e.g., `doctor_db`) and run the following SQL commands to set up the schema:

```sql
-- Users table (Handles both doctors and patients)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('patient', 'doctor', 'admin')) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(100),
  consultation_fee DECIMAL(10, 2),
  bio TEXT,
  experience_years INTEGER
);

-- Patients table
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  dob DATE,
  gender VARCHAR(20),
  address TEXT
);

-- Doctor Availability
CREATE TABLE doctor_availability (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INTEGER DEFAULT 30, -- in minutes
  is_active BOOLEAN DEFAULT true
);

-- Appointments
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id),
  patient_id INTEGER REFERENCES patients(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Setup

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your database configuration:

```env
PORT=3000
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=doctor_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
# Server running on port 3000
```

### 3. Frontend Setup

Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
# App running at http://localhost:5173
```

The frontend is configured to proxy API requests to `http://localhost:3000` automatically.

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user (patient/doctor)
- `POST /api/auth/login` - Login and receive JWT

### Doctors
- `GET /api/doctors` - a list of all doctors
- `GET /api/doctors/:id/slots?date=YYYY-MM-DD` - Get available slots for a specific date

### Appointments
- `POST /api/appointments/book` - Book a new appointment
- `GET /api/appointments?userId=...&role=...` - Get appointment history

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
