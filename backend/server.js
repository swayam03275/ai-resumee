require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const resume = require("./models/Resume");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

//middleware to handle cors
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.some(
          (allowed) => origin.includes(allowed) || allowed.includes(origin),
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

//connect database
connectDB();

//middleware
app.use(express.json());
app.use(cookieParser());

//app.use("/api/resume",resumeRoutes)

//routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

//serve upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//start server
const PORT = process.env.PORT || 8000;

// For Vercel serverless, export the app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}
