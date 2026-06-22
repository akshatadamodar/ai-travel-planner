import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CreateTrip() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budgetType: "Medium",
    interests: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createTrip = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        destination: formData.destination,
        days: Number(formData.days),
        budgetType: formData.budgetType,
        interests: formData.interests
          .split(",")
          .map((item) => item.trim()),
      };

      const res = await API.post(
        "/trips",
        payload
      );

      toast.success("Trip Created Successfully");

      navigate(`/trip/${res.data.trip._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Trip Creation Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="page-card overflow-hidden p-8 shadow-[0_20px_60px_rgba(15,23,42,0.09)]">
          <div className="mb-8">
            <p className="badge">Build your perfect trip</p>
            <h1 className="page-title mt-4 text-4xl text-slate-950">Create a new travel plan</h1>
            <p className="mt-3 text-slate-600 max-w-2xl">
              Tell us where you want to go and what you love, and the AI will generate a travel itinerary for you.
            </p>
          </div>

          <form className="space-y-5" onSubmit={createTrip}>
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              className="w-full border border-slate-200 bg-slate-50 px-5 py-3 rounded-3xl text-slate-900 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={formData.destination}
              onChange={handleChange}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                name="days"
                placeholder="Days"
                className="w-full border border-slate-200 bg-slate-50 px-5 py-3 rounded-3xl text-slate-900 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                value={formData.days}
                onChange={handleChange}
                required
              />

              <select
                className="w-full border border-slate-200 bg-slate-50 px-5 py-3 rounded-3xl text-slate-900 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                name="budgetType"
                value={formData.budgetType}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <input
              type="text"
              name="interests"
              placeholder="Food, Shopping, Culture"
              className="w-full border border-slate-200 bg-slate-50 px-5 py-3 rounded-3xl text-slate-900 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={formData.interests}
              onChange={handleChange}
              required
            />

            <button
              disabled={loading}
              className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Generating Trip..." : "Generate AI Trip"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CreateTrip;