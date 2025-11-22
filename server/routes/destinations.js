import express from "express";
import Destination from "../models/Destination.js";

const router = express.Router();

// GET /api/destinations
// supports ?page=1&limit=12&q=search
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.max(1, parseInt(req.query.limit || "12"));
    const q = req.query.q;

    const filter = {};
    if (q) filter.$text = { $search: q };

    const total = await Destination.countDocuments(filter);
    const docs = await Destination.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ featured: -1, createdAt: -1 });

    res.json({ docs, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Error fetching destinations:", err);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

// GET /api/destinations/:id
router.get("/:id", async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ error: "Destination not found" });
    res.json(dest);
  } catch (err) {
    console.error("Error fetching destination:", err);
    res.status(500).json({ error: "Failed to fetch destination" });
  }
});

export default router;
