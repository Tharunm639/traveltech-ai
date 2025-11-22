import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  {
    day: { type: Number },
    title: { type: String },
    details: { type: String },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    type: { type: String, enum: ["family", "solo", "couple", "adventure", "luxury"], default: "family" },
    images: [{ type: String }],
    summary: { type: String },
    itineraryOutline: [itineraryItemSchema],
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

packageSchema.index({ title: "text", summary: "text", tags: "text" });

export default mongoose.model("Package", packageSchema);
