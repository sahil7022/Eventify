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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await firebaseService.loginWithGoogle();
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        showNotification('success', 'Authenticated with Google.');
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', 'Google identification failed.');
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-bold text-slate-600"><span className="bg-[#0f172a] px-4">Secure Middleware</span></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 md:py-4 bg-white/5 border border-white/10 text-white rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Access with Google
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
