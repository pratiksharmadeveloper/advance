import cors from "cors";
import morgan from "morgan";
import express, { Express } from "express";
import helmet from "helmet";

export const initMiddleware = (app: Express) => {
  // Logging based on environment
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan("dev"));
  }
// Serve static files for uploaded images
app.use(
  '/uploads',
  express.static('uploads', {
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
    }
  })
);

  // Body parsing
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));
  app.use(express.json({ limit: "20mb" }));

  // CORS
  const allowedOrigins = process.env.NODE_ENV === "production"
    ? ["https://yourdomain.com"]
    : ["http://localhost:3000", "http://localhost:3001"];

  // Helmet for security - helps secure Express apps by setting various HTTP headers
  app.use(helmet());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    })
  );
};

export default initMiddleware;
