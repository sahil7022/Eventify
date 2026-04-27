import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Calendar, ShieldCheck, Zap, 
  Trophy, Target, ClipboardList, Bell, 
  Heart, History, ChevronRight, Activity,
  CheckCircle2, Clock, XCircle, Search
} from "lucide-react";
import { MetricCard } from "../../components/MetricCard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * MOCK API SERVICE STRUCTURE
 * Prepared for future integration with server.js and MySQL
 */
const InsightsAPI = {
  getStats: async () => {
    // API: GET /api/insights/stats
    return { registered: 12, attended: 8, upcoming: 4, cancelled: 1 };
  },
  getActivity: async () => {
    // API: GET /api/insights/activity
    return [
      { month: 'Jan', registered: 2, attended: 1 },
      { month: 'Feb', registered: 4, attended: 3 },
      { month: 'Mar', registered: 3, attended: 2 },
      { month: 'Apr', registered: 6, attended: 5 },
      { month: 'May', registered: 8, attended: 4 },
      { month: 'Jun', registered: 5, attended: 3 }
    ];
  },
  getTimeline: async () => {
    // API: GET /api/insights/timeline
    return [
      { id: 1, title: 'Nexus Tech Summit', date: 'Oct 12', type: 'upcoming', status: 'Upcoming' },
      { id: 2, title: 'Strategic Biz Expo', date: 'Nov 05', type: 'upcoming', status: 'Upcoming' },
      { id: 3, title: 'AI Workshop', date: 'Sep 20', type: 'completed', status: 'Completed' },
      { id: 4, title: 'Hackathon 2024', date: 'Sep 05', type: 'completed', status: 'Completed' }
    ];
  },
  getCategories: async () => {
    // API: GET /api/insights/categories
    return [
      { name: 'Tech', count: 6 },
      { name: 'Business', count: 3 },
      { name: 'Art', count: 2 },
      { name: 'Sports', count: 1 }
    ];
  },
  getEngagement: async () => {
    // API: GET /api/insights/engagement
    // Score Logic: Register (+5), Attend (+10)
    return { score: 140, level: 'High' };
  },
  getReminders: async () => {
    // API: GET /api/insights/reminders
    return { 
      count: 2, 
      next: { title: 'Nexus Tech Summit', time: '10:00 AM', date: 'Oct 12' } 
    };
  },
  getSummary: async () => {
    // API: GET /api/insights/summary
    return {
      text: "You've attended 2 events this month. You are most active in the Tech category.",
      monthCount: 2,
      topCategory: "Tech"
    };
  },
  getInterests: async () => {
    // API: GET /api/user/interests
    return ["Artificial Intelligence", "UI/UX Design", "Entrepreneurship"];
  }
};

