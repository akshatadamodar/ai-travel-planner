import express from "express";

import {
  createTrip,
  getTrips,
  getTripById,
  addActivity,
  removeActivity,
  regenerateDay,
  getPackingList,
} from "../controllers/tripController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTrip);

router.get("/", protect, getTrips);

router.get("/:id", protect, getTripById);

router.put("/:id/add-activity", protect, addActivity);

router.put("/:id/remove-activity", protect, removeActivity);

router.put("/:id/regenerate-day", protect, regenerateDay);

router.get("/:id/packing-list", protect, getPackingList);

export default router;