import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Bytez from "bytez.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1) Initialize Bytez SDK with your API key from .env
const sdk = new Bytez(process.env.BYTEZ_API_KEY);

// 2) Choose the model (Google Gemini 1.5 Flash for multimodal capabilities)
const model = sdk.model("google/gemini-1.5-flash");

// 3) System prompt to define chatbot behavior
const SYSTEM_PROMPT = `
You are a supportive, empathetic mental wellness companion called "VERIA ASSISTANT".

Your role:
- Offer emotional support, active listening, and gentle coping suggestions.
- Help users reflect on their thoughts and feelings.
- Normalize seeking help from mental health professionals.
- If the user shares an image (referenced as [Image: URL]), acknowledge it gently and ask how it relates to their feelings.

You are NOT a therapist, doctor, or crisis counselor:
- Do NOT claim to diagnose, treat, or cure any condition.
- Do NOT give medical, legal, or other professional advice.
- If the user asks for diagnosis or treatment, gently explain your limits
  and recommend professional help.

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
- Use short paragraphs.
- Ask gentle, open-ended questions.
- Be non-judgmental and validating.
- Keep responses concise (2-4 short paragraphs max).
- Use occasional gentle emoji (💙, 🌿, ✨) sparingly.
`.trim();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check route
app.get("/", (req, res) => {
    res.send("Mental Wellness Chatbot backend (Bytez) is running");
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 4) Chat endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        if (!Array.isArray(messages)) {
            return res.status(400).json({ error: "messages must be an array" });
        }

        // Helper to convert local URL to base64
        const processMessage = (msg) => {
            // Regex to find [Image: http://localhost:PORT/uploads/filename]
            const imgRegex = /\[Image: .*?\/uploads\/(.*?)\]/g;
            const matches = [...msg.content.matchAll(imgRegex)];

            if (matches.length === 0) {
                // Return text-only message in Gemini format
                return {
                    role: msg.role === 'assistant' ? 'model' : msg.role, // Gemini uses 'model' not 'assistant'
                    parts: [{ text: msg.content }]
                };
            }

            // It has images. Construct Gemini native structured content.
            const parts = [];

            // Add the text part
            parts.push({ text: msg.content.replace(imgRegex, '').trim() });

            matches.forEach(match => {
                const filename = match[1];
                const filePath = path.join(uploadDir, filename);

                if (fs.existsSync(filePath)) {
                    try {
                        const fileBuffer = fs.readFileSync(filePath);
                        const base64Image = fileBuffer.toString('base64');
                        const mimeType = path.extname(filePath) === '.png' ? 'image/png' : 'image/jpeg';

                        parts.push({
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Image
                            }
                        });
                    } catch (e) {
                        console.error("Error reading file for chat:", filename, e);
                    }
                }
            });

            return {
                role: msg.role === 'assistant' ? 'model' : msg.role,
                parts: parts
            };
        };

        const processedMessages = messages.map(processMessage);

        // Build full conversation for the model: system + history
        // Gemini expects system instructions separately or as 'user'/'model' turns?
        // Actually, gemini-1.5-flash supports 'system' role in some APIs, but often it's 'systemInstruction' param.
        // Let's try passing it as the first 'user' message with a specific prefix if 'system' role fails,
        // OR better yet, let's keep it as standard 'user' or 'system' role and hope Bytez handles it.
        // Given previous attempt worked for text, 'system' role IS supported by Bytez normalization.
        // But for consistency with parts, let's make the system message use parts too.

        const fullMessages = [
            { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
            ...processedMessages,
        ];

        // Call Bytez model
        const { error, output } = await model.run(fullMessages);

        if (error) {
            console.error("Bytez error:", error);
            // Fallback response for image heavy requests that might fail
            return res.json({
                reply: "I see you shared something, but I'm having a little trouble processing it right now. Could you tell me more about it in your own words? 🌿"
            });
        }

        // Inspect and extract reply from output
        let replyText = "";

        if (typeof output === "string") {
            replyText = output;
        } else if (Array.isArray(output)) {
            // e.g. [{ role: "assistant", content: "..." }]
            replyText = output[0]?.content || "";
        } else if (output && output.content) {
            // e.g. { role: "assistant", content: "..." }
            replyText = output.content;
        }

        if (!replyText) {
            console.warn("Empty AI response", output);
            return res.json({ reply: "I'm listening. Please go on." });
        }

        // Send back to frontend
        res.json({ reply: replyText });
    } catch (err) {
        console.error("Error in /api/chat:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the URL to access the file
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            fileUrl: fileUrl,
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
    if (
        !process.env.BYTEZ_API_KEY ||
        process.env.BYTEZ_API_KEY === "your_real_bytez_api_key_here"
    ) {
        console.warn(
            "⚠️  WARNING: BYTEZ_API_KEY is not set. Add your key to backend/.env"
        );
    }
});
