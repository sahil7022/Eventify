import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export default function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

useEffect(() => {
  const canvasEl = canvasRef.current;
  if (!canvasEl) return;

  const ctx = canvasEl.getContext("2d");
  if (!ctx) return;
  const ctxSafe = ctx;

  let particles: Particle[] = [];

  const resize = () => {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
  };

  resize();
  window.addEventListener("resize", resize);

  // CREATE PARTICLES
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
    });
  }

  // ✅ LOCK SAFE REFERENCES
  const canvas = canvasEl;

  function draw() {
    const width = canvas.width;
    const height = canvas.height;

    ctxSafe.clearRect(0, 0, width, height);

    // DOTS
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctxSafe.beginPath();
      ctxSafe.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctxSafe.fillStyle = "rgba(255,255,255,0.9)";
      ctxSafe.fill();
    });

    // LINES
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctxSafe.beginPath();
          ctxSafe.strokeStyle = "rgba(255,255,255,0.15)";
          ctxSafe.moveTo(particles[i].x, particles[i].y);
          ctxSafe.lineTo(particles[j].x, particles[j].y);
          ctxSafe.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  return () => {
    window.removeEventListener("resize", resize);
  };
}, []);

  return (
    <div className="relative min-h-screen bg-[#031416] text-white overflow-hidden">

      {/* 🌌 CANVAS */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* 🌫️ OVERLAY */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(3,20,22,0.4)",
          zIndex: 1,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10">

        {/* NAVBAR */}
        <nav className="flex justify-between items-center px-10 py-6">
          <h1 className="text-2xl font-bold text-cyan-400">Eventify</h1>

          <div className="flex gap-6 text-gray-300">
            <button
              onClick={() => navigate("/login")}
              className="hover:text-white transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="hover:text-white transition"
            >
              Register
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div className="flex flex-col items-center justify-center text-center mt-20 px-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg">
            Smart Event Platform
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            Discover, organize, and participate in campus events with a modern AI-powered system.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-10 px-8 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition shadow-lg"
          >
            Enter Platform →
          </button>
        </div>

        {/* FEATURES */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 px-10 pb-20">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-2">🚀 AI Recommendations</h3>
            <p className="text-gray-400">
              Get personalized event suggestions based on your interests.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-2">📅 Smart Scheduling</h3>
            <p className="text-gray-400">
              Never miss an event with automated reminders and tracking.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-2">🤝 Community</h3>
            <p className="text-gray-400">
              Connect, collaborate, and grow with like-minded people.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}