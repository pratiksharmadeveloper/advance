# Hospital Management System - Backend

A comprehensive Express.js backend with TypeORM and MySQL for a hospital management system.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 👥 **User Management**: Admin, Doctor, and Patient user types
- 📅 **Appointment Management**: Complete appointment lifecycle management
- 🏥 **Doctor & Patient Profiles**: Detailed profiles with medical information
- 📰 **News Management**: Hospital news and announcements
- 💼 **Vacancy Management**: Job postings and applications
- 💬 **Messaging System**: Internal communication between users
- 🔒 **Security**: Helmet, CORS, Rate limiting, Input validation
- 📊 **Database**: TypeORM with MySQL for robust data management

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: MySQL
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express-validator
- **Email**: Nodemailer (for notifications)

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=hospital_db

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   # File Upload Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Create MySQL database:**
   ```sql
   CREATE DATABASE hospital_db;
   ```

5. **Run the application:**
   ```bash
   # Development mode
   npm run dev

   # Production build
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Appointments
- `POST /api/appointments` - Create appointment (authenticated)
- `GET /api/appointments/my-appointments` - Get user's appointments
- `GET /api/appointments` - Get all appointments (admin/doctor)
- `GET /api/appointments/:id` - Get appointment by ID (admin/doctor)
- `PUT /api/appointments/:id/status` - Update appointment status (admin/doctor)
- `PUT /api/appointments/:id` - Update appointment (admin/doctor)
- `DELETE /api/appointments/:id` - Delete appointment (admin only)

### Health Check
- `GET /health` - API health check
- `GET /` - API information

## Project Structure

```
src/
├── config/
│   └── database.ts          # TypeORM configuration
├── controllers/
│   ├── userController.ts    # User management
│   └── appointmentController.ts # Appointment management
├── entities/
│   ├── User.ts             # User entity
│   ├── Doctor.ts           # Doctor entity
│   ├── Patient.ts          # Patient entity
│   ├── Appointment.ts      # Appointment entity
│   ├── News.ts             # News entity
│   ├── Vacancy.ts          # Vacancy entity
│   └── Message.ts          # Message entity
├── middleware/
│   ├── auth.ts             # Authentication middleware
│   └── errorHandler.ts     # Error handling middleware
├── routes/
│   ├── index.ts            # Main router
│   ├── userRoutes.ts       # User routes
│   ├── appointmentRoutes.ts # Appointment routes
│   └── ...                 # Other route files
├── services/
│   ├── userService.ts      # User business logic
│   └── appointmentService.ts # Appointment business logic
└── index.ts                # Application entry point
```

## Database Schema

The application uses TypeORM entities with the following relationships:

- **User** (1:1) **Doctor** - User can be a doctor
- **User** (1:1) **Patient** - User can be a patient
- **User** (1:N) **Appointment** - User can have multiple appointments
- **Doctor** (1:N) **Appointment** - Doctor can have multiple appointments
- **Patient** (1:N) **Appointment** - Patient can have multiple appointments
- **User** (1:N) **Message** - User can send/receive messages

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin, Doctor, Patient roles
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run typeorm` - TypeORM CLI commands

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Async/await for asynchronous operations
- Error handling with custom middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 