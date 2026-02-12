import { NextRequest, NextResponse } from 'next/server';
import Bytez from 'bytez.js';
import fs from 'fs';
import path from 'path';

// Initialize Bytez SDK with API key from environment
const sdk = new Bytez(process.env.BYTEZ_API_KEY || '');
const model = sdk.model('google/gemini-1.5-flash');

// System prompt for mental wellness chatbot
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

interface Message {
    role: string;
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'messages must be an array' },
                { status: 400 }
            );
        }

        // Helper to process messages with images
        const processMessage = (msg: Message) => {
            // Regex to find [Image: /uploads/filename]
            const imgRegex = /\[Image: \/uploads\/(.*?)\]/g;
            const matches = [...msg.content.matchAll(imgRegex)];

            if (matches.length === 0) {
                // Return text-only message in Gemini format
                return {
                    role: msg.role === 'assistant' ? 'model' : msg.role,
                    parts: [{ text: msg.content }],
                };
            }

            // It has images. Construct Gemini native structured content
            const parts: any[] = [];

            // Add the text part (with image markers removed)
            const textContent = msg.content.replace(imgRegex, '').trim();
            if (textContent) {
                parts.push({ text: textContent });
            }

            // Add image parts
            matches.forEach((match) => {
                const filename = match[1];
                const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

                if (fs.existsSync(filePath)) {
                    try {
                        const fileBuffer = fs.readFileSync(filePath);
                        const base64Image = fileBuffer.toString('base64');
                        const ext = path.extname(filePath).toLowerCase();
                        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

                        parts.push({
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Image,
                            },
                        });
                    } catch (e) {
                        console.error('Error reading file for chat:', filename, e);
                    }
                }
            });

            return {
                role: msg.role === 'assistant' ? 'model' : msg.role,
                parts: parts,
            };
        };

        const processedMessages = messages.map(processMessage);

        // Build full conversation for the model
        const fullMessages = [
            { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
            ...processedMessages,
        ];

        // Call Bytez model
        const { error, output } = await model.run(fullMessages);

        if (error) {
            console.error('Bytez error:', error);
            // Fallback response
            return NextResponse.json({
                reply: "I see you shared something, but I'm having a little trouble processing it right now. Could you tell me more about it in your own words? 🌿",
            });
        }

        // Extract reply from output
        let replyText = '';

        if (typeof output === 'string') {
            replyText = output;
        } else if (Array.isArray(output)) {
            replyText = output[0]?.content || '';
        } else if (output && (output as any).content) {
            replyText = (output as any).content;
        }

        if (!replyText) {
            console.warn('Empty AI response', output);
            return NextResponse.json({ reply: "I'm listening. Please go on." });
        }

        return NextResponse.json({ reply: replyText });
    } catch (err) {
        console.error('Error in /api/chat:', err);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
