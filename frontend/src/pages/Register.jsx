import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/register",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("Registration Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center px-4 py-12">
      <div className="page-card w-full max-w-md p-10">
        <div className="mb-8">
          <p className="badge">Start planning</p>
          <h1 className="page-title mt-4 text-4xl text-slate-950">Create your account</h1>
          <p className="mt-3 text-slate-600">Sign up now to begin building AI-powered travel itineraries.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full border border-slate-200 bg-slate-50 px-5 py-3 rounded-3xl text-slate-900 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            value={formData.name}
            onChange={handleChange}
            required
          />

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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Already have an account?{' '}
          <Link to="/" className="text-sky-600 font-semibold hover:text-sky-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;