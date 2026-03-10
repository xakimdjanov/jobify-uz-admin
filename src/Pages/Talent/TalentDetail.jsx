import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { talenApi } from "../../services/api";
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";
import { IoStarSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const TalentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [talent, setTalent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- MODAL STATES ---
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [notifyForm, setNotifyForm] = useState({
    title: "",
    message: "",
    type: "job",
  });

  useEffect(() => {
    const fetchTalentDetail = async () => {
      setIsLoading(true);
      try {
        const res = await talenApi.getById(id);
        const data = res.data?.data || res.data;
        setTalent(data);

        setNotifyForm((prev) => ({
          ...prev,
          title: `${data.occupation || ""} - New Opportunity!`,
        }));
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    if (id) fetchTalentDetail();
  }, [id]);

  const handleSendAlert = async (e) => {
    e.preventDefault();
    const payload = {
      talent_id: Number(id),
      job_id: null,
      title: notifyForm.title || `Opportunity Alert`,
      message: notifyForm.message,
      type: notifyForm.type,
      is_read: false,
      sent_to_telegram: false,
    };

    try {
      const response = await axios.post(
        "https://jobify-backend-production-6a97.up.railway.app/api/notifications",
        payload
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(`Xabarnoma ${talent.first_name}ga yuborildi! 🎉`);
        setIsNotifyModalOpen(false);
        setNotifyForm({ ...notifyForm, message: "" });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Xabarnoma yuborishda xatolik"
      );
    }
  };

  const defaultAvatar =
    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

  const cardBg = "bg-white border-gray-50 shadow-sm";
  const btnPrimary = "bg-[#163D5C] hover:bg-[#163D5C]/90 text-white transition-all active:scale-95 shadow-sm";

  const DetailSkeleton = () => (
    <div className="max-w-5xl mx-auto px-4 mt-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={`rounded-[2rem] p-8 border ${cardBg}`}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[28px] bg-gray-200" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded-md w-1/2" />
                <div className="h-4 bg-gray-200 rounded-md w-1/3" />
                <div className="flex gap-4 mt-6">
                  <div className="h-10 bg-gray-100 rounded-lg w-24" />
                  <div className="h-10 bg-gray-100 rounded-lg w-24" />
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-50">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-9 w-20 bg-gray-100 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          <div className={`rounded-[2rem] p-8 border ${cardBg}`}>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className={`rounded-[2rem] p-8 border ${cardBg} space-y-6`}>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-100 rounded w-full" />
              <div className="h-10 bg-gray-100 rounded w-full" />
            </div>
            <div className="h-14 bg-gray-200 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFEFF] pb-20 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 pt-8">
          <div className="h-6 w-32 bg-gray-100 rounded" />
        </div>
        <DetailSkeleton />
      </div>
    );
  }

  if (!talent)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-bold">Talent not found.</p>
      </div>
    );

  const getSkillsArray = () => {
    const rawSkills = talent.skils || talent.skills;
    if (Array.isArray(rawSkills)) return rawSkills;
    try {
      return JSON.parse(rawSkills || "[]");
    } catch {
      return [];
    }
  };

  const skillsArray = getSkillsArray();
  const cleanPhone = String(talent.phone || talent.phone_number || "").replace(/[^\d+]/g, "");

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-[#1A1C21] font-gilroy pb-20 transition-colors duration-300">
      <Toaster position="top-center" />

      {/* --- NOTIFY MODAL --- */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsNotifyModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClose size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#343C44]">
              <FiSend className="text-[#163D5C]" /> Send Alert
            </h2>
            <form onSubmit={handleSendAlert} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notification Title (Occupation include)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163D5C] transition-all"
                  value={notifyForm.title}
                  onChange={(e) => setNotifyForm({ ...notifyForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Message
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNotifyForm({
                        ...notifyForm,
                        message: `Hello! We saw your profile and it matches our ${talent.occupation} position. We would like to invite you for an interview.`,
                      })
                    }
                    className="text-[10px] px-2 py-1 rounded-md transition-colors border bg-green-50 text-blue-950 border-green-100 hover:bg-green-100"
                  >
                    + Use Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifyForm({ ...notifyForm, message: "" })}
                    className="text-[10px] px-2 py-1 rounded-md transition-colors border bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
                  >
                    Clear
                  </button>
                </div>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#163D5C] resize-none transition-all"
                  placeholder={`Hello! We saw your profile and it matches our ${talent.occupation} position...`}
                  value={notifyForm.message}
                  onChange={(e) => setNotifyForm({ ...notifyForm, message: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className={`${btnPrimary} w-full py-4 rounded-2xl font-bold text-lg`}
              >
                Send for {talent.occupation} position
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CONTACTS MODAL --- */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-[2.5rem] p-8 max-sm:p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <MdClose size={24} />
            </button>
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 bg-blue-50">
                <HiOutlinePhone className="text-4xl text-[#1D3D54]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A1C21]">Contacts</h2>
            </div>
            <div className="space-y-4">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-4 p-4 rounded-2xl border bg-gray-50 hover:bg-gray-100 border-gray-100 transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors bg-white group-hover:bg-green-50">
                  <HiOutlinePhone className="text-xl text-blue-950" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                  <p className="text-sm font-bold truncate text-[#1D3D54]">
                    {talent.phone || talent.phone_number || "Not available"}
                  </p>
                </div>
              </a>
              <a
                href={`mailto:${talent.email || ""}`}
                className="flex items-center gap-4 p-4 rounded-2xl border bg-gray-50 hover:bg-gray-100 border-gray-100 transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors bg-white group-hover:bg-blue-50">
                  <HiOutlineMail className="text-xl text-blue-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                  <p className="text-sm font-bold truncate text-[#1D3D54]">
                    {talent.email || "Send Email"}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER NAV --- */}
      <div className="max-w-5xl mx-auto px-4 pt-8 mb-8">
        <div className="flex items-center justify-between p-3 rounded-[1.5rem] shadow-sm border bg-white border-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2 font-bold text-xl hover:text-[#163D5C] transition-colors text-[#343C44]"
          >
            <ArrowLeft size={24} />
            Back
          </button>
          <button
            onClick={() => setIsNotifyModalOpen(true)}
            className={`${btnPrimary} px-8 py-3 rounded-2xl font-bold`}
          >
            Send Alert
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className={`rounded-[2rem] p-8 border ${cardBg}`}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative">
                  <img
                    src={talent.image || talent.profilePhoto || defaultAvatar}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-[28px] object-cover ring-8 ring-gray-50"
                    alt="Profile"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold tracking-tight text-[#1A1C21]">
                    {talent.first_name} {talent.last_name}
                  </h1>
                  <p className="font-bold text-sm mt-2 tracking-wide uppercase text-[#163D5C]">
                    {talent.occupation} • {talent.specialty}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-5 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                      <HiOutlineLocationMarker className="text-lg text-gray-400" />
                      {talent.city}, {talent.country}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                      <HiOutlineBriefcase className="text-lg text-gray-400" />
                      {talent.workplace_type || "Remote"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-700">
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skillsArray.length > 0 ? (
                    skillsArray.map((skillObj, i) => {
                      const name = typeof skillObj === "object" ? skillObj.skill || skillObj.name : skillObj;
                      const years = typeof skillObj === "object" ? skillObj.experience_years : null;

                      return (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex flex-col items-start bg-green-50 text-blue-950 border-green-100"
                        >
                          <span>{name}</span>
                          {years && (
                            <span className="text-[10px] opacity-70 font-medium text-gray-500">
                              {years}
                            </span>
                          )}
                        </span>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 italic">No skills specified</p>
                  )}
                </div>
              </div>
            </div>

            <div className={`rounded-[2rem] p-8 border ${cardBg}`}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-700">
                About
              </h3>
              <p className="leading-relaxed text-gray-500">
                {talent.bio || `${talent.first_name} is a highly skilled specialist.`}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className={`rounded-[2rem] p-8 border sticky top-8 ${cardBg}`}>
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-400">Expected Salary</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-[#101828]">
                    ${talent.minimum_salary?.toLocaleString()}
                  </span>
                  <span className="font-medium text-gray-400">/month</span>
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Employment</span>
                  <span className="font-semibold text-sm">{talent.work_type || "Contract"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Rating</span>
                  <span className="font-semibold text-sm flex items-center gap-1 text-[#163D5C]">
                    <IoStarSharp /> 4.8
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="font-semibold text-sm">{talent.city || "—"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="w-full py-4 border-2 border-[#163D5C] text-[#163D5C] font-bold rounded-2xl text-sm transition-colors hover:bg-green-50 active:scale-95"
                >
                  Send Alert
                </button>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full py-4 border-2 border-[#1D3D54] text-[#1D3D54] font-bold rounded-2xl text-sm transition-colors hover:bg-[#1D3D54] hover:text-white active:scale-95"
                >
                  Contacts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDetail;