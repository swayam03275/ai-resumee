import { useContext, useState } from "react";
import {
  FaCheckCircle,
  FaFileDownload,
  FaMagic,
  FaRobot,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileInfoCard from "../componets/cards/profileInfoCard";
import Modal from "../componets/Modal";
import { UserContext } from "../context/UserContext";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

const features = [
  {
    icon: <FaRobot className="text-2xl text-black" />,
    title: "AI-Powered Suggestions",
    desc: "Get instant, personalized resume feedback and improvements from our AI.",
  },
  {
    icon: <FaMagic className="text-2xl text-black" />,
    title: "Instant Formatting",
    desc: "Your resume is always perfectly formatted and professional.",
  },
  {
    icon: <FaCheckCircle className="text-2xl text-black" />,
    title: "ATS Optimization",
    desc: "Boost your chances with resumes optimized for Applicant Tracking Systems.",
  },
  {
    icon: <FaFileDownload className="text-2xl text-black" />,
    title: "One-Click Download",
    desc: "Export your resume in PDF with a single click.",
  },
];

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className='w-full min-h-screen bg-[url("/bg.jpg")] bg-cover bg-center'>
      {/* Navbar/Header at the top */}
      <header className="w-full flex items-center justify-between md:px-10 bg-transparent border-b border-black/10 h-16">
        <div className="text-xl font-bold flex items-center gap-2 ">
          <img src="/logo.svg" alt="" className="w-10 h-10" />
          AI Resume Builder
        </div>
        <div>
          {user ? (
            <ProfileInfoCard />
          ) : (
            <button
              className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
              onClick={() => setOpenAuthModal(true)}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </header>
      {/* Main Content: Centered hero section with shadcn style */}
      <div className="w-full flex items-center justify-center min-h-[70vh]">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center maindiv">
          <div className='flex flex-col items-center justify-center gap-8 max-w-2xl p-10 rounded-2xl shadow-lg border border-black/10 bg-[url("/bg.jpg")] bg-cover bg-center relative overflow-hidden'>
            <div className="absolute inset-0 backdrop-blur-[50px] " />
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold shadow flex items-center gap-2">
                  <FaRobot className="inline-block text-lg text-white" /> AI
                  Resume Builder
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-2 text-black text-center">
                Land Your Dream Job with AI-Powered Resumes!
              </h1>
              <p className="text-lg text-black mb-6 text-center max-w-xl">
                Craft a standout resume in minutes. Get instant, AI-powered
                feedback, perfect formatting, and one-click downloads. Your next
                job is just a resume away.
              </p>
              <button
                className="bg-black text-lg font-bold flex items-center justify-center text-white px-6 py-2 rounded-lg shadow hover:bg-gray-900 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="w-full flex justify-center py-10">
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full px-4 ">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center backdrop-blur-[52px] rounded-xl p-6 shadow border border-black/10"
            >
              {f.icon}
              <h3 className="mt-3 text-lg font-bold text-black text-center">
                {f.title}
              </h3>
              <p className="text-gray-700 text-center mt-2 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
