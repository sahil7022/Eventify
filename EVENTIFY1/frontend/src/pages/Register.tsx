import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  // 🔥 FORM STATE
  const [formData, setFormData] = useState({
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

  // 🔥 STATS STATE
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    departments: 0,
    onlineUsers: 0,
  });

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔥 ANIMATE STATS
  const animateValue = (start, end, duration, key) => {
    let startTime = null;

    const step = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);

      setStats((prev) => ({
        ...prev,
        [key]: Math.floor(progress * (end - start) + start),
      }));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // 🔥 LOAD STATS
  const loadStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stats");
      const data = res.data;

      animateValue(0, data.users, 800, "users");
      animateValue(0, data.events, 800, "events");
      animateValue(0, data.departments, 800, "departments");
      animateValue(0, data.onlineUsers, 800, "onlineUsers");

    } catch (err) {
      console.log("Stats error");
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert("Accept terms first");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/register", {
        name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        institution: formData.institution,
        department: formData.department,
        year: formData.year,
      });

      alert("Registration successful");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}
      <div className="register-left">
        <h1 className="logo">Eventify</h1>
        <p className="tagline">Your gateway to amazing events</p>

        <div className="stats">
          <div className="stat-box"><h2>{stats.users}</h2><p>Users</p></div>
          <div className="stat-box"><h2>{stats.events}</h2><p>Events</p></div>
          <div className="stat-box"><h2>{stats.departments}</h2><p>Departments</p></div>
          <div className="stat-box"><h2>{stats.onlineUsers}</h2><p>Online</p></div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-card">

        <form onSubmit={handleRegister} className="register-form">

          <h2>Create Account</h2>

          <div className="row">
            <input name="firstName" placeholder="First Name" onChange={handleChange} className="input" required />
            <input name="middleName" placeholder="Middle" onChange={handleChange} className="input" />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} className="input" required />
          </div>

          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input" required />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />

          <input name="institution" placeholder="Institution" onChange={handleChange} className="input" required />
          <input name="department" placeholder="Department" onChange={handleChange} className="input" required />

          <select name="year" onChange={handleChange} className="input">
            <option value="">Select Year</option>
            <option>First Year</option>
            <option>Second Year</option>
            <option>Third Year</option>
            <option>Fourth Year</option>
            <option>Postgraduate</option>
            <option>Faculty</option>
          </select>

          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="input" required />

<div className="terms-container">
  <label className="terms-label">
    <input
      type="checkbox"
      name="terms"
      onChange={handleChange}
      required
    />
    <span>
      I agree to the <b>Terms & Conditions</b>
    </span>
  </label>
</div>
          <button className="btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>

        </form>
      </div>
    </div>
  );
}