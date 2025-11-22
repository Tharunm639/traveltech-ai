import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import Trip from "./tripModel.js"; // ✅ Import Trip model
import destinationsRouter from "./routes/destinations.js";
import packagesRouter from "./routes/packages.js";
import itinerariesRouter from "./routes/itineraries.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import enquiriesRouter from "./routes/enquiries.js";
import aiRouter from "./routes/ai.js";
import errorHandler from "./middleware/errorHandler.js";

// ✅ Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ✅ Debug info for environment file
console.log("🔍 .env exists:", fs.existsSync(path.resolve(process.cwd(), ".env")));
console.log("🔍 Mongo URI from .env:", process.env.MONGO_URI);

const app = express();

// ✅ FIX: Trust proxy to allow rate limiter to work correctly behind the React proxy
app.set('trust proxy', 1);

// ✅ Middleware setup
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Basic rate limiting
const limiter = rateLimit({ windowMs: 60_000, max: 120 });
app.use(limiter);

// ✅ Allow frontend (React at port 3000) to access backend (port 5000)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
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

// Mount new routers
app.use("/api/destinations", destinationsRouter);
app.use("/api/packages", packagesRouter);
app.use("/api/itineraries", itinerariesRouter);
// Enquiries (public create)
app.use('/api/enquiries', enquiriesRouter);
// AI proxy route (Anthropic or other providers)
app.use('/api/ai', aiRouter);
// Authentication routes
app.use('/api/auth', authRouter);
// Admin routes (protected by header token)
app.use('/api/admin', adminRouter);

// Error handler (should be last)
app.use(errorHandler);

// ✅ Handle invalid routes gracefully
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});