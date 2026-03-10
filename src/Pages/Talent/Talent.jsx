import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { talentApi } from "../../services/api";
import { useTheme } from "../../context/ThemeContext"; // Context ulandi
import {
  HiOutlineEye,
  HiOutlineTrash,
  HiExclamation,
  HiOutlineGlobeAlt,
  HiOutlineSearch,
} from "react-icons/hi";
import toast from "react-hot-toast";

const BASE_URL = "https://jobify-backend-production-6a97.up.railway.app";
const DEFAULT_AVATAR =
  "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

function Talents() {
  const { settings } = useTheme(); // Dark mode holati
  const isDark = settings.darkMode;

  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTalentId, setSelectedTalentId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const response = await talentApi.getAll();
      const data = response.data?.data || response.data || [];
      setTalents(data);
    } catch (err) {
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      const fullName = `${talent.first_name} ${talent.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [talents, searchTerm]);

  const handleToggleVerified = async (talentId, currentStatus) => {
    try {
      setUpdatingId(talentId);
      await talentApi.update(talentId, { is_verified: !currentStatus });

      setTalents((prev) =>
        prev.map((t) =>
          t.id === talentId ? { ...t, is_verified: !currentStatus } : t,
        ),
      );
      toast.success(!currentStatus ? "Active qilindi" : "Noactive qilindi");
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setUpdatingId(null);
    }
  };

  const getProfileImage = (talent) => {
    const rawUrl = talent.profileimg_url || talent.image || talent.profilePhoto;
    if (!rawUrl) return DEFAULT_AVATAR;
    if (rawUrl.startsWith("http")) return rawUrl;
    return `${BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
  };

  const confirmDelete = async () => {
    if (!selectedTalentId) return;
    try {
      setIsDeleting(true);
      await talentApi.delete(selectedTalentId);
      toast.success("Talent o'chirildi");
      setTalents((prev) => prev.filter((t) => t.id !== selectedTalentId));
    } catch (err) {
      toast.error("O'chirishda xatolik");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setSelectedTalentId(null);
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-300 ${isDark ? 'bg-[#121212]' : 'bg-[#fcfcfc]'}`}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center justify-center text-white text-xl font-black px-4 py-1.5 rounded-2xl shadow-lg min-w-[50px] animate-in slide-in-from-left duration-500 ${isDark ? 'bg-indigo-600 shadow-indigo-900/20' : 'bg-blue-950 shadow-indigo-200'}`}>
                {loading ? "..." : filteredTalents.length}
              </span>

              <div className="flex flex-col">
                <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  Talentlar
                </h1>
              </div>
            </div>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch
                className={`${isDark ? 'text-gray-500' : 'text-gray-400'} group-focus-within:text-indigo-500 transition-colors`}
                size={20}
              />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              className={`block w-full pl-11 pr-4 py-3 border-2 rounded-2xl outline-none text-sm transition-all shadow-sm ${isDark
                  ? 'bg-[#1a1c1e] border-gray-800 text-gray-200 focus:border-indigo-500 placeholder:text-gray-600'
                  : 'bg-white border-gray-100 text-gray-900 focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 placeholder:text-gray-400'
                }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className={`border rounded-xl shadow-sm overflow-hidden transition-all ${isDark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className={`${isDark ? 'bg-gray-800/50 border-b border-gray-800' : 'bg-gray-50 border-b border-gray-200'}`}>
                <tr>
                  <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Talentlar
                  </th>
                  <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Shahar
                  </th>
                  <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Kasb
                  </th>
                  <th className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                {!loading &&
                  filteredTalents.map((talent) => (
                    <tr
                      key={talent.id}
                      className={`transition-colors group ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50/50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-full overflow-hidden border-2 shrink-0 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                            <img
                              src={getProfileImage(talent)}
                              alt="Profile"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className={`text-sm font-bold truncate max-w-[150px] ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                            {talent.first_name} {talent.last_name}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <HiOutlineGlobeAlt className={isDark ? 'text-gray-600' : 'text-gray-400'} size={16} />
                          {talent.country || "Uzbekistan"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border ${isDark
                            ? 'bg-indigo-900/20 text-indigo-400 border-indigo-900/30'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          }`}>
                          {talent.occupation || "Technology"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                          <div className={`flex items-center gap-2 border-r pr-4 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                            <button
                              onClick={() => handleToggleVerified(talent.id, talent.is_verified)}
                              disabled={updatingId === talent.id}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${talent.is_verified
                                  ? (isDark ? "bg-indigo-600" : "bg-[#1D3D54]")
                                  : (isDark ? "bg-gray-700" : "bg-gray-200")
                                } ${updatingId === talent.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${talent.is_verified ? "translate-x-4" : "translate-x-0"
                                  }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/talent/${talent.id}`)}
                              className={`p-2 rounded-lg transition-all cursor-pointer active:scale-90 ${isDark ? 'text-gray-500 hover:text-blue-400 hover:bg-blue-400/10' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                              title="View"
                            >
                              <HiOutlineEye size={20} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTalentId(talent.id);
                                setIsModalOpen(true);
                              }}
                              className={`p-2 rounded-lg transition-all cursor-pointer active:scale-90 ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                              title="Delete"
                            >
                              <HiOutlineTrash size={20} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* NO RESULTS */}
            {!loading && filteredTalents.length === 0 && (
              <div className={`py-12 text-center text-sm ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                No talents found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in duration-200 border ${isDark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-transparent'}`}>
            <div className="text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <HiExclamation className="text-red-600" size={32} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Delete Talent
              </h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Ushbu foydalanuvchini o'chirmoqchimisiz?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 px-4 py-2.5 border rounded-xl font-bold cursor-pointer active:scale-95 transition-colors ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? "..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Talents;