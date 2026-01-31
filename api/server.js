// Vercel serverless function for backend API
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============ MODELS ============
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    thumbnailLink: { type: String, default: "" },
    template: {
      theme: { type: String },
      colorPalette: { type: String },
    },
    profileInfo: {
      profileImg: { type: String },
      profilePreviewUrl: { type: String },
      fullName: { type: String },
      designation: { type: String },
      summary: { type: String },
    },
    contactInfo: {
      email: { type: String },
      phone: { type: String },
      location: { type: String },
      linkedin: { type: String },
      github: { type: String },
      website: { type: String },
    },
    workExperience: [
      {
        company: { type: String },
        role: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        startDate: { type: String },
        endDate: { type: String },
      },
    ],
    skills: [
      {
        name: { type: String },
        progress: { type: Number },
      },
    ],
    projects: [
      {
        title: { type: String },
        description: { type: String },
        github: { type: String },
        liveDemo: { type: String },
      },
    ],
    certifications: [
      {
        title: { type: String },
        issuer: { type: String },
        year: { type: String },
      },
    ],
    languages: [
      {
        name: { type: String },
        progress: { type: Number },
      },
    ],
    interests: [{ type: String }],
  },
  { timestamps: true },
);

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

// ============ MIDDLEWARE ============
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

// ============ APP SETUP ============
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
        callback(null, true); // Allow all origins for now
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// ============ DATABASE ============
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

// ============ AUTH ROUTES ============
// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Get Profile
app.get("/api/auth/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// ============ RESUME ROUTES ============
// Create Resume
app.post("/api/resume", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const defaultResumeData = {
      profileInfo: {
        profileImg: "",
        profilePreviewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      interests: [],
    };
    const resume = await Resume.create({
      userId: req.user.id,
      title,
      ...defaultResumeData,
    });
    res.status(201).json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating resume", error: error.message });
  }
});

// Get All Resumes
app.get("/api/resume", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching resumes", error: error.message });
  }
});

// Get Resume by ID
app.get("/api/resume/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching resume", error: error.message });
  }
});

// Update Resume
app.put("/api/resume/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body },
      { new: true },
    );
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating resume", error: error.message });
  }
});

// Delete Resume
app.delete("/api/resume/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting resume", error: error.message });
  }
});

// Upload Images
app.put("/api/resume/:id/upload-images", authMiddleware, async (req, res) => {
  try {
    const { thumbnailLink, profilePreviewUrl } = req.body;
    const updateData = {};
    if (thumbnailLink) updateData.thumbnailLink = thumbnailLink;
    if (profilePreviewUrl)
      updateData["profileInfo.profilePreviewUrl"] = profilePreviewUrl;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updateData },
      { new: true },
    );
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading images", error: error.message });
  }
});

// Health check
app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

// ============ EXPORT ============
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
