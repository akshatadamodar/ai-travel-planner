import { useNavigate } from "react-router-dom";

function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trip/${trip._id}`)}
      className="
      bg-white
      rounded-xl
      shadow-md
      p-5
      cursor-pointer
      hover:shadow-xl
      transition
      "
    >
      <h2 className="text-2xl font-bold">
        {trip.destination}
      </h2>

      <div className="mt-3 text-gray-600">
        <p>{trip.days} Days</p>

        <p>Budget : {trip.budgetType}</p>
      </div>

      <div className="mt-4">
        <span className="bg-blue-100 px-3 py-1 rounded">
          {trip.interests?.join(", ")}
        </span>
      </div>
    </div>
  );
}

export default TripCard;