import React, { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Sahifa yuklanish skeleti
  const navigate = useNavigate();

  // Sahifa birinchi marta ochilganda skeleton ko'rsatish
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await adminApi.login(credentials);
  //     const token = response.data.token;
  //     localStorage.setItem("token", token);
  //     navigate("/dashboard");
  //   } catch (error) {
  //     alert("Email yoki parol xato!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Yuborilayotgan ma'lumotlar:", credentials); // 1. Tekshirish

    try {
      const response = await adminApi.login(credentials);
      console.log("Serverdan kelgan javob:", response); // 2. Tekshirish

      // Agar token response.data ichida bo'lsa
      const token =
        response.data?.token || response.data?.access_token || response.data;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        alert("Token topilmadi. Server javobini tekshiring.");
      }
    } catch (error) {
      console.error("Xatolik tafsiloti:", error.response); // 3. Xato sababi
      alert(error.response?.data?.message || "Email yoki parol xato!");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  from-[#f0f4f8] to-[#d9e2ec] px-4">
      <div className="max-w-md w-full p-10 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-[0_20px_50px_rgba(22,61,92,0.15)] border border-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#163D5C] to-[#2c6e9c]"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-xs uppercase tracking-widest font-bold text-[#163D5C] mb-2 ml-1">
              Email Manzil
            </label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="admin@jobify.uz"
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#163D5C]/10 focus:border-[#163D5C] outline-none transition-all duration-300"
              required
            />
          </div>

          <div className="group">
            <label className="block text-xs uppercase tracking-widest font-bold text-[#163D5C] mb-2 ml-1">
              Maxfiy Parol
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#163D5C]/10 focus:border-[#163D5C] outline-none transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#163D5C] p-1 rounded-md transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#163D5C]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.644C3.67 8.5 7.653 6 12 6c4.347 0 8.33 2.5 9.964 5.678a1.012 1.012 0 010 .644C20.33 15.5 16.347 18 12 18c-4.347 0-8.33-2.5-9.964-5.678z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative py-4 bg-[#163D5C] text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(22,61,92,0.3)] hover:bg-[#1d4f75] hover:shadow-[0_15px_25px_rgba(22,61,92,0.4)] transition-all duration-300 active:scale-[0.97] disabled:bg-gray-400 disabled:cursor-not-allowed overflow-hidden group"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="ml-2 italic">Tekshirilmoqda...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                TIZIMGA KIRISH
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs font-medium tracking-tighter">
            &copy; 2026 JOBIFY ADMIN SYSTEM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
