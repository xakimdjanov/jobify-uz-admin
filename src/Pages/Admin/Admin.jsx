import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { adminApi } from '../../services/api'; 
import { useTheme } from '../../context/ThemeContext';
import {
  HiOutlineTrash,
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineSearch,
  HiExclamation,
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiX,
  HiCamera,
  HiOutlineEye,
  HiOutlineEyeOff
} from "react-icons/hi";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { settings } = useTheme();
  const isDark = settings.darkMode;

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modallar va holatlar
  const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form holati
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    profileimg: null
  });

  // Adminlarni yuklash
  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAll();
      const data = response?.data || response || [];
      setAdmins(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Qidiruv
  const filteredAdmins = useMemo(() => {
    return admins.filter(a =>
      (a.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [admins, searchTerm]);

  // Modalni ochish
  const openModal = (type, admin = null) => {
    setModalType(type);
    setShowPassword(false); // Modal ochilganda ko'zni yopib qo'yamiz
    if (admin) {
      setSelectedAdmin(admin);
      setFormData({
        fullname: admin.fullname || '',
        email: admin.email || '',
        password: '',
        profileimg: null
      });
    } else {
      setFormData({ fullname: '', email: '', password: '', profileimg: null });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedAdmin(null);
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profileimg: e.target.files[0] }));
    }
  };

  // REGISTER & UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('fullname', formData.fullname);
    data.append('email', formData.email);
    if (formData.password) data.append('password', formData.password);
    if (formData.profileimg) data.append('profileimg', formData.profileimg);

    try {
      if (modalType === 'add') {
        await adminApi.register(data);
        toast.success("Yangi admin qo'shildi");
      } else {
        await adminApi.update(selectedAdmin.id, data);
        toast.success("Ma'lumotlar yangilandi");
      }
      fetchAdmins();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await adminApi.delete(selectedAdmin.id);
      setAdmins(prev => prev.filter(a => a.id !== selectedAdmin.id));
      toast.success("Admin o'chirildi");
      closeModal();
    } catch (error) {
      toast.error("O'chirishda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className={`flex h-screen items-center justify-center ${isDark ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-300 ${isDark ? 'bg-[#121212]' : 'bg-[#fcfcfc]'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Adminlar</h1>
            <span className="bg-indigo-600 text-white px-4 py-1 rounded-2xl text-xs font-black shadow-lg">{admins.length}</span>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <HiOutlineSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Ism yoki email..."
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 outline-none transition-all ${isDark ? 'bg-[#1a1c1e] border-gray-800 text-white focus:border-indigo-500' : 'bg-white border-gray-100 focus:border-indigo-400'}`}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => openModal('add')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl active:scale-95 transition-all"
            >
              <HiOutlinePlusCircle size={22} /> <span className="hidden md:inline">Qo'shish</span>
            </button>
          </div>
        </div>

        {/* ADMINS TABLE */}
        <div className={`rounded-[2rem] border overflow-hidden transition-all ${isDark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className={isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'}>
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-wider text-gray-400">Admin profili</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-wider text-gray-400">Elektron pochta</th>
                  <th className="px-8 py-5 text-center text-[11px] font-black uppercase tracking-wider text-gray-400">Amallar</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className={`transition-colors ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-indigo-50/30'}`}>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 overflow-hidden shadow-inner border border-white/10">
                          {admin.profileimg_url ? (
                            <img src={admin.profileimg_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <HiOutlineUserCircle size={48} className="text-indigo-300" />
                          )}
                        </div>
                        <span className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{admin.fullname}</span>
                      </div>
                    </td>
                    <td className={`px-8 py-4 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-2">
                        <HiOutlineMail className="opacity-50" /> {admin.email}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openModal('edit', admin)} className={`p-2.5 rounded-xl transition-all ${isDark ? 'text-blue-400 hover:bg-blue-400/10' : 'text-blue-600 hover:bg-blue-50'}`}>
                          <HiOutlinePencilAlt size={20} />
                        </button>
                        <button onClick={() => openModal('delete', admin)} className={`p-2.5 rounded-xl transition-all ${isDark ? 'text-red-400 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'}`}>
                          <HiOutlineTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className={`relative w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#1a1c1e] border border-gray-800 text-white' : 'bg-white'}`}>
            <button onClick={closeModal} className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-500/10 transition-colors"><HiX size={24}/></button>
            <h2 className="text-2xl font-black mb-8">{modalType === 'add' ? "Yangi admin qo'shish" : "Ma'lumotlarni tahrirlash"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-2 mb-6">
                <label className="relative cursor-pointer group">
                  <div className={`w-24 h-24 rounded-[2rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${isDark ? 'bg-[#121212] border-gray-700 group-hover:border-indigo-500' : 'bg-gray-50 border-gray-300 group-hover:border-indigo-400'}`}>
                    {formData.profileimg ? (
                      <img src={URL.createObjectURL(formData.profileimg)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <HiCamera size={32} className="text-gray-400 mx-auto" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Rasm</span>
                      </div>
                    )}
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>

              {/* Fullname */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-500 ml-1 mb-1 block tracking-widest">To'liq ism</label>
                <input required name="fullname" value={formData.fullname} onChange={handleInputChange} placeholder="Masalan: Ali Valiyev" className={`w-full p-4 rounded-2xl border-2 outline-none transition-all ${isDark ? 'bg-[#121212] border-gray-800 focus:border-indigo-500' : 'bg-gray-50 border-gray-100 focus:border-indigo-400'}`} />
              </div>
              
              {/* Email */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-500 ml-1 mb-1 block tracking-widest">Email manzil</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="admin@misol.uz" className={`w-full p-4 rounded-2xl border-2 outline-none transition-all ${isDark ? 'bg-[#121212] border-gray-800 focus:border-indigo-500' : 'bg-gray-50 border-gray-100 focus:border-indigo-400'}`} />
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <label className="text-[11px] font-black uppercase text-gray-500 ml-1 mb-1 block tracking-widest">Parol {modalType === 'edit' && "(yangilash uchun)"}</label>
                <div className="relative">
                  <input 
                    required={modalType === 'add'} 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    placeholder="••••••••"
                    className={`w-full p-4 rounded-2xl border-2 outline-none transition-all ${isDark ? 'bg-[#121212] border-gray-800 focus:border-indigo-500' : 'bg-gray-50 border-gray-100 focus:border-indigo-400'}`} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <HiOutlineEyeOff size={22} /> : <HiOutlineEye size={22} />}
                  </button>
                </div>
              </div>

              <button disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all mt-4">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (modalType === 'add' ? "Yaratish" : "Saqlash")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {modalType === 'delete' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-10 rounded-[2.5rem] text-center shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${isDark ? 'bg-[#1a1c1e] text-white' : 'bg-white'}`}>
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <HiExclamation size={48} />
            </div>
            <h3 className="text-2xl font-black mb-3">O'chirishni tasdiqlang</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">Rostdan ham <span className="font-black text-gray-800 dark:text-gray-200">"{selectedAdmin?.fullname}"</span>ni tizimdan butkul o'chirmoqchimisiz?</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDelete} 
                disabled={isSubmitting} 
                className="w-full py-4 font-black bg-red-600 text-white rounded-2xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                {isSubmitting ? "O'chirilmoqda..." : "Ha, o'chirilsin"}
              </button>
              <button 
                onClick={closeModal} 
                className={`w-full py-4 font-bold rounded-2xl transition-all ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;