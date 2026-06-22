import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    toast.success("Logged out successfully");

    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl px-6 md:px-10 py-4 flex items-center justify-between shadow-sm">
      <Link to="/dashboard" className="text-2xl font-semibold tracking-tight text-slate-950">
        AI Travel Planner
      </Link>

      <button
        onClick={handleLogout}
        className="btn-primary bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;