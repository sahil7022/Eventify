import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Globe, Building2, Activity, ShieldCheck, ArrowRight, ChevronLeft, Calendar, User, Sparkles } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { api } from "../services/api";
import { firebaseService } from "../services/firebaseService";

export default function Register() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    department: "",
    year: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);

  // Realistic mock stats
  const stats = {
    users: "1,248+",
    events: "34",
    departments: "12",
    onlineUsers: "156"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.terms) { 
      showNotification('error', 'Please accept the terms to proceed.');
      return; 
    }
    if (form.password !== form.confirmPassword) { 
      showNotification('error', 'Passwords do not match.');
      return; 
    }
    
    try {
      setLoading(true);
      const registerData = {
        name: `${form.firstName} ${form.middleName} ${form.lastName}`.trim().replace(/\s+/g, ' '),
        email: form.email,
        password: form.password,
        role: 'participant', // Default role
        phone: form.phone,
        institution: form.institution,
        department: form.department,
        year: form.year
      };


      const result = await firebaseService.register(registerData);
      
      if (result.user) {
        showNotification('success', 'Account created successfully! Welcome to Eventify.');
        navigate("/dashboard"); // Firebase often logs you in immediately
      } else {
        showNotification('error', result.message || 'Registration failed.');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Registration failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans flex flex-col lg:flex-row overflow-y-auto no-scrollbar">
      
      {/* 🏙️ LEFT SIDE: Branding & Stats */}
      <div className="w-full lg:w-[40%] flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-slate-900 border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.08),transparent)] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3 md:gap-4 mb-12 lg:mb-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <Sparkles size={24} className="text-white fill-current" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Eventify</h1>
        </div>

        <div className="relative z-10 space-y-12 md:space-y-16">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight italic uppercase tracking-tighter">
              Eventify
            </h2>
            <p className="text-indigo-400 font-black text-xl md:text-2xl lg:text-3xl uppercase tracking-tighter italic">Your gateway to amazing events</p>
          </div>

          {/* 📊 Responsive Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {[
              { label: "Users", value: stats.users, icon: Users },
              { label: "Events", value: stats.events, icon: Calendar },
              { label: "Departments", value: stats.departments, icon: Building2 },
              { label: "Online", value: stats.onlineUsers, icon: Activity },
            ].map((stat, i) => (
              <div key={i} className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] glass-panel bg-white/[0.02] border-white/5 hover:border-indigo-500/20 transition-all group">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 text-indigo-400">
                  <stat.icon className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 group-hover:scale-110 transition-transform" />
                  <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter italic">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0 pt-8 border-t border-white/5 text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-relaxed">
          Operational Terminal • Campus Directory Synchronized • 256-bit Secure Sync
        </div>
      </div>

      {/* 📝 RIGHT SIDE: Registration Card */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10 lg:p-20 relative bg-slate-950/20">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-3xl relative z-10">
          <div className="glass-panel p-6 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[4rem] shadow-3xl bg-[#0f172a]/80 backdrop-blur-3xl border-white/5">
            
            <form onSubmit={handleRegister} className="space-y-8 md:space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2 md:mb-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Create Account</h2>
                  <p className="text-slate-500 mt-3 md:mt-4 font-bold uppercase text-[9px] md:text-[10px] tracking-widest italic ml-1">Define your student identity signature.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-3 px-5 py-2.5 md:px-6 md:py-3 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-indigo-400 font-black uppercase tracking-widest text-[8px] md:text-[9px] hover:bg-white/10 transition-all shadow-inner whitespace-nowrap self-start md:self-auto"
                >
                  <ChevronLeft size={14} /> Restore Session
                </button>
              </div>

              {/* Row Grid: Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                  <input name="firstName" placeholder="Aditya" onChange={handleChange} required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Middle</label>
                  <input name="middleName" placeholder="Kumar" onChange={handleChange} className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                  <input name="lastName" placeholder="Sharma" onChange={handleChange} required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Node</label>
                  <input name="email" type="email" placeholder="aditya@iitb.ac.in" onChange={handleChange} required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Signal</label>
                  <input name="phone" placeholder="+91 00000 00000" onChange={handleChange} className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
              </div>

              {/* University Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institution</label>
                  <input name="institution" placeholder="IIT Bombay" onChange={handleChange} required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                  <input name="department" placeholder="Aerospace Engineering" onChange={handleChange} required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
              </div>

              {/* Academic Year */}
              <div className="space-y-2 md:space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Phase</label>
                <select name="year" onChange={handleChange} required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner appearance-none relative text-sm">
                  <option value="" className="bg-slate-900">Select Year</option>
                  <option className="bg-slate-900">First Year</option>
                  <option className="bg-slate-900">Second Year</option>
                  <option className="bg-slate-900">Third Year</option>
                  <option className="bg-slate-900">Fourth Year</option>
                  <option className="bg-slate-900">Postgraduate</option>
                  <option className="bg-slate-900">Faculty</option>
                </select>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secret Key</label>
                  <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Repeat Key</label>
                  <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold shadow-inner placeholder:text-slate-700 text-sm" />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="p-1 md:p-2">
                <label className="flex items-center gap-3 md:gap-5 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" name="terms" onChange={handleChange} required className="peer sr-only" />
                    <div className="w-6 h-6 md:w-7 md:h-7 border-2 border-white/10 rounded-lg md:rounded-xl bg-white/5 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all flex items-center justify-center shadow-inner overflow-hidden">
                      <ShieldCheck size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100" />
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-slate-400 font-bold group-hover:text-white transition-colors select-none leading-tight">
                    I agree to the <b className="text-indigo-400 underline decoration-indigo-500/30 underline-offset-4">Terms & Conditions</b>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-4 md:py-6 bg-indigo-500 text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-[11px] hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 md:gap-4 group"
                >
                  {loading ? "Constructing Identity..." : (
                    <>
                      Initialize Connection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-8 md:pt-10 border-t border-white/5 text-center">
                <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Already have a signature?</p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-3 md:mt-4 px-8 py-3 md:px-10 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] hover:bg-white/10 transition-all shadow-inner"
                >
                  Return to Dashboard
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
