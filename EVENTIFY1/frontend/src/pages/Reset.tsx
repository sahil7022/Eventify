import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Reset() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password) {
      alert("Enter new password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          password,
        }
      );

      const data = res.data;

      alert(data.message || "Password updated");

      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#031416] via-[#083b3d] to-[#0d8f86]">

      {/* Glow Background */}
      <div className="absolute w-[350px] h-[350px] bg-cyan-400/20 blur-[120px] rounded-full top-10 left-10"></div>
      <div className="absolute w-[250px] h-[250px] bg-teal-500/20 blur-[100px] rounded-full bottom-10 right-10"></div>

      {/* Card */}
      <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-[350px] border border-white/10 text-white">

        <h2 className="text-xl font-semibold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-gray-400 text-center text-sm mb-6">
          Enter your new password
        </p>

        <form onSubmit={handleReset} className="space-y-4">

          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 transition p-2 rounded-lg font-semibold"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}