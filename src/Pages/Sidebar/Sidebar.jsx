import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    MdQuestionAnswer,
    MdLogout,
    MdNotificationsNone,
    MdOutlinePersonOutline,
    MdOutlineWork,
    MdOutlineDarkMode,
    MdOutlineWbSunny
} from 'react-icons/md';
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoStatsChart } from "react-icons/io5";
import { useTheme } from '../../context/ThemeContext';

function Sidebar() {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { settings, toggleSwitch } = useTheme();

    const [admin, setAdmin] = useState({
        fullname: "Admin",
        profileimg_url: "",
        email: ""
    });

    useEffect(() => {
        const storedAdmin = localStorage.getItem("adminUser");
        if (storedAdmin) {
            try {
                setAdmin(JSON.parse(storedAdmin));
            } catch (error) {
                console.error("Ma'lumotni o'qishda xatolik", error);
            }
        }
    }, []);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <IoStatsChart size={20} />, mobile: true },
        { name: 'Kompaniya', path: '/company', icon: <HiOutlineBuildingOffice2 size={22} />, mobile: true },
        { name: 'Talent', path: '/talent', icon: <MdOutlinePersonOutline size={22} />, mobile: true },
        { name: 'Ish', path: '/jobs', icon: <MdOutlineWork size={22} />, mobile: true },
        { name: 'Xabar', path: '/message', icon: <MdQuestionAnswer size={22} />, mobile: false },
        { name: 'Bildirishnoma', path: '/notification', icon: <MdNotificationsNone size={22} />, mobile: true }
    ];

    const handleLogout = () => {
        localStorage.clear();
        setIsLogoutModalOpen(false);
        navigate('/admin/login', { replace: true });
    };

    return (
        <>
            {/* Sidebar Asosiy Konteyneri */}
            <div className={`fixed bottom-0 left-0 w-full h-17.5 border-t flex flex-row items-center justify-around z-100 transition-all duration-300 rounded-[50px] md:rounded-r-[30px] md:rounded-l-none md:flex-col md:w-64 md:h-screen md:border-r md:border-t-0 md:py-6 md:px-4 md:justify-start 
                ${settings.darkMode ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100'}`}>

                {/* Admin Profil qismi */}
                <div className={`hidden md:flex items-center gap-3 mb-8 px-2 w-full border-b pb-6 ${settings.darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#163D5C]/10 bg-gray-100 shrink-0">
                        {admin.profileimg_url ? (
                            <img src={admin.profileimg_url} alt="Admin Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#163D5C] text-white font-bold text-lg">
                                {admin.fullname?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <h3 className={`font-bold text-[15px] truncate ${settings.darkMode ? 'text-gray-200' : 'text-[#163D5C]'}`}>{admin.fullname}</h3>
                        <p className="text-[12px] text-gray-400 truncate">{admin.email || "Administrator"}</p>
                    </div>
                </div>

                {/* Navigatsiya */}
                <nav className="flex flex-row md:flex-col gap-1 md:gap-1.5 w-full justify-around md:justify-start">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                relative flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all
                                ${!item.mobile ? "hidden md:flex" : "flex"} 
                                ${isActive
                                    ? (settings.darkMode ? "text-white bg-[#163D5C]/50 shadow-sm" : "text-white bg-[#163D5C] shadow-sm")
                                    : (settings.darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-[#9BA6B1] hover:text-[#163D5C] hover:bg-gray-50")}
                            `}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="text-[10px] md:text-[14px] font-semibold">{item.name}</span>
                        </NavLink>
                    ))}

                    {/* Dark Mode Toggle Switch */}
                    <div className="hidden md:flex items-center justify-between px-4 py-3 mt-4 w-full">
                        <div className="flex items-center gap-3">
                            {/* Mantiq to'g'irlandi: darkMode bo'lsa OY, bo'lmasa QUYOSH */}
                            {settings.darkMode ? (
                                <MdOutlineDarkMode size={22} className="text-blue-400 shrink-0" />
                            ) : (
                                <MdOutlineWbSunny size={22} className="text-yellow-500 shrink-0" />
                            )}
                            <span className={`text-[14px] font-semibold ${settings.darkMode ? 'text-gray-200' : 'text-[#9BA6B1]'}`}>
                                {settings.darkMode ? 'Dark mode' : 'Light mode'}
                            </span>
                        </div>

                        {/* Switch Tab */}
                        <div
                            onClick={() => toggleSwitch('darkMode')}
                            className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-300 ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${settings.darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className={`cursor-pointer hidden md:flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-red-500 mt-auto md:mt-10 ${settings.darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                    >
                        <MdLogout size={20} className="shrink-0" />
                        <span className="text-[14px] font-semibold">Logout</span>
                    </button>
                </nav>
            </div>

            {/* Logout Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-200 px-4">
                    <div className={`p-6 rounded-2xl shadow-xl max-w-xs w-full ${settings.darkMode ? 'bg-[#1a1c1e] text-gray-200' : 'bg-white text-[#163D5C]'}`}>
                        <h3 className="text-lg font-bold mb-2">Chiqish</h3>
                        <p className={`text-sm mb-6 ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tizimdan chiqishni xohlaysizmi?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsLogoutModalOpen(false)} className={`flex-1 py-2 rounded-xl border font-semibold ${settings.darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>Yo'q</button>
                            <button onClick={handleLogout} className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 font-semibold">Ha</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;