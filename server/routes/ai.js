import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Helper function to safely extract and parse JSON from the AI response
function safeParse(text) {
  console.log("📩 Raw Text Received (Start):", text.substring(0, 100));

  // 1. Remove markdown format (```json ... ```)
  let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

  // 2. Isolate the JSON object ({...})
  const jsonStartIndex = cleanedText.indexOf('{');
  const jsonEndIndex = cleanedText.lastIndexOf('}');

  if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
    cleanedText = cleanedText.substring(jsonStartIndex, jsonEndIndex + 1);
  } else {
    console.error("⚠️ Failed to find proper JSON delimiters { } in AI response.");
  }

  return JSON.parse(cleanedText);
}


router.post('/generate', async (req, res) => {
  try {
    console.log("🤖 AI Request Received.");

    // --- CONFIGURATION ---
    const API_KEY = process.env.GEMINI_API_KEY;
    const MODEL_NAME = "gemini-pro";
    // ---------------------

    if (!API_KEY) {
      throw new Error("API_KEY_INVALID: Missing GEMINI_API_KEY in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const { destination, days, budget, vibe } = req.body;

    console.log(`📍 Planning trip to ${destination} using ${MODEL_NAME}...`);

    const prompt = `
      Act as a professional travel agent. Plan a ${days}-day trip to ${destination}.
      Budget: ${budget}.
      Vibe: ${vibe}.
      
      STRICTLY return a JSON object ONLY. Do NOT include any introductory text, markdown (like \`\`\`json), or commentary.
      
      The JSON must follow this exact structure:
      {
        "hotels": [
           { "name": "Hotel Name", "price": "Est. Price", "description": "Short description" }
        ],
        "itinerary": [
           { "day": 1, "morning": "Activity", "afternoon": "Activity", "evening": "Activity" },
           { "day": 2, "morning": "Activity", "afternoon": "Activity", "evening": "Activity" }
        ]
      }
    `;

    // FIX: Removed requestOptions to simplify the call structure
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Use the safe parsing helper
    const data = safeParse(text);

    console.log("✅ AI Success! Sending data.");
    res.json(data);

  } catch (error) {
    console.error("❌ AI FAILED during generation or parsing:", error);

    let errorMessage = "Failed to generate itinerary due to internal server error.";
    if (error.message && error.message.includes('API_KEY_INVALID')) {
      errorMessage = "Configuration Error: The API Key is invalid or expired.";
    } else if (error.message && error.message.includes('JSON')) {
      errorMessage = "AI Parsing Error: Try a simpler request (e.g., Paris).";
    }

    res.status(500).json({ error: errorMessage });
  }
});

export default router;