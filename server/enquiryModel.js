import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    message: { type: String },
    status: { type: String, default: "New" }
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
export { Enquiry };