export const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [engagement, setEngagement] = useState<any>(null);
  const [reminders, setReminders] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [s, a, t, c, e, r, sum, i] = await Promise.all([
          // API: GET /api/insights/stats
          InsightsAPI.getStats(),
          // API: GET /api/insights/activity
          InsightsAPI.getActivity(),
          // API: GET /api/insights/timeline?search=searchQuery
          InsightsAPI.getTimeline(),
          // API: GET /api/insights/categories
          InsightsAPI.getCategories(),
          // API: GET /api/insights/engagement
          InsightsAPI.getEngagement(),
          // API: GET /api/insights/reminders
          InsightsAPI.getReminders(),
          // API: GET /api/insights/summary
          InsightsAPI.getSummary(),
          // API: GET /api/user/interests
          InsightsAPI.getInterests()
        ]);
        setStats(s);
        setActivity(a);
        setTimeline(t);
        setCategories(c);
        setEngagement(e);
        setReminders(r);
        setSummary(sum);
        setInterests(i);
      } catch (err) {
        console.error("Failed to fetch insights signal:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredTimeline = timeline.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity size={40} className="text-indigo-500 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Syncing Intelligence Matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
      
      {/* 📊 Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Registered" value={stats?.registered} icon={ClipboardList} color="#818cf8" />
        <MetricCard label="Attended" value={stats?.attended} icon={CheckCircle2} color="#10b981" />
        <MetricCard label="Upcoming" value={stats?.upcoming} icon={Clock} color="#fbbf24" />
        <MetricCard label="Cancelled" value={stats?.cancelled} icon={XCircle} color="#f87171" />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 📈 Events Activity Graph */}
        <div className="xl:col-span-2 glass-panel p-10 rounded-[3.5rem] border-white/5 bg-slate-900/40 relative overflow-hidden group">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Participation Index</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Monthly Registration vs Attendance throughput</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-[9px] font-black uppercase text-slate-400">Registered</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black uppercase text-slate-400">Attended</span>
                 </div>
              </div>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={activity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.2rem', color: '#fff' }} />
                    <Bar dataKey="registered" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="attended" fill="#10b981" radius={[8, 8, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 🏆 Engagement Score */}
        <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent flex flex-col items-center justify-center text-center space-y-8 group shadow-2xl">
           <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
                 <Trophy size={60} className="drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]" />
              </div>
              <div className="absolute -top-4 -right-4 px-4 py-1.5 bg-indigo-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg border border-indigo-400/50">{engagement?.level} RANK</div>
           </div>
           <div className="space-y-3">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Engagement Score</h3>
              <div className="text-6xl font-black text-white tracking-tighter italic leading-none">{engagement?.score}</div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed pt-2">Register (+5) | Attend (+10) <br/> Synergy optimized for current session</p>
           </div>
           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
              <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 📅 Event Timeline */}
        <div className="xl:col-span-2 glass-panel p-10 rounded-[3.5rem] border-white/5 space-y-8 bg-slate-900/40">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Event Timeline</h3>
              <div className="flex items-center gap-4 flex-1 max-w-sm">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                   <input 
                     type="text"
                     placeholder="Search timeline..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-xs text-white focus:border-indigo-500 transition-all outline-none"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                <History size={20} className="text-slate-500 shrink-0" />
              </div>
           </div>
           <div className="space-y-4">
              {filteredTimeline.map((item, i) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all group cursor-pointer shadow-inner">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'upcoming' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                      {item.type === 'upcoming' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white uppercase italic group-hover:text-indigo-400 transition-colors leading-none tracking-tight">{item.title}</h4>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">{item.date} • {item.status}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-800 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
                </div>
              ))}
           </div>
        </div>

        {/* 🎯 Category Insight */}
        <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 space-y-8 bg-slate-900/40">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Category Insight</h3>
              <Target size={20} className="text-slate-500" />
           </div>
           <div className="space-y-6 pt-2">
              <div className="p-6 rounded-[2rem] bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                 <div className="absolute -right-6 -bottom-6 opacity-20 rotate-12">
                    <Zap size={100} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Most Attended Domain</p>
                 <h4 className="text-4xl font-black italic tracking-tighter uppercase mt-2">{categories?.[0]?.name}</h4>
              </div>
              <div className="space-y-4">
                 {categories.map((cat, i) => (
                    <div key={cat.name} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">{cat.name}</span>
                          <span className="text-white">{cat.count} Events</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${(cat.count / 10) * 100}%` }} 
                            className={`h-full ${i === 0 ? 'bg-indigo-500' : 'bg-slate-700'}`} 
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 🔔 Upcoming Reminder Insight */}
        <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 flex flex-col md:flex-row items-center gap-8 bg-slate-900 border-indigo-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <div className="w-20 h-20 rounded-[2rem] bg-amber-500/10 flex items-center justify-center text-amber-400 animate-pulse flex-shrink-0">
              <Bell size={32} />
           </div>
           <div className="space-y-2 text-center md:text-left">
              <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em]">Critical Protocol: Upcoming</h4>
              <p className="text-white font-medium text-lg leading-relaxed"><span className="text-amber-400 font-black">{reminders?.count} missions</span> are pending sync. Next protocol: <span className="text-white font-black italic">"{reminders?.next?.title}"</span> at {reminders?.next?.time} on {reminders?.next?.date}.</p>
           </div>
        </div>

        {/* ❤️ Interests / Preferences */}
        <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 space-y-6 bg-slate-900/40">
           <div className="flex items-center gap-3">
              <Heart size={20} className="text-rose-500" />
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Interest Nodes</h3>
           </div>
           <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                 <span key={interest} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-bold uppercase tracking-widest text-indigo-400">{interest}</span>
              ))}
              <span className="px-4 py-2 bg-white/5 border border-white/10 border-dashed rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-white cursor-pointer">+ Add Interest</span>
           </div>
           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic pt-2 leading-relaxed">System Recommendation: Higher participation in technical sectors would optimize your engagement delta based on these nodes.</p>
        </div>
      </div>

      {/* 🧾 Activity Summary Banner */}
      <div className="glass-panel p-10 lg:p-14 rounded-[4rem] border-white/5 bg-indigo-600 text-white shadow-3xl shadow-indigo-500/20 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_-20%,rgba(255,255,255,0.1),transparent)]" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
               <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60">Operational Summary</div>
               <h3 className="text-3xl lg:text-4xl font-black italic tracking-tighter uppercase leading-none">{summary?.text}</h3>
               <p className="text-white/60 text-xs font-medium uppercase tracking-[0.2em] leading-relaxed italic">Intelligence sync complete. Your cross-campus footprint is expanding optimally across the {summary?.topCategory} sector.</p>
            </div>
            <button className="px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-bold uppercase text-[10px] tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shrink-0">Download Audit PDF</button>
         </div>
      </div>

    </motion.div>
  );
};
