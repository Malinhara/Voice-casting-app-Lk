const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const FormData = require("form-data");
const fetch = require("node-fetch"); // Node 18+ has built-in fetch
const fileRoutes = require("./routes/fileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const { OpenAI } = require("openai/client.js");
const { GoogleGenAI } = require("@google/genai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: ["http://localhost:5173"],
}));

app.use(express.json());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });
new GoogleGenerativeAI({
  apiKey: process.env.API_KEY, // Only API key, no project/location
});


const ai = new GoogleGenAI({
  vertexai: true,
  project: '519775718078',  
  location: 'us-central1',  
});



// Routes
app.use("/user/files", fileRoutes);
app.use("/user/projects", projectRoutes); // New project routes
app.use("/user", userRoutes);


app.post("/proxy", async (req, res) => {
  let { url1, url2 } = req.body;

  // Clean nested structure
  if (url1 && typeof url1 === "object") {
    url2 = url1.url2 ?? url2;
    url1 = url1.url1 ?? null;
  }

  console.log("Final URLs:", { url1, url2 });

  if (!url1 && !url2) {
    return res.status(400).json({ error: "At least one audio URL is required" });
  }

  try {
    const fetchAudio = async (url) => {
      if (!url || typeof url !== "string" || !url.startsWith("http")) {
        throw new Error(`Invalid URL: ${url}`);
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    };

    const form = new FormData();

    if (url1) {
      const buffer1 = await fetchAudio(url1);
      form.append("files", buffer1, {
        filename: "audio1.mp3",
        contentType: "audio/mpeg",
      });
    }

    if (url2) {
      const buffer2 = await fetchAudio(url2);
      form.append("files", buffer2, {
        filename: "audio2.mp3",
        contentType: "audio/mpeg",
      });
    }

    const pyRes = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await pyRes.json();
    res.json(data);

  } catch (err) {
    console.error("Error in /proxy:", err);
    res.status(500).json({ error: err.message });
  }
});




app.post("/analyze-image", async (req, res) => {
  try {
    const { image_url } = req.body;
    if (!image_url) return res.status(400).json({ error: "image_url is required" });

    console.log("Received image URL for analysis:", image_url);

const prompt = `
  Analyze the person in this image in detail. Focus only on their appearance:

  Image URL: ${image_url}

  1. Face: Estimate the person's age range and describe their *perceived* gender based strictly on visible traits (e.g., facial features, hair, clothing). Use cautious wording such as "appears female" or "appears male." If uncertain, say "gender unclear" instead of guessing. Also describe facial expression, key facial features, and mood.

  2. Body & Pose: Describe posture, body position, clothing, gear, and accessories. Do not identify the real person.
`;



    // Create a chat session and send message
    const chat = await ai.chats.create({
      model: "gemini-2.5-pro",
      config: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      },
    });

    const response = await chat.sendMessage({ message: prompt });

    // Gemini returns response as a 'candidates' array
    const analysisText = response?.text || "no";

    console.log(analysisText);

    res.status(200).json({ analysis: analysisText });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/finalanalyze", async (req, res) => {
  try {
    const { imageAnalysis, voiceAnalysis,script } = req.body;

    console.log("Script:", script);

    // --- Construct prompt ---
const prompt = `
You are an expert character analyst.

Character Script/Description:
${script || "No description provided."}

Image Analysis Summary (key traits only):
${JSON.stringify(imageAnalysis, null, 2)}

Voice Analysis Summary (key traits only):
${JSON.stringify(voiceAnalysis, null, 2)}

Task:
Analyze how the character's IMAGE and VOICE align for dubbing suitability in a **fully deterministic way**.

⚠️Instructions:
- Only evaluate Voice vs Image for scoring. Script alignment is informational only.
- Major traits: pitch, tone/brightness, energy, speech rate, emotion.
- Assign points per trait:
   - Fully aligned → 2 points
   - Partially aligned → 1 point
   - Misaligned → 0 points
- Expected range or style per trait should match the character description and image:
   - Pitch: matches apparent age, gender, and size (e.g., low/mid/high)
   - Tone/Brightness: matches visual expression, demeanor, or personality
   - Speech rate: matches character’s expected communication style
   - Energy: matches apparent activity level or temperament
   - Emotion: matches visible emotion, expression, or personality
- Total points = sum of all major traits (max 10)
- Overall Score (%) = (Total Points ÷ 10) × 100
- Verdict based strictly on total points:
   - 8–10 → Good
   - 5–7 → Moderate
   - 0–4 → Bad

1. **Voice vs Image**
- Compare measured voice traits against expected ranges/style based on image and character description.
- Assign points per trait as above.
- Include numeric score (0–10) and percentage (0–100%).

2. **Overall Assessment**
- Provide numeric score, percentage, and verdict from total points only.

3. **Script Alignment (Informational Only)**
- Identify script parts that best match the voice + image profile.
- Explain why these parts align.
- Do NOT use this for scoring.

4. **Suggestions for Improvement**
- Provide actionable adjustments for expression, styling, or vocal delivery to improve alignment.

Requirements:
- Use clear headings and bullet points.
- Output must be human-readable markdown.
- Include numeric scores and percentages.
- Ensure results are consistent and reproducible across runs for the same input.
`;


      const chat = await ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        temperature: 0.5,
        maxOutputTokens: 1024,
      },
    });

    const response = await chat.sendMessage({ message: prompt });

    // Gemini returns response as a 'candidates' array
    const analysisText = response?.text || "no";

    res.json({
      summary: "Analysis completed successfully",
      analysis:analysisText,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process analysis" });
  }
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// const prompt = `
// You are an expert AI voice–image evaluator.

// INPUTS:
// - Character Image Analysis Summary: ${JSON.stringify(imageAnalysis, null, 2)}
// - Voice Analysis Summary: ${JSON.stringify(voiceAnalysis, null, 2)}

// GOAL:
// Evaluate how well the **voice** aligns with the **image** of the character.
// Focus purely on visual–vocal harmony (ignore script mismatches).

// ─────────────────────────────────────────────
// ### 1. Core Evaluation Logic

// Major traits considered: **pitch, tone, emotion, energy, pace (speech rate)**  
// Each trait i ∈ T is scored and weighted as follows:
// - sᵢ = individual alignment score (0–10)
// - wᵢ = importance weight
// - Σwᵢ = 1.0

// Weight Distribution (based on importance for visual realism):
// - Tone → 0.30
// - Pitch → 0.25
// - Emotion → 0.20
// - Energy → 0.15
// - Pace → 0.10

// For internal computation (do NOT reveal math):
// 1. Normalize numeric voice values to [0,1].
// 2. Infer “ideal visual target” for each trait from image attributes:
//    - Calm / mature face → lower pitch, low energy, slow pace.
//    - Youthful / expressive face → higher pitch, energetic tone, faster pace.
//    - Serious or neutral expression → low emotional intensity.
// 3. Compute internal similarity score per trait:
//    sᵢ = 10 × (1 − |vᵢ − cᵢ|)
// 4. Aggregate:
//    S_total = Σ (wᵢ × sᵢ)
//    P_total = (S_total / 10) × 100
// 5. Clamp results to valid range [0,10] and [0–100%].

// ─────────────────────────────────────────────
// ### 2. Verdict Classification

// - **Good** → S_total ≥ 8.0 (P_total ≥ 80%)
// - **Moderate** → 5.0 ≤ S_total < 8.0
// - **Bad** → S_total < 5.0

// ─────────────────────────────────────────────
// ### 3. Output Format (Markdown)

// Your response must include only the readable summary below — never show math or formulas.

// **1. Voice vs Image Alignment**
// - Briefly describe how each major voice trait (tone, pitch, emotion, energy, pace) matches or contrasts with the image’s expression, demeanor, and perceived personality.
// - Assign a numeric score (0–10) and note general alignment in words (e.g., “strong”, “moderate”, “weak”).

// **2. Overall Assessment**
// - Provide:
//   - Weighted Overall Score: X.X / 10
//   - Percentage: XX.X%
//   - Verdict: Good / Moderate / Bad
// - The score should reflect the mathematical evaluation internally computed, but display only human-readable explanation.

// **3. Suggestions for Improvement**
// - List 2–3 actionable recommendations to adjust voice tone, pacing, or emotion to better fit the character’s image.

// ─────────────────────────────────────────────
// ### 4. Evaluation Guidance
// - Major mismatches (tone/pitch/emotion) significantly reduce score.
// - Minor mismatches (energy/pace) cause small deductions (<10%).
// - Prioritize visual coherence and emotional believability.
// - The tone of the report should be analytical yet natural.

// ─────────────────────────────────────────────
// ### Notes
// - Perform all internal calculations using the weighted function, but do NOT display or reference them.
// - Output must be concise, clear, and in Markdown format.
// `;
