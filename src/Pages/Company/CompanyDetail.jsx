import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, X, Camera, ChevronDown, ArrowLeft, Loader2 } from 'lucide-react';
import { companyApi, jobApi } from '../../services/api'; // applicationApi agar ishlatilmasa olib tashlandi
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Country, City } from 'country-state-city';

export const INDUSTRIES = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Other"];

const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [company, setCompany] = useState(null);
    const [stats, setStats] = useState({ active: 0, posted: 0, hired: 56 });
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const allCountries = Country.getAllCountries();
    const [availableCities, setAvailableCities] = useState([]);

    const defaultAvatar = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

    useEffect(() => {
        fetchData();
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [id]);

    useEffect(() => {
        if (formData.country) {
            const selectedCountry = allCountries.find(c => c.name === formData.country);
            if (selectedCountry) {
                const cities = City.getCitiesOfCountry(selectedCountry.isoCode);
                setAvailableCities(cities.map(city => city.name));
            }
        } else { setAvailableCities([]); }
    }, [formData.country]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await companyApi.getById(id);
            const profileData = res.data?.data || res.data;

            if (profileData) {
                setCompany(profileData);
                setFormData({ ...profileData });

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

    const handlePhoneChange = (e) => {
        const digits = e.target.value.replace(/\D/g, "");
        let mainDigits = digits.startsWith("998") ? digits.slice(3) : digits;
        mainDigits = mainDigits.substring(0, 9);
        let formatted = "+998 ";
        if (mainDigits.length > 0) formatted += "(" + mainDigits.substring(0, 2);
        if (mainDigits.length >= 2) formatted += ") " + mainDigits.substring(2, 5);
        if (mainDigits.length >= 5) formatted += "-" + mainDigits.substring(5, 7);
        if (mainDigits.length >= 7) formatted += "-" + mainDigits.substring(7, 9);
        setFormData(prev => ({ ...prev, phone: formatted.trim() }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const toastId = toast.loading("Yuklanmoqda...");
        try {
            const imgData = new FormData();
            imgData.append('profileimg', file);
            await companyApi.update(id, imgData);
            setImagePreview(URL.createObjectURL(file));
            toast.update(toastId, { render: "Logo yangilandi!", type: "success", isLoading: false, autoClose: 3000 });
            fetchData();
        } catch (error) {
            toast.update(toastId, { render: "Xatolik yuz berdi", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading("Saqlanmoqda...");
        try {
            const { created_at, profileimg_url, ...updateData } = formData;
            await companyApi.update(id, updateData);
            setIsModalOpen(false);
            fetchData();
            toast.update(loadingToast, { render: "Muvaffaqiyatli saqlandi!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            toast.update(loadingToast, { render: "Xatolik yuz berdi", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        </div>
    );

    return (
        <div className="p-3 sm:p-6 lg:p-8 min-h-screen font-sans bg-[#F9FAFB] text-left pb-10">
            <ToastContainer />

            <div className="max-w-7xl mx-auto">
                {/* Header Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                    <button onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-600 hover:text-teal-600 transition-all">
                        <ArrowLeft size={18} /> Orqaga
                    </button>
                    <Link to="/company/post-job" className="bg-[#5CB85C] hover:bg-[#4cae4c] text-white w-full sm:w-auto px-8 py-3 rounded-xl font-bold shadow-md text-center active:scale-95 transition-all">
                        Post a Job
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6">
                    {/* Left Sidebar */}
                    <div className="rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-sm relative h-fit border bg-white border-gray-50">
                        <button onClick={() => setIsModalOpen(true)} className="absolute right-4 top-4 text-gray-300 hover:text-[#5CB85C] transition-colors"><Pencil size={18} /></button>
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
                                <img src={imagePreview || company?.profileimg_url || company?.logo || defaultAvatar} className="w-full h-full rounded-full object-cover border-4 shadow-md border-gray-50" alt="Profile" />
                                <label className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#5CB85C] p-2 sm:p-3 rounded-full text-white cursor-pointer shadow-lg hover:bg-[#4cae4c] transition-all">
                                    <Camera size={18} /><input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <h2 className="text-base sm:text-xl font-bold text-center mt-4 break-words w-full text-[#1F2937] px-2">{company?.company_name || 'Nomsiz'}</h2>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1 text-center">{company?.industry || 'Soha tanlanmagan'}</p>
                        </div>
                        <div className="space-y-1 pt-4 border-t border-gray-50">
                            <h3 className="font-bold text-gray-400 mb-3 text-[10px] uppercase tracking-widest">Ma'lumotlar</h3>
                            <InfoRow label="Shahar" value={company?.city} />
                            <InfoRow label="Davlat" value={company?.country} />
                            <InfoRow label="Telefon" value={company?.phone} />
                            <InfoRow label="Email" value={company?.email} />
                            <InfoRow label="Website" value={company?.website} isLink />
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
                        <div className="w-full rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-10 shadow-sm border relative min-h-[250px] bg-white border-gray-100">
                            <button onClick={() => setIsModalOpen(true)} className="absolute right-6 top-6 text-gray-300 hover:text-blue-500 transition-colors"><Pencil size={18} /></button>
                            <h3 className="font-bold text-md sm:text-lg mb-4 text-gray-800">Kompaniya haqida</h3>
                            <div className="text-xs sm:text-base leading-relaxed break-words whitespace-pre-wrap text-gray-500">
                                {company?.about_company || company?.description || "Ma'lumot kiritilmagan..."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL (Tahrirlash) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4">
                    <div ref={dropdownRef} className="rounded-[1.5rem] sm:rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl relative">
                        <div className="sticky top-0 p-4 border-b flex justify-center items-center z-10 bg-white border-gray-50">
                            <h2 className="text-md sm:text-lg font-bold text-gray-700">Tahrirlash</h2>
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-4 sm:p-8 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ModalInput label="Kompaniya nomi" value={formData?.company_name} onChange={v => setFormData({ ...formData, company_name: v })} required={true} />
                                <div className="flex flex-col">
                                    <label className="text-gray-400 font-bold mb-1.5 text-[10px] uppercase ml-1">Telefon</label>
                                    <input type="text" className="border rounded-xl p-3 outline-none text-sm bg-gray-50 border-gray-100" value={formData?.phone || ""} onChange={handlePhoneChange} placeholder="+998 (__) ___-__-__" />
                                </div>
                                <ModalInput label="Website" value={formData?.website} onChange={v => setFormData({ ...formData, website: v })} />
                                <SearchableDropdown label="Soha" value={formData?.industry} fieldName="industry" options={INDUSTRIES} onSelect={(field, val) => setFormData({ ...formData, [field]: val })} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />
                                <SearchableDropdown label="Davlat" value={formData?.country} fieldName="country" options={allCountries.map(c => c.name)} onSelect={(field, val) => setFormData({ ...formData, [field]: val })} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />
                                <SearchableDropdown label="Shahar" value={formData?.city} fieldName="city" options={availableCities} onSelect={(field, val) => setFormData({ ...formData, [field]: val })} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />
                            </div>
                            <div>
                                <label className="block text-gray-400 font-bold mb-1.5 text-[10px] uppercase ml-1">Haqida</label>
                                <textarea className="w-full h-32 border rounded-xl p-3 outline-none text-sm resize-none bg-white border-gray-200" value={formData?.about_company || ""} onChange={(e) => setFormData({ ...formData, about_company: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-[#5CB85C] text-white py-4 rounded-xl font-bold shadow-lg uppercase tracking-widest text-xs">Saqlash</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Yordamchi komponentlar (Kichik ekranlar uchun o'lchamlar optimallashgan)
const InfoRow = ({ label, value, isLink }) => (
    <div className="flex justify-between items-center text-[12px] py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-gray-400 font-medium shrink-0">{label}:</span>
        <span className="font-bold text-gray-700 truncate ml-2 text-right">
            {isLink && value ? (
                <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
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

const ModalInput = ({ label, value, onChange, required }) => (
    <div className="flex flex-col">
        <label className="text-gray-400 font-bold mb-1.5 text-[10px] uppercase ml-1">{label} {required && "*"}</label>
        <input type="text" className="border rounded-xl p-3 text-sm bg-gray-50 border-gray-100 outline-none focus:border-teal-500 transition-all" value={value || ''} onChange={e => onChange(e.target.value)} required={required} />
    </div>
);

const SearchableDropdown = ({ label, value, options, fieldName, onSelect, activeDropdown, setActiveDropdown }) => (
    <div className="flex flex-col relative">
        <label className="text-gray-400 font-bold mb-1.5 text-[10px] uppercase ml-1">{label}</label>
        <div className="relative">
            <input type="text" className="w-full border rounded-xl p-3 text-sm bg-gray-50 border-gray-100 outline-none" value={value || ""} onFocus={() => setActiveDropdown(fieldName)} onChange={(e) => onSelect(fieldName, e.target.value)} />
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {activeDropdown === fieldName && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-xl mt-1 shadow-xl z-50 max-h-40 overflow-y-auto">
                {options.filter(opt => opt.toLowerCase().includes((value || "").toLowerCase())).map((opt, i) => (
                    <div key={i} className="p-3 text-xs hover:bg-gray-50 cursor-pointer text-gray-600 border-b border-gray-50 last:border-0" onClick={() => { onSelect(fieldName, opt); setActiveDropdown(null); }}>{opt}</div>
                ))}
            </div>
        )}
    </div>
);

export default CompanyDetail;