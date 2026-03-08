import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { RiLoader4Line } from "react-icons/ri";

const Login = () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RiLoader4Line className="w-12 h-12 text-[#163D5C] animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] px-4 font-sans w-screen">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
        {/* Dekorativ element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#163D5C] to-[#2a5e86]"></div>

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-[#163D5C] tracking-tight">Xush kelibsiz</h2>
          <p className="text-gray-400 mt-2 text-sm">Jobify boshqaruv paneliga kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 ml-1">
              Email Manzil
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#163D5C] transition-colors">
                <HiOutlineMail size={20} />
              </div>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="admin@jobify.uz"
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#163D5C]/5 focus:border-[#163D5C] outline-none transition-all placeholder:text-gray-300"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 ml-1">
              Maxfiy Parol
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#163D5C] transition-colors">
                <HiOutlineLockClosed size={20} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#163D5C]/5 focus:border-[#163D5C] outline-none transition-all placeholder:text-gray-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#163D5C] transition-colors p-1"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#163D5C] text-white font-bold rounded-2xl shadow-lg shadow-[#163D5C]/20 hover:bg-[#1d4f75] active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Jobify. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;