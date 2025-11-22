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
    items: [itineraryItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);
