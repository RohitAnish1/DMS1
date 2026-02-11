# Frontend - Doctor Management System

This is the frontend client for the Doctor Management System, built with React and Vite. It provides the user interface for patients to book appointments and doctors to manage their schedules.

## 🚀 Features

- **Authentication Flows**: Login and Registration forms with validation.
- **Dashboard**: User-specific dashboard (Patient/Doctor views).
- **Booking System**: Interactive slot selection and appointment booking.
- **Responsive Design**: Mobile-friendly interface.

## 🛠 Tech Stack

- **React 19**: UI Library
- **Vite**: Build tool and development server
- **React Router DOM v7**: Client-side routing
- **Context API**: Global state management
- **Lucide React**: Icon set
- **Date-fns**: Date utility library

## 📦 Installation

This frontend requires the **Backend** to be running on port `3000` for API requests to work correctly.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## proxy Configuration

The development server is configured to proxy API requests to the backend:

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`

All requests to `/api/*` are forwarded to the backend automatically.

## 📂 Project Structure

- `src/components`: Reusable UI components (Navbar, etc.)
- `src/pages`: Main application pages (Login, Dashboard, Booking)
- `src/context`: React Context providers (AuthContext)
- `src/api.js`: API utility functions
