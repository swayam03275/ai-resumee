// Vercel serverless function for backend API
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("../backend/routes/authRoutes");
const resumeRoutes = require("../backend/routes/resumeRoutes");

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
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

// Connect to MongoDB
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Serve upload folder
app.use("/uploads", express.static(path.join(__dirname, "../backend/uploads")));

// Health check
app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

// Export for Vercel serverless
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
