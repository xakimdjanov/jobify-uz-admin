import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { useTheme } from '../../context/ThemeContext'; // Context-ni import qildik
// Ikonkalarni import qilish
import {
    MdNotificationsNone,
    MdOutlinePersonOutline,
    MdOutlineWork
} from 'react-icons/md';
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

function Dashboard() {
    const { settings } = useTheme(); // Dark mode holatini olish
    const [stats, setStats] = useState({
        talents: 0,
        companies: 0,
        jobs: 0,
        notifications: 0,
        signupChart: {
            talents: [],
            companies: [],
            labels: []
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [tRes, cRes, jRes, nRes] = await Promise.all([
                    api.get('/talent'),
                    api.get('/company'),
                    api.get('/jobs'),
                    api.get('/contacts')
                ]);

                const talents = tRes.data || [];
                const companies = cRes.data || [];

                const getWeeklyData = (talentList, companyList) => {
                    const talentCounts = [0, 0, 0, 0, 0, 0, 0];
                    const companyCounts = [0, 0, 0, 0, 0, 0, 0];
                    const labels = ['Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha', 'Yak'];

                    const today = new Date();
                    const currentDay = today.getDay();

                    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
                    const monday = new Date(today);
                    monday.setDate(today.getDate() - diffToMonday);
                    monday.setHours(0, 0, 0, 0);

                    for (let i = 0; i < 7; i++) {
                        const d = new Date(monday);
                        d.setDate(monday.getDate() + i);
                        const startOfDay = d.getTime();
                        const endOfDay = new Date(d).setHours(23, 59, 59, 999);

                        if (d.toDateString() === today.toDateString()) {
                            labels[i] = "Bugun";
                        }

                        (Array.isArray(talentList) ? talentList : []).forEach(item => {
                            const createdAt = new Date(item.createdAt).getTime();
                            if (createdAt >= startOfDay && createdAt <= endOfDay) {
                                talentCounts[i]++;
                            }
                        });

                        (Array.isArray(companyList) ? companyList : []).forEach(item => {
                            const createdAt = new Date(item.createdAt).getTime();
                            if (createdAt >= startOfDay && createdAt <= endOfDay) {
                                companyCounts[i]++;
                            }
                        });
                    }
                    return { talentCounts, companyCounts, labels };
                };

                const chartData = getWeeklyData(talents, companies);

                let contactsCount = 0;
                if (Array.isArray(nRes.data)) {
                    contactsCount = nRes.data.length;
                } else if (nRes.data?.data && Array.isArray(nRes.data.data)) {
                    contactsCount = nRes.data.data.length;
                } else if (nRes.data?.contacts && Array.isArray(nRes.data.contacts)) {
                    contactsCount = nRes.data.contacts.length;
                }

                setStats({
                    talents: Array.isArray(talents) ? talents.length : 0,
                    companies: Array.isArray(companies) ? companies.length : 0,
                    jobs: (jRes.data || []).length,
                    notifications: contactsCount,
                    signupChart: {
                        talents: chartData.talentCounts,
                        companies: chartData.companyCounts,
                        labels: chartData.labels
                    }
                });
            } catch (error) {
                console.error("Dashboard yuklashda xatolik:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className={`flex justify-center items-center h-screen ${settings.darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className={`min-h-screen p-4 lg:p-10 font-sans transition-colors duration-300 ${settings.darkMode ? 'bg-[#121212] text-white' : 'bg-white text-slate-900'}`}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className={`text-2xl lg:text-3xl font-black tracking-tight ${settings.darkMode ? 'text-gray-100' : 'text-slate-800'}`}>Platforma Analitikasi</h1>
                    <p className={`${settings.darkMode ? 'text-gray-400' : 'text-slate-500'} font-medium text-sm`}>Tizimning real vaqtdagi ko'rsatkichlari</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
                    <StatCard title="Talantlar" value={stats.talents} icon={<MdOutlinePersonOutline />} color="blue" isDark={settings.darkMode} />
                    <StatCard title="Kompaniyalar" value={stats.companies} icon={<HiOutlineBuildingOffice2 />} color="green" isDark={settings.darkMode} />
                    <StatCard title="Ish o'rinlari" value={stats.jobs} icon={<MdOutlineWork />} color="purple" isDark={settings.darkMode} />
                    <StatCard title="Xabarlar" value={stats.notifications} icon={<MdNotificationsNone />} color="orange" isDark={settings.darkMode} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <ChartSection
                        title="Talantlar dinamikasi"
                        data={stats.signupChart.talents}
                        labels={stats.signupChart.labels}
                        color="blue"
                        label="Yangi talantlar"
                        isDark={settings.darkMode}
                    />
                    <ChartSection
                        title="Kompaniyalar dinamikasi"
                        data={stats.signupChart.companies}
                        labels={stats.signupChart.labels}
                        color="green"
                        label="Yangi kompaniyalar"
                        isDark={settings.darkMode}
                    />
                </div>
            </div>
        </div>
    );
}

const ChartSection = ({ title, data, labels, color, label, isDark }) => {
    const maxValue = Math.max(...data, 1);
    const theme = {
        blue: { bar: "from-blue-500 to-blue-600", text: "text-blue-600", bg: "bg-blue-500", border: isDark ? "border-blue-900/30" : "border-blue-100", todayText: "text-blue-600" },
        green: { bar: "from-emerald-500 to-emerald-600", text: "text-emerald-600", bg: "bg-emerald-500", border: isDark ? "border-emerald-900/30" : "border-emerald-100", todayText: "text-emerald-600" }
    };
    return (
        <div className={`p-5 lg:p-7 rounded-3xl border transition-all ${isDark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-slate-200/60 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h2 className={`text-lg font-bold leading-none mb-2 ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>{title}</h2>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${theme[color].bg}`}></span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${theme[color].border} ${theme[color].text}`}>Haftalik</div>
            </div>
            <div className="relative w-full h-64 flex items-end justify-between px-1">
                {data.map((count, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 h-full justify-end z-10 group/item">
                        <span className={`mb-2 text-[11px] font-black transition-all ${count > 0 ? theme[color].text : (isDark ? 'text-gray-700' : 'text-slate-300')}`}>{count}</span>
                        <div
                            className={`w-10/12 max-w-8 bg-linear-to-t ${theme[color].bar} rounded-t-lg transition-all duration-500 group-hover/item:brightness-110`}
                            style={{ height: `${(count / maxValue) * 160}px`, minHeight: count > 0 ? '6px' : '3px' }}
                        ></div>
                        <span className={`mt-4 text-[10px] font-bold uppercase tracking-tighter ${labels[index] === 'Bugun' ? theme[color].todayText + ' font-black' : (isDark ? 'text-gray-600' : 'text-slate-400')}`}>{labels[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, isDark }) => {
    const colors = {
        blue: isDark ? "bg-blue-900/20 text-blue-400 border-blue-900/30" : "bg-blue-50 text-blue-600 border-blue-100",
        green: isDark ? "bg-emerald-900/20 text-emerald-400 border-emerald-900/30" : "bg-emerald-50 text-emerald-600 border-emerald-100",
        purple: isDark ? "bg-purple-900/20 text-purple-400 border-purple-900/30" : "bg-purple-50 text-purple-600 border-purple-100",
        orange: isDark ? "bg-orange-900/20 text-orange-400 border-orange-900/30" : "bg-orange-50 text-orange-600 border-orange-100"
    };
    return (
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${colors[color]} border text-2xl shadow-inner`}>{icon}</div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
                    <p className={`text-2xl font-black leading-none ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>{(value || 0).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;