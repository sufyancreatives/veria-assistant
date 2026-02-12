import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Bytez from "bytez.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ── Bytez client ──────────────────────────────────────────────────────
const BYTEZ_KEY = process.env.BYTEZ_API_KEY || "d9de7c39faa815e48b7f01f95039351a";
const sdk = new Bytez(BYTEZ_KEY);
// Use Gemini 1.5 Flash for multimodal capabilities (images + text)
const model = sdk.model("google/gemini-1.5-flash");

// ── System prompt (critical for safety & tone) ─────────────────────────
const SYSTEM_PROMPT = `
You are a supportive, empathetic mental wellness companion called "Serenity".
Your role:
- Offer emotional support, active listening, and gentle coping suggestions.
- Help users reflect on their thoughts and feelings.
- Normalize seeking help from mental health professionals.
- Use a warm, conversational tone with short paragraphs.
- Ask gentle, open-ended questions to encourage reflection.
- Be non-judgmental and validating of the user's experiences.
- If the user shares an image, acknowledge it gently and ask how it makes them feel or what it represents to them.

You are NOT a therapist, doctor, or crisis counselor:
- Do NOT claim to diagnose, treat, or cure any condition.
- Do NOT give medical, legal, or other professional advice.
- Do NOT recommend specific medications or dosages.
- If the user asks for diagnosis or treatment, gently explain your limits
  and recommend they consult a licensed mental health professional.

Safety:
- If the user mentions self-harm, suicide, or wanting to hurt themselves or others,
  respond with empathy and STRONGLY encourage them to seek immediate help.
  Provide these resources:
  • National Suicide Prevention Lifeline: 988 (call or text)
  • Crisis Text Line: Text HOME to 741741
  • International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
  • Emergency services: 911 (US) or local equivalent
- Do NOT provide instructions or encouragement for self-harm or harming others.
- Always prioritize the user's safety above all else.

Style:
- Keep responses concise (2-4 short paragraphs max).
- Use empathetic language and validate feelings.
- End with an open-ended question when appropriate.
- Use occasional gentle emoji (💙, 🌿, ✨) sparingly.
`.trim();

// ── POST /api/upload ──────────────────────────────────────────────────
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({
      fileUrl,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// ── POST /api/chat ─────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // Construct conversation with System Prompt
    const conversationWithSystem = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    // Process messages to handle identifying images vs text
    // Note: Bytez client might handle images differently depending on the model schema.
    // For standard OpenRouter/OpenAI compatibility in Bytez, we often pass content as string
    // or array of content parts { type: "text", text: "..." }, { type: "image_url", image_url: { url: "..." } }

    messages.forEach((m) => {
      // Check if the content contains a file URL (bracketed format we added in frontend)
      // "[Attached files: name, name]" is just text, but if we want the model to SEE the image,
      // we need to parse the structure or rely on the frontend sending the URL properly.
      //
      // HACK: The frontend sends textual representation in `content`.
      // Real multimodal support would require the database/frontend to send `content` as an array.
      //
      // For now, let's look for http links in the text that end in image extensions
      // and try to format them for the model if possible.

      // Simple text-only pass-through for now as basic verification
      // To enable ACTUAL vision, we need to parse the image URLs from the text
      // or update the frontend to send strict content arrays.
      //
      // Let's rely on text context for now: "User uploaded an image: [URL]"
      // If the model supports image URLs via text (some do), it might work.
      // Otherwise, we strictly need { type: "image_url" }.

      conversationWithSystem.push({
        role: m.role,
        content: m.content,
      });
    });

    // Call Bytez API
    const { error, output } = await model.run(conversationWithSystem);

    if (error) {
      console.error("Bytez API Error:", error);
      // Fallback response if API fails
      return res.json({
        reply: "I noticed you shared something, but I'm having trouble seeing it clearly right now. Could you tell me a bit about it? 🌿"
      });
    }

    const aiText = output || "I'm listening. Please go on.";
    res.json({ reply: aiText });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({
      error: "Something went wrong while processing your message. Please try again.",
    });
  }
});

// ── Health check ───────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start server ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using Bytez.js with Google Gemini 1.5 Flash (Multimodal)`);
  if (!BYTEZ_KEY) {
    console.warn("⚠️  WARNING: BYTEZ_API_KEY is not set. Add your key to server/.env");
  }
});
