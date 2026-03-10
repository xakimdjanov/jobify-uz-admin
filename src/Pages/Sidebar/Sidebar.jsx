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
        { name: 'Dash', path: '/dashboard', icon: <IoStatsChart size={20} /> },
        { name: 'Kompaniya', path: '/company', icon: <HiOutlineBuildingOffice2 size={22} /> },
        { name: 'Talent', path: '/talent', icon: <MdOutlinePersonOutline size={22} /> },
        { name: 'Ish', path: '/jobs', icon: <MdOutlineWork size={22} /> },
        { name: 'Xabar', path: '/message', icon: <MdQuestionAnswer size={22} /> },
        { name: 'Bildirish', path: '/notification', icon: <MdNotificationsNone size={22} /> }
    ];

    const handleLogout = () => {
        localStorage.clear();
        setIsLogoutModalOpen(false);
        navigate('/admin/login', { replace: true });
    };

    return (
        <>
            {/* Sidebar Asosiy Konteyneri */}
            <div className={`fixed bottom-0 left-0 w-full md:w-64 md:h-screen md:top-0 border-t md:border-t-0 md:border-r flex flex-row md:flex-col z-[100] transition-all duration-300 rounded-t-[30px] md:rounded-t-0 md:rounded-r-[30px] 
                ${settings.darkMode ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100'}`}>

                {/* Admin Profil qismi - Faqat Desktop */}
                <div className={`hidden md:flex items-center gap-3 mt-6 mb-8 px-6 w-full border-b pb-6 ${settings.darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#163D5C]/10 bg-gray-100 shrink-0">
                        {admin.profileimg_url ? (
                            <img src={admin.profileimg_url} alt="Admin Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#163D5C] text-white font-bold text-lg">
                                {admin.fullname?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col overflow-hidden text-left">
                        <h3 className={`font-bold text-[15px] truncate ${settings.darkMode ? 'text-gray-200' : 'text-[#163D5C]'}`}>{admin.fullname}</h3>
                        <p className="text-[12px] text-gray-400 truncate">{admin.email || "Administrator"}</p>
                    </div>
                </div>

                {/* Navigatsiya - Mobileda scroll butunlay olib tashlandi */}
                <nav className="flex flex-row md:flex-col flex-1 w-full justify-around md:justify-start px-1 md:px-4 py-1.5 md:py-0 overflow-hidden">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-0.5 md:gap-3 px-1 md:px-4 py-1 md:py-3 rounded-xl transition-all flex-1 md:flex-none
                                ${isActive
                                    ? (settings.darkMode ? "text-white bg-[#163D5C]/50 shadow-sm" : "text-white bg-[#163D5C] shadow-sm")
                                    : (settings.darkMode ? "text-gray-400 hover:text-white" : "text-[#9BA6B1] hover:text-[#163D5C] hover:bg-gray-50")}
                            `}
                        >
                            <span className="shrink-0 scale-90 md:scale-100">{item.icon}</span>
                            <span className="text-[9px] xs:text-[10px] md:text-[14px] font-semibold whitespace-nowrap">{item.name}</span>
                        </NavLink>
                    ))}

                    {/* Mobile uchun Toggle */}
                    <div className="flex md:hidden items-center justify-center flex-1" onClick={() => toggleSwitch('darkMode')}>
                        <div className={`p-1.5 rounded-lg ${settings.darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-600'}`}>
                            {settings.darkMode ? <MdOutlineDarkMode size={18} /> : <MdOutlineWbSunny size={18} />}
                        </div>
                    </div>
                </nav>

                {/* Pastki qism: Desktop uchun Switch va Logout */}
                <div className="hidden md:flex flex-col w-full px-4 pb-8 gap-2">
                    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${settings.darkMode ? 'border-gray-800 bg-gray-800/20' : 'border-gray-50 bg-gray-50/50'}`}>
                        <div className="flex items-center gap-3">
                            {settings.darkMode ? (
                                <MdOutlineDarkMode size={20} className="text-blue-400" />
                            ) : (
                                <MdOutlineWbSunny size={20} className="text-yellow-500" />
                            )}
                            <span className={`text-[13px] font-semibold ${settings.darkMode ? 'text-gray-300' : 'text-[#9BA6B1]'}`}>
                                {settings.darkMode ? 'Tungi rejim' : 'Kungi rejim'}
                            </span>
                        </div>
                        <div
                            onClick={() => toggleSwitch('darkMode')}
                            className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors duration-300 ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${settings.darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-red-500 hover:scale-[1.02] active:scale-[0.98] ${settings.darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                    >
                        <MdLogout size={20} className="shrink-0" />
                        <span className="text-[14px] font-semibold">Chiqish</span>
                    </button>
                </div>
            </div>

            {/* Logout Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] px-4">
                    <div className={`p-6 rounded-3xl shadow-2xl max-w-xs w-full animate-in fade-in zoom-in duration-200 ${settings.darkMode ? 'bg-[#1a1c1e] text-gray-200 border border-gray-800' : 'bg-white text-[#163D5C]'}`}>
                        <h3 className="text-lg font-bold mb-2">Chiqish</h3>
                        <p className={`text-sm mb-6 ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tizimdan chiqishni xohlaysizmi?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsLogoutModalOpen(false)} className={`flex-1 py-2.5 rounded-2xl border font-semibold transition-all ${settings.darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>Yo'q</button>
                            <button onClick={handleLogout} className="flex-1 py-2.5 rounded-2xl bg-red-500 text-white hover:bg-red-600 font-semibold shadow-lg shadow-red-500/30 transition-all">Ha</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;