import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck, Home } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { api } from "../services/api";
import { firebaseService } from "../services/firebaseService";

export default function Login() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      
      const { email, password } = form;
      const result = await firebaseService.login(email, password);

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        showNotification('success', result.user.role === 'admin' ? 'Welcome, Strategic Admin.' : 'Identification Verified.');
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      }

    } catch (err: any) {
      console.error(err);
      setError("Connection error. Is the backend running?");
      showNotification('error', 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] font-sans relative overflow-hidden px-4 md:px-6">
      {/* Home Button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-all font-bold uppercase text-[9px] md:text-[10px] tracking-widest group z-20"
      >
        <Home className="w-4 h-4 md:w-4.5 md:h-4.5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Return to Home</span>
        <span className="sm:hidden">Home</span>
      </button>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse md:block hidden"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse md:block hidden"></div>

      <div className="w-full max-w-md relative z-10 py-12 md:py-0">
        <div className="glass-panel p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl space-y-8 md:space-y-10">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white italic uppercase tracking-tighter">Welcome back</h1>
            <p className="text-slate-500 mt-2 font-medium text-sm md:text-base">Sign in to continue.</p>
          </div>

          {error && (
            <div className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl text-red-400 text-[10px] md:text-xs font-bold text-center uppercase tracking-widest leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={onLogin} className="space-y-4 md:space-y-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-500" size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl outline-none focus:border-indigo-500 transition-all text-white font-medium placeholder:text-slate-600 shadow-inner text-sm md:text-base"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                 <span onClick={() => navigate("/forgot")} className="text-[9px] md:text-[10px] font-bold text-indigo-400 cursor-pointer hover:underline uppercase tracking-widest">Forgot?</span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-500" size={16} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={onChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl outline-none focus:border-indigo-500 transition-all text-white font-medium placeholder:text-slate-600 shadow-inner text-sm md:text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 md:py-4 bg-indigo-500 text-white rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-indigo-600 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
            >
              {loading ? "Authenticating..." : (
                <>
                  Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 md:pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] md:text-xs text-slate-500 font-medium">New here?</p>
            <button
              onClick={() => navigate("/register")}
              className="mt-2 md:mt-3 text-indigo-400 font-bold hover:underline uppercase tracking-widest text-[11px] md:text-sm"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
