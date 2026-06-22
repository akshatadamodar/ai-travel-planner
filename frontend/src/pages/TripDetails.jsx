import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";

function TripDetails() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);

  const [activity, setActivity] = useState("");

  const [selectedDay, setSelectedDay] = useState(1);

  const [instruction, setInstruction] = useState("");

  const fetchTrip = async () => {
    try {
      const res = await API.get(`/trips/${id}`);

      setTrip(res.data.trip);
    } catch (error) {
      toast.error("Failed to fetch trip");
    }
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  // Add activity
  const addActivity = async (day) => {
    if (!activity) return;

    try {
      await API.put(`/trips/${id}/add-activity`, {
        day,
        activity,
      });

      toast.success("Activity Added");

      setActivity("");

      fetchTrip();
    } catch (error) {
      toast.error("Failed");
    }
  };

  // Remove activity
  const removeActivity = async (day, item) => {
    try {
      await API.put(`/trips/${id}/remove-activity`, {
        day,
        activity: item,
      });

      toast.success("Removed");

      fetchTrip();
    } catch (error) {
      toast.error("Failed");
    }
  };

  // Regenerate day
  const regenerateDay = async () => {
    try {
      await API.put(`/trips/${id}/regenerate-day`, {
        day: selectedDay,
        instruction,
      });

      toast.success("Day Regenerated");

      setInstruction("");

      fetchTrip();
    } catch (error) {
      toast.error("Regeneration Failed");
    }
  };

  if (!trip)
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="page-card p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="badge">Trip details</p>
              <h1 className="page-title mt-4 text-4xl text-slate-950">{trip.destination}</h1>
              <p className="mt-3 text-slate-600">{trip.days} days itinerary · {trip.budgetType} budget</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Days</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{trip.days}</p>
              </div>
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Budget</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{trip.budgetType}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            <section className="page-card p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <h2 className="section-title">Itinerary</h2>
              <div className="space-y-6">
                {trip.itinerary.map((dayPlan) => (
                  <div key={dayPlan.day} className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-950">Day {dayPlan.day}</h3>
                        <p className="mt-2 text-slate-500">Activities planned for the day</p>
                      </div>
                    </div>
                    <ul className="mt-5 space-y-3">
                      {dayPlan.activities.map((item, index) => (
                        <li key={index} className="flex items-center justify-between rounded-3xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                          <span className="text-slate-700">{item}</span>
                          <button
                            onClick={() => removeActivity(dayPlan.day, item)}
                            className="text-red-600 font-semibold hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                      <input
                        type="text"
                        placeholder="New Activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-3xl text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                      <button onClick={() => addActivity(dayPlan.day)} className="btn-primary">
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="page-card p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <h2 className="section-title">Regenerate Day</h2>
              <select
                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-3xl text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 mb-4"
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
              >
                {[...Array(trip.days)].map((_, index) => (
                  <option key={index}>{index + 1}</option>
                ))}
              </select>
              <textarea
                rows="4"
                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-3xl text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="More outdoor activities..."
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
              <button onClick={regenerateDay} className="btn-primary w-full mt-4">
                Regenerate
              </button>
            </section>

            <section className="page-card p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <h2 className="section-title">Estimated Budget</h2>
              <div className="space-y-3 text-slate-700">
                <p>Flights: <span className="font-semibold text-slate-950">${trip.estimatedBudget?.flights}</span></p>
                <p>Accommodation: <span className="font-semibold text-slate-950">${trip.estimatedBudget?.accommodation}</span></p>
                <p>Food: <span className="font-semibold text-slate-950">${trip.estimatedBudget?.food}</span></p>
                <p>Activities: <span className="font-semibold text-slate-950">${trip.estimatedBudget?.activities}</span></p>
              </div>
              <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-slate-950 font-semibold">
                Total: ${trip.estimatedBudget?.total}
              </div>
            </section>

            <section className="page-card p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <h2 className="section-title">Hotels</h2>
              <div className="space-y-3">
                {trip.hotels?.map((hotel, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-950">{hotel.name}</h3>
                    <p className="text-slate-600">{hotel.type}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="page-card p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <h2 className="section-title">Packing Suggestions</h2>
              <ul className="space-y-3">
                {trip.packingSuggestions?.map((item, index) => (
                  <li key={index} className="rounded-3xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-slate-700">
                    🎒 {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TripDetails;