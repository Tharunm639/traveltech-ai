import mongoose from 'mongoose';

const aiUsageSchema = new mongoose.Schema({
  promptLength: { type: Number },
  model: { type: String },
  provider: { type: String },
  ip: { type: String },
  responseSize: { type: Number },
}, { timestamps: true });

const AiUsage = mongoose.model('AiUsage', aiUsageSchema);
export default AiUsage;
