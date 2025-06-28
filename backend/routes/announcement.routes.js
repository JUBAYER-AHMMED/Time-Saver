import express from "express";
import Announcement from "../models/announcement.model.js";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Admins only" });
};

// GET all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
});

// POST a new announcement (admin only)
router.post("/", isAdmin, async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: "Title and message are required" });
  }

  try {
    const newAnnouncement = new Announcement({
      title,
      message,
      postedBy: req.user._id,
    });

    const saved = await newAnnouncement.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to post announcement" });
  }
});

// DELETE an announcement (admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete announcement" });
  }
});

export default router;
