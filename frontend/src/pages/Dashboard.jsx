import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TripCard from "../components/TripCard";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const res = await API.get("/trips");

      setTrips(res.data.trips);
    } catch (error) {
      toast.error("Unable to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="page-card p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="badge">Plan your next adventure</p>
              <h1 className="page-title mt-4 text-4xl text-slate-950">My Trips</h1>
              <p className="mt-3 text-slate-600 max-w-2xl">
                View your current itineraries and generate new travel plans with AI-powered recommendations.
              </p>
            </div>

            <button
              onClick={() => navigate("/create-trip")}
              className="btn-primary"
            >
              Create Trip
            </button>
          </div>
        </section>

        {loading ? (
          <div className="text-center mt-12 text-slate-600">Loading your trips...</div>
        ) : trips.length === 0 ? (
          <div className="page-card mt-8 p-10 text-center">
            <h2 className="text-3xl font-semibold text-slate-950">No Trips Yet</h2>
            <p className="mt-3 text-slate-600">Start your first AI-powered itinerary and explore new destinations.</p>
            <button
              onClick={() => navigate("/create-trip")}
              className="btn-primary mt-8"
            >
              Create your first trip
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-8">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;