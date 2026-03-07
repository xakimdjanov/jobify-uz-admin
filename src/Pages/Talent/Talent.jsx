import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { talentApi } from "../../services/api";
import {
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineUserCircle,
  HiExclamation,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import toast from "react-hot-toast";

// Server bazaviy manzili
const BASE_URL = "https://jobify-backend-production-6a97.up.railway.app";
// Detail sahifangizdagi default avatar
const DEFAULT_AVATAR =
  "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

function Talents() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTalentId, setSelectedTalentId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const response = await talentApi.getAll();
      // Backend ma'lumot tuzilmasiga qarab tekshiramiz
      const data = response.data?.data || response.data || [];
      setTalents(data);
    } catch (err) {
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Rasmni serverdan yoki default holatda olish funksiyasi
  const getProfileImage = (talent) => {
    const rawUrl = talent.profileimg_url || talent.image || talent.profilePhoto;

    if (!rawUrl) return DEFAULT_AVATAR;
    if (rawUrl.startsWith("http")) return rawUrl;

    // Server path bo'lsa (masalan: /uploads/abc.jpg)
    return `${BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
  };

  const confirmDelete = async () => {
    if (!selectedTalentId) return;
    try {
      setIsDeleting(true);
      await talentApi.delete(selectedTalentId);
      toast.success("Talent muvaffaqiyatli o'chirildi");
      setTalents((prev) => prev.filter((t) => t.id !== selectedTalentId));
    } catch (err) {
      toast.error("O'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setSelectedTalentId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-800">
              {loading ? "..." : talents.length}
            </span>
            <span className="text-xl text-gray-500 font-medium">talents</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Talents name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Country
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Occupation
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!loading &&
                  talents.map((talent) => (
                    <tr
                      key={talent.id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-4xl overflow-hidden border-4 border-gray-100 bg-gray-50">
                            <img
                              src={getProfileImage(talent)}
                              alt="Profile"
                              className="w-full h-full object-cover grayscale  transition-all duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_AVATAR;
                              }}
                            />
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {talent.first_name} {talent.last_name}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <HiOutlineGlobeAlt
                            className="text-gray-400"
                            size={16}
                          />
                          {talent.country || "Uzbekistan"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-900 text-[10px] font-extrabold rounded uppercase tracking-widest border border-indigo-100">
                          {talent.occupation || "Technology"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800">
                          {formatPrice(
                            talent.salary_min || talent.minimum_salary,
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() => navigate(`/talent/${talent.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <HiOutlineEye size={20} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTalentId(talent.id);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
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

      {/* DELETE MODAL (Kodni qisqartirish uchun mantiqiy qismi qoldi) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center">
              <HiExclamation className="mx-auto text-red-600 mb-4" size={48} />
              <h3 className="text-lg font-bold mb-2">Talentni o'chirish</h3>
              <p className="text-sm text-gray-500 mb-6">
                Ushbu foydalanuvchini bazadan o'chirmoqchimisiz?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-xl font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold"
                >
                  {isDeleting ? "..." : "O'chirish"}
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
