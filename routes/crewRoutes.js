import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createCrew,
  getAllCrew,
  getCrewById,
  updateCrew,
  deleteCrew
} from "../controllers/crewController.js";

const router = express.Router();

// Public routes
router.get("/", getAllCrew);
router.get("/:id", getCrewById);

// Admin only routes
router.post("/", auth, isAdmin, createCrew);
router.put("/:id", auth, isAdmin, updateCrew);
router.delete("/:id", auth, isAdmin, deleteCrew);

export default router; 