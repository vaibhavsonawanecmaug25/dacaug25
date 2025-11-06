import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./authcontext.jsx";  


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ from AuthContext
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { token, user } = await apiLogin(form.email, form.password);

      // ✅ Save token & user in AuthContext
      login(token, user);

      toast.success("Login successful!");

      // Redirect based on role (make sure role is lowercase in DB)
      const target = user?.role === "admin" ? "/admin" : "/dashboard";
      setTimeout(() => navigate(target), 500);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="card p-4 shadow" style={{ width: "25rem" }}>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <p className="text-center mt-3">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
