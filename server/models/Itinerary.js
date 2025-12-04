import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  {
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    startDate: { type: Date },
    notes: { type: String },
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String },
    type: { type: String, enum: ['package', 'ai'], default: 'package' }, // 'package' or 'ai'
    items: { type: [itineraryItemSchema], default: [] }, // For package-based itineraries
    details: { type: Object }, // For AI-generated itineraries (stores the full JSON)
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);
