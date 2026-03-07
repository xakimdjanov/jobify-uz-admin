import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobApi } from "../../services/api";
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
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-28 bg-gray-200 rounded"></div>
            <div className="h-2 w-20 bg-gray-100 rounded"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-32 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 bg-green-50 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </td>
    </tr>
  );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#163D5C]">
          Ish e'lonlari boshqaruvi
        </h1>
        <div className="text-sm text-gray-500 font-medium">
          Jami: <span className="text-[#163D5C]">{jobs.length} ta e'lon</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 border-b">Kompaniya</th>
                <th className="px-6 py-4 border-b">Lavozim</th>
                <th className="px-6 py-4 border-b">Maosh</th>
                <th className="px-6 py-4 border-b">Sana</th>
                <th className="px-6 py-4 border-b text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50/80 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-bold overflow-hidden border border-indigo-100">
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
                          <div className="text-sm font-bold text-gray-900">
                            {job.company?.company_name}
                          </div>
                          <div className="text-[11px] text-gray-500 uppercase tracking-tighter">
                            {job.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-semibold">
                        {job.occupation}
                      </div>
                      <div className="text-xs text-blue-800 font-medium">
                        {job.category || "Dasturlash"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blue-800 bg-green-50 px-2 py-1 rounded">
                        ${job.salary_min} - ${job.salary_max}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {job.createdAt
                        ? format(new Date(job.createdAt), "dd.MM.yyyy")
                        : "---"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                          title="Ko'rish"
                        >
                          <HiOutlineEye size={20} />
                        </Link>

                        <button
                          onClick={() => openDeleteModal(job.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <HiExclamation className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              E'lonni o'chirish
            </h3>
            <p className="text-sm text-center text-gray-500 mb-6">
              Ishonchingiz komilmi?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
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
