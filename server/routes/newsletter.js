import express from "express";
import Subscriber from "../subscriberModel.js";

const router = express.Router();

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    const exists = await Subscriber.findOne({ email });
    if (exists) return res.status(409).json({ error: "Already subscribed" });
    await Subscriber.create({ email });
    res.json({ ok: true, message: "Subscribed successfully!" });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

export default router;
