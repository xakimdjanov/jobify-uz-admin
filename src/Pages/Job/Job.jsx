import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobApi } from "../../services/api";
import { useTheme } from "../../context/ThemeContext"; // ThemeContext qo'shildi
import { format } from "date-fns";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineEye,
  HiExclamation,
} from "react-icons/hi";
import toast from "react-hot-toast";

function Job() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { settings } = useTheme(); // Dark mode holati
  const isDark = settings.darkMode;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobApi.getAll();
      setJobs(response.data || []);
    } catch (err) {
      console.error("Jobs yuklashda xatolik:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        toast.error("Sessiya muddati tugadi, qayta kiring");
        navigate("/admin/login");
      } else {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
        toast.error("Ma'lumotlarni olib bo'lmadi");
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedJobId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedJobId) return;
    try {
      setIsDeleting(true);
      await jobApi.delete(selectedJobId);
      toast.success("E'lon muvaffaqiyatli o'chirildi");
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== selectedJobId));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
      toast.error("O'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setSelectedJobId(null);
    }
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
          <div className="flex flex-col gap-2">
            <div className={`h-3 w-28 rounded ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
            <div className={`h-2 w-20 rounded ${isDark ? "bg-gray-700" : "bg-gray-100"}`}></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={`h-3 w-32 rounded ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
      </td>
      <td className="px-6 py-4">
        <div className={`h-4 w-24 rounded ${isDark ? "bg-gray-800" : "bg-green-50"}`}></div>
      </td>
      <td className="px-6 py-4">
        <div className={`h-3 w-20 rounded ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-8 h-8 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}></div>
          ))}
        </div>
      </td>
    </tr>
  );

  if (error)
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${isDark ? "bg-[#121212]" : ""}`}>
        <HiExclamation size={48} className="text-red-400 mb-4" />
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button
          onClick={fetchJobs}
          className="px-6 py-2 bg-[#163D5C] text-white rounded-lg hover:bg-[#1d4f75] transition-all cursor-pointer shadow-md active:scale-95"
        >
          Qayta urinish
        </button>
      </div>
    );

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${isDark ? "bg-[#121212]" : "bg-gray-50"}`}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#163D5C]"}`}>
          Ish e'lonlari boshqaruvi
        </h1>
        <div className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Jami: <span className={isDark ? "text-blue-400" : "text-[#163D5C]"}>{jobs.length} ta e'lon</span>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto rounded-xl shadow-sm border overflow-hidden transition-all ${isDark ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className={`${isDark ? "bg-[#252525] text-gray-400" : "bg-gray-50 text-gray-600"} uppercase text-[11px] tracking-wider font-bold`}>
              <tr>
                <th className={`px-6 py-4 border-b ${isDark ? "border-gray-800" : ""}`}>Kompaniya</th>
                <th className={`px-6 py-4 border-b ${isDark ? "border-gray-800" : ""}`}>Lavozim</th>
                <th className={`px-6 py-4 border-b ${isDark ? "border-gray-800" : ""}`}>Maosh</th>
                <th className={`px-6 py-4 border-b ${isDark ? "border-gray-800" : ""}`}>Sana</th>
                <th className={`px-6 py-4 border-b text-center ${isDark ? "border-gray-800" : ""}`}>Amallar</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
              {loading ? (
                [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className={`transition-all duration-200 ${isDark ? "hover:bg-[#252525]/50" : "hover:bg-gray-50/80"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden border ${isDark ? "bg-gray-800 border-gray-700 text-blue-400" : "bg-indigo-50 border-indigo-100 text-indigo-700"}`}>
                          {job.company?.profileimg_url ? (
                            <img
                              src={job.company.profileimg_url}
                              alt="logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            job.company?.company_name
                              ?.substring(0, 2)
                              .toUpperCase() || "TC"
                          )}
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                            {job.company?.company_name}
                          </div>
                          <div className={`text-[11px] uppercase tracking-tighter ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                            {job.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-900"}`}>
                        {job.occupation}
                      </div>
                      <div className={`text-xs font-medium ${isDark ? "text-blue-400" : "text-blue-800"}`}>
                        {job.category || "Dasturlash"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold px-2 py-1 rounded ${isDark ? "bg-green-900/20 text-green-400" : "text-blue-800 bg-green-50"}`}>
                        ${job.salary_min} - ${job.salary_max}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      {job.createdAt
                        ? format(new Date(job.createdAt), "dd.MM.yyyy")
                        : "---"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <Link
                          to={`/jobs/${job.id}`}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${isDark ? "text-gray-500 hover:text-blue-400 hover:bg-blue-400/10" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
                          title="Ko'rish"
                        >
                          <HiOutlineEye size={20} />
                        </Link>

                        <button
                          onClick={() => openDeleteModal(job.id)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${isDark ? "text-gray-500 hover:text-red-400 hover:bg-red-400/10" : "text-gray-400 hover:text-red-600 hover:bg-red-50"}`}
                          title="O'chirish"
                        >
                          <HiOutlineTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    <span className="text-lg font-medium">
                      Hozircha e'lonlar yo'q
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DELETE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
          <div className={`rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in duration-200 ${isDark ? "bg-[#1E1E1E] border border-gray-800" : "bg-white"}`}>
            <div className={`flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4 ${isDark ? "bg-red-900/20" : "bg-red-100"}`}>
              <HiExclamation className="text-red-600" size={24} />
            </div>
            <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              E'lonni o'chirish
            </h3>
            <p className={`text-sm text-center mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Ishonchingiz komilmi?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`flex-1 px-4 py-2.5 text-sm font-bold border rounded-xl transition-colors cursor-pointer ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
              >
                {isDeleting ? "..." : "O'chirilsin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Job;