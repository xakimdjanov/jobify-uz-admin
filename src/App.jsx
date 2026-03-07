// import { Route, Routes, Navigate } from "react-router-dom";
// import "./App.css";

// import Sidebar from "./Pages/Sidebar/Sidebar";
// import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
// import Company from "./Pages/Company/Company.jsx";
// import Talent from "./Pages/Talent/Talent.jsx";
// import Jobs from "./Pages/Job/Job.jsx";
// import Message from "./Pages/Message/Message.jsx";
// import Notification from "./Pages/Notificatons/Notification.jsx";
// import TalentDetail from "./Pages/Talent/TalentDetail.jsx";
// import JobDetailPageCompany from "./Pages/Job/JobDetailPage.jsx";
// import Login from './Pages/Admin/Login';

// function App() {
//   return (
//     <div className="flex min-h-screen bg-[#F8F9FB]">
//       <Sidebar />
//       <main className="flex-1 p-5 md:p-10 transition-all duration-300 md:ml-64 pb-20 md:pb-10">
//         <Routes>
//           <Route path="/" element={<Navigate to="/admin/login" />} />
//           <Route path="/admin/login" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/company" element={<Company />} />
//           <Route path="/message" element={<Message />} />
//           <Route path="/notification" element={<Notification />} />
//           <Route path="/talent" element={<Talent />} />
//           <Route path="/talent/:id" element={<TalentDetail />} />
//           <Route path="/jobs" element={<Jobs />} />
//           <Route path="/jobs/:id" element={<JobDetailPageCompany />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;

import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import Sidebar from "./Pages/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Company from "./Pages/Company/Company.jsx";
import Talent from "./Pages/Talent/Talent.jsx";
import Jobs from "./Pages/Job/Job.jsx";
import Message from "./Pages/Message/Message.jsx";
import Notification from "./Pages/Notificatons/Notification.jsx";
import TalentDetail from "./Pages/Talent/TalentDetail.jsx";
import JobDetailPageCompany from "./Pages/Job/JobDetailPage.jsx";
import Login from "./Pages/Admin/Login";
import ProtectedRoute from "./Pages/ProtectedRoute/ProtectedRoute.jsx";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      {!isLoginPage && <Sidebar />}

      <main
        className={`flex-1 transition-all duration-300 ${
          isLoginPage
            ? "p-0 h-screen flex items-center justify-center"
            : "p-5 md:p-10 md:ml-64 pb-20 md:pb-10"
        }`}
      >
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="company" element={<Company />} />
                  <Route path="message" element={<Message />} />
                  <Route path="notification" element={<Notification />} />
                  <Route path="talent" element={<Talent />} />
                  <Route path="talent/:id" element={<TalentDetail />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="jobs/:id" element={<JobDetailPageCompany />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
