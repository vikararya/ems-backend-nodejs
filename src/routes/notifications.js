import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET semua notifikasi terbaru
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20); // ambil 20 terbaru
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
