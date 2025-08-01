import 'reflect-metadata';
import express from 'express';
import { config } from 'dotenv';
import { initializeDatabase } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import initMiddleware from './middleware';
import { IUser } from './interfaces';

config();
const app = express();
const PORT = process.env.PORT || 3001;

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Init common middleware
initMiddleware(app);


// Routes
app.use('/api/v1', routes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ status: false, message: "Not found" });
});

// Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();
