import express from "express";
import Itinerary from "../models/Itinerary.js";
import Package from "../models/Package.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/itineraries
// Authenticated users get their own itineraries. Admins can request all by adding ?all=true
router.get("/", authenticate, async (req, res) => {
  try {
    const { all } = req.query;
    let docs;
    if (all && req.user.role === 'admin') {
      docs = await Itinerary.find().sort({ createdAt: -1 }).populate("items.package", "title price durationDays images");
    } else {
      docs = await Itinerary.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate("items.package", "title price durationDays images");
    }
    res.json(docs);
  } catch (err) {
    console.error("Error fetching itineraries:", err);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

// POST /api/itineraries
// Body: { name, items: [{ packageId, startDate?, notes? }] }
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, items } = req.body;
    if (!name || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid payload: name and items[] are required" });
    }

    // Validate package IDs exist
    const packageIds = items.map(i => i.packageId);
    const found = await Package.find({ _id: { $in: packageIds } }).select("_id");
    if (found.length !== packageIds.length) {
      return res.status(400).json({ error: "One or more packageIds are invalid" });
    }

    const mappedItems = items.map(i => ({ package: i.packageId, startDate: i.startDate, notes: i.notes }));

    const it = new Itinerary({ name, userId: req.user.id, items: mappedItems });
    await it.save();

    res.status(201).json(it);
  } catch (err) {
    console.error("Error creating itinerary:", err);
    res.status(500).json({ error: "Failed to create itinerary" });
  }
});

// PATCH /api/itineraries/:id  -> update name or items (owner or admin)
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const it = await Itinerary.findById(req.params.id);
    if (!it) return res.status(404).json({ error: 'Itinerary not found' });
    if (String(it.userId) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    Object.assign(it, req.body);
    await it.save();
    const updated = await Itinerary.findById(it._id).populate('items.package', 'title price durationDays images');
    res.json(updated);
  } catch (err) {
    console.error('Error updating itinerary:', err);
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
});

// DELETE /api/itineraries/:id (owner or admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const it = await Itinerary.findById(req.params.id);
    if (!it) return res.status(404).json({ error: 'Itinerary not found' });
    if (String(it.userId) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await Itinerary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting itinerary:', err);
    res.status(500).json({ error: 'Failed to delete itinerary' });
  }
});

export default router;
