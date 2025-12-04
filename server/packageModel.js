import mongoose from "mongoose";


const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    durationDays: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["India", "International"], required: true },
    theme: {
      type: String,
      enum: ["Family", "Honeymoon", "Adventure", "Group", "Custom"],
      required: true,
    },
    summary: { type: String },
    highlights: [String],
    itineraryOutline: [
      {
        day: Number,
        title: String,
        details: String
      }
    ],
    images: [String],
    isBestSeller: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
packageSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const Package = mongoose.model("Package", packageSchema);
export default Package;
