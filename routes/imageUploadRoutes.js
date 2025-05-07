import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  uploadMovieImage,
  uploadActorImage,
  uploadDirectorImage,
} from "../controllers/imageUploadController.js";

const router = express.Router();

// Image upload routes (admin only)
router.post(
  "/movies/:movieId/images",
  auth,
  isAdmin,
  upload.array("images", 5),
  uploadMovieImage
);
router.post(
  "/actors/:actorId/images",
  auth,
  isAdmin,
  upload.array("images", 5),
  uploadActorImage
);
router.post(
  "/directors/:directorId/images",
  auth,
  isAdmin,
  upload.array("images", 5),
  uploadDirectorImage
);

export default router;
