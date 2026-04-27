import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      const data = res.data;

      alert(data.message || "Reset link sent");

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

        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleForgot} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 transition p-2 rounded-lg font-semibold"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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