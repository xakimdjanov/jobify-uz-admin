import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin, Globe, Phone, Mail, Briefcase } from 'lucide-react';
import { companyApi, jobApi } from '../../services/api';
import { useTheme } from '../../context/ThemeContext'; // ThemeContext qo'shildi
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { settings } = useTheme(); // Dark mode holati
    const isDark = settings.darkMode;

    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [stats, setStats] = useState({ active: 0, posted: 0, hired: 56 });

    const defaultAvatar = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await companyApi.getById(id);
            const profileData = res.data?.data || res.data;

            if (profileData) {
                setCompany(profileData);

                const [jobsRes] = await Promise.allSettled([jobApi.getAll()]);
                const jobsData = jobsRes.status === 'fulfilled' ? (jobsRes.value.data?.data || jobsRes.value.data) : [];

                if (Array.isArray(jobsData)) {
                    const myJobs = jobsData.filter(job => String(job.company_id) === String(id));
                    setStats(prev => ({
                        ...prev,
                        posted: myJobs.length,
                        active: myJobs.filter(j => j.is_activate || j.is_active).length,
                    }));
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Ma'lumotlarni yuklab bo'lmadi");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#121212]' : 'bg-[#F9FAFB]'}`}>
            <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
        </div>
    );

    return (
        <div className={`p-3 sm:p-6 lg:p-8 min-h-screen font-sans text-left pb-10 transition-colors duration-300 ${isDark ? 'bg-[#121212]' : 'bg-[#F9FAFB]'}`}>
            <ToastContainer theme={isDark ? "dark" : "light"} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl shadow-sm border font-bold transition-all active:scale-95 ${isDark
                                ? 'bg-[#1a1c1e] border-gray-800 text-gray-300 hover:text-teal-400'
                                : 'bg-white border-gray-100 text-gray-600 hover:text-teal-600'
                            }`}
                    >
                        <ArrowLeft size={18} /> Orqaga
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6">

                    {/* Left Sidebar */}
                    <div className={`rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-sm h-fit border transition-all ${isDark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100'
                        }`}>
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
                                <img
                                    src={company?.profileimg_url || company?.logo || defaultAvatar}
                                    className={`w-full h-full rounded-full object-cover border-4 shadow-sm ${isDark ? 'border-gray-800' : 'border-gray-50'}`}
                                    alt="Logo"
                                />
                            </div>
                            <h2 className={`text-base sm:text-xl font-bold text-center mt-4 break-words w-full px-2 ${isDark ? 'text-gray-100' : 'text-[#1F2937]'}`}>
                                {company?.company_name || 'Nomsiz'}
                            </h2>
                            <p className={`font-medium text-xs sm:text-sm mt-1 text-center px-3 py-1 rounded-full ${isDark ? 'bg-teal-900/20 text-teal-400' : 'bg-teal-50 text-teal-600'
                                }`}>
                                {company?.industry || 'Soha tanlanmagan'}
                            </p>
                        </div>

                        <div className={`space-y-1 pt-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-50'}`}>
                            <h3 className={`font-bold mb-4 text-[10px] uppercase tracking-widest text-center sm:text-left ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Bog'lanish</h3>
                            <InfoRow isDark={isDark} icon={<MapPin size={14} />} label="Shahar" value={company?.city} />
                            <InfoRow isDark={isDark} icon={<Globe size={14} />} label="Davlat" value={company?.country} />
                            <InfoRow isDark={isDark} icon={<Phone size={14} />} label="Telefon" value={company?.phone} />
                            <InfoRow isDark={isDark} icon={<Mail size={14} />} label="Email" value={company?.email} />
                            <InfoRow isDark={isDark} icon={<Briefcase size={14} />} label="Website" value={company?.website} isLink />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-6">
                        {/* Stats Dashboard */}
                        <div className={`rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 text-white shadow-xl bg-gradient-to-br ${isDark ? 'from-[#0f172a] via-[#1e293b] to-[#0f172a]' : 'from-[#163D5C] via-[#2B5876] to-[#163D5C]'
                            }`}>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60 mb-6 text-center">Dashboard Statistics</p>
                            <div className="grid grid-cols-3 gap-1 sm:gap-4 text-center">
                                <StatBox number={stats.active} label="Active" />
                                <div className="border-x border-white/10"><StatBox number={`+${stats.posted}`} label="Posted" /></div>
                                <StatBox number={stats.hired} label="Hired" />
                            </div>
                        </div>

                        {/* About Company */}
                        <div className={`w-full rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-10 shadow-sm border min-h-[250px] transition-all ${isDark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100'
                            }`}>
                            <h3 className={`font-bold text-md sm:text-lg mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                Kompaniya haqida
                            </h3>
                            <div className={`text-xs sm:text-base leading-relaxed break-words whitespace-pre-wrap italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {company?.about_company || company?.description || "Ma'lumot kiritilmagan..."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value, isLink, isDark }) => (
    <div className={`flex justify-between items-center text-[12px] py-3 border-b last:border-0 ${isDark ? 'border-gray-800' : 'border-gray-50'}`}>
        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {icon}
            <span className="font-medium">{label}:</span>
        </div>
        <span className={`font-bold truncate ml-2 text-right max-w-[150px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {isLink && value ? (
                <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">
                    {value.replace(/(^\w+:|^)\/\//, '')}
                </a>
            ) : (value || '---')}
        </span>
    </div>
);

const StatBox = ({ number, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-xl sm:text-3xl font-extrabold">{number}</span>
        <span className="text-[8px] sm:text-[10px] uppercase opacity-70 font-bold tracking-wider">{label}</span>
    </div>
);

export default CompanyDetail;