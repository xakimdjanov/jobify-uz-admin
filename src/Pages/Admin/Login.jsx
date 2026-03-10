import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { RiLoader4Line } from "react-icons/ri";
import { useTheme } from "../../context/ThemeContext"; // ThemeContext ulandi

const Login = () => {
  const { settings } = useTheme(); // Dark mode holatini olish
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminApi.login(credentials);
      const token = response.data?.token;
      const adminData = response.data?.admin;

      if (token) {
        localStorage.setItem("token", token);
        if (adminData) {
          localStorage.setItem("adminUser", JSON.stringify(adminData));
        }
        navigate("/dashboard");
      } else {
        alert("Token topilmadi. Server javobini tekshiring.");
      }
    } catch (error) {
      console.error("Xatolik:", error.response);
      alert(error.response?.data?.message || "Email yoki parol xato!");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${settings.darkMode ? "bg-[#121212]" : "bg-gray-50"
        }`}>
        <div className="flex flex-col items-center gap-4">
          <RiLoader4Line className={`w-12 h-12 animate-spin ${settings.darkMode ? "text-blue-500" : "text-[#163D5C]"
            }`} />
          <p className={`${settings.darkMode ? "text-gray-400" : "text-gray-500"} font-medium animate-pulse`}>
            Yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 font-sans w-screen transition-colors duration-300 ${settings.darkMode ? "bg-[#0f0f0f]" : "bg-[#F3F4F6]"
      }`}>
      <div className={`max-w-md w-full rounded-[2.5rem] shadow-2xl border p-8 md:p-12 relative overflow-hidden transition-all duration-300 ${settings.darkMode ? "bg-zinc-900 border-zinc-800 shadow-black/40" : "bg-white border-gray-100 shadow-gray-200"
        }`}>
        {/* Dekorativ element */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${settings.darkMode ? "from-blue-600 to-indigo-600" : "from-[#163D5C] to-[#2a5e86]"
          }`}></div>

        <div className="mb-10 text-center">
          <h2 className={`text-3xl font-extrabold tracking-tight transition-colors ${settings.darkMode ? "text-white" : "text-[#163D5C]"
            }`}>Xush kelibsiz</h2>
          <p className={`mt-2 text-sm transition-colors ${settings.darkMode ? "text-zinc-500" : "text-gray-400"
            }`}>Jobify boshqaruv paneliga kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className={`text-[11px] uppercase tracking-widest font-bold ml-1 transition-colors ${settings.darkMode ? "text-zinc-500" : "text-gray-500"
              }`}>
              Email Manzil
            </label>
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${settings.darkMode ? "text-zinc-600 group-focus-within:text-blue-500" : "text-gray-400 group-focus-within:text-[#163D5C]"
                }`}>
                <HiOutlineMail size={20} />
              </div>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="admin@jobify.uz"
                className={`w-full pl-11 pr-4 py-4 rounded-2xl border outline-none transition-all placeholder:text-gray-400 ${settings.darkMode
                    ? "bg-zinc-800 border-zinc-700 text-white focus:bg-zinc-800/50 focus:border-blue-500 focus:ring-blue-500/10"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-[#163D5C] focus:ring-[#163D5C]/5"
                  }`}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className={`text-[11px] uppercase tracking-widest font-bold ml-1 transition-colors ${settings.darkMode ? "text-zinc-500" : "text-gray-500"
              }`}>
              Maxfiy Parol
            </label>
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${settings.darkMode ? "text-zinc-600 group-focus-within:text-blue-500" : "text-gray-400 group-focus-within:text-[#163D5C]"
                }`}>
                <HiOutlineLockClosed size={20} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-4 rounded-2xl border outline-none transition-all placeholder:text-gray-400 ${settings.darkMode
                    ? "bg-zinc-800 border-zinc-700 text-white focus:bg-zinc-800/50 focus:border-blue-500 focus:ring-blue-500/10"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-[#163D5C] focus:ring-[#163D5C]/5"
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors p-1 ${settings.darkMode ? "text-zinc-600 hover:text-blue-400" : "text-gray-400 hover:text-[#163D5C]"
                  }`}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 ${settings.darkMode
                  ? "bg-blue-600 shadow-blue-900/20 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600"
                  : "bg-[#163D5C] shadow-[#163D5C]/20 hover:bg-[#1d4f75] disabled:bg-gray-300 disabled:text-gray-500"
                }`}
            >
              {loading ? (
                <>
                  <RiLoader4Line className="animate-spin" size={20} />
                  TEKSHIRILMOQDA...
                </>
              ) : (
                "TIZIMGA KIRISH"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className={`text-xs transition-colors ${settings.darkMode ? "text-zinc-600" : "text-gray-400"}`}>
            &copy; {new Date().getFullYear()} Jobify. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;