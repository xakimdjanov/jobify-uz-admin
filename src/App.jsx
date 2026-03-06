import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './Pages/Sidebar/Sidebar';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import Company from './Pages/Company/Company.jsx';
import Talent from './Pages/Talent/Talent.jsx';
import Job from './Pages/Job/Job.jsx';
import Message from './Pages/Message/Message.jsx';
import Notification from './Pages/Notificatons/Notification.jsx';

function App() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      <Sidebar />
      <main className="flex-1 p-5 md:p-10 transition-all duration-300 md:ml-64 pb-20 md:pb-10">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<Company />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/jobs" element={<Job />} />
          <Route path="/message" element={<Message />} />
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;