import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';


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

// EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
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

      Grade fairly out of 50 marks.
      Return ONLY a JSON object with this exact structure:
      {
        "totalScore": number,
        "feedback": "Teacher's overall comment",
        "detailedReport": "A string formatted with newlines showing each question, student answer, and the correct answer if they were wrong."
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const aiResult = JSON.parse(response.choices[0].message.content.replace(/```json|```/g, "").trim());

    // AUTOMATIC EMAIL TO TUTOR (mercynjenga366@gmail.com)
    const mailOptions = {
      from: `"Heart Test Bot" <${process.env.EMAIL_USER}>`,
      to: 'mercynjenga366@gmail.com',
      subject: `TEST SUBMISSION: Score ${aiResult.totalScore}/50`,
      text: `
        TEST REPORT - MAMMALIAN HEART
        -----------------------------
        Total Score: ${aiResult.totalScore} / 50
        
        Teacher Feedback:
        ${aiResult.feedback}
        
        Detailed Breakdown:
        ${aiResult.detailedReport}
      `
    };

    // Send email in background
    transporter.sendMail(mailOptions).catch(err => console.error("Auto-mail failed:", err));

    // Send result back to student
    res.json(aiResult);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Grading failed." });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Marker running on http://localhost:${PORT}`);
});