import express from "express";
import Package from "../models/Package.js";
import Destination from "../models/Destination.js";

const router = express.Router();

// GET /api/packages
// filters: destinationId, type, maxPrice, minDuration, q, page, limit
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.max(1, parseInt(req.query.limit || "12"));
    const { destinationId, type, maxPrice, minDuration, q } = req.query;

    const filter = {};
    if (destinationId) filter.destination = destinationId;
    if (type) filter.type = type;
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    if (minDuration) filter.durationDays = { ...(filter.durationDays || {}), $gte: Number(minDuration) };
    if (q) filter.$text = { $search: q };

    const total = await Package.countDocuments(filter);
    const docs = await Package.find(filter)
      .populate("destination", "name country slug imageUrl")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ featured: -1, price: 1, createdAt: -1 });

    res.json({ docs, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Error fetching packages:", err);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

// GET /api/packages/:id
router.get("/:id", async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate("destination", "name country slug imageUrl");
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    console.error("Error fetching package:", err);
    res.status(500).json({ error: "Failed to fetch package" });
  }
});

export default router;
