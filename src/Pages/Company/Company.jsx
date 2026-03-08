import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../../services/api';
import {
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineSearch
} from "react-icons/hi";
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await companyApi.getAll();
      // API dan kelayotgan turli xil formatlarni tekshirish
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

  // --- TOGGLE VERIFIED (ANIQ ISHLAYDIGAN QISMI) ---
  const handleToggleVerified = async (id, currentStatus) => {
    if (updatingId) return; // Bir vaqtda bir nechta so'rov yubormaslik uchun

    try {
      setUpdatingId(id);

      // API ga yangi holatni yuboramiz (teskarisi)
      const newStatus = !currentStatus;
      await companyApi.update(id, { is_verified: newStatus });

      // State'ni darhol yangilaymiz
      setCompanies((prev) =>
        prev.map((c) =>
          (c.id || c._id) === id ? { ...c, is_verified: newStatus } : c
        )
      );

      toast.success(newStatus ? "Kompaniya faollashtirildi" : "Kompaniya bloklandi");
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Holatni o'zgartirishda xatolik yuz berdi");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Ishonchingiz komilmi?',
      text: `"${name}" o'chirib tashlanadi!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ha, o‘chirilsin!',
      cancelButtonText: 'Bekor qilish'
    });

    if (result.isConfirmed) {
      try {
        await companyApi.delete(id);
        setCompanies(prev => prev.filter(c => (c.id || c._id) !== id));
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (error) {
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  };

  const filteredCompanies = companies.filter(c =>
    (c.company_name || c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className=" min-h-screen p-3 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* HEADER SECTION - Responsive Gap & Direction */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center bg-slate-900 text-white text-lg sm:text-xl font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-lg min-w-[45px]">
              {filteredCompanies.length}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Kompaniyalar</h1>
          </div>

          {/* SEARCH - Full width on mobile */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Qidiruv..."
              className="block w-full pl-11 pr-4 py-2.5 sm:py-3 border-2 border-gray-100 rounded-xl sm:rounded-2xl bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE SECTION - Responsive Hidden columns */}
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-[320px]:table">
              <thead className="bg-gray-50 border-b border-gray-200 hidden sm:table-header-group">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Kompaniya</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Soha</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Manzil</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 block sm:table-row-group">
                {filteredCompanies.map((company) => {
                  const companyId = company.id || company._id;
                  const companyName = company.company_name || company.name || "Nomsiz";
                  const isVerified = company.is_verified || false;

                  return (
                    <tr key={companyId} className="hover:bg-gray-50/50 transition-colors group block sm:table-row p-4 sm:p-0">
                      {/* Name & Logo - Centered on very small mobile */}
                      <td className="sm:px-6 sm:py-4 block sm:table-cell mb-2 sm:mb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-indigo-50 overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center">
                            {company.logo || company.profileimg_url ? (
                              <img src={company.logo || company.profileimg_url} className="w-full h-full object-cover" alt="logo" />
                            ) : (
                              <HiOutlineOfficeBuilding className="text-indigo-500" size={20} />
                            )}
                          </div>
                          <div className="text-sm font-bold text-gray-900 truncate max-w-[180px] sm:max-w-[200px]">
                            {companyName}
                          </div>
                        </div>
                      </td>

                      {/* Industry - Hidden or inline on mobile */}
                      <td className="sm:px-6 sm:py-4 block sm:table-cell mb-2 sm:mb-0 ml-13 sm:ml-0">
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-blue-100">
                          {company.industry || "Soha yo'q"}
                        </span>
                      </td>

                      {/* Location - Inline with icon on mobile */}
                      <td className="sm:px-6 sm:py-4 block sm:table-cell mb-3 sm:mb-0 ml-13 sm:ml-0">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                          <HiOutlineLocationMarker className="text-gray-400" size={14} />
                          <span className="truncate">{company.location || company.city || "O'zbekiston"}</span>
                        </div>
                      </td>

                      {/* Actions - Flex on mobile */}
                      <td className="sm:px-6 sm:py-4 block sm:table-cell border-t sm:border-t-0 pt-3 sm:pt-0">
                        <div className="flex justify-between sm:justify-center items-center gap-2 sm:gap-4">

                          {/* TOGGLE SWITCH (Verified status) */}
                          <div className="flex items-center gap-2 sm:border-r border-gray-100 sm:pr-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase sm:hidden">Status:</span>
                            <button
                              onClick={() => handleToggleVerified(companyId, isVerified)}
                              disabled={updatingId === companyId}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isVerified ? "bg-indigo-600" : "bg-gray-200"
                                } ${updatingId === companyId ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isVerified ? "translate-x-4" : "translate-x-0"
                                  }`}
                              />
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/company/${companyId}`)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Ko'rish"
                            >
                              <HiOutlineEye size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(companyId, companyName)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="O'chirish"
                            >
                              <HiOutlineTrash size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredCompanies.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-gray-400 text-sm">Hech qanday kompaniya topilmadi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;