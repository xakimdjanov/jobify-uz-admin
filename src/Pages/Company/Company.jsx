import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../../services/api';
import { MapPin, Briefcase, Trash2, Eye, Loader2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await companyApi.getAll();
      const data = response?.data?.companies || response?.data?.data || response?.data || [];
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire('Xatolik', 'Ma’lumotlarni yuklab bo‘lmadi', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Ishonchingiz komilmi?',
      text: `"${name}" o'chirib tashlanadi!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Bekor qilish',
      confirmButtonText: 'Ha, o‘chirilsin!'
    });

    if (result.isConfirmed) {
      try {
        await companyApi.delete(id);
        setCompanies(prev => prev.filter(c => (c.id || c._id) !== id));
        Swal.fire('O‘chirildi!', '', 'success');
      } catch (error) {
        Swal.fire('Xatolik!', 'O‘chirish amalga oshmadi.', 'error');
      }
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
    </div>
  );

  return (
    <div className="p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Kompaniyalar</h1>
            <p className="text-slate-500 text-xs md:text-sm">Barcha ro'yxatga olingan tashkilotlar</p>
          </div>
          <div className="text-xs md:text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
            Jami: {companies.length}
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {companies.length === 0 ? (
            <div className="bg-white p-10 md:p-20 rounded-2xl md:rounded-3xl text-center border border-dashed border-gray-200">
              <AlertCircle className="mx-auto text-gray-300 w-10 h-10 md:w-12 md:h-12" />
              <p className="text-gray-400 mt-2 text-sm md:base">Ma'lumotlar topilmadi</p>
            </div>
          ) : (
            companies.map((company) => {
              const companyId = company.id || company._id;
              const companyName = company.company_name || company.name || "Nomsiz";

              return (
                <div
                  key={companyId}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-4 md:gap-6 group"
                >
                  {/* Logo - responsive sizing */}
                  <div className="w-14 h-14 min-[320px]:w-16 min-[320px]:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-teal-500 flex items-center justify-center shrink-0 text-white overflow-hidden shadow-sm">
                    {company.logo || company.profileimg_url ? (
                      <img src={company.logo || company.profileimg_url} className="w-full h-full object-cover" alt="logo" />
                    ) : (
                      <span className="text-xl md:text-2xl font-bold uppercase">{companyName[0]}</span>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 flex flex-col gap-1 text-center md:text-left w-full">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors truncate px-2 md:px-0">
                      {companyName}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest">
                        <Briefcase size={12} className="md:w-[14px]" />
                        {company.industry || "Soha yo'q"}
                      </span>
                    </div>
                  </div>

                  {/* Location Section - Hidden on very small if needed, or simplified */}
                  <div className="flex flex-col items-center md:items-end gap-1 shrink-0 w-full md:w-auto px-4 md:px-6 md:border-x border-gray-50 py-2 md:py-0">
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-600 font-semibold text-center">
                      <MapPin size={14} className="text-teal-500 md:w-[16px]" />
                      <span className="truncate max-w-[200px] md:max-w-none">
                        {company.location || company.city || company.country || "O'zbekiston"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Stacked on mobile */}
                  <div className="flex flex-row md:flex-row items-center gap-2 w-full md:w-auto justify-center mt-2 md:mt-0">
                    <button
                      onClick={() => navigate(`/company/${companyId}`)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white border border-gray-200 text-slate-700 rounded-lg md:rounded-xl text-xs md:text-sm font-bold hover:bg-teal-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <Eye size={16} className="md:w-[18px]" />
                      Batafsil
                    </button>
                    <button
                      onClick={() => handleDelete(companyId, companyName)}
                      className="p-2 md:p-2.5 text-red-500 bg-white border border-gray-200 rounded-lg md:rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95"
                    >
                      <Trash2 size={18} className="md:w-[20px]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Company;