import Trip from "../models/Trip.js";
import {
  generateTravelPlan,
  regenerateDayPlan,
} from "../services/geminiService.js";

import { getPackingSuggestions } from "../services/weatherService.js";

/* =========================
   CREATE TRIP
========================= */
export const createTrip = async (req, res) => {
  try {
    const { destination, days, budgetType, interests } =
      req.body;

    let aiData;

    try {
      aiData = await generateTravelPlan(
        destination,
        days,
        budgetType,
        interests
      );
    } catch (error) {
      return res.status(503).json({
        success: false,
        message: "AI service is busy. Please try again later.",
      });
    }

    const packingSuggestions =
      await getPackingSuggestions(destination);

    const trip = await Trip.create({
      destination,
      days,
      budgetType,
      interests,
      itinerary: aiData.itinerary,
      estimatedBudget: aiData.estimatedBudget,
      hotels: aiData.hotels,
      packingSuggestions,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL TRIPS
========================= */
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SINGLE TRIP
========================= */
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADD ACTIVITY  ✅ FIX HERE
========================= */
export const addActivity = async (req, res) => {
  try {
    const { day, activity } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const dayPlan = trip.itinerary.find(
      (d) => d.day === Number(day)
    );

    if (!dayPlan) {
      return res.status(404).json({
        success: false,
        message: "Day not found",
      });
    }

    dayPlan.activities.push(activity);

    await trip.save();

    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   REMOVE ACTIVITY
========================= */
export const removeActivity = async (req, res) => {
  try {
    const { day, activity } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const dayPlan = trip.itinerary.find(
      (d) => d.day === Number(day)
    );

    if (!dayPlan) {
      return res.status(404).json({
        success: false,
        message: "Day not found",
      });
    }

    dayPlan.activities = dayPlan.activities.filter(
      (a) => a !== activity
    );

    await trip.save();

    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   REGENERATE DAY
========================= */
export const regenerateDay = async (req, res) => {
  try {
    const { day, instruction } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const newDay = await regenerateDayPlan(
      trip.destination,
      day,
      trip.interests,
      instruction
    );

    const index = trip.itinerary.findIndex(
      (d) => d.day === Number(day)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Day not found",
      });
    }

    trip.itinerary[index] = newDay;

    await trip.save();

    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   PACKING LIST
========================= */
export const getPackingList = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      packingSuggestions: trip.packingSuggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};