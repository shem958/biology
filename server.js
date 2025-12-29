import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. FIX: Serve static files from the 'public' folder 
// This ensures that when you go to http://localhost:3000, index.html is loaded.
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/mark", async (req, res) => {
  try {
    const { answers } = req.body;

    const prompt = `
      You are a biology teacher marking a test on the mammalian heart and circulatory system.
      Mark using standard secondary school biology marking.
      Award marks fairly even if wording differs.
      Give a total score out of 50.

      Questions and student answers:
      ${JSON.stringify(answers, null, 2)}

      Return ONLY valid JSON:
      {
        "totalScore": number,
        "breakdown": {
          "q1": score,
          "q2": score
        },
        "feedback": "short teacher comment"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // FIX: Changed from gpt-4.1-mini (which doesn't exist)
      messages: [{ role: "user", content: prompt }]
    });

    let content = response.choices[0].message.content;
    
    // Safety check: Remove markdown code blocks if the AI accidentally includes them
    const cleanJson = content.replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Marking error:", error);
    res.status(500).json({ error: "Failed to mark the test." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Marker running on http://localhost:${PORT}`);
});