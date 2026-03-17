// import React, { useState, useEffect } from "react";
// import { adminApi } from "../../services/api";
// import { useNavigate } from "react-router-dom";
// import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
// import { RiLoader4Line } from "react-icons/ri";
// import { useTheme } from "../../context/ThemeContext"; // ThemeContext ulandi

// const Login = () => {
//   const { settings } = useTheme(); // Dark mode holatini olish
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => setPageLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await adminApi.login(credentials);
//       const token = response.data?.token;
//       const adminData = response.data?.admin;

//       if (token) {
//         localStorage.setItem("token", token);
//         if (adminData) {
//           localStorage.setItem("adminUser", JSON.stringify(adminData));
//         }
//         navigate("/dashboard");
//       } else {
//         alert("Token topilmadi. Server javobini tekshiring.");
//       }
//     } catch (error) {
//       console.error("Xatolik:", error.response);
//       alert(error.response?.data?.message || "Email yoki parol xato!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (pageLoading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${settings.darkMode ? "bg-[#121212]" : "bg-gray-50"
//         }`}>
//         <div className="flex flex-col items-center gap-4">
//           <RiLoader4Line className={`w-12 h-12 animate-spin ${settings.darkMode ? "text-blue-500" : "text-[#163D5C]"
//             }`} />
//           <p className={`${settings.darkMode ? "text-gray-400" : "text-gray-500"} font-medium animate-pulse`}>
//             Yuklanmoqda...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen flex items-center justify-center px-4 font-sans w-screen transition-colors duration-300 ${settings.darkMode ? "bg-[#0f0f0f]" : "bg-[#F3F4F6]"
//       }`}>
//       <div className={`max-w-md w-full rounded-[2.5rem] shadow-2xl border p-8 md:p-12 relative overflow-hidden transition-all duration-300 ${settings.darkMode ? "bg-zinc-900 border-zinc-800 shadow-black/40" : "bg-white border-gray-100 shadow-gray-200"
//         }`}>
//         {/* Dekorativ element */}
//         <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${settings.darkMode ? "from-blue-600 to-indigo-600" : "from-[#163D5C] to-[#2a5e86]"
//           }`}></div>

//         <div className="mb-10 text-center">
//           <h2 className={`text-3xl font-extrabold tracking-tight transition-colors ${settings.darkMode ? "text-white" : "text-[#163D5C]"
//             }`}>Xush kelibsiz</h2>
//           <p className={`mt-2 text-sm transition-colors ${settings.darkMode ? "text-zinc-500" : "text-gray-400"
//             }`}>Jobify boshqaruv paneliga kiring</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email Input */}
//           <div className="space-y-2">
//             <label className={`text-[11px] uppercase tracking-widest font-bold ml-1 transition-colors ${settings.darkMode ? "text-zinc-500" : "text-gray-500"
//               }`}>
//               Email Manzil
//             </label>
//             <div className="relative group">
//               <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${settings.darkMode ? "text-zinc-600 group-focus-within:text-blue-500" : "text-gray-400 group-focus-within:text-[#163D5C]"
//                 }`}>
//                 <HiOutlineMail size={20} />
//               </div>
//               <input
//                 name="email"
//                 type="email"
//                 onChange={handleChange}
//                 placeholder="admin@jobify.uz"
//                 className={`w-full pl-11 pr-4 py-4 rounded-2xl border outline-none transition-all placeholder:text-gray-400 ${settings.darkMode
//                     ? "bg-zinc-800 border-zinc-700 text-white focus:bg-zinc-800/50 focus:border-blue-500 focus:ring-blue-500/10"
//                     : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-[#163D5C] focus:ring-[#163D5C]/5"
//                   }`}
//                 required
//               />
//             </div>
//           </div>

//           {/* Password Input */}
//           <div className="space-y-2">
//             <label className={`text-[11px] uppercase tracking-widest font-bold ml-1 transition-colors ${settings.darkMode ? "text-zinc-500" : "text-gray-500"
//               }`}>
//               Maxfiy Parol
//             </label>
//             <div className="relative group">
//               <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${settings.darkMode ? "text-zinc-600 group-focus-within:text-blue-500" : "text-gray-400 group-focus-within:text-[#163D5C]"
//                 }`}>
//                 <HiOutlineLockClosed size={20} />
//               </div>
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className={`w-full pl-11 pr-12 py-4 rounded-2xl border outline-none transition-all placeholder:text-gray-400 ${settings.darkMode
//                     ? "bg-zinc-800 border-zinc-700 text-white focus:bg-zinc-800/50 focus:border-blue-500 focus:ring-blue-500/10"
//                     : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-[#163D5C] focus:ring-[#163D5C]/5"
//                   }`}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors p-1 ${settings.darkMode ? "text-zinc-600 hover:text-blue-400" : "text-gray-400 hover:text-[#163D5C]"
//                   }`}
//               >
//                 {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
//               </button>
//             </div>
//           </div>

//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 ${settings.darkMode
//                   ? "bg-blue-600 shadow-blue-900/20 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600"
//                   : "bg-[#163D5C] shadow-[#163D5C]/20 hover:bg-[#1d4f75] disabled:bg-gray-300 disabled:text-gray-500"
//                 }`}
//             >
//               {loading ? (
//                 <>
//                   <RiLoader4Line className="animate-spin" size={20} />
//                   TEKSHIRILMOQDA...
//                 </>
//               ) : (
//                 "TIZIMGA KIRISH"
//               )}
//             </button>
//           </div>
//         </form>

//         <div className="mt-8 text-center">
//           <p className={`text-xs transition-colors ${settings.darkMode ? "text-zinc-600" : "text-gray-400"}`}>
//             &copy; {new Date().getFullYear()} Jobify. Barcha huquqlar himoyalangan.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;














import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff, HiShieldCheck } from "react-icons/hi";
import { RiLoader4Line, RiAlarmWarningFill } from "react-icons/ri";
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const { settings } = useTheme();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBlockStatus = () => {
      const blockUntil = localStorage.getItem("blockUntil");
      if (blockUntil) {
        const remainingTime = new Date(blockUntil) - new Date();
        if (remainingTime > 0) {
          navigate("/error-page");
        } else {
          localStorage.removeItem("blockUntil");
          localStorage.removeItem("loginAttempts");
        }
      }
    };

    checkBlockStatus();
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminApi.login(credentials);
      const token = response.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.removeItem("loginAttempts");
        navigate("/dashboard");
      }
    } catch (error) {
      let attempts = Number(localStorage.getItem("loginAttempts") || 0) + 1;
      localStorage.setItem("loginAttempts", attempts);

      if (attempts >= 2) {
        const blockTime = new Date(new Date().getTime() + 5 * 60000);
        localStorage.setItem("blockUntil", blockTime);
        navigate("/error-page");
      } else {
        // Bu yerda faqat Modal ochiladi, input ustidagi errorMsg bo'sh qoladi
        setShowModal(true);
        setErrorMsg(""); // Yozuvni olib tashladik
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${settings.darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
        <RiLoader4Line className={`w-12 h-12 animate-spin ${settings.darkMode ? "text-blue-500" : "text-[#163D5C]"}`} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 font-sans w-screen transition-all duration-500 ${settings.darkMode ? "bg-[#0f0f0f]" : "bg-[#F3F4F6]"}`}>

      {/* --- PREMIUM GLASS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Orqa fon shaffofligi */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"></div>

          {/* Modal Card */}
          <div className={`relative max-w-sm w-full rounded-[2.5rem] p-1 border overflow-hidden shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 ${settings.darkMode ? "bg-red-950/20 border-red-500/30" : "bg-white/80 border-red-200"
            }`}>
            <div className={`rounded-[2.3rem] p-8 ${settings.darkMode ? "bg-zinc-900/90" : "bg-white"}`}>
              <div className="flex flex-col items-center text-center">


                {/* Ikonka qismi */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/40">
                    <RiAlarmWarningFill size={40} className="text-white" />
                  </div>
                </div>

                <h3 className={`text-2xl font-black mb-3 tracking-tight ${settings.darkMode ? "text-white" : "text-gray-900"}`}>
                  Ogohlantirish!
                </h3>

                <p className={`text-[15px] leading-relaxed mb-8 px-2 ${settings.darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  Sizda faqat <span className="text-red-500 font-bold underline decoration-2">1 ta urinish</span> qoldi. Ma'lumotlarni qayta tekshirib kiritishingizni so'raymiz, yana noto'g'ri kiritilsa tizim <span className="font-bold text-red-500">5 daqiqaga</span> yopiladi.
                </p>

                <button
                  onClick={() => setShowModal(false)}
                  className="group relative w-full inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.95]"
                >
                  <HiShieldCheck className="mr-2 text-xl" />
                  TUSHUNDIM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ASOSIY LOGIN CARD --- */}
      <div className={`max-w-md w-full rounded-[2.5rem] shadow-2xl border p-8 md:p-12 relative overflow-hidden transition-all duration-300 ${settings.darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"
        }`}>
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${settings.darkMode ? "from-blue-600 to-indigo-600" : "from-[#163D5C] to-[#2a5e86]"}`}></div>

        <div className="mb-10 text-center">
          <h2 className={`text-3xl font-extrabold tracking-tight ${settings.darkMode ? "text-white" : "text-[#163D5C]"}`}>Xush kelibsiz</h2>
          <p className={`mt-2 text-sm ${settings.darkMode ? "text-zinc-500" : "text-gray-400"}`}>Xavfsiz boshqaruv paneliga kiring</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-sm flex items-center gap-3 animate-shake">
            <RiAlarmWarningFill className="text-lg" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={`text-[11px] uppercase tracking-widest font-bold ml-1 ${settings.darkMode ? "text-zinc-500" : "text-gray-500"}`}>Email Manzil</label>
            <div className="relative group">
              <HiOutlineMail size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${settings.darkMode ? "text-zinc-600 group-focus-within:text-blue-500" : "text-gray-400 group-focus-within:text-[#163D5C]"}`} />
              <input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="admin@jobify.uz"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${settings.darkMode ? "bg-zinc-800/50 border-zinc-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#163D5C]"}`}
                required
              />
            </div>
          </div>


          <div className="space-y-2">
            <label className={`text-[11px] uppercase tracking-widest font-bold ml-1 ${settings.darkMode ? "text-zinc-500" : "text-gray-500"}`}>Parol</label>
            <div className="relative group">
              <HiOutlineLockClosed size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${settings.darkMode ? "text-zinc-600 group-focus-within:text-blue-500" : "text-gray-400 group-focus-within:text-[#163D5C]"}`} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-4 rounded-2xl border outline-none transition-all ${settings.darkMode ? "bg-zinc-800/50 border-zinc-700 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#163D5C]"}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 ${settings.darkMode ? "text-zinc-600 hover:text-blue-400" : "text-gray-400 hover:text-[#163D5C]"}`}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${settings.darkMode ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" : "bg-[#163D5C] hover:bg-[#1d4f75] shadow-[#163D5C]/20"
              }`}
          >
            {loading ? <RiLoader4Line className="animate-spin text-xl" /> : "TIZIMGA KIRISH"}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-gray-500/10 pt-6">
          <p className={`text-[10px] tracking-widest uppercase ${settings.darkMode ? "text-zinc-600" : "text-gray-400"}`}>
            Jobify Security System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
