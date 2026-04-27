/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Bell,
  MapPin,
  Star,
  X,
  User,
  LogOut,
  Calendar,
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Ticket,
  Settings,
  ShieldCheck,
  TrendingUp,
  Filter,
  Zap,
  Info,
  QrCode,
  ArrowRight,
  Menu,
  GraduationCap,
  Briefcase,
  Image as ImageIcon,
  CheckCircle2,
  Globe,
  ExternalLink,
  Smartphone,
  Users,
  BookOpen,
  Send,
  MoreVertical,
  Download,
  ShieldAlert,
  Sparkles,
  List,
  Plus,
  Trash2,
  Megaphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// --- Types ---
type EventStats = {
  attendeeCount: number;
  organizerCount: number;
  totalEngagement: number;
  ticketSales: string;
  engagementRate: string;
};

type UserType = {
  uid: string;
  displayName: string;
};

type SubEvent = {
  id: string;
  title: string;
  time: string;
  speaker: string;
  location: string;
  description: string;
};

type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  category: "Tech" | "Business" | "Art" | "Sports";
  price: string;
  description: string;
  subEvents?: SubEvent[];
};

type Broadcast = {
  id: string;
  eventId: string;
  eventName: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'update' | 'shoutout';
};

type Profile = {
  name: string;
  college: string;
  dept: string;
  mobile: string;
  email: string;
  bio: string;
  interests: string;
  skills: string[];
  goal: string;
  avatar: string;
};

// --- Mock Data ---
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "AI & Innovation Summit",
    date: "20 May, 2024",
    location: "Bangalore, India",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
    category: "Tech",
    price: "Free",
    description: "Deep dive into the latest LLMs and Generative AI breakthroughs with industry leaders.",
    subEvents: [
      { id: "s1", title: "Generative AI Workshop", time: "10:00 AM", speaker: "Dr. Elena V.", location: "Hall A", description: "Hands-on session with stable diffusion." },
      { id: "s2", title: "The Future of LLMs", time: "01:30 PM", speaker: "Sam H. (CEO)", location: "Main Stage", description: "Keynote on AGI timelines." },
      { id: "s3", title: "Ethics in Automation", time: "04:00 PM", speaker: "Panel Discussion", location: "Room 202", description: "Exploring the societal impact of AI." },
    ]
  },
  {
    id: "2",
    name: "Startup Founders Meetup",
    date: "12 June, 2024",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200",
    category: "Business",
    price: "₹499",
    description: "Scale your startup! Network with VCs and successful founders from across the country.",
  },
  {
    id: "3",
    name: "Digital Arts Showcase",
    date: "05 July, 2024",
    location: "Delhi, India",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200",
    category: "Art",
    price: "₹250",
    description: "Experience the fusion of technology and creativity in our annual digital art exhibition.",
  },
  {
    id: "4",
    name: "React Converge 2024",
    date: "15 Aug, 2024",
    location: "Hyderabad, India",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200",
    category: "Tech",
    price: "₹999",
    description: "India's largest React conference featuring core team members and library authors.",
  },
];

const CATEGORY_COLORS = {
  Tech: "#818cf8", // indigo-400
  Business: "#60a5fa", // blue-400
  Art: "#c084fc", // purple-400
  Sports: "#f87171", // red-400
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

// --- Components ---

interface EventCardProps {
  key?: string;
  event: Event;
  isBookmarked: boolean;
  isRegistered: boolean;
  onToggleBookmark: (id: string) => void;
  onRegister: (e: Event) => void;
}

const EventCard = ({ 
  event, 
  isBookmarked, 
  isRegistered,
  onToggleBookmark, 
  onRegister 
}: EventCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-brand-accent/50 transition-all duration-300"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={event.image} 
        alt={event.name}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-brand-accent border border-brand-accent/30">
        {event.category}
      </div>
      <button 
        onClick={() => onToggleBookmark(event.id)}
        className="absolute top-3 right-3 p-2 bg-slate-950/60 backdrop-blur-md rounded-full text-white hover:bg-slate-950 transition-colors"
      >
        <Star size={16} fill={isBookmarked ? "#facc15" : "none"} className={isBookmarked ? "text-yellow-400" : "text-white"} />
      </button>
    </div>
    
    <div className="p-5 space-y-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Calendar size={12} className="text-brand-accent" />
          {event.date}
        </div>
        <h3 className="text-lg font-semibold text-white line-clamp-1">{event.name}</h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
          <MapPin size={12} /> {event.location}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <span className="text-sm font-bold text-brand-accent">{event.price}</span>
        <button 
          onClick={() => onRegister(event)}
          disabled={isRegistered}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isRegistered 
              ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
              : "bg-brand-accent hover:opacity-90 text-slate-950"
          }`}
        >
          {isRegistered ? "Registered" : "Register Now"}
        </button>
      </div>
    </div>
  </motion.div>
);

interface OrganizerCardProps {
  key?: string;
  event: Event;
  registered: { id: string, role: string }[];
  onUpdateImage: (id: string, image: string) => void;
  onManage: (event: Event) => void;
}

const OrganizerCard = ({ event, onUpdateImage, registered, onManage }: OrganizerCardProps) => {
  const [stats, setStats] = useState<EventStats | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      // Backend disconnected: using simulated data
      setStats({
        attendeeCount: registered.filter(r => r.id === event.id && r.role === 'Participant').length + 42,
        organizerCount: registered.filter(r => r.id === event.id && r.role === 'Organizer').length + 3,
        totalEngagement: 140 + Math.floor(Math.random() * 20),
        ticketSales: `₹${(15000 + Math.floor(Math.random() * 5000)).toLocaleString()}`,
        engagementRate: "89%"
      });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [event.id, registered]);

  return (
    <div 
      onClick={() => onManage(event)}
      className="glass-panel rounded-3xl overflow-hidden group border border-brand-border/50 hover:border-brand-accent/30 transition-all cursor-pointer hover:shadow-2xl hover:shadow-brand-accent/5"
    >
      <div className="relative h-48 overflow-hidden bg-slate-900 flex items-center justify-center">
        {event.image ? (
          <img src={event.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
        ) : (
          <ImageIcon size={48} className="text-slate-800" />
        )}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
           <div className="bg-white text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl scale-95 group-hover:scale-100 transition-all flex items-center gap-2">
             <TrendingUp size={16} /> Open Dashboard
           </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
         <div className="flex items-start justify-between">
            <div>
               <h4 className="font-black text-lg truncate mb-1">{event.name}</h4>
               <div className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-widest">{event.category} • {event.location}</div>
            </div>
            <div className="bg-brand-accent/10 border border-brand-accent/20 px-2 py-1 rounded text-[8px] font-black text-brand-accent">ACTIVE</div>
         </div>

         <div className="space-y-2">
             <label className="text-[10px] uppercase font-black tracking-widest text-brand-text-secondary ml-1">Asset Control</label>
             <div className="flex gap-2">
                <button 
                  onClick={() => document.getElementById(`event-upload-${event.id}`)?.click()}
                  className="flex-1 glass-item rounded-xl px-3 py-2.5 text-[10px] focus:outline-none border-brand-accent/20 hover:border-brand-accent/60 transition-all font-black flex items-center justify-center gap-2 text-brand-accent uppercase tracking-wider"
                >
                  <ImageIcon size={14} /> Update Media
                </button>
                <input 
                  id={`event-upload-${event.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(ev) => {
                    const file = ev.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onUpdateImage(event.id, reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
             </div>
          </div>

          <div className="pt-4 border-t border-brand-border/50">
             <div className="flex items-center justify-between mb-4">
               <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Real-time Metrics</h5>
               <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                 <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Live Stream</span>
               </div>
             </div>
             
             <div className="grid grid-cols-3 gap-2">
                <div className="glass-item p-3 rounded-xl border border-brand-accent/5 hover:border-brand-accent/20 transition-all">
                   <div className="text-sm font-black text-brand-text-primary">
                     {stats?.attendeeCount || 0}
                   </div>
                   <div className="text-[8px] font-black text-brand-text-secondary uppercase tracking-tight">Attendees</div>
                </div>
                <div className="glass-item p-3 rounded-xl border border-blue-400/5 hover:border-blue-400/20 transition-all">
                   <div className="text-sm font-black text-brand-text-primary">
                     {stats?.engagementRate || '0%'}
                   </div>
                   <div className="text-[8px] font-black text-brand-text-secondary uppercase tracking-tight">Engagement</div>
                </div>
                <div className="glass-item p-3 rounded-xl border border-yellow-400/5 hover:border-yellow-400/20 transition-all">
                   <div className="text-sm font-black text-brand-text-primary">
                     {stats?.ticketSales || '₹0'}
                   </div>
                   <div className="text-[8px] font-black text-brand-text-secondary uppercase tracking-tight">Sales</div>
                </div>
             </div>
          </div>

         <div className="flex items-center justify-between pt-4 border-t border-brand-border">
            <div className="flex -space-x-2">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                   <User size={14} />
                 </div>
               ))}
               <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-950 flex items-center justify-center text-[8px] font-black text-brand-accent">
                 +{stats?.organizerCount || 2}
               </div>
            </div>
            <div className="text-[10px] font-black text-brand-accent italic uppercase tracking-tighter">Organizer Privileges</div>
         </div>
      </div>
    </div>
  );
};

interface OrganizerManagementModalProps {
  event: Event;
  onClose: () => void;
  onBroadcast?: (id: string, name: string, msg: string, type: Broadcast['type']) => void;
  onUpdateSubEvents?: (id: string, subEvents: SubEvent[]) => void;
}

const RulebookModal = ({ event, onClose }: { event: Event, onClose: () => void }) => {
  const [rulebook, setRulebook] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Backend disconnected: using mock timeout and event description as fallback rulebook
    setTimeout(() => {
      setRulebook(event.description + "\n\n1. Attendance is mandatory for all sessions.\n2. Digital Pass must be presented at the entrance.\n3. Respect the code of conduct.");
      setLoading(false);
    }, 800);
  }, [event.id, event.description]);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }} 
        className="relative w-full max-w-2xl glass-panel rounded-[2rem] p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar border border-brand-accent/20"
      >
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
           <div className="flex items-center gap-3">
              <BookOpen className="text-brand-accent" size={24} />
              <h3 className="text-xl font-black">{event.name} - Rules</h3>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><X size={20}/></button>
        </div>
        
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="prose prose-invert max-w-none">
             {rulebook ? (
               <div className="whitespace-pre-wrap text-sm leading-relaxed text-brand-text-primary opacity-80 font-medium">
                  {rulebook}
               </div>
             ) : (
               <p className="text-sm text-brand-text-secondary italic text-center py-10 leading-relaxed">No special rules have been published for this summit yet.</p>
             )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const OrganizerManagementModal = ({ event, onClose, onBroadcast, onUpdateSubEvents }: OrganizerManagementModalProps) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [rulebook, setRulebook] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"participants" | "rulebook" | "broadcast" | "analytics" | "program">("analytics");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [drillDownMetric, setDrillDownMetric] = useState<string | null>(null);
  
  const [localSubEvents, setLocalSubEvents] = useState<SubEvent[]>(event.subEvents || []);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastType, setBroadcastType] = useState<Broadcast['type']>("alert");

  useEffect(() => {
    setLoading(true);
    // Backend disconnected: using mock data for participants, rulebook, and stats
    
    const mockParticipants = [
      { id: 1, name: "Rahul Sharma", email: "rahul@campus.edu", department: "CSE", registration_date: "2024-04-10" },
      { id: 2, name: "Priya Patel", email: "priya@campus.edu", department: "ECE", registration_date: "2024-04-11" },
      { id: 3, name: "Sameer V", email: "sameer@campus.edu", department: "ME", registration_date: "2024-04-12" },
      { id: 4, name: "Ananya R", email: "ananya@campus.edu", department: "CSE", registration_date: "2024-04-13" },
    ];

    const mockStats = {
      attendeeCount: 156,
      organizerCount: 8,
      totalEngagement: 240,
      ticketSales: "₹45,000",
      engagementRate: "92%",
      timeline: [
        { date: '2026-04-14', count: 5 },
        { date: '2026-04-15', count: 12 },
        { date: '2026-04-16', count: 8 },
        { date: '2026-04-17', count: 25 },
        { date: '2026-04-18', count: 40 },
        { date: '2026-04-19', count: 35 },
        { date: '2026-04-20', count: 56 }
      ]
    };

    setTimeout(() => {
      setParticipants(mockParticipants);
      setRulebook(event.description + "\n\n# General Rules\n- No plagiarism allowed.\n- Late submissions will be penalized.\n- Maintain professionalism.");
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, [event.id, event.description]);

  const saveRulebook = () => {
    setSaving(true);
    // Backend disconnected: simulating local save
    setTimeout(() => {
      alert("Rulebook updated locally!");
      setSaving(false);
    }, 600);
  };

  const dashboardData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 1100 },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }} 
        className="relative w-full max-w-5xl glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-brand-accent/20"
      >
        <div className="p-8 border-b border-brand-border flex items-center justify-between bg-slate-900/40">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <Briefcase size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black">{event.name}</h3>
                <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mt-1">Management Console</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 bg-brand-glass rounded-xl hover:bg-white/5 transition-colors"><X size={20}/></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
           {/* Sub-navigation */}
           <div className="w-20 sm:w-64 border-r border-brand-border bg-slate-950/20 p-4 space-y-2">
              {[
                { id: "analytics", label: "Dashboard", icon: BarChart },
                 { id: "program", label: "Program", icon: List },
                { id: "participants", label: "Participants", icon: Users },
                { id: "rulebook", label: "Rule Book", icon: BookOpen },
                { id: "broadcast", label: "Broadcast", icon: Megaphone },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id as any);
                    setDrillDownMetric(null);
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${
                    activeSubTab === tab.id ? "bg-brand-accent text-slate-950 shadow-lg shadow-brand-accent/20" : "text-brand-text-secondary hover:bg-brand-glass"
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
              
              <div className="pt-10 space-y-4 px-2 hidden sm:block">
                 <div className="p-4 rounded-2xl bg-brand-accent/5 border border-brand-accent/10 space-y-2">
                    <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Admin Note</p>
                    <p className="text-[10px] text-brand-text-primary leading-relaxed opacity-70 italic font-medium">As organizer, you have tactical control. Strategic changes require system-wide administrator keys.</p>
                 </div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-brand-bg/50">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                   <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <motion.div 
                  key={activeSubTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                   {activeSubTab === "analytics" && (
                     <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-2xl font-black">Performance Dashboard</h4>
                                <p className="text-xs text-brand-text-secondary mt-1">Consolidated metrics and real-time trends.</p>
                            </div>
                            {drillDownMetric && (
                              <button 
                                onClick={() => setDrillDownMetric(null)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                              >
                                <ChevronLeft size={14}/> Back to Overview
                              </button>
                            )}
                        </div>

                        {!drillDownMetric ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                { id: "attendees", label: "Attendees", value: stats?.attendeeCount || 0, delta: "+12%", icon: Users, color: "text-brand-accent" },
                                { id: "engagement", label: "Engagement", value: stats?.engagementRate || "0%", delta: "+5.4%", icon: Zap, color: "text-yellow-400" },
                                { id: "sales", label: "Gross Sales", value: stats?.ticketSales || "₹0", delta: "+₹2.4k", icon: Ticket, color: "text-brand-accent" },
                              ].map(card => (
                                <button 
                                  key={card.label}
                                  onClick={() => setDrillDownMetric(card.id)}
                                  className="glass-panel p-6 rounded-[2rem] text-left hover:scale-[1.02] transition-all group border border-transparent hover:border-brand-accent/20"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${card.color}`}>
                                      <card.icon size={24} />
                                    </div>
                                    <div className="text-[10px] font-black text-brand-accent flex items-center gap-1">
                                      <TrendingUp size={10} /> {card.delta}
                                    </div>
                                  </div>
                                  <div className="text-3xl font-black mb-1">{card.value}</div>
                                  <div className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest leading-none">
                                    {card.label}
                                  </div>
                                  <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                    Analyze <ExternalLink size={10} />
                                  </div>
                                </button>
                              ))}
                            </div>

                            <div className="glass-panel p-8 rounded-[2.5rem] space-y-6">
                              <h5 className="text-sm font-black uppercase tracking-widest opacity-60">Registration Velocity (Last 7 Days)</h5>
                              <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={stats?.timeline || dashboardData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                      dataKey={stats?.timeline ? "date" : "name"} 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }} 
                                      dy={10}
                                      tickFormatter={(val) => stats?.timeline ? val.split('-').slice(1).join('/') : val}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }} />
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderRadius: '16px', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        fontSize: '12px'
                                      }}
                                      itemStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="count" fill="var(--color-brand-accent)" radius={[4, 4, 0, 0]} barSize={40} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                          >
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-panel p-8 rounded-[2.5rem] bg-slate-900/40">
                                   <h5 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Detailed Breakdown: {drillDownMetric.toUpperCase()}</h5>
                                   <div className="space-y-6">
                                      {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                           <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center font-bold text-brand-accent">0{i}</div>
                                              <div>
                                                 <div className="text-sm font-bold">Region Cluster {i}</div>
                                                 <div className="text-[10px] text-brand-text-secondary font-medium lowercase">North Block Campus</div>
                                              </div>
                                           </div>
                                           <div className="text-right">
                                              <div className="text-sm font-black">+{i * 24}</div>
                                              <div className="text-[10px] text-brand-accent font-bold uppercase tracking-tighter">Healthy Volume</div>
                                           </div>
                                        </div>
                                      ))}
                                   </div>
                                </div>
                                
                                <div className="glass-panel p-8 rounded-[2.5rem]">
                                   <h5 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Comparative Growth</h5>
                                   <div className="h-64 w-full">
                                      <ResponsiveContainer width="100%" height="100%">
                                         <PieChart>
                                            <Pie
                                               data={[
                                                 { name: 'Organic', value: 400 },
                                                 { name: 'Socials', value: 300 },
                                                 { name: 'Referral', value: 300 },
                                                 { name: 'Direct', value: 200 },
                                               ]}
                                               cx="50%"
                                               cy="50%"
                                               innerRadius={60}
                                               outerRadius={80}
                                               paddingAngle={5}
                                               dataKey="value"
                                            >
                                               {[
                                                 "var(--color-brand-accent)",
                                                 "rgba(45,212,191,0.6)",
                                                 "rgba(45,212,191,0.3)",
                                                 "rgba(45,212,191,0.1)"
                                               ].map((color, index) => (
                                                 <Cell key={`cell-${index}`} fill={color} stroke="none" />
                                               ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                         </PieChart>
                                      </ResponsiveContainer>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="p-8 rounded-[2.5rem] bg-brand-accent/5 border border-brand-accent/10">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                   <div className="w-16 h-16 rounded-3xl bg-brand-accent flex items-center justify-center text-slate-950 flex-shrink-0">
                                      <Zap size={32} />
                                   </div>
                                   <div>
                                      <h6 className="text-lg font-black leading-tight">Optimization Strategy Suggested</h6>
                                      <p className="text-sm text-brand-text-secondary mt-1 max-w-2xl leading-relaxed">Based on current registration velocity, we recommend increasing social media visibility during peak campus hours (4:00 PM - 7:00 PM) to maintain the momentum for your summit.</p>
                                   </div>
                                   <button className="md:ml-auto w-full md:w-auto px-6 py-3 bg-white text-slate-950 rounded-xl font-bold text-sm whitespace-nowrap hover:scale-105 transition-all">Apply Recommendation</button>
                                </div>
                             </div>
                          </motion.div>
                        )}
                     </div>
                   )}
                   {activeSubTab === "program" && (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="text-2xl font-black">Program Schedule</h4>
                              <p className="text-xs text-brand-text-secondary mt-1">Manage sub-events, workshops, and sessions.</p>
                           </div>
                           <button 
                             onClick={() => {
                               const newSub: SubEvent = {
                                 id: Math.random().toString(36).substr(2, 9),
                                 title: "New Session",
                                 time: "12:00 PM",
                                 speaker: "Assign Speaker",
                                 location: "TBD",
                                 description: "New session description..."
                               };
                               const updated = [...localSubEvents, newSub];
                               setLocalSubEvents(updated);
                               onUpdateSubEvents?.(event.id, updated);
                             }}
                             className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-accent/20"
                           >
                             <Plus size={16}/> Add Session
                           </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                           {localSubEvents.length === 0 ? (
                             <div className="py-20 text-center glass-panel rounded-3xl border-dashed border-2 border-brand-border/40">
                                <List size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-bold text-brand-text-secondary">No sessions scheduled yet.</p>
                             </div>
                           ) : (
                             localSubEvents.map(sub => (
                               <div key={sub.id} className="glass-panel p-5 rounded-2xl flex items-center justify-between group">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-xs uppercase">
                                        {sub.time}
                                     </div>
                                     <div>
                                        <div className="text-sm font-bold">{sub.title}</div>
                                        <div className="text-[10px] text-brand-text-secondary font-medium uppercase tracking-wider">{sub.speaker} • {sub.location}</div>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button className="p-2 hover:bg-white/5 rounded-lg text-brand-text-secondary"><ChevronRight size={14}/></button>
                                     <button 
                                       onClick={() => {
                                         const updated = localSubEvents.filter(s => s.id !== sub.id);
                                         setLocalSubEvents(updated);
                                         onUpdateSubEvents?.(event.id, updated);
                                       }}
                                       className="p-2 hover:bg-red-500/10 rounded-lg text-red-500"
                                     >
                                       <Trash2 size={14}/>
                                     </button>
                                  </div>
                               </div>
                             ))
                           )}
                        </div>
                     </div>
                   )}

                   {activeSubTab === "participants" && (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h4 className="text-2xl font-black">Registered Talent</h4>
                           <div className="flex gap-2">
                              <button className="flex items-center gap-2 px-4 py-2 glass-item rounded-xl text-xs font-bold text-brand-text-secondary hover:text-white transition-all"><Download size={14}/> Export CSV</button>
                           </div>
                        </div>

                        <div className="space-y-3">
                           {participants.length === 0 ? (
                             <div className="p-20 text-center glass-panel rounded-3xl opacity-50 border-dashed border-2 border-brand-border">
                                <Users size={48} className="mx-auto mb-4 text-brand-text-secondary" />
                                <p className="font-bold">No participants registered yet.</p>
                             </div>
                           ) : (
                             <div className="glass-panel overflow-hidden rounded-3xl border border-brand-border/30">
                               <table className="w-full text-left">
                                  <thead className="bg-slate-900/60 border-b border-brand-border">
                                     <tr className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Department</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-brand-border/30">
                                     {participants.map(p => (
                                       <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                          <td className="px-6 py-4">
                                             <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-xs">{p.name.charAt(0)}</div>
                                                <div className="min-w-0">
                                                   <div className="text-sm font-bold truncate">{p.name}</div>
                                                   <div className="text-[10px] text-brand-text-secondary truncate">{p.email}</div>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4 text-xs font-medium text-brand-text-secondary">{p.department}</td>
                                          <td className="px-6 py-4">
                                             <span className="px-2 py-1 rounded bg-brand-accent/10 text-brand-accent text-[10px] font-black border border-brand-accent/20 uppercase tracking-tighter">Verified</span>
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                             <button className="p-2 glass-item rounded-lg text-brand-text-secondary hover:text-white transition-colors"><MoreVertical size={14}/></button>
                                          </td>
                                       </tr>
                                     ))}
                                  </tbody>
                               </table>
                             </div>
                           )}
                        </div>
                     </div>
                   )}

                   {activeSubTab === "rulebook" && (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="text-2xl font-black">Official Rule Book</h4>
                              <p className="text-xs text-brand-text-secondary mt-1">Define boundaries, judging criteria, and procedures.</p>
                           </div>
                           <button 
                             onClick={saveRulebook}
                             disabled={saving}
                             className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-accent/20"
                           >
                             {saving ? "Saving..." : "Save Rules"}
                           </button>
                        </div>
                        <div className="glass-panel p-6 rounded-3xl min-h-[400px] bg-slate-950/40 relative group">
                           <textarea 
                             className="w-full h-full min-h-[400px] bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-brand-text-primary p-4 custom-scrollbar"
                             placeholder="# Rule Header\n1. Rule One...\n2. Rule Two..."
                             value={rulebook}
                             onChange={e => setRulebook(e.target.value)}
                           />
                           <div className="absolute top-4 right-4 opacity-0 group-focus-within:opacity-100 transition-opacity">
                              <span className="text-[9px] font-black bg-brand-accent/20 text-brand-accent px-2 py-1 rounded">MARKDOWN SUPPORTED</span>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeSubTab === "broadcast" && (
                     <div className="space-y-8">
                         <div>
                            <h4 className="text-2xl font-black">System Broadcast</h4>
                            <p className="text-xs text-brand-text-secondary mt-1">Send critical updates to all participants instantly.</p>
                         </div>

                         <div className="grid grid-cols-1 gap-6">
                            <div className="glass-panel p-8 rounded-3xl space-y-6 border border-brand-accent/20 bg-brand-accent/[0.02]">
                               <div className="flex gap-4">
                                  {(['alert', 'update', 'shoutout'] as const).map(t => (
                                    <button 
                                      key={t}
                                      onClick={() => setBroadcastType(t)}
                                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                        broadcastType === t ? 'bg-brand-accent text-slate-950 border-brand-accent' : 'bg-transparent text-brand-text-secondary border-brand-border hover:border-brand-accent/40'
                                      }`}
                                    >
                                      {t}
                                    </button>
                                  ))}
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-accent/60">Message Content</label>
                                  <textarea 
                                    className="w-full glass-item rounded-2xl p-4 text-sm focus:border-brand-accent transition-all min-h-[120px] outline-none bg-slate-900/50"
                                    placeholder="Attention Participants! Room changed to Hall B..."
                                    value={broadcastMsg}
                                    onChange={e => setBroadcastMsg(e.target.value)}
                                  />
                               </div>
                               <button 
                                 onClick={() => {
                                   if (!broadcastMsg.trim()) return;
                                   onBroadcast?.(event.id, event.name, broadcastMsg, broadcastType);
                                   setBroadcastMsg("");
                                   alert("Broadcast Dispatched: Message has been injected into all active participant sessions.");
                                 }}
                                 className="w-full py-4 bg-brand-accent text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-accent/30"
                               >
                                 <Megaphone size={18}/> Send Universal Alert
                               </button>
                            </div>

                            <div className="space-y-3">
                               <div className="flex items-center gap-2 mb-2">
                                  <ShieldAlert size={14} className="text-yellow-500" />
                                  <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">Security Protocols</h5>
                               </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">
                                     <div className="text-xs font-bold text-white mb-1">Blacklist User</div>
                                     <div className="text-[10px] text-brand-text-secondary leading-tight">Requires Regional Admin clearance level.</div>
                                  </div>
                                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">
                                     <div className="text-xs font-bold text-white mb-1">Revoke Registration</div>
                                     <div className="text-[10px] text-brand-text-secondary leading-tight">Available after incident report submission.</div>
                                  </div>
                               </div>
                            </div>
                         </div>
                     </div>
                   )}
                </motion.div>
              )}
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<"explore" | "dashboard" | "tickets" | "organizer">("explore");
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);
  const [managingEvent, setManagingEvent] = useState<Event | null>(null);
  const [viewingRulebookEvent, setViewingRulebookEvent] = useState<Event | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [activeBroadcast, setActiveBroadcast] = useState<Broadcast | null>(null);
  
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [globalStats, setGlobalStats] = useState({ users: 0, events: 0, departments: 0, onlineUsers: 0 });

  useEffect(() => {
    // Backend disconnected: using mock stats
    setGlobalStats({
      users: 1240,
      events: MOCK_EVENTS.length,
      departments: 12,
      onlineUsers: 45
    });
  }, []);
  
  const [eventOverrides, setEventOverrides] = useState<Record<string, Partial<Event>>>(() => {
    const saved = localStorage.getItem("eventify_overrides");
    return saved ? JSON.parse(saved) : {};
  });

  const events = useMemo(() => {
    return MOCK_EVENTS.map(e => ({
      ...e,
      ...(eventOverrides[e.id] || {})
    }));
  }, [eventOverrides]);
  const [notifications] = useState([
    { id: 1, text: "New 'Web3 Summit' added nearby!", time: "2h ago" },
    { id: 2, text: "Ticket confirmed: AI Summit", time: "5h ago" },
  ]);

  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem("eventify_profile");
    const defaultProfile: Profile = {
      name: "Arjun Raj",
      college: "IIT Bombay",
      dept: "CSE",
      mobile: "+91 98765 43210",
      email: "arjun@iitb.ac.in",
      bio: "Tech enthusiast and community builder.",
      interests: "AI, Blockchain, Web Dev",
      skills: ["React", "Python", "UI/UX"],
      goal: "Networking",
      avatar: ""
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultProfile, ...parsed };
      } catch (e) {
        console.error("Failed to parse profile", e);
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  const profileCompletionPercentage = useMemo(() => {
    let count = 0;
    if (profile.name && profile.name !== "Arjun Raj") count++;
    if (profile.college) count++;
    if (profile.dept) count++;
    if (profile.mobile) count++;
    return (count / 4) * 100;
  }, [profile]);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem("eventify_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  
  type Registration = {
    id: string;
    role: "Participant" | "Organizer";
  };
  
  const [registered, setRegistered] = useState<Registration[]>(() => {
    const saved = localStorage.getItem("eventify_registered_v2");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem("eventify_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (broadcasts.length > 0 && !activeBroadcast) {
      setActiveBroadcast(broadcasts[broadcasts.length - 1]);
      const timer = setTimeout(() => setActiveBroadcast(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [broadcasts, activeBroadcast]);

  const addBroadcast = (eventId: string, eventName: string, message: string, type: Broadcast['type']) => {
    const newBroadcast: Broadcast = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      eventName,
      message,
      timestamp: "Just now",
      type
    };
    setBroadcasts(prev => [...prev, newBroadcast]);
  };

  useEffect(() => {
    localStorage.setItem("eventify_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("eventify_overrides", JSON.stringify(eventOverrides));
  }, [eventOverrides]);

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const content = document.querySelector('.content-area-scroll');
      if (content) {
        setShowScrollToTop(content.scrollTop > 500);
      }
    };
    const content = document.querySelector('.content-area-scroll');
    content?.addEventListener('scroll', handleScroll);
    return () => content?.removeEventListener('scroll', handleScroll);
  }, []);

  const changeTab = (tab: "explore" | "dashboard" | "tickets" | "organizer") => {
    setActiveTab(tab);
    setShowMobileMenu(false);
    // Smooth scroll content area to top on tab change
    const contentArea = document.querySelector('.content-area-scroll');
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- Logic ---
  const filteredEvents = useMemo(() => {
    return events.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, events]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const isProfileComplete = useMemo(() => {
    return profile.name && profile.college && profile.dept && profile.mobile && profile.name !== "Arjun Raj"; // Forcing edit from default
  }, [profile]);

  const handleRegister = (event: Event) => {
    if (!isProfileComplete) {
      setShowProfile(true);
      return;
    }
    if (!registered.find(r => r.id === event.id)) {
      setPendingEvent(event);
      setShowRoleSelection(true);
    }
  };

  const confirmRegistration = (role: "Participant" | "Organizer") => {
    if (pendingEvent) {
      setRegistered(prev => [...prev, { id: pendingEvent.id, role }]);
      setShowRoleSelection(false);
      setPendingEvent(null);
    }
  };

  // --- Chart Data ---
  const analyticsData = [
    { name: "Mon", count: 2 },
    { name: "Tue", count: 5 },
    { name: "Wed", count: 3 },
    { name: "Thu", count: 7 },
    { name: "Fri", count: 4 },
    { name: "Sat", count: 8 },
    { name: "Sun", count: 6 },
  ];

  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = { Tech: 0, Business: 0, Art: 0, Sports: 0 };
    const registeredIds = registered.map(r => r.id);
    events.filter(e => registeredIds.includes(e.id)).forEach(e => {
      counts[e.category]++;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [registered, events]);

  const organizerEvents = useMemo(() => {
    const organizedIds = registered.filter(r => r.role === "Organizer").map(r => r.id);
    return events.filter(e => organizedIds.includes(e.id));
  }, [registered, events]);

  // --- Featured Slider ---
  const [sliderIndex, setSliderIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [events]);

  const featured = events[sliderIndex];

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text-primary font-sans overflow-hidden">
      
      {/* 📁 Sidebar (Responsive) */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-brand-border flex flex-col p-6 z-[100] transition-transform duration-500 ease-out lg:relative lg:translate-x-0 ${showMobileMenu ? "translate-x-0 shadow-[0_0_100px_rgba(0,0,0,0.8)]" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-10">
          <div 
            onClick={() => changeTab("explore")}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-accent flex items-center justify-center shadow-[0_4px_20px_var(--color-brand-accent-glow)] group-hover:scale-110 transition-transform">
              <Sparkles size={20} className="text-slate-950 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none text-brand-text-primary">Eventify</span>
              <span className="text-[9px] font-bold text-brand-accent/80 tracking-widest uppercase mt-0.5">Summit Suite</span>
            </div>
          </div>
          <button onClick={() => setShowMobileMenu(false)} className="lg:hidden p-2 text-brand-text-secondary">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar py-2">
          <div className="px-4 pb-2 uppercase text-[10px] font-black tracking-widest text-brand-text-secondary opacity-40">Discovery</div>
          {[
            { id: "explore", label: "Explore", icon: Globe },
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "tickets", label: "Registered Events", icon: Ticket },
            ...(organizerEvents.length > 0 ? [{ id: "organizer", label: "Organizer Hub", icon: Briefcase }] : []),
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => changeTab(item.id as any)}
              className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === item.id 
                  ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20 shadow-[0_4px_20px_rgba(45,212,191,0.08)]" 
                  : "text-brand-text-secondary hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeTab === item.id ? "text-brand-accent" : "group-hover:text-brand-accent transition-colors"} />
                {item.label}
              </div>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-indicator" 
                  className="w-1.5 h-1.5 bg-brand-accent rounded-full shadow-[0_0_8px_var(--color-brand-accent-glow)]" 
                />
              )}
            </button>
          ))}
          
          <div className="pt-6 pb-2 px-4 uppercase text-[10px] font-black tracking-widest text-brand-text-secondary opacity-40">Identity</div>
          <button 
            onClick={() => { changeTab("explore"); setSearch("Bookmarked"); }} 
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-brand-text-secondary hover:text-white hover:bg-white/5 transition-all group"
          >
            <Star size={18} className="group-hover:text-yellow-400" />
            Bookmarked
          </button>
          <button 
            onClick={() => { changeTab("explore"); setSearch(""); setShowProfile(true); }} 
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-brand-text-secondary hover:text-white hover:bg-white/5 transition-all group"
          >
            <Settings size={18} className="group-hover:rotate-45 transition-transform" />
            Control Panel
          </button>
        </nav>

        <div className="mt-auto glass-item rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-slate-950 font-bold">
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{profile.name}</div>
              <div className="text-[10px] text-brand-text-secondary">{profile.college} • {profile.dept}</div>
            </div>
          </div>
          <button 
            onClick={() => setShowProfile(true)}
            className="w-full py-2 hover:bg-brand-glass rounded-lg text-xs font-semibold text-brand-text-secondary transition-colors"
          >
            Edit Profile
          </button>
          <div className="flex items-center justify-between text-[11px] font-bold mt-2">
            <button className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
              <LogOut size={12} /> Logout
            </button>
            <div className="text-brand-text-secondary">v2.0.4</div>
          </div>
        </div>
      </aside>

      {/* 🌌 Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden bg-radial-[circle_at_top_right] from-slate-900 to-brand-bg">
        
        {/* 🔝 Top Bar */}
        <header className="p-4 lg:p-6 flex items-center justify-between z-10 sticky top-0 bg-brand-bg/80 backdrop-blur-md lg:bg-transparent">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setShowMobileMenu(true)} className="lg:hidden p-2 glass-item rounded-xl text-brand-accent">
              <Menu size={20} />
            </button>
            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary" size={16} />
              <input 
                type="text" 
                placeholder="Search summits..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-brand-glass border border-brand-border rounded-xl pl-11 pr-4 py-2 text-sm w-full focus:outline-none focus:border-brand-accent/30 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full glass-item flex items-center justify-center text-lg hover:border-brand-accent/40 transition-colors"
              >
                <Bell size={18} className={showNotifications ? "text-brand-accent" : "text-brand-text-secondary"} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_10px_var(--color-brand-accent-glow)]" />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 glass-panel rounded-2xl p-4 z-50 space-y-3"
                  >
                    <div className="text-xs font-black uppercase tracking-widest text-brand-accent">Notifications</div>
                    <div className="space-y-2">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3 bg-white/5 rounded-xl text-xs space-y-1">
                          <p className="font-medium text-white">{n.text}</p>
                          <p className="text-[10px] text-brand-text-secondary">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider hidden sm:flex items-center gap-2 ${profileCompletionPercentage === 100 ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-brand-accent/10 border-brand-accent/30 text-brand-accent"}`}>
              {profileCompletionPercentage === 100 ? "Student Verified" : `Profile ${profileCompletionPercentage}%`}
              {profileCompletionPercentage < 100 && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />}
            </div>
          </div>
        </header>

        {/* 🌪 Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 lg:px-10 space-y-10 custom-scrollbar content-area-scroll scroll-smooth">
          
          {activeTab === "explore" && (
            <div className="space-y-10 animate-in fade-in duration-500">
               {/* 🏷 Categories & Mobile Header */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                    {['All', 'Tech', 'Business', 'Art', 'Sports'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSearch(cat === 'All' ? '' : cat)}
                        className={`px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-wider uppercase transition-all border shrink-0 ${
                          (search === cat || (cat === 'All' && search === '')) 
                            ? 'bg-brand-accent text-slate-950 border-brand-accent shadow-[0_4px_15px_rgba(45,212,191,0.3)]' 
                            : 'bg-brand-glass text-brand-text-secondary border-brand-border hover:border-brand-accent/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">
                    <Filter size={14} className="text-brand-accent" />
                    <span>Showing {filteredEvents.length} Summits</span>
                  </div>
               </div>

              {/* 🎠 Hero Slider */}
              <section className="relative h-72 rounded-3xl overflow-hidden border border-brand-border group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featured.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <img src={featured.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end max-w-2xl">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-brand-accent text-slate-950 px-3 py-1 rounded-full text-[10px] font-black w-fit mb-3"
                      >
                        FEATURED EVENT
                      </motion.div>
                      <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-black mb-3 text-shadow-lg tracking-tight font-display italic"
                      >
                        {featured.name}
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-brand-text-secondary text-sm mb-6 line-clamp-2 max-w-lg"
                      >
                        {featured.description}
                      </motion.p>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-3"
                      >
                        <button 
                          onClick={() => handleRegister(featured)}
                          className="bg-brand-accent text-slate-950 px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                        >
                          Secure Seat <Zap size={14} />
                        </button>
                        <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors">
                          Syllabus
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute bottom-10 right-10 flex gap-2">
                  {MOCK_EVENTS.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${sliderIndex === i ? "w-8 bg-brand-accent" : "w-2 bg-white/30"}`} />
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                {/* 📋 Event List */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">Upcoming Near You</h3>
                      <div className="px-2 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold text-brand-accent">NEW</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-brand-text-secondary cursor-pointer hover:text-white transition-colors uppercase tracking-wider">
                        <Filter size={12} /> Filter
                      </div>
                      <span className="text-xs text-brand-accent cursor-pointer font-bold hover:underline">See All</span>
                    </div>
                  </div>
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {filteredEvents.length === 0 ? (
                      <div className="col-span-full py-20 glass-panel rounded-[2rem] border-dashed border-2 border-brand-border flex flex-col items-center justify-center text-center p-8">
                         <div className="w-16 h-16 rounded-2xl bg-brand-glass flex items-center justify-center text-brand-text-secondary mb-4">
                           <Search size={32} className="opacity-20" />
                         </div>
                         <h4 className="text-xl font-bold">No Summits Found</h4>
                         <p className="text-sm text-brand-text-secondary mt-2 max-w-xs">We couldn't find any events matching "{search}". Try broadening your matrix parameters.</p>
                         <button 
                           onClick={() => setSearch("")}
                           className="mt-6 text-xs font-black uppercase tracking-widest text-brand-accent hover:underline"
                         >
                           Reset Matrix Search
                         </button>
                      </div>
                    ) : (
                      filteredEvents.map(event => (
                        <motion.div 
                          key={event.id}
                          variants={staggerItem}
                          whileHover={{ y: -4 }}
                          className="glass-panel p-4 rounded-3xl flex flex-col gap-4 group transition-all hover:border-brand-accent/50 hover:bg-slate-900/80"
                        >
                        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-inner">
                          <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-3 left-3 px-2 py-1 bg-slate-950/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white border border-white/10">{event.category}</div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(event.id); }}
                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border border-white/10 transition-all ${bookmarks.includes(event.id) ? 'bg-yellow-400 text-slate-950' : 'bg-slate-950/40 text-white hover:bg-slate-950'}`}
                          >
                            <Star size={14} fill={bookmarks.includes(event.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0 px-1">
                          <h4 className="text-lg font-black leading-tight mb-2">{event.name}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-brand-text-secondary font-medium">
                            <div className="flex items-center gap-1"><MapPin size={12} className="text-brand-accent" /> {event.location.split(',')[0]}</div>
                            <div className="flex items-center gap-1"><Calendar size={12} className="text-brand-accent" /> {event.date.split(',')[0]}</div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                             <div className="text-sm font-black text-brand-accent">{event.price}</div>
                             <button 
                               onClick={() => handleRegister(event)}
                               className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${
                                 registered.find(r => r.id === event.id) 
                                   ? 'bg-indigo-400/10 text-indigo-400 border border-indigo-400/20' 
                                   : 'bg-white text-slate-950 hover:bg-brand-accent hover:text-slate-950 active:scale-95'
                               }`}
                             >
                               {registered.find(r => r.id === event.id) 
                                 ? 'Registered' 
                                 : (event.price === "Free" ? 'Register' : 'Grab Ticket')}
                             </button>
                          </div>
                        </div>
                      </motion.div>
                    )))}
                  </motion.div>
                </div>

                {/* 📊 User Insights */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold">User Insights</h3>
                  <div className="glass-panel p-6 rounded-[20px] space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-item p-4 rounded-2xl">
                        <div className="text-2xl font-black text-brand-accent">{registered.length}</div>
                        <div className="text-[10px] uppercase tracking-wider text-brand-text-secondary mt-1 font-bold">Events Joined</div>
                      </div>
                      <div className="glass-item p-4 rounded-2xl">
                        <div className="text-2xl font-black text-brand-accent">{bookmarks.length}</div>
                        <div className="text-[10px] uppercase tracking-wider text-brand-text-secondary mt-1 font-bold">Bookmarked</div>
                      </div>
                    </div>

                    <div className="glass-item p-4 rounded-2xl space-y-4 relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] uppercase tracking-wider text-brand-text-secondary font-bold">Network Growth</div>
                        <TrendingUp size={14} className="text-brand-accent animate-bounce" />
                      </div>
                      <div className="flex items-end gap-2 h-16 pt-2">
                        {[40, 65, 50, 90, 75, 85, 95].map((h, i) => (
                          <div 
                            key={i} 
                            style={{ height: `${h}%` }} 
                            className={`flex-1 rounded-sm bg-brand-accent transition-all duration-700 delay-[${i * 100}ms] ${i === 6 ? "shadow-[0_0_15px_var(--color-brand-accent-glow)]" : "opacity-40"}`} 
                          />
                        ))}
                      </div>
                      <div className="text-[11px] text-brand-accent font-bold flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
                         +24% this month
                      </div>
                    </div>

                    <button className="w-full py-3 rounded-xl border border-dashed border-brand-accent text-brand-accent text-sm font-bold bg-transparent">
                      Update Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
               {/* KPI Cards */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Community Members", value: globalStats.users, icon: User, color: "text-brand-accent" },
                    { label: "Total Summits", value: globalStats.events, icon: Globe, color: "text-blue-400" },
                    { label: "Departments", value: globalStats.departments, icon: GraduationCap, color: "text-indigo-400" },
                    { label: "Online Now", value: globalStats.onlineUsers, icon: Zap, color: "text-yellow-400" },
                  ].map((kpi, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-panel p-5 rounded-3xl flex items-center gap-4 border-l-4"
                      style={{ borderLeftColor: (CATEGORY_COLORS as any)[Object.keys(CATEGORY_COLORS)[i]] || 'var(--color-brand-accent)' }}
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${kpi.color}`}>
                        <kpi.icon size={24} />
                      </div>
                      <div>
                         <div className="text-2xl font-black">{kpi.value}</div>
                         <div className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">{kpi.label}</div>
                      </div>
                    </motion.div>
                  ))}
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                 <div className="xl:col-span-2 glass-panel p-8 rounded-3xl space-y-8">
                    <div>
                      <h2 className="text-2xl font-black">Engagement Velocity</h2>
                      <p className="text-sm text-brand-text-secondary mt-1">Growth in your campus connections over time.</p>
                    </div>
                    
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                          <YAxis hide />
                          <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                          />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {analyticsData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={index === 5 ? '#818cf8' : 'rgba(129, 140, 248, 0.2)'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="glass-panel p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-black">Recent Activity</h3>
                    <div className="space-y-4">
                       {[
                         { user: "Sarah L.", action: "Registered for AI Summit", time: "2m ago", icon: Ticket },
                         { user: "Tech Hub", action: "Updated Rulebook", time: "15m ago", icon: BookOpen },
                         { user: "Marcus P.", action: "Joined as Organizer", time: "1h ago", icon: User },
                         { user: "Innovation Lab", action: "New Event Mockup", time: "3h ago", icon: ImageIcon },
                         { user: "Kiran R.", action: "Grabbed Early Bird", time: "5h ago", icon: Zap }
                       ].map((activity, i) => (
                         <div key={i} className="flex gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-brand-glass flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent/20 transition-colors">
                               <activity.icon size={16} className="text-brand-text-secondary group-hover:text-brand-accent" />
                            </div>
                            <div className="min-w-0">
                               <p className="text-xs font-bold leading-tight"><span className="text-brand-accent">{activity.user}</span> {activity.action}</p>
                               <p className="text-[10px] text-brand-text-secondary mt-1">{activity.time}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-text-secondary hover:text-white transition-colors">View Audit Log</button>
                 </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="glass-panel p-8 rounded-3xl space-y-8">
                    <div>
                      <h2 className="text-2xl font-black">Interest Overview</h2>
                      <p className="text-sm text-brand-text-secondary mt-1">Segmented view of your interests.</p>
                    </div>
                    
                    <div className="h-80 w-full text-brand-accent">
                      <ResponsiveContainer width="100%" height="100%">
                        {categoryDistribution.length > 0 ? (
                          <PieChart>
                            <Pie
                              data={categoryDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={8}
                              dataKey="value"
                              stroke="none"
                            >
                              {categoryDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={(CATEGORY_COLORS as any)[entry.name]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                              itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                            <TrendingUp size={48} className="mb-4 text-brand-text-secondary" />
                            <p className="text-sm">Register for events to see your interest breakdown!</p>
                          </div>
                        )}
                      </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="glass-panel p-8 rounded-3xl space-y-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <GraduationCap size={150} />
                     </div>
                     <div>
                       <h2 className="text-2xl font-black">Campus Leaderboard</h2>
                       <p className="text-sm text-brand-text-secondary mt-1">Top performing organizers this semester.</p>
                     </div>
                     
                     <div className="space-y-4 relative z-10">
                        {[
                          { name: "Entrepreneurship Cell", stats: "14 Events • 4.2k Attendees", rank: 1 },
                          { name: "DevComm IITB", stats: "8 Events • 2.8k Attendees", rank: 2 },
                          { name: "Design Studio", stats: "5 Events • 1.1k Attendees", rank: 3 },
                          { name: "Robotics Club", stats: "4 Events • 850 Attendees", rank: 4 }
                        ].map((club, i) => (
                          <div key={i} className="flex items-center justify-between p-4 glass-item rounded-2xl hover:border-brand-accent/30 transition-all cursor-pointer">
                             <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${i === 0 ? "bg-yellow-400 text-slate-950" : "bg-white/10 text-white"}`}>
                                   {club.rank}
                                </div>
                                <div>
                                   <div className="text-sm font-bold">{club.name}</div>
                                   <div className="text-[10px] text-brand-text-secondary">{club.stats}</div>
                                </div>
                             </div>
                             <ChevronRight size={16} className="text-brand-text-secondary" />
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-6 rounded-3xl bg-brand-accent/5 border border-brand-accent/10 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_-20%,rgba(45,212,191,0.1),transparent)]" />
                 <div className="w-14 h-14 rounded-2xl bg-brand-accent flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(45,212,191,0.2)] flex-shrink-0 animate-pulse">
                   <Zap size={28} />
                 </div>
                 <div className="flex-1">
                   <h4 className="text-lg font-black italic tracking-tight">Platform Prediction: High Velocity Expected</h4>
                   <p className="text-sm text-brand-text-secondary mt-1 leading-relaxed max-w-3xl">Our algorithms suggest a <span className="text-brand-accent font-bold">14% increase</span> in regional registrations over the next 48 hours for Tech-centric summits. Optimize your broadcast frequency to capture peak student interest between 18:00 and 21:00 IST.</p>
                 </div>
                 <button className="px-6 py-3 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Deploy Campaign</button>
               </div>
            </div>
          )}

          {activeTab === "organizer" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
               <div>
                 <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                   Organizer Hub <div className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-1 rounded border border-indigo-500/20">ROOT ACCESS</div>
                 </h2>
                 <p className="text-sm text-brand-text-secondary mt-1">Manage event assets and community engagement.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {organizerEvents.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass-panel rounded-[3rem] border-dashed border-2 border-brand-border">
                       <Briefcase size={64} className="mx-auto mb-6 text-brand-text-secondary opacity-20" />
                       <h3 className="text-2xl font-black mb-2">No Managed Events</h3>
                       <p className="text-brand-text-secondary max-w-xs mx-auto">Create or join an event as an organizer to see it here.</p>
                    </div>
                  ) : (
                    organizerEvents.map(e => (
                      <OrganizerCard 
                         key={e.id} 
                         event={e} 
                         registered={registered}
                         onUpdateImage={(id, image) => setEventOverrides(prev => ({
                           ...prev,
                           [id]: { ...prev[id], image }
                         }))}
                         onManage={(ev) => {
                           setManagingEvent(ev);
                           // By default, opening the management console should show the dashboard
                         }}
                       />
                    ))
                  )}
               </div>
            </div>
          )}
          {activeTab === "tickets" && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Registered Events</h2>
                    <p className="text-sm text-brand-text-secondary mt-1">Your upcoming campus credentials.</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold">+</div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {registered.length === 0 ? (
                    <div className="col-span-full h-80 glass-panel rounded-[2rem] flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-brand-border">
                      <div className="w-20 h-20 rounded-3xl bg-brand-glass flex items-center justify-center mb-6">
                        <Ticket size={40} className="text-brand-accent opacity-50 outline-dotted outline-2 outline-offset-8 outline-brand-accent/20" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Active Passes</h3>
                      <p className="text-brand-text-secondary text-sm max-w-xs">The campus is buzzing with activity. Secure your spot at the next summit!</p>
                      <button 
                        onClick={() => setActiveTab("explore")} 
                        className="mt-8 px-6 py-3 bg-brand-accent text-slate-950 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-brand-accent/20"
                      >
                        Explore Summits
                      </button>
                    </div>
                  ) : (
                    MOCK_EVENTS.filter(e => registered.find(r => r.id === e.id)).map(e => {
                      const reg = registered.find(r => r.id === e.id);
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={e.id} 
                          className="relative glass-panel rounded-[2rem] flex flex-col sm:flex-row overflow-hidden group"
                        >
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                          <img src={e.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                          <div className="absolute top-4 left-4 bg-brand-accent text-slate-950 text-[9px] font-black tracking-widest px-2 py-1 rounded">
                            {e.price === "Free" ? "CONFIRMED" : "PREMIUM PASS"}
                          </div>
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between relative">
                          <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-brand-bg rounded-full hidden sm:block" />
                          <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-brand-bg rounded-full hidden sm:block shadow-inner" />
                          
                          <div className="space-y-4">
                            <div>
                              <div className="text-[10px] font-black text-brand-accent tracking-widest uppercase mb-1">{e.category}</div>
                              <h3 className="text-xl font-black leading-tight tracking-tight">{e.name}</h3>
                            </div>
                            
                            <div className="space-y-2 border-l-2 border-brand-accent/20 pl-4">
                               <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                                 <Calendar size={14} className="text-brand-accent" />
                                 <span className="font-bold text-brand-text-primary">{e.date}</span>
                               </div>
                               <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                                 <MapPin size={14} className="text-brand-accent" />
                                 <span className="font-bold">{e.location}</span>
                               </div>
                            </div>
                           <div className="mt-6 pt-6 border-t border-brand-border flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <div className={`w-8 h-8 rounded bg-indigo-400/20 flex items-center justify-center text-indigo-400`}>
                                 <ShieldCheck size={16} />
                               </div>
                               <div>
                                 <div className="text-[10px] font-black text-indigo-400 uppercase">
                                   {reg?.role === "Organizer" ? "Team Access" : "Verified Attendee"}
                                 </div>
                                 <div className="text-[9px] text-brand-text-secondary">Order #E24{e.id}0{reg?.role === "Organizer" ? 'ORG' : 'PAR'}</div>
                               </div>
                             </div>
                           <div className="flex gap-2">
                             <button 
                               onClick={() => setViewingRulebookEvent(e)}
                               className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-all border border-white/10 flex items-center gap-2 text-[11px] font-bold text-brand-accent"
                             >
                               <BookOpen size={16} /> <span className="hidden lg:inline">Rules</span>
                             </button>
                             <button className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-all border border-white/10 flex items-center gap-2 text-[11px] font-bold">
                               <QrCode size={16} /> <span className="hidden lg:inline">View Pass</span>
                             </button>
                             <button className="bg-brand-accent text-slate-950 p-2.5 rounded-xl hover:scale-105 transition-all flex items-center justify-center group/btn shadow-lg shadow-brand-accent/20">
                               <ExternalLink size={16} />
                               <span className="max-w-0 overflow-hidden group-hover/btn:max-w-[100px] transition-all whitespace-nowrap text-xs ml-0 group-hover/btn:ml-2">Event Details</span>
                             </button>
                           </div>
                          </div>

                          </div>
                        </div>
                      </motion.div>
                    );
                  }))}
                </div>
              </div>
          )}

        </div>
      </main>

      {/* 👤 Profile Modal (Expanded) */}
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfile(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="relative w-full max-w-2xl glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden p-6 lg:p-10 space-y-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <GraduationCap size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Identity Hub</h2>
                      <p className="text-sm text-brand-text-secondary mt-1">Refine your campus presence.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowProfile(false)} className="p-2 text-brand-text-secondary hover:text-white transition-colors"><X /></button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-1 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2rem] bg-brand-accent p-1 shadow-[0_0_40px_rgba(45,212,191,0.2)] overflow-hidden">
                        <div className="w-full h-full rounded-[1.8rem] border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-white text-4xl font-black uppercase overflow-hidden">
                          {profile.avatar ? (
                            <img src={profile.avatar} className="w-full h-full object-cover" alt="" />
                          ) : (
                            profile.name.charAt(0)
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-slate-950 border border-brand-border flex items-center justify-center text-brand-accent shadow-xl">
                        <ImageIcon size={18} />
                      </div>
                    </div>

                    <div className="space-y-4 w-full">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black tracking-widest text-brand-text-secondary ml-1 block text-center lg:text-left">Identity Visual</label>
                          <div className="flex flex-col items-center lg:items-start gap-4">
                            <button 
                              onClick={() => document.getElementById('profile-upload')?.click()}
                              className="w-full glass-item rounded-xl px-4 py-3 text-xs focus:outline-none border-brand-accent/20 hover:border-brand-accent/60 transition-all font-bold flex items-center justify-center gap-2 text-brand-accent group/btn"
                            >
                              <ImageIcon size={14} className="group-hover/btn:scale-110 transition-transform" />
                              Select from Gallery
                            </button>
                            <input 
                              id="profile-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setProfile(prev => ({ ...prev, avatar: reader.result as string }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            {profile.avatar && (
                              <button 
                                onClick={() => setProfile(prev => ({ ...prev, avatar: "" }))}
                                className="text-[10px] font-bold text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest"
                              >
                                Remove Current
                              </button>
                            )}
                          </div>
                       </div>
                       
                       <div className="space-y-3 pt-4">
                          <p className="text-[11px] font-black text-brand-accent uppercase tracking-widest text-center border-b border-brand-accent/10 pb-2 mb-4">Focus Goal</p>
                          <select 
                            value={profile.goal}
                            onChange={e => setProfile({...profile, goal: e.target.value})}
                            className="w-full glass-item rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-accent font-bold bg-slate-900 border border-brand-border/50 text-brand-accent appearance-none text-center cursor-pointer hover:bg-slate-800 transition-colors"
                          >
                             {["Skill Mastery", "Networking", "Career Prep", "Research", "Project Launch"].map(g => (
                               <option key={g} value={g} className="bg-slate-950 text-white font-bold">{g}</option>
                             ))}
                          </select>
                          
                          <div className="mt-8 space-y-3">
                             <p className="text-[11px] font-black text-brand-accent uppercase tracking-widest text-center mb-4">Milestone Badges</p>
                             <div className="flex justify-center gap-3">
                                {[
                                  { icon: Zap, label: "Fast Mover", active: registered.length > 2 },
                                  { icon: Star, label: "Top Rated", active: bookmarks.length > 3 },
                                  { icon: ShieldCheck, label: "Verified", active: isProfileComplete }
                                ].map((badge, idx) => (
                                  <div 
                                    key={idx} 
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                                      badge.active 
                                        ? "bg-brand-accent/20 border-brand-accent text-brand-accent shadow-[0_0_15px_rgba(45,212,191,0.2)]" 
                                        : "bg-slate-900/50 border-brand-border text-slate-700 grayscale"
                                    }`}
                                    title={badge.label}
                                  >
                                    <badge.icon size={20} fill={badge.active ? "currentColor" : "none"} className={badge.active ? "animate-pulse" : ""} />
                                  </div>
                                ))}
                             </div>
                             <p className="text-[9px] text-center text-brand-text-secondary font-bold uppercase tracking-tight mt-2 italic">Collect badges by joining events!</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        { label: "Full Name", key: "name", icon: User },
                        { label: "Phone", key: "mobile", icon: Smartphone },
                        { label: "College", key: "college", icon: GraduationCap },
                        { label: "Department", key: "dept", icon: Globe },
                      ].map(field => (
                        <div key={field.key} className="space-y-2 group">
                           <div className="flex items-center gap-2 mb-1 ml-1">
                             <field.icon size={12} className="text-brand-accent opacity-50 group-focus-within:opacity-100 transition-opacity" />
                             <label className="text-[10px] uppercase font-black tracking-widest text-brand-text-secondary">{field.label}</label>
                           </div>
                           <input 
                             className="w-full glass-item rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-all font-medium"
                             value={(profile as any)[field.key] || ""}
                             onChange={e => setProfile({...profile, [field.key]: e.target.value})}
                           />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 group">
                      <div className="flex items-center gap-2 mb-1 ml-1">
                        <Info size={12} className="text-brand-accent opacity-50 transition-opacity" />
                        <label className="text-[10px] uppercase font-black tracking-widest text-brand-text-secondary">Short Bio</label>
                      </div>
                      <textarea 
                        rows={3}
                        className="w-full glass-item rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-all resize-none font-medium text-brand-text-primary"
                        placeholder="Tell the campus your story..."
                        value={profile.bio}
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 group">
                      <div className="flex items-center gap-2 mb-1 ml-1">
                        <Star size={12} className="text-brand-accent opacity-50 transition-opacity" />
                        <label className="text-[10px] uppercase font-black tracking-widest text-brand-text-secondary">Signature Skills</label>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2 p-2 glass-item rounded-xl min-h-[44px]">
                        {profile.skills.map(skill => (
                          <div key={skill} className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 group/tag">
                            {skill}
                            <button 
                              onClick={() => setProfile({...profile, skills: profile.skills.filter(s => s !== skill)})}
                              className="hover:text-white transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <input 
                        className="w-full glass-item rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-all font-medium"
                        placeholder="Add a new skill (Press Enter)"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                             const newSkill = e.currentTarget.value.trim();
                             if (!profile.skills.includes(newSkill)) {
                               setProfile({...profile, skills: [...profile.skills, newSkill]});
                             }
                             e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                       <button onClick={() => setShowProfile(false)} className="flex-1 bg-brand-accent text-slate-950 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-accent/20">
                          Confirm Identity
                       </button>
                    </div>
                  </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎟 Role Selection Modal */}
      <AnimatePresence>
        {viewingRulebookEvent && (
          <RulebookModal 
            event={viewingRulebookEvent} 
            onClose={() => setViewingRulebookEvent(null)} 
          />
        )}
        {managingEvent && (
          <OrganizerManagementModal 
            event={managingEvent} 
            onClose={() => setManagingEvent(null)}
            onBroadcast={(eid, ename, msg, type) => addBroadcast(eid, ename, msg, type)}
            onUpdateSubEvents={(eid, updated) => setEventOverrides(prev => ({
              ...prev,
              [eid]: { ...prev[eid], subEvents: updated }
            }))}
          />
        )}
        {showRoleSelection && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRoleSelection(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md glass-panel rounded-[2.5rem] p-8 space-y-8 text-center">
               <div className="mx-auto w-20 h-20 rounded-full bg-brand-accent/10 flex items-center justify-center mb-4">
                 <Zap size={40} className="text-brand-accent" />
               </div>
               <div>
                  <h2 className="text-2xl font-black">Choose Your Path</h2>
                  <p className="text-sm text-brand-text-secondary mt-2">How do you want to participate in this summit?</p>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => confirmRegistration("Participant")}
                    className="flex items-center gap-4 p-5 glass-item rounded-2xl hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-slate-950 transition-colors">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <div className="font-black text-white">As Participant</div>
                      <div className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-wider">Attend & Learn</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => confirmRegistration("Organizer")}
                    className="flex items-center gap-4 p-5 glass-item rounded-2xl hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <div className="font-black text-white">As Organizer</div>
                      <div className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-wider">Manage & Host</div>
                    </div>
                  </button>
               </div>

               <button onClick={() => setShowRoleSelection(false)} className="text-xs font-bold text-brand-text-secondary hover:text-white transition-colors underline underline-offset-4 decoration-brand-border">
                 Maybe later
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚀 Floating Back to Top */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => document.querySelector('.content-area-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-brand-accent text-slate-950 flex items-center justify-center shadow-[0_10px_40px_rgba(45,212,191,0.4)] z-[200] hover:scale-110 active:scale-95 transition-all border-4 border-slate-900 group"
          >
            <div className="absolute -top-12 right-0 bg-slate-950 text-brand-accent text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-accent/20">
              RETURN TO APEX
            </div>
            <ChevronRight size={24} className="-rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 📣 Global Broadcast Alert */}
      <AnimatePresence>
        {activeBroadcast && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-full max-w-xl px-4"
          >
            <div className="glass-panel p-1 rounded-2xl shadow-2xl border-2 border-brand-accent/50 overflow-hidden">
               <div className="relative bg-slate-950/80 backdrop-blur-xl p-4 sm:p-6 rounded-xl flex gap-4 sm:gap-6 overflow-hidden">
                  {/* Decorative pulse */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl animate-pulse" />
                  
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent flex-shrink-0 animate-pulse">
                    <ShieldAlert size={32} />
                  </div>
                  
                  <div className="flex-1 space-y-1 sm:space-y-2 py-1">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Universal Broadcast</span>
                        <span className="text-[9px] font-bold text-brand-text-secondary uppercase">{activeBroadcast.timestamp}</span>
                     </div>
                     <h4 className="text-sm sm:text-lg font-black leading-tight">Critical Message from {activeBroadcast.eventName}</h4>
                     <p className="text-xs sm:text-sm font-medium text-brand-text-primary leading-relaxed">
                        {activeBroadcast.message}
                     </p>
                  </div>

                  <button 
                    onClick={() => setActiveBroadcast(null)}
                    className="absolute top-3 right-3 p-1 text-brand-text-secondary hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
               </div>
               <div className="h-1 bg-brand-accent origin-left" style={{ transition: 'transform 8s linear', transform: 'scaleX(0)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #818cf8; }
      `}</style>
    </div>
  );
}
