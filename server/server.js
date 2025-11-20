import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Trip from "./tripModel.js"; // ✅ Import Trip model

// ✅ Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ✅ Debug info for environment file
console.log("🔍 .env exists:", fs.existsSync(path.resolve(process.cwd(), ".env")));
console.log("🔍 Mongo URI from .env:", process.env.MONGO_URI);

const app = express();

// ✅ Middleware setup
app.use(express.json());

// ✅ Allow frontend (React at port 3000) to access backend (port 5000)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

connectDB();

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ TravelTech backend is connected to MongoDB!");
});

// ✅ POST route — Save new trip
app.post("/api/trips", async (req, res) => {
  try {
    const { destination, days, budget } = req.body;

    if (!destination || !days || !budget) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const trip = new Trip({ destination, days, budget });
    await trip.save();

    console.log(`🆕 New Trip Added: ${destination} — ${days} days — ₹${budget}`);
    res.status(201).json({ message: "Trip saved successfully!", trip });
  } catch (error) {
    console.error("❌ Error saving trip:", error);
    res.status(500).json({ error: "Failed to save trip" });
  }
});

// ✅ GET route — Retrieve all trips
app.get("/api/trips", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error("❌ Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

// ✅ Handle invalid routes gracefully
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
