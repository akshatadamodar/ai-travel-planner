import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    activities: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
      trim: true,
    },

    days: {
      type: Number,
      required: true,
    },

    budgetType: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    interests: [
      {
        type: String,
      },
    ],

    itinerary: [activitySchema],

    estimatedBudget: {
      flights: Number,
      accommodation: Number,
      food: Number,
      activities: Number,
      total: Number,
    },

    hotels: [hotelSchema],

    weatherInfo: {
      weather: String,
      temperature: Number,
    },

    packingList: [
      {
        type: String,
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
