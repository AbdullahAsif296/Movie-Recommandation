import express from "express";
import { auth } from "../middlewares/authMiddleware.js";
import multer from "multer";
import {
  upsertProfile,
  getProfile,
  updateAvatar,
  deleteProfile,
  updateFavoriteGenres,
  updateFavoriteActors,
  updateBio
} from "../controllers/profileController.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Profile routes
router.get("/profile", auth, getProfile);
router.post("/profile", auth, upsertProfile);
router.put("/profile", auth, upsertProfile);
router.delete("/profile", auth, deleteProfile);

// Field-specific update routes
router.put("/profile/genres", auth, updateFavoriteGenres);
router.put("/profile/actors", auth, updateFavoriteActors);
router.put("/profile/bio", auth, updateBio);
router.put("/profile/avatar", auth, upload.single("avatar"), updateAvatar);

export default router;