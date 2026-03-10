import React, { useState, useEffect, useMemo } from 'react';
import { talentApi, companyApi, notificationApi } from "../../services/api";
import {
    MdSend, MdDeleteOutline, MdNotificationsNone,
    MdOutlineMessage, MdPerson, MdBusiness,
    MdGroups, MdSearch, MdCheckCircle
} from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../../context/ThemeContext"; // Theme ulandi

function Notification() {
    const { settings } = useTheme(); // Dark mode holati
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        targetGroup: 'talent',
        sendMode: 'all',
        selectedId: '',
        title: '',
        message: '',
    });

    const getAdminToken = () => localStorage.getItem('token');

    const fetchNotifications = async () => {
        try {
            const res = await notificationApi.getAll();
            setNotifications((res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async (group) => {
        setUsers([]);
        try {
            const res = group === 'talent' ? await talentApi.getAll() : await companyApi.getAll();
            setUsers(res.data || []);
        } catch (error) {
            toast.error("Ma'lumotlarni yuklashda xatolik!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Ushbu bildirishnomani o'chirmoqchimisiz?")) return;
        const token = getAdminToken();
        if (!token) return toast.error("Admin token topilmadi!");

        try {
            await notificationApi.delete(id, token);
            setNotifications(prev => prev.filter(n => (n.id !== id && n._id !== id)));
            toast.info("Xabar muvaffaqiyatli o'chirildi");
        } catch (error) {
            toast.error("O'chirishda xatolik yuz berdi");
        }
    };

    useEffect(() => {
        fetchNotifications();
        loadUsers(formData.targetGroup);
    }, [formData.targetGroup]);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const name = (u.fullName || u.companyName || u.email || "").toLowerCase();
            return name.includes(searchTerm.toLowerCase());
        });
    }, [users, searchTerm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getAdminToken();
        if (!token) return toast.error("Token topilmadi!");
        if (!formData.title.trim() || !formData.message.trim()) return toast.warning("To'ldiring!");

        setSending(true);
        const toastId = toast.loading("Jarayon boshlandi...");

        try {
            if (formData.sendMode === 'all') {
                const total = users.length;
                for (let i = 0; i < total; i++) {
                    const user = users[i];
                    await notificationApi.send({
                        [formData.targetGroup === 'talent' ? 'talent_id' : 'company_id']: user.id || user._id,
                        title: formData.title,
                        message: formData.message,
                        type: "broadcast"
                    }, token);
                }
                toast.update(toastId, { render: `Muvaffaqiyatli!`, type: "success", isLoading: false, autoClose: 3000 });
            } else {
                await notificationApi.send({
                    title: formData.title,
                    message: formData.message,
                    [formData.targetGroup === 'talent' ? 'talent_id' : 'company_id']: parseInt(formData.selectedId)
                }, token);
                toast.update(toastId, { render: "Xabar yuborildi!", type: "success", isLoading: false, autoClose: 3000 });
            }
            setFormData({ ...formData, title: '', message: '', selectedId: '' });
            fetchNotifications();
        } catch (error) {
            toast.update(toastId, { render: "Xatolik!", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 md:-ml-64 md:pl-64 ${settings.darkMode ? "bg-[#121212] text-white" : "bg-[#f4f7fe] text-slate-800"
            }`}>
            <ToastContainer position="top-right" theme={settings.darkMode ? "dark" : "colored"} />

            <div className="max-w-4xl mx-auto p-4 lg:p-10">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className={`text-3xl font-black tracking-tight flex items-center gap-2 ${settings.darkMode ? "text-white" : "text-slate-900"
                            }`}>
                            <MdNotificationsNone className="text-blue-600" /> Bildirishnomalar
                        </h1>
                        <p className={settings.darkMode ? "text-zinc-400" : "text-slate-500 font-medium"}>Admin Boshqaruv Paneli</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* FORM QISMI */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className={`p-6 rounded-[28px] shadow-sm border transition-all ${settings.darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200"
                            }`}>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className={`text-[11px] font-black uppercase tracking-widest ml-1 ${settings.darkMode ? "text-zinc-500" : "text-slate-400"
                                        }`}>Kimga yuboramiz?</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, targetGroup: 'talent' })}
                                            className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all border-2 cursor-pointer ${formData.targetGroup === 'talent'
                                                    ? 'border-blue-600 bg-blue-600/10 text-blue-600'
                                                    : (settings.darkMode ? 'border-zinc-800 bg-zinc-800 text-zinc-500' : 'border-slate-100 bg-slate-50 text-slate-400')
                                                }`}
                                        >
                                            <MdPerson size={20} /> Talentlar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, targetGroup: 'company' })}
                                            className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all border-2 cursor-pointer ${formData.targetGroup === 'company'
                                                    ? 'border-orange-500 bg-orange-500/10 text-orange-600'
                                                    : (settings.darkMode ? 'border-zinc-800 bg-zinc-800 text-zinc-500' : 'border-slate-100 bg-slate-50 text-slate-400')
                                                }`}
                                        >
                                            <MdBusiness size={20} /> Kompaniyalar
                                        </button>
                                    </div>
                                </div>

                                <div className={`flex p-1.5 rounded-2xl ${settings.darkMode ? "bg-zinc-800" : "bg-slate-100"}`}>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, sendMode: 'all' })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.sendMode === 'all'
                                                ? (settings.darkMode ? "bg-zinc-700 shadow-lg text-white" : "bg-white shadow-sm text-slate-900")
                                                : "text-slate-500"
                                            }`}
                                    >
                                        <MdGroups size={18} /> Barchasiga
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, sendMode: 'single' })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.sendMode === 'single'
                                                ? (settings.darkMode ? "bg-zinc-700 shadow-lg text-white" : "bg-white shadow-sm text-slate-900")
                                                : "text-slate-500"
                                            }`}
                                    >
                                        <MdPerson size={18} /> Bittasiga
                                    </button>
                                </div>

                                {formData.sendMode === 'single' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="relative">
                                            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Qidirish..."
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 ${settings.darkMode ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-200"
                                                    }`}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            size="5"
                                            value={formData.selectedId}
                                            onChange={(e) => setFormData({ ...formData, selectedId: e.target.value })}
                                            className={`w-full rounded-xl px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 overflow-y-auto cursor-pointer ${settings.darkMode ? "bg-zinc-900 border border-zinc-800 text-zinc-300" : "bg-white border-slate-200"
                                                }`}
                                        >
                                            {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                                <option key={u.id || u._id} value={u.id || u._id} className="p-2 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white">
                                                    {u.fullName || u.companyName || u.email}
                                                </option>
                                            )) : <option disabled>Topilmadi...</option>}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Xabar sarlavhasi"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className={`w-full rounded-2xl px-5 py-4 outline-none transition-colors border ${settings.darkMode ? "bg-zinc-800 border-zinc-700 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                                            }`}
                                        required
                                    />
                                    <textarea
                                        rows="4"
                                        placeholder="Xabar matni..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className={`w-full rounded-2xl px-5 py-4 outline-none transition-colors border resize-none ${settings.darkMode ? "bg-zinc-800 border-zinc-700 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:border-blue-500"
                                            }`}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className={`w-full py-4 rounded-2xl text-white font-black shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95 ${formData.targetGroup === 'talent'
                                            ? 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'
                                            : 'bg-orange-500 shadow-orange-500/20 hover:bg-orange-600'
                                        }`}
                                >
                                    {sending ? "Yuborilmoqda..." : "Yuborishni boshlash"} <MdSend />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* TARIX QISMI */}
                    <div className="lg:col-span-5 space-y-4">
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-2 ${settings.darkMode ? "text-zinc-500" : "text-slate-400"
                            }`}>
                            <MdCheckCircle className="text-green-500" /> Oxirgi yuborilganlar
                        </h3>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <div className={`p-10 rounded-[28px] text-center ${settings.darkMode ? "bg-zinc-900 text-zinc-500" : "bg-white text-slate-400"}`}>Yuklanmoqda...</div>
                            ) : notifications.length === 0 ? (
                                <div className={`p-10 rounded-[28px] text-center border border-dashed ${settings.darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-white border-slate-300 text-slate-400"
                                    }`}>Tarix bo'sh.</div>
                            ) : (
                                notifications.map((note) => (
                                    <div key={note.id || note._id} className={`p-4 rounded-2xl border transition-all group relative ${settings.darkMode ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-slate-100 shadow-sm hover:shadow-md"
                                        }`}>
                                        <div className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${note.talent_id
                                                    ? (settings.darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-500')
                                                    : (settings.darkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-500')
                                                }`}>
                                                <MdOutlineMessage size={20} />
                                            </div>
                                            <div className="pr-6">
                                                <h4 className={`font-bold text-sm leading-tight ${settings.darkMode ? "text-zinc-100" : "text-slate-800"}`}>{note.title}</h4>
                                                <p className={`text-xs mt-1 line-clamp-2 ${settings.darkMode ? "text-zinc-400" : "text-slate-500"}`}>{note.message}</p>
                                                <span className={`text-[9px] mt-2 block font-bold ${settings.darkMode ? "text-zinc-600" : "text-slate-400"}`}>
                                                    {new Date(note.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(note.id || note._id)}
                                            className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 hover:scale-120 transition-all cursor-pointer p-1"
                                        >
                                            <MdDeleteOutline size={22} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notification;