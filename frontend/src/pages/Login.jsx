import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center px-4 py-12">
      <div className="page-card w-full max-w-md p-10">
        <div className="mb-8">
          <p className="badge">Travel smarter</p>
          <h1 className="page-title mt-4 text-4xl text-slate-950">Login to your account</h1>
          <p className="mt-3 text-slate-600">Access your AI-powered travel plans with a secure login.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-slate-200 bg-slate-50 px-5 py-3 rounded-3xl text-slate-900 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-slate-200 bg-slate-50 px-5 py-3 rounded-3xl text-slate-900 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            disabled={loading}
            className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-600 font-semibold hover:text-sky-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;