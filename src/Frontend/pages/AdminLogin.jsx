import React, { useState } from "react";
import "./AdminLogin.css";
import loginImg from "../assets/business-user-shield_78370-7029.avif";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        formData
      );

      console.log("API RESPONSE:", res.data);

      if (!res.data || !res.data.admin) {
        setError(res.data.message || "Invalid credentials");
        return;
      }

      // ✅ Store token + admin
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      navigate("/admin/dashboard");

    } catch (err) {
      console.log(err);
      setError("Server error ❌");
    }
  };

  return (
    <div className="login-page">
      <div className="navbar">
        <div className="logo">SmartShop</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
        </div>
      </div>

      <div className="login-container">
        <div className="left">
          <img src={loginImg} alt="login" />
        </div>

        <div className="right">
          <h2>Admin Login</h2>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      <div className="footer">
        <p>© 2026 SmartShop</p>
      </div>
    </div>
  );
};

export default AdminLogin;
