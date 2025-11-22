import express from 'express';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch';
import { body, validationResult } from 'express-validator';
import AiUsage from '../models/AiUsage.js';
import aiConfig from '../aiConfig.js';

const router = express.Router();

// basic rate limiting to protect AI endpoint
const limiter = rateLimit({ windowMs: 60_000, max: 30 });
router.use(limiter);

// POST /api/ai
// body: { prompt: string, maxTokens?: number }
router.post(
  '/',
  body('prompt').isString().notEmpty().isLength({ min: 1, max: 5000 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { prompt, maxTokens } = req.body;
    const provider = process.env.AI_PROVIDER || 'anthropic';
    const model = aiConfig.overrideModel || process.env.AI_MODEL || 'claude-haiku-4.5';

    if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY' });

      try {
        // Use Anthropic completion endpoint. Field names may vary by API version; adapt if needed.
        const body = {
          model,
          prompt,
          max_tokens: maxTokens || 300,
          temperature: 0.7
        };

        const r = await fetch('https://api.anthropic.com/v1/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (!r.ok) {
          const text = await r.text();
          console.error('Anthropic error', r.status, text);
          return res.status(502).json({ error: 'AI provider error', details: text });
        }

        const j = await r.json();
        // Determine text in common fields
        const responseText = j.completion || j.output || (j?.choices && j.choices[0]?.text) || j?.text || null;

        // Log usage asynchronously (do not block response on DB write)
        try {
          const usage = new AiUsage({ promptLength: prompt.length, model, provider, ip: req.ip || req.headers['x-forwarded-for'] || '', responseSize: responseText ? responseText.length : 0 });
          usage.save().catch(e => console.error('Failed to save AI usage', e));
        } catch (e) { console.error('AiUsage error', e); }

        return res.json({ provider: 'anthropic', model, raw: j, text: responseText });
      } catch (err) {
        console.error('AI request failed', err);
        return res.status(502).json({ error: 'AI request failed' });
      }
    }

    return res.status(400).json({ error: 'Unsupported AI provider' });
  }
);

export default router;
