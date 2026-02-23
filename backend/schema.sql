-- Create Tables for Doctor Management System

-- 1. Users table (Base table for login)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients table (Profile for patients)
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dob DATE,
    gender VARCHAR(20),
    address TEXT
);

-- 3. Doctors table (Profile for doctors)
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    consultation_fee DECIMAL(10, 2)
);

-- 4. Doctor Availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INTEGER DEFAULT 30, -- in minutes
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
