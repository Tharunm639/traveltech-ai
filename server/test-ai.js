import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Your API Key
const API_KEY = process.env.GEMINI_API_KEY;

async function testConnection() {
  console.log("🔄 Testing Google AI Connection...");

  if (!API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is missing in .env file");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    // We will try 'gemini-pro' first as it is the most reliable
    const modelsToTry = ["gemini-pro", "gemini-1.5-flash"];

    for (const modelName of modelsToTry) {
      console.log(`\n🧪 Testing model: ${modelName}...`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log(`✅ SUCCESS! Model '${modelName}' is working!`);
        console.log(`💬 Response: ${response.text()}`);
        return; // Exit after success
      } catch (e) {
        console.log(`❌ Model '${modelName}' failed: ${e.message.split('[')[0]}`);
      }
    }

    console.log("\n❌ All models failed. Check your API key.");

  } catch (error) {
    console.error("FATAL ERROR:", error);
  }
}

testConnection();