import React, { useState, useEffect } from "react";
import api, { contactApi } from "../../services/api"; 
import { AiOutlineDelete, AiOutlineExclamationCircle } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";

const AdminMessages = () => {
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

  useEffect(() => { fetchMessages(); }, []);

  const getShortMessage = (text, limit = 120) => {
    if (!text || text.length <= limit) return text;
    const shortText = text.substring(0, text.lastIndexOf(' ', limit));
    return shortText || text.substring(0, limit);
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/contacts/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Xabar o'chirildi");
      setMessages(prev => prev.filter(msg => msg.id !== deleteId));
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400 font-bold">Yuklanmoqda...</div>;

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FA] min-h-screen font-sans">
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-tight">Xabarlar</h1>
        <p className="text-sm text-gray-500">Jami: {messages?.length || 0} ta</p>
      </div>

      {/* MOBIL UCHUN (CARD DESIGN) - 350px va undan kichik ekranlarda ko'rinadi */}
      <div className="block md:hidden space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-3">
              <div className="font-bold text-gray-900 break-words">{msg.name}</div>
              <div className="text-xs text-blue-500 break-all">{msg.email}</div>
            </div>
            <div className="text-sm text-gray-700 mb-4 break-words whitespace-pre-wrap leading-relaxed">
              {expandedIds.includes(msg.id) ? msg.message : getShortMessage(msg.message)}
              {msg.message?.length > 120 && (
                <button onClick={() => toggleExpand(msg.id)} className="text-blue-600 font-bold ml-1">
                  {expandedIds.includes(msg.id) ? " (yopish)" : "..."}
                </button>
              )}
            </div>
            <button 
              onClick={() => openDeleteModal(msg.id)}
              className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <AiOutlineDelete size={18} /> O'chirish
            </button>
          </div>
        ))}
      </div>

      {/* KOMPYUTER UCHUN (TABLE) - md ekrandan boshlab ko'rinadi */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 uppercase text-[11px] text-gray-400 font-black bg-gray-50/30">
              <th className="px-6 py-4 w-[25%]">Foydalanuvchi</th>
              <th className="px-6 py-4 w-[65%]">Xabar</th>
              <th className="px-6 py-4 text-center w-[10%]">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-[14px]">
            {messages.map((msg) => {
              const isExpanded = expandedIds.includes(msg.id);
              return (
                <tr key={msg.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 align-top">
                    <div className="font-bold text-gray-900 break-words">{msg.name}</div>
                    <div className="text-[13px] text-blue-500 mt-1 break-all">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="break-words whitespace-pre-wrap">
                      {isExpanded ? msg.message : getShortMessage(msg.message)}
                      {msg.message?.length > 120 && (
                        <button onClick={() => toggleExpand(msg.id)} className="text-blue-600 font-bold ml-1 cursor-pointer">
                          {isExpanded ? " (yopish)" : "..."}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    <button onClick={() => openDeleteModal(msg.id)} className="p-2.5 text-gray-400 hover:text-red-500 transition-all">
                      <AiOutlineDelete size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- RESPONSIVE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-t-[32px] md:rounded-[40px] w-full md:w-[380px] p-8 md:p-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-1 bg-gray-200 rounded-full mb-6 md:hidden"></div>
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AiOutlineExclamationCircle size={40} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Ishonchingiz komilmi?</h2>
              <p className="text-gray-500 text-sm mb-8">Ushbu xabar butunlay o'chirib tashlanadi.</p>
              <div className="flex flex-col md:flex-row w-full gap-3">
                <button onClick={confirmDelete} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold order-1 md:order-2 active:scale-95">O'chirish</button>
                <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold order-2 md:order-1 active:scale-95">Bekor qilish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;