// import { Route, Routes, Navigate, useLocation } from "react-router-dom";
// import "./App.css";
// import { useTheme } from "./context/ThemeContext";

// import Sidebar from "./Pages/Sidebar/Sidebar";
// import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
// import Company from "./Pages/Company/Company.jsx";
// import CompanyDetail from "./Pages/Company/CompanyDetail.jsx";
// import Talent from "./Pages/Talent/Talent.jsx";
// import Jobs from "./Pages/Job/Job.jsx";
// import Message from "./Pages/Message/Message.jsx";
// import Notification from "./Pages/Notificatons/Notification.jsx";
// import TalentDetail from "./Pages/Talent/TalentDetail.jsx";
// import JobDetailPageCompany from "./Pages/Job/JobDetailPage.jsx";
// import Login from "./Pages/Admin/Login";
// import AdminList from "./Pages/Admin/Admin.jsx";
// // import ProtectedRoute from "./Pages/ProtectedRoute/ProtectedRoute.jsx"; // Kerak bo'lsa ishlating

// function App() {
//   const { settings } = useTheme();
//   const location = useLocation();
//   const isLoginPage = location.pathname === "/admin/login";

//   return (
//     // Body darajasida fon rangini saqlash uchun asosiy konteyner
//     <div className={`flex flex-col md:flex-row min-h-screen w-full transition-colors duration-300 ${settings.darkMode ? "bg-[#121212]" : "bg-[#F8F9FB]"
//       }`}>

//       {!isLoginPage && <Sidebar />}

//       <main
//         className={`flex-1 transition-all duration-300 w-full min-h-screen ${settings.darkMode ? "bg-[#121212] text-white" : "bg-[#F8F9FB] text-black"
//           } ${isLoginPage
//             ? "p-0 flex items-center justify-center"
//             : "p-4 md:p-10 mb-[70px] md:mb-0 md:ml-64"
//           /* md:ml-64 faqat desktopda sidebar uchun joy tashlaydi */
//           /* mb-[70px] faqat mobileda bottom-bar uchun joy tashlaydi */
//           }`}
//       >
//         <Routes>
//           <Route path="/admin/login" element={<Login />} />
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/company" element={<Company />} />
//           <Route path="/company/:id" element={<CompanyDetail />} />
//           <Route path="/message" element={<Message />} />
//           <Route path="/notification" element={<Notification />} />
//           <Route path="/talent" element={<Talent />} />
//           <Route path="/admin" element={<AdminList />} />
//           <Route path="/talent/:id" element={<TalentDetail />} />
//           <Route path="/jobs" element={<Jobs />} />
//           <Route path="/jobs/:id" element={<JobDetailPageCompany />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;












import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom"; // useNavigate qo'shildi
import React, { useState, useEffect } from "react"; // useEffect, useState qo'shildi
import "./App.css";
import { useTheme } from "./context/ThemeContext";

// Ikonkalar qo'shildi
import { RiTimerFlashLine } from "react-icons/ri";
import { HiOutlineShieldExclamation } from "react-icons/hi";

import Sidebar from "./Pages/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Company from "./Pages/Company/Company.jsx";
import CompanyDetail from "./Pages/Company/CompanyDetail.jsx";
import Talent from "./Pages/Talent/Talent.jsx";
import Jobs from "./Pages/Job/Job.jsx";
import Message from "./Pages/Message/Message.jsx";
import Notification from "./Pages/Notificatons/Notification.jsx";
import TalentDetail from "./Pages/Talent/TalentDetail.jsx";
import JobDetailPageCompany from "./Pages/Job/JobDetailPage.jsx";
import Login from "./Pages/Admin/Login";
import AdminList from "./Pages/Admin/Admin.jsx";

// --- XAVFSIZLIK KOMPONENTI (PROTECTED ROUTE) ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const blockUntil = localStorage.getItem("blockUntil");

  if (blockUntil) {
    const isBlocked = new Date(blockUntil) > new Date();
    if (isBlocked) {
      return <Navigate to="/error-page" replace />;
    }
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// --- BLOKLANGAN FOYDALANUVCHILAR UCHUN SAHIFA (YANGILANDI) ---
const ErrorPage = () => {
  const { settings } = useTheme();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const checkAndCountdown = () => {
      const blockUntil = localStorage.getItem("blockUntil");

      if (!blockUntil) {
        navigate("/admin/login");
        return;
      }

      const now = new Date().getTime();
      const distance = new Date(blockUntil).getTime() - now;

      if (distance <= 0) {
        // Vaqt tugaganda avtomatik tozalash va loginga qaytarish
        localStorage.removeItem("blockUntil");
        localStorage.removeItem("loginAttempts");
        navigate("/admin/login");
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    const timer = setInterval(checkAndCountdown, 1000);
    checkAndCountdown(); // Darhol ishga tushirish

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center w-full min-h-[400px] p-6">
      <div className="relative max-w-md w-full group">
        {/* Effektli fon */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[3rem] blur opacity-20 transition duration-1000"></div>

        <div className={`relative backdrop-blur-xl border rounded-[3rem] p-8 md:p-12 text-center shadow-2xl transition-all ${settings.darkMode
          ? "bg-red-950/10 border-red-500/20 shadow-red-900/20"
          : "bg-white/90 border-red-100 shadow-red-200"
          }`}>
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-xl shadow-red-500/40 rotate-12">
              <HiOutlineShieldExclamation size={40} className="text-white" />
            </div>
          </div>

          <h2 className={`text-2xl md:text-3xl font-black mb-3 tracking-tight ${settings.darkMode ? "text-white" : "text-gray-900"}`}>
            Kirish Cheklandi
          </h2>

          <p className={`text-sm leading-relaxed mb-8 ${settings.darkMode ? "text-zinc-400" : "text-gray-500"}`}>
            Xavfsizlik tizimi tizimni vaqtincha blokladi. Iltimos, taymer tugashini kuting:
          </p>


          <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-mono text-2xl font-bold border transition-all ${settings.darkMode
            ? "bg-red-500/10 border-red-500/30 text-red-500"
            : "bg-red-50 border-red-100 text-red-600"
            }`}>
            <RiTimerFlashLine className="animate-spin-slow" />
            {timeLeft || "..."}
          </div>

          <div className="mt-10 flex flex-col items-center gap-2">
            <div className="w-full h-1 bg-gray-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 animate-pulse w-full"></div>
            </div>
            <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${settings.darkMode ? "text-zinc-600" : "text-gray-400"}`}>
              Security System Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { settings } = useTheme();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";
  const isErrorPage = location.pathname === "/error-page";

  return (
    <div className={`flex flex-col md:flex-row min-h-screen w-full transition-colors duration-300 ${settings.darkMode ? "bg-[#121212]" : "bg-[#F8F9FB]"
      }`}>

      {!isLoginPage && !isErrorPage && <Sidebar />}

      <main
        className={`flex-1 transition-all duration-300 w-full min-h-screen ${settings.darkMode ? "bg-[#121212] text-white" : "bg-[#F8F9FB] text-black"
          } ${(isLoginPage || isErrorPage)
            ? "p-0 flex items-center justify-center"
            : "p-4 md:p-10 mb-[70px] md:mb-0 md:ml-64"
          }`}
      >
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/error-page" element={<ErrorPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/company" element={<ProtectedRoute><Company /></ProtectedRoute>} />
          <Route path="/company/:id" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
          <Route path="/message" element={<ProtectedRoute><Message /></ProtectedRoute>} />
          <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="/talent" element={<ProtectedRoute><Talent /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminList /></ProtectedRoute>} />
          <Route path="/talent/:id" element={<ProtectedRoute><TalentDetail /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetailPageCompany /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
