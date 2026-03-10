import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../../services/api';
import {
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiExclamation
} from "react-icons/hi";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  
  // Modal uchun statelar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await companyApi.getAll();
      const data = response?.data?.companies || response?.data?.data || response?.data || [];
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c =>
      (c.company_name || c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const handleToggleVerified = async (id, currentStatus) => {
    if (updatingId) return;
    try {
      setUpdatingId(id);
      const newStatus = !currentStatus;
      await companyApi.update(id, { is_verified: newStatus });
      setCompanies((prev) =>
        prev.map((c) => (c.id || c._id) === id ? { ...c, is_verified: newStatus } : c)
      );
      toast.success(newStatus ? "Kompaniya faollashtirildi" : "Kompaniya bloklandi");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setUpdatingId(null);
    }
  };

  // O'chirishni tasdiqlash funksiyasi
  const confirmDelete = async () => {
    if (!selectedCompany) return;
    try {
      setIsDeleting(true);
      await companyApi.delete(selectedCompany.id);
      setCompanies(prev => prev.filter(c => (c.id || c._id) !== selectedCompany.id));
      toast.success("Muvaffaqiyatli o'chirildi");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleting(false);
      setSelectedCompany(null);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center bg-slate-900 text-white text-xl font-black px-4 py-1.5 rounded-2xl shadow-lg min-w-[50px]">
              {filteredCompanies.length}
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Kompaniyalar</h1>
          </div>

          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Kompaniya nomi..."
              className="block w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-2xl bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400">Kompaniya</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400">Soha</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400">Manzil</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCompanies.map((company) => {
                  const companyId = company.id || company._id;
                  const companyName = company.company_name || company.name || "Nomsiz";
                  const isVerified = company.is_verified || false;

                  return (
                    <tr key={companyId} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 overflow-hidden border border-gray-100 flex items-center justify-center">
                            {company.logo || company.profileimg_url ? (
                              <img src={company.logo || company.profileimg_url} className="w-full h-full object-cover" alt="logo" />
                            ) : (
                              <HiOutlineOfficeBuilding className="text-indigo-500" size={20} />
                            )}
                          </div>
                          <div className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{companyName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase border border-blue-100">
                          {company.industry || "Soha yo'q"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <HiOutlineLocationMarker className="text-gray-400" size={16} />
                          <span className="truncate">{company.location || company.city || "O'zbekiston"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                          <button
                            onClick={() => handleToggleVerified(companyId, isVerified)}
                            disabled={updatingId === companyId}
                            className={`relative inline-flex h-5 w-9 rounded-full border-2 border-transparent transition-colors ${isVerified ? "bg-indigo-600" : "bg-gray-200"}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isVerified ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                          <div className="flex items-center gap-1">
                            <button onClick={() => navigate(`/company/${companyId}`)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><HiOutlineEye size={20} /></button>
                            <button 
                              onClick={() => {
                                setSelectedCompany({ id: companyId, name: companyName });
                                setIsModalOpen(true);
                              }} 
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <HiOutlineTrash size={20} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CUSTOM DELETE MODAL (ANIMATSIYASIZ) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiExclamation className="text-red-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">O'chirishni tasdiqlang</h3>
              <p className="text-sm text-gray-500 mb-6">
                Rostdan ham <span className="font-bold text-gray-700">"{selectedCompany?.name}"</span> kompaniyasini o'chirib tashlamoqchimisiz?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;