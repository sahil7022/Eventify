import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type LoginResponse = {
  user: {
    name?: string;
    email?: string;
  };
};

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ✅ Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post<LoginResponse>(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");

    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#031416] text-white relative overflow-hidden">

      {/* 🌌 BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none" />

      {/* 🔐 LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md">

        {/* OUTER GLOW */}
        <div className="absolute inset-0 rounded-3xl 
          bg-gradient-to-r from-cyan-400/20 to-teal-300/20 
          blur-2xl opacity-30"
        />

        {/* MAIN CARD */}
        <div className="relative p-8 rounded-3xl 
          bg-[#021011]/80 backdrop-blur-2xl 
          border border-white/10 
          shadow-[0_0_60px_rgba(0,255,200,0.15)]"
        >

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cyan-400 tracking-wide">
              Eventify
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to your account
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-[#031416] border border-white/10 px-4 py-3 rounded-xl 
                outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-[#031416] border border-white/10 px-4 py-3 rounded-xl 
                outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-cyan-400 to-teal-300 text-black
              hover:scale-[1.02] transition-all duration-300
              shadow-[0_0_25px_rgba(0,255,200,0.4)]"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* LINKS */}
          <div className="flex justify-between text-sm text-gray-400">

            <span
              onClick={() => navigate("/forgot")}
              className="hover:text-white cursor-pointer transition"
            >
              Forgot password?
            </span>

            <span
              onClick={() => navigate("/register")}
              className="hover:text-white cursor-pointer transition"
            >
              Sign up
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}