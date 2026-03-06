import React, { useState, useEffect } from 'react';
import api from "../../services/api";

function Dashboard() {
    const [stats, setStats] = useState({
        talents: 0,
        companies: 0,
        jobs: 0,
        notifications: 0,
        signupChart: [0, 0, 0, 0, 0, 0, 0]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [tRes, cRes, jRes, nRes] = await Promise.all([
                    api.get('/talent'),
                    api.get('/company'),
                    api.get('/jobs'),
                    api.get('/notifications')
                ]);

                const talents = tRes.data || [];
                const companies = cRes.data || [];

                const calculateWeeklySignups = (tList, cList) => {
                    const counts = [0, 0, 0, 0, 0, 0, 0];
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);

                    [...tList, ...cList].forEach(user => {
                        const createdDate = new Date(user.createdAt);
                        const diffTime = today - createdDate;
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays >= 0 && diffDays < 7) {
                            counts[6 - diffDays]++; // 0-indeks 6 kun oldin, 6-indeks bugun
                        }
                    });
                    return counts;
                };

                setStats({
                    talents: talents.length,
                    companies: companies.length,
                    jobs: (jRes.data || []).length,
                    notifications: (nRes.data || []).length,
                    signupChart: calculateWeeklySignups(talents, companies)
                });
            } catch (error) {
                console.error("Xatolik:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const daysLabels = ['6 kun oldin', '5 kun oldin', '4 kun oldin', '3 kun oldin', '2 kun oldin', 'Kecha', 'Bugun'];
    const maxValue = Math.max(...stats.signupChart, 1);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-slate-900">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Platforma Analitikasi</h1>
                    <p className="text-slate-500 mt-2">Platformadagi oxirgi faolliklar va statistika</p>
                </header>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Talantlar" value={stats.talents} icon="👥" color="blue" />
                    <StatCard title="Kompaniyalar" value={stats.companies} icon="🏢" color="green" />
                    <StatCard title="Ish o'rinlari" value={stats.jobs} icon="💼" color="purple" />
                    <StatCard title="Xabarlar" value={stats.notifications} icon="🔔" color="orange" />
                </div>

                {/* Graph Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Ro'yxatdan o'tishlar dinamikasi</h2>
                            <p className="text-sm text-slate-400 mt-1">Haftalik yangi foydalanuvchilar soni</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Barcha ro'yxatdan o'tishlar</span>
                        </div>
                    </div>

                    <div className="relative w-full h-72 flex items-end justify-between gap-3 sm:gap-6 px-2">
                        {stats.signupChart.map((count, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                                {/* Ustun ustidagi raqam */}
                                <span className={`mb-2 text-sm font-bold transition-all duration-300 ${count > 0 ? 'text-blue-600 opacity-100' : 'text-slate-300 opacity-50'}`}>
                                    {count}
                                </span>

                                {/* Grafik ustuni */}
                                <div
                                    className="w-full max-w-11.25 bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 ease-out hover:from-blue-500 hover:to-blue-300 shadow-md hover:shadow-blue-200/50"
                                    style={{
                                        height: `${(count / maxValue) * 80}%`,
                                        minHeight: count > 0 ? '6px' : '2px'
                                    }}
                                >
                                </div>

                                {/* Kun nomi */}
                                <span className="mt-4 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-tighter">
                                    {daysLabels[index]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100"
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]} border transition-colors group-hover:bg-white`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{value.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default Dashboard;