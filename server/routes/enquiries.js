import express from 'express';
import { body, validationResult } from 'express-validator';
import EnquiryModule from '../enquiryModel.js';
const Enquiry = EnquiryModule && EnquiryModule.default ? EnquiryModule.default : EnquiryModule;

const router = express.Router();

// Public: create an enquiry
router.post(
  '/',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('phone').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, phone, packageId, message } = req.body;
      const e = new Enquiry({ name, email, phone, packageId, message });
      await e.save();
      res.status(201).json({ message: 'Enquiry submitted', enquiry: e });
    } catch (err) {
      console.error('Failed to create enquiry', err);
      res.status(500).json({ error: 'Failed to create enquiry' });
    }
  }
);

export default router;
