import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    region: { type: String },
    imageUrl: { type: String },
    shortDescription: { type: String },
    longDescription: { type: String },
    activities: [{ type: String }],
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Destination", destinationSchema);
