import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin, Globe, Phone, Mail, Briefcase } from 'lucide-react';
import { companyApi, jobApi } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        </div>
    );

    return (
        <div className="p-3 sm:p-6 lg:p-8 min-h-screen font-sans bg-[#F9FAFB] text-left pb-10">
            <ToastContainer />

            <div className="max-w-7xl mx-auto">
                {/* Header - Faqat Orqaga tugmasi qoldi */}
                <div className="flex mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-600 hover:text-teal-600 transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} /> Orqaga
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6">

                    {/* Left Sidebar */}
                    <div className="rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-sm h-fit border bg-white border-gray-100">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
                                <img
                                    src={company?.profileimg_url || company?.logo || defaultAvatar}
                                    className="w-full h-full rounded-full object-cover border-4 shadow-sm border-gray-50"
                                    alt="Logo"
                                />
                            </div>
                            <h2 className="text-base sm:text-xl font-bold text-center mt-4 break-words w-full text-[#1F2937] px-2">
                                {company?.company_name || 'Nomsiz'}
                            </h2>
                            <p className="text-teal-600 font-medium text-xs sm:text-sm mt-1 text-center bg-teal-50 px-3 py-1 rounded-full">
                                {company?.industry || 'Soha tanlanmagan'}
                            </p>
                        </div>

                        <div className="space-y-1 pt-6 border-t border-gray-50">
                            <h3 className="font-bold text-gray-400 mb-4 text-[10px] uppercase tracking-widest text-center sm:text-left">Bog'lanish</h3>
                            <InfoRow icon={<MapPin size={14} />} label="Shahar" value={company?.city} />
                            <InfoRow icon={<Globe size={14} />} label="Davlat" value={company?.country} />
                            <InfoRow icon={<Phone size={14} />} label="Telefon" value={company?.phone} />
                            <InfoRow icon={<Mail size={14} />} label="Email" value={company?.email} />
                            <InfoRow icon={<Briefcase size={14} />} label="Website" value={company?.website} isLink />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-6">
                        {/* Stats Dashboard */}
                        <div className="bg-gradient-to-br from-[#163D5C] via-[#2B5876] to-[#163D5C] rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 text-white shadow-xl">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60 mb-6 text-center">Dashboard Statistics</p>
                            <div className="grid grid-cols-3 gap-1 sm:gap-4 text-center">
                                <StatBox number={stats.active} label="Active" />
                                <div className="border-x border-white/10"><StatBox number={`+${stats.posted}`} label="Posted" /></div>
                                <StatBox number={stats.hired} label="Hired" />
                            </div>
                        </div>

                        {/* About Company */}
                        <div className="w-full rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-10 shadow-sm border bg-white border-gray-100 min-h-[250px]">
                            <h3 className="font-bold text-md sm:text-lg mb-4 text-gray-800">
                                Kompaniya haqida
                            </h3>
                            <div className="text-xs sm:text-base leading-relaxed break-words whitespace-pre-wrap text-gray-500 italic">
                                {company?.about_company || company?.description || "Ma'lumot kiritilmagan..."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value, isLink }) => (
    <div className="flex justify-between items-center text-[12px] py-3 border-b border-gray-50 last:border-0">
        <div className="flex items-center gap-2 text-gray-400">
            {icon}
            <span className="font-medium">{label}:</span>
        </div>
        <span className="font-bold text-gray-700 truncate ml-2 text-right max-w-[150px]">
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