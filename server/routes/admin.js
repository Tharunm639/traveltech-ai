import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import EnquiryModule from '../enquiryModel.js';
const Enquiry = EnquiryModule && EnquiryModule.default ? EnquiryModule.default : EnquiryModule;
import AiUsage from '../models/AiUsage.js';
import aiConfig from '../aiConfig.js';

const router = express.Router();

// adminGuard: allow either a valid admin JWT or the DEV_ADMIN_TOKEN header (dev fallback)
const adminGuard = (req, res, next) => {
  const devToken = req.header('x-admin-token') || req.query.adminToken;
  const expected = process.env.DEV_ADMIN_TOKEN;
  if (devToken && expected && devToken === expected) return next();

  const auth = req.header('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return res.status(403).json({ error: 'Forbidden: admin required' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Forbidden: admin role required' });
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    console.error('Admin token check failed', err);
    return res.status(403).json({ error: 'Forbidden: invalid admin token' });
  }
};

// Apply guard to all admin routes
router.use(adminGuard);

// Create destination
router.post(
  '/destinations',
  body('name').isString().notEmpty(),
  body('slug').isString().notEmpty(),
  body('country').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const d = new Destination(req.body);
      await d.save();
      res.status(201).json(d);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create destination' });
    }
  }
);

// Update destination
router.put('/destinations/:id', async (req, res) => {
  try {
    const d = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!d) return res.status(404).json({ error: 'Destination not found' });
    res.json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

// Delete destination
router.delete('/destinations/:id', async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

// Create package
router.post(
  '/packages',
  body('title').isString().notEmpty(),
  body('slug').isString().notEmpty(),
  body('destination').isString().notEmpty(),
  body('price').isNumeric(),
  body('durationDays').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const p = new Package(req.body);
      await p.save();
      res.status(201).json(p);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create package' });
    }
  }
);

// Update package
router.put('/packages/:id', async (req, res) => {
  try {
    const p = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ error: 'Package not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// Delete package
router.delete('/packages/:id', async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// List enquiries (admin)
router.get('/enquiries', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '20'));
    const filter = {};
    const total = await Enquiry.countDocuments(filter);
    const docs = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('packageId', 'title slug');

    res.json({ docs, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Failed to list enquiries', err);
    res.status(500).json({ error: 'Failed to list enquiries' });
  }
});

// Update enquiry (status or message)
router.patch('/enquiries/:id', async (req, res) => {
  try {
    const update = {};
    if (req.body.status) update.status = req.body.status;
    if (req.body.message) update.message = req.body.message;
    const e = await Enquiry.findByIdAndUpdate(req.params.id, update, { new: true }).populate('packageId', 'title slug');
    if (!e) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(e);
  } catch (err) {
    console.error('Failed to update enquiry', err);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Delete enquiry
router.delete('/enquiries/:id', async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Failed to delete enquiry', err);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// AI config (get)
router.get('/ai/config', async (req, res) => {
  try {
    res.json({ model: aiConfig.overrideModel || process.env.AI_MODEL || null, provider: process.env.AI_PROVIDER || null });
  } catch (err) {
    console.error('Failed to get AI config', err);
    res.status(500).json({ error: 'Failed to get AI config' });
  }
});

// AI config (set override)
router.post('/ai/config', async (req, res) => {
  try {
    const { overrideModel } = req.body;
    aiConfig.overrideModel = overrideModel || null;
    res.json({ ok: true, overrideModel: aiConfig.overrideModel });
  } catch (err) {
    console.error('Failed to set AI config', err);
    res.status(500).json({ error: 'Failed to set AI config' });
  }
});

// List AI usage (admin)
router.get('/ai/usage', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '50'));
    const total = await AiUsage.countDocuments({});
    const docs = await AiUsage.find({}).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit);
    res.json({ docs, page, limit, total, totalPages: Math.ceil(total/limit) });
  } catch (err) {
    console.error('Failed to list ai usage', err);
    res.status(500).json({ error: 'Failed to list ai usage' });
  }
});

export default router;
