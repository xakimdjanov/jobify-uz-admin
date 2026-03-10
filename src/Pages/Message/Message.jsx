import React, { useState, useEffect } from "react";
import api, { contactApi } from "../../services/api";
import { AiOutlineDelete, AiOutlineExclamationCircle } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const AdminMessages = () => {
  const { settings } = useTheme();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactApi.getAll();
      if (response.data?.success) setMessages(response.data.data);
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getShortMessage = (text, limit = 120) => {
    if (!text || text.length <= limit) return text;
    const shortText = text.substring(0, text.lastIndexOf(" ", limit));
    return shortText || text.substring(0, limit);
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/contacts/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xabar o'chirildi");
      setMessages((prev) => prev.filter((msg) => msg.id !== deleteId));
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  // Loading holatida ham sahifa to'liq rangda bo'lishi uchun
  if (loading)
    return (
      <div className={`min-h-screen md:-ml-64 md:pl-64 flex items-center justify-center font-bold transition-colors duration-300 ${settings.darkMode ? "bg-[#121212] text-zinc-500" : "bg-[#F8F9FA] text-gray-400"
        }`}>
        <div className="animate-pulse">Yuklanmoqda...</div>
      </div>
    );

  return (
    /* ASOSIY CONTAINER: Sidebarning tagini oqartirish/qoraytirish uchun manfiy margin ishlatildi */
    <div className={`min-h-screen transition-colors duration-300 md:-ml-64 md:pl-64 ${settings.darkMode ? "bg-[#121212]" : "bg-[#F8F9FA]"
      }`}>

      {/* KONTENT QISMI */}
      <div className="p-4 md:p-10 w-full">
        <Toaster position="top-right" />

        <div className="mb-8">
          <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${settings.darkMode ? "text-white" : "text-gray-900"
            }`}>
            Xabarlar
          </h1>
          <p className={`text-sm mt-1 font-medium ${settings.darkMode ? "text-zinc-400" : "text-gray-500"
            }`}>
            Jami: <span className={settings.darkMode ? "text-blue-400" : "text-blue-600"}>{messages?.length || 0} ta</span>
          </p>
        </div>

        {/* ASOSIY JADVAL/KARTALAR BLOKI */}
        <div className={`rounded-[32px] shadow-sm border overflow-hidden transition-all duration-300 ${settings.darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"
          }`}>

          {/* MOBILE CARD VIEW */}
          <div className="block md:hidden divide-y divide-gray-50 dark:divide-zinc-800">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6">
                <div className="mb-4">
                  <div className={`font-bold text-lg ${settings.darkMode ? "text-zinc-100" : "text-gray-900"}`}>{msg.name}</div>
                  <div className={`text-sm ${settings.darkMode ? "text-blue-400" : "text-blue-500"}`}>{msg.email}</div>
                </div>
                <div className={`text-sm mb-6 leading-relaxed ${settings.darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                  {expandedIds.includes(msg.id) ? msg.message : getShortMessage(msg.message)}
                  {msg.message?.length > 120 && (
                    <button onClick={() => toggleExpand(msg.id)} className="text-blue-500 font-bold ml-1">
                      {expandedIds.includes(msg.id) ? " (yopish)" : "..."}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => openDeleteModal(msg.id)}
                  className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all ${settings.darkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-500"
                    }`}
                >
                  <AiOutlineDelete size={18} /> O'chirish
                </button>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b uppercase text-[11px] font-black tracking-widest ${settings.darkMode ? "bg-zinc-800/50 border-zinc-800 text-zinc-500" : "bg-gray-50/50 border-gray-100 text-gray-400"
                  }`}>
                  <th className="px-8 py-5">Foydalanuvchi</th>
                  <th className="px-8 py-5">Xabar</th>
                  <th className="px-8 py-5 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className={settings.darkMode ? "text-zinc-300" : "text-gray-700"}>
                {messages.map((msg) => {
                  const isExpanded = expandedIds.includes(msg.id);
                  return (
                    <tr key={msg.id} className={`border-b transition-colors ${settings.darkMode ? "border-zinc-800 hover:bg-zinc-800/30" : "border-gray-50 hover:bg-gray-50/30"
                      }`}>
                      <td className="px-8 py-6 align-top whitespace-nowrap">
                        <div className={`font-bold ${settings.darkMode ? "text-zinc-100" : "text-gray-900"}`}>{msg.name}</div>
                        <div className={`text-[13px] mt-0.5 ${settings.darkMode ? "text-blue-400" : "text-blue-500"}`}>{msg.email}</div>
                      </td>
                      <td className="px-8 py-6 align-top">
                        <div className="leading-relaxed max-w-2xl whitespace-pre-wrap">
                          {isExpanded ? msg.message : getShortMessage(msg.message)}
                          {msg.message?.length > 120 && (
                            <button onClick={() => toggleExpand(msg.id)} className="text-blue-500 font-bold ml-1 hover:underline">
                              {isExpanded ? " (yopish)" : "..."}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 align-top text-center">
                        <button
                          onClick={() => openDeleteModal(msg.id)}
                          className={`p-3 rounded-xl transition-all ${settings.darkMode ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/10" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                            }`}
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Loyiha dizayniga moslangan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className={`w-full md:w-[420px] p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 border ${settings.darkMode ? "bg-zinc-900 border-zinc-800 rounded-[40px]" : "bg-white border-gray-100 rounded-t-[40px] md:rounded-[40px]"
            }`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-1.5 rounded-full mb-8 md:hidden ${settings.darkMode ? "bg-zinc-700" : "bg-gray-200"}`}></div>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${settings.darkMode ? "bg-red-500/10 text-red-500" : "bg-red-50 text-red-500"
                }`}>
                <AiOutlineExclamationCircle size={48} />
              </div>
              <h2 className={`text-2xl font-black mb-3 tracking-tight ${settings.darkMode ? "text-white" : "text-gray-900"}`}>Ishonchingiz komilmi?</h2>
              <p className={`text-sm mb-10 px-4 leading-relaxed ${settings.darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                Ushbu xabarni tizimdan butunlay o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
              </p>
              <div className="flex flex-col md:flex-row w-full gap-4">
                <button onClick={confirmDelete} className={`w-full py-4.5 rounded-2xl font-bold order-1 md:order-2 active:scale-95 transition-transform ${settings.darkMode ? "bg-white text-black hover:bg-zinc-200" : "bg-gray-900 text-white hover:bg-black"
                  }`}>
                  O'chirish
                </button>
                <button onClick={() => setIsModalOpen(false)} className={`w-full py-4.5 rounded-2xl font-bold order-2 md:order-1 active:scale-95 transition-transform ${settings.darkMode ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;