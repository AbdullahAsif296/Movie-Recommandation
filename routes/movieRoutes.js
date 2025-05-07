import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";

import {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovie,
  getAllMovies,
} from "../controllers/movieController.js";

const router = express.Router();

// Admin-only routes
router.post("/", auth, isAdmin, addMovie);
router.put("/:id", auth, isAdmin, updateMovie);
router.delete("/:id", auth, isAdmin, deleteMovie);

// Public routes
router.get("/:id", getMovie);
router.get("/", getAllMovies);

export default router;
