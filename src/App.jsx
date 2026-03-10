import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import { useTheme } from "./context/ThemeContext";

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
// import ProtectedRoute from "./Pages/ProtectedRoute/ProtectedRoute.jsx"; // Kerak bo'lsa ishlating

function App() {
  const { settings } = useTheme();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  return (
    // Body darajasida fon rangini saqlash uchun asosiy konteyner
    <div className={`flex flex-col md:flex-row min-h-screen w-full transition-colors duration-300 ${settings.darkMode ? "bg-[#121212]" : "bg-[#F8F9FB]"
      }`}>

      {!isLoginPage && <Sidebar />}

      <main
        className={`flex-1 transition-all duration-300 w-full min-h-screen ${settings.darkMode ? "bg-[#121212] text-white" : "bg-[#F8F9FB] text-black"
          } ${isLoginPage
            ? "p-0 flex items-center justify-center"
            : "p-4 md:p-10 mb-[70px] md:mb-0 md:ml-64"
          /* md:ml-64 faqat desktopda sidebar uchun joy tashlaydi */
          /* mb-[70px] faqat mobileda bottom-bar uchun joy tashlaydi */
          }`}
      >
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<Company />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/message" element={<Message />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/talent/:id" element={<TalentDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetailPageCompany />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;