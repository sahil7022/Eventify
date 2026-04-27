import { useState, useRef } from "react";
import { Bell, Search } from "lucide-react";

type User = {
  displayName: string;
};

export default function Topbar({ user }: { user: User }) {
  const [showProfile, setShowProfile] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Upload Profile Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center mb-8">

      {/* LOGO */}
      <h1 className="text-2xl font-bold text-cyan-400">
        Eventify
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* SEARCH */}
        <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
          <Search size={16} />
          <input
            placeholder="Search events..."
            className="bg-transparent outline-none text-sm text-white"
          />
        </div>

        {/* NOTIFICATION */}
        <div className="relative cursor-pointer">
          <Bell className="text-gray-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
        </div>

        {/* PROFILE */}
        <div className="relative">

          <div
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" />
            ) : (
              user?.displayName?.slice(0, 2)?.toUpperCase() || "User"
            )}
          </div>

          {/* DROPDOWN */}
          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-[#020617] border border-white/10 rounded-xl p-4 shadow-xl space-y-3">

              <div className="text-sm text-gray-300">
                {user.displayName}
              </div>

              {/* UPLOAD IMAGE */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-left text-sm hover:text-cyan-400"
              >
                Upload Profile Image
              </button>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />

              {/* COMPLETE PROFILE */}
              <button className="w-full text-left text-sm hover:text-cyan-400">
                Complete Profile
              </button>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}