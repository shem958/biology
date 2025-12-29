import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/mark", async (req, res) => {
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
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.json(JSON.parse(response.choices[0].message.content));
});

app.listen(3000, () => {
  console.log("AI Marker running on http://localhost:3000");
});
