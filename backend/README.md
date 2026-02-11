# Backend - Doctor Management System

This is the backend server for the Doctor Management System, built with Node.js and Express. It handles user authentication, appointment scheduling, and doctor availability.

## 🚀 Key Features

*   **RESTful API**: Structured endpoints for resources.
*   **Authentication**: Secure JWT-based auth flow.
*   **Database**: PostgreSQL integration with `pg`.
*   **Validation**: Input validation using `zod` (if used, check code) or manual checks.
*   **Safety**: Transaction management for critical operations (like booking).

## 🛠 Tech Stack

*   **Node.js**: Runtime environment
*   **Express**: Web framework
*   **PostgreSQL**: Relational database
*   **bcryptjs**: Password hashing
*   **jsonwebtoken**: Auth tokens

## 📦 Database Setup

Ensure you have a PostgreSQL database running. The connection string is constructed from environment variables.

### Environment Variables

Create a `.env` file in this directory with the following variables:

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=your_database_name
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

## 🔧 Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will start on port `3000`.

## 🔗 Main Endpoints

*   `POST /api/auth/register`: Create new user
*   `POST /api/auth/login`: Authenticate user
*   `GET /api/doctors`: List all doctors
*   `GET /api/doctors/:id/slots`: Check availability
*   `POST /api/appointments/book`: Book a slot

## ⚠️ Notes

Check `package.json` for all available scripts. `npm run dev` uses `nodemon` for hot-reloading.
