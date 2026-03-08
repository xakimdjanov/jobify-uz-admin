import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    MdQuestionAnswer,
    MdLogout,
    MdNotificationsNone,
    MdOutlinePersonOutline,
    MdOutlineWork
} from 'react-icons/md';
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoStatsChart } from "react-icons/io5";

function Sidebar() {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const user = {
        name: "Admin",
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
        localStorage.clear();
        setIsLogoutModalOpen(false);
        navigate('/login', { replace: true });
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 w-full h-17.5 border-t flex flex-row items-center justify-around z-100 bg-white border-gray-100 md:flex-col md:w-64 md:h-screen md:border-r md:border-t-0 md:py-6 md:px-4 md:justify-start transition-all">

                {/* User Profile Section (Desktop only) */}
                <div className="hidden md:flex items-center gap-3 mb-8 px-2 w-full">
                    <div className="flex flex-col overflow-hidden">
                        <h3 className="font-semibold text-[20px] truncate text-[#333]">{user.name}</h3>
                        <p className="text-[17px] text-gray-400 truncate">{user.city}</p>
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
                                    ? "text-[#163D5C] md:text-white md:bg-[#163D5C] md:shadow-md"
                                    : "text-[#9BA6B1] hover:text-[#163D5C] hover:bg-gray-50"}
                            `}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="text-[10px] md:text-[14px] font-medium">{item.name}</span>
                        </NavLink>
                    ))}

                    {/* Logout Button (Desktop only) */}
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="cursor-pointer hidden md:flex items-center gap-3 px-4 py-3 rounded-md transition-all mt-auto w-full text-red-500 hover:text-red-500 hover:bg-red-50"
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
                            <button onClick={() => setIsLogoutModalOpen(false)} className="cursor-pointer flex-1 py-2 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50">Yo'q</button>
                            <button onClick={handleLogout} className="cursor-pointer flex-1 py-2 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600">Ha</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;