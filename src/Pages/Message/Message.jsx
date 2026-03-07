import React, { useState, useEffect } from "react";
import { contactApi } from "../../services/api"; //
import { AiOutlineDelete } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactApi.getAll(); //
      if (response.data && response.data.success) {
        setMessages(response.data.data); //
      }
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // So'zlarni buzmasdan kesish uchun yordamchi funksiya
  const getShortMessage = (text, limit = 120) => {
    if (!text || text.length <= limit) return text;
    // Limitdan keyingi birinchi bo'sh joygacha bo'lgan qismini olamiz
    const shortText = text.substring(0, text.lastIndexOf(' ', limit));
    return shortText || text.substring(0, limit);
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Yuklanmoqda...</div>;

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen font-sans">
      <Toaster />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Messages</h1>
        <p className="text-sm text-gray-500">
          Jami kelgan xabarlar: {messages?.length || 0} ta
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 uppercase text-[12px] text-gray-400 tracking-wider">
              <th className="px-6 py-4 font-semibold w-[25%]">USER INFO</th>
              <th className="px-6 py-4 font-semibold w-[65%]">MESSAGE</th>
              <th className="px-6 py-4 font-semibold text-center w-[10%]">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {messages && messages.length > 0 ? (
              messages.map((msg) => {
                const isExpanded = expandedIds.includes(msg.id);
                const isLong = msg.message?.length > 120;

                return (
                  <tr key={msg.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-gray-900 leading-tight">{msg.name}</div>
                      <div className="text-[13px] text-blue-500 mt-1">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-gray-600 leading-relaxed">
                      <div className="relative">
                        <span className="whitespace-pre-wrap">
                          {isExpanded ? msg.message : getShortMessage(msg.message)}
                        </span>
                        
                        {isLong && (
                          <button 
                            onClick={() => toggleExpand(msg.id)}
                            className="text-blue-600 font-bold hover:underline ml-1 focus:outline-none cursor-pointer inline-block"
                          >
                            {isExpanded ? " (yopish)" : "..."}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-center">
                      <button 
                        className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer"
                      >
                        <AiOutlineDelete size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-gray-400">Xabarlar mavjud emas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMessages;