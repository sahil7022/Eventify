type User = {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin" | "super_admin";
};

export default function MainLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="w-full mx-auto px-6 py-8">

        {/* 🔥 IMPORTANT */}
        {children}

      </div>
    </div>
  );
}