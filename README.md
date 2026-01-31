# AI Resume Builder 🚀

A modern, AI-powered resume builder application that helps users create professional resumes with multiple templates, AI-assisted content generation, and real-time ATS scoring.

## 🌟 Features

### 🤖 AI-Powered Assistance

- **Smart Content Generation**: AI-powered suggestions for profile summaries, work experience descriptions, and project details
- **ATS Score Analysis**: Real-time analysis of resume compatibility with Applicant Tracking Systems
- **Professional Feedback**: Get improvement suggestions and recommendations

### 📝 Resume Builder

- **Multiple Templates**: 3 professional resume templates with customizable color palettes
- **Step-by-Step Builder**: Guided multi-step form for easy resume creation
- **Real-Time Preview**: Live preview of your resume as you build it
- **Form Validation**: Comprehensive validation to ensure completeness

### 🎨 Customization

- **Theme Selector**: Choose from multiple color palettes for each template
- **Profile Photo Support**: Upload and manage profile pictures
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📄 Export & Management

- **PDF Download**: One-click PDF export with print optimization
- **Resume Management**: Save, edit, and manage multiple resumes
- **Cloud Storage**: All data securely stored in the cloud

### 🔐 User Authentication

- **Secure Login/Signup**: JWT-based authentication with cookie storage
- **User Profiles**: Personalized dashboard for each user
- **Session Management**: Persistent login sessions

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library
- **Moment.js** - Date formatting
- **HTML2Canvas & jsPDF** - PDF generation
- **React-to-Print** - Print functionality
- **Framer Motion** - Animations

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling
- **dotenv** - Environment variable management

### AI Integration

- **Google Gemini 2.0 Flash** - AI content generation and analysis

## 📁 Project Structure

```
AI-Resume/
├── backend/                     # Express.js backend
│   ├── config/
│   │   └── db.js               # Database connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── resumeController.js # Resume CRUD operations
│   │   └── uploadResumeImages.js # Image upload handling
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT authentication
│   │   └── uploadMiddleware.js # Multer configuration
│   ├── models/
│   │   ├── Resume.js          # Resume data model
│   │   └── User.js            # User data model
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── resumeRoutes.js    # Resume routes
│   ├── uploads/               # File uploads directory
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── server.js             # Express server entry point
├── frontend/resume/            # React frontend
│   ├── public/
│   ├── src/
│   │   ├── AI/
│   │   │   └── AI.js         # AI integration
│   │   ├── assets/           # Images and assets
│   │   ├── components/       # Reusable components
│   │   │   ├── inputs/       # Form input components
│   │   │   ├── cards/        # Card components
│   │   │   ├── layouts/      # Layout components
│   │   │   └── ResumeTemplates/ # Resume template components
│   │   ├── context/
│   │   │   └── UserContext.jsx # User state management
│   │   ├── pages/            # Page components
│   │   │   ├── Auth/         # Login/Signup pages
│   │   │   ├── Home/         # Dashboard and home
│   │   │   └── ResumeUpdate/ # Resume editing pages
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # React entry point
│   ├── package.json
│   └── vite.config.js       # Vite configuration
├── .gitignore                # Git ignore file
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Google AI API key (for Gemini integration)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/swayam03275/AI-Resume.git
   cd AI-Resume
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Copy environment template and fill in your values
   cp .env.example .env
   ```

3. **Configure Backend Environment**
   Edit `backend/.env` with your values:

   ```env
   PORT=8000
   MONGO_URL=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Frontend Setup**

   ```bash
   cd ../frontend/resume
   npm install

   # Copy frontend environment template and fill in your values
   cp .env.example .env
   ```

5. **Configure Frontend Environment**
   Edit `frontend/resume/.env` with your Google AI API key:
   ```env
   VITE_GEMINI_API_KEY=your-google-gemini-api-key-here
   ```

### Running the Application

1. **Start Backend Server**

   ```bash
   cd backend
   npm run dev    # Development mode with nodemon
   # or
   npm start      # Production mode
   ```

2. **Start Frontend Development Server**

   ```bash
   cd frontend/resume
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/upload-image` - Upload profile image

### Resumes

- `GET /api/resume` - Get all user resumes
- `POST /api/resume` - Create new resume
- `GET /api/resume/:id` - Get resume by ID
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume
- `PUT /api/resume/:id/upload-images` - Upload resume images

## 🎯 Usage Guide

### Creating a Resume

1. **Sign Up/Login**: Create an account or login to existing account
2. **Dashboard**: Access your dashboard to view existing resumes
3. **Create New**: Click "Add New Resume" to start building
4. **Step-by-Step Process**:

   - **Profile Info**: Enter your name, designation, and summary (AI-assisted)
   - **Contact Info**: Add email, phone, address, and social links
   - **Skills**: List your professional and technical skills
   - **Work Experience**: Add work history with AI-generated descriptions
   - **Education**: Include educational background
   - **Projects**: Showcase your projects with GitHub/live links
   - **Certifications**: Add relevant certifications and awards

5. **Customize**: Choose templates and color schemes
6. **AI Review**: Get ATS score and improvement suggestions
7. **Download**: Export as PDF when satisfied

### AI Features

- **Smart Summaries**: AI generates professional summaries based on your input
- **Work Descriptions**: AI improves work experience descriptions
- **Project Details**: AI enhances project descriptions
- **ATS Analysis**: Real-time ATS scoring with improvement tips

## 🔒 Security Features

- JWT-based authentication with httpOnly cookies
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization
- Secure file upload handling

### Environment Variables for Production

```env
# Backend (.env)
NODE_ENV=production
PORT=8000
MONGO_URL=your-production-mongodb-url
JWT_SECRET=your-production-jwt-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI-powered content generation
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [MongoDB](https://mongodb.com/) for database services
- [TailwindCSS](https://tailwindcss.com/) for styling

## 📞 Contact

**Swayam** - [@swayam03275](https://github.com/swayam03275)

Project Link: [https://github.com/swayam03275/AI-Resume](https://github.com/swayam03275/AI-Resume)

---

**Built with ❤️ for helping people land their dream jobs!**
