// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, Calendar, User, Bell } from "lucide-react";

// export default function Sidebar() {
//   return (
//     <div className="w-64 min-h-screen bg-[#021011] border-r border-white/10 p-6 flex flex-col">

//       {/* LOGO */}
//       <h1 className="text-2xl font-bold text-cyan-400 mb-10">
//         Eventify
//       </h1>

//       {/* NAV LINKS */}
//       <nav className="flex flex-col gap-4">

//         <NavLink
//           to="/dashboard"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-lg transition ${
//               isActive
//                 ? "bg-cyan-400 text-black"
//                 : "text-gray-400 hover:bg-white/10"
//             }`
//           }
//         >
//           <LayoutDashboard size={20} />
//           Dashboard
//         </NavLink>

//         <NavLink
//           to="/events"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-lg transition ${
//               isActive
//                 ? "bg-cyan-400 text-black"
//                 : "text-gray-400 hover:bg-white/10"
//             }`
//           }
//         >
//           <Calendar size={20} />
//           Events
//         </NavLink>

//         <NavLink
//           to="/profile"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-lg transition ${
//               isActive
//                 ? "bg-cyan-400 text-black"
//                 : "text-gray-400 hover:bg-white/10"
//             }`
//           }
//         >
//           <User size={20} />
//           Profile
//         </NavLink>

//         <NavLink
//           to="/notifications"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-lg transition ${
//               isActive
//                 ? "bg-cyan-400 text-black"
//                 : "text-gray-400 hover:bg-white/10"
//             }`
//           }
//         >
//           <Bell size={20} />
//           Notifications
//         </NavLink>

//       </nav>
//     </div>
//   );
// }