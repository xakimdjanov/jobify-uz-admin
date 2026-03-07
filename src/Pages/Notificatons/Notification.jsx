import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { MdSend, MdDeleteOutline, MdNotificationsNone, MdOutlineMessage } from 'react-icons/md';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({ title: '', message: '' });

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            // Ma'lumotlarni oxirgisi birinchi ko'rinadigan qilib tartiblaymiz
            const sortedData = (res.data || []).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotifications(sortedData);
        } catch (error) {
            console.error("Yuklashda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.message.trim()) return;

        setSending(true);
        try {
            await api.post('/notifications', formData);
            setFormData({ title: '', message: '' });
            await fetchNotifications();
            alert("Bildirishnoma yuborildi!");
        } catch (error) {
            console.error("Yuborishda xatolik:", error);
            alert("Xatolik yuz berdi.");
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("O'chirmoqchimisiz?")) return;
        try {
            await api.delete(`/notifications/${id}`);
            // Ro'yxatdan o'chirishda id yoki _id ga qarab filter qilamiz
            setNotifications(prev => prev.filter(n => (n._id !== id && n.id !== id)));
        } catch (error) {
            console.error("O'chirishda xatolik:", error);
        }
    };

    return (
        <div className="min-h-screen p-4 lg:p-10 text-slate-900 bg-[#f8fafc]">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <MdNotificationsNone className="text-orange-500 text-3xl" /> Bildirishnomalar
                    </h1>
                    <p className="text-slate-500 font-medium">Foydalanuvchilarga xabar yuborish tizimi</p>
                </header>

                <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-200/60 mb-10">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <MdSend className="text-blue-500" /> Yangi xabar yozish
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Mavzu</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="Xabar sarlavhasi"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Xabar matni</label>
                            <textarea
                                rows="4"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                placeholder="Xabar matni..."
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {sending ? "Yuborilmoqda..." : "Barchaga yuborish"}
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Oxirgi yuborilganlar</h2>
                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Yuklanmoqda...</div>
                    ) : notifications.length === 0 ? (
                        <div className="bg-white p-10 rounded-3xl text-center text-slate-400 border border-dashed border-slate-300">
                            Hozircha xabarlar yo'q.
                        </div>
                    ) : (
                        notifications.map((note, index) => (
                            <div
                                key={note._id || note.id || `notif-${index}`}
                                className="bg-white p-5 rounded-[20px] border border-slate-200/60 flex justify-between items-start group hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                        <MdOutlineMessage size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800">{note.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{note.message}</p>
                                        <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                                            {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Hozirgina'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(note._id || note.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-4"
                                    title="O'chirish"
                                >
                                    <MdDeleteOutline size={22} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notification;