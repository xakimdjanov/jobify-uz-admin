import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    MdQuestionAnswer,
    MdLogout,
    MdNotificationsNone,
    MdOutlinePersonOutline,
    MdOutlineWork,
    MdOutlineSettings
} from 'react-icons/md';
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoStatsChart } from "react-icons/io5";

function Sidebar() {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Statik ma'lumotlar (Backend o'rniga)
    const user = {
        name: "Ibrohim",
        city: "Namangan"
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <IoStatsChart size={20} />, mobile: true },
        { name: 'Company', path: '/company', icon: <HiOutlineBuildingOffice2 size={22} />, mobile: true },
        { name: 'Talent', path: '/talent', icon: <MdOutlinePersonOutline size={22} />, mobile: true },
        { name: 'Jobs', path: '/jobs', icon: <MdOutlineWork size={22} />, mobile: true },
        { name: 'Message', path: '/message', icon: <MdQuestionAnswer size={22} />, mobile: false },
        { name: 'Notification', path: '/notification', icon: <MdNotificationsNone size={22} />, mobile: true }
    ];

    const handleLogout = () => {
        // Chiqish mantiqi (Masalan login sahifasiga yuborish)
        navigate('/login');
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 w-full h-70px border-t flex flex-row items-center justify-around z-100 bg-white border-gray-100 md:relative md:flex-col md:w-[260px] md:h-screen md:border-r md:border-t-0 md:py-6 md:px-4 md:justify-start transition-all">

                {/* User Profile Section */}
                <div className="hidden md:flex items-center gap-3 mb-8 px-2 w-full">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={user.img} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <h3 className="font-semibold text-[15px] truncate text-[#333]">{user.name}</h3>
                        <p className="text-[12px] text-gray-400 truncate">{user.city}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-row md:flex-col gap-1 md:gap-1.5 w-full justify-around md:justify-start">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                relative flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-md transition-all duration-200
                ${!item.mobile ? "hidden md:flex" : "flex"} 
                ${isActive
                                    ? "bg-[#163D5C] text-white shadow-md"
                                    : "text-[#9BA6B1] hover:text-[#163D5C] hover:bg-gray-50"}
              `}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="text-[10px] md:text-[14px] font-medium">{item.name}</span>

                            {item.badge && (
                                <span className="absolute top-1 right-2 md:right-4 bg-[#2ECC71] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}

                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="hidden md:flex items-center gap-3 px-4 py-3 rounded-md transition-all mt-auto w-full text-[#9BA6B1] hover:text-red-500 hover:bg-red-50"
                    >
                        <MdLogout size={20} className="shrink-0" />
                        <span className="text-[14px] font-medium">Logout</span>
                    </button>
                </nav>
            </div>

            {/* Logout Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-200 px-4">
                    <div className="p-6 rounded-2xl shadow-xl max-w-xs w-full bg-white text-[#163D5C] animate-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-2">Chiqish</h3>
                        <p className="text-sm mb-6 text-gray-600">Tizimdan chiqishni xohlaysizmi?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-2 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50">Yo'q</button>
                            <button onClick={handleLogout} className="flex-1 py-2 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600">Ha</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;