import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

// Initialize Groq SDK
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// System prompt for mental wellness chatbot
const SYSTEM_PROMPT = `
You are a supportive, empathetic mental wellness companion called "VERIA ASSISTANT".

Your role:
- Offer emotional support, active listening, and gentle coping suggestions.
- Help users reflect on their thoughts and feelings.
- Normalize seeking help from mental health professionals.
- If the user shares an image, acknowledge it gently and ask how it relates to their feelings.

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages } = body;

        if (!Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'messages must be an array' },
                { status: 400 }
            );
        }

        let hasImages = false;

        // Process messages to convert [Image: ...] tags to Groq vision format
        const processedMessages = messages.map((msg: any) => {
            // Regex to find [Image: /uploads/filename]
            const imgRegex = /\[Image: \/uploads\/(.*?)\]/g;
            const matches = [...msg.content.matchAll(imgRegex)];

            if (matches.length === 0) {
                return {
                    role: msg.role,
                    content: msg.content,
                };
            }

            hasImages = true;
            const contentParts: any[] = [];

            // Add text part (with image markers removed)
            const textContent = msg.content.replace(imgRegex, '').trim();
            if (textContent) {
                contentParts.push({ type: 'text', text: textContent });
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
                        const dataUrl = `data:${mimeType};base64,${base64Image}`;

                        contentParts.push({
                            type: 'image_url',
                            image_url: {
                                url: dataUrl,
                            },
                        });
                    } catch (e) {
                        console.error('Error reading file for chat:', filename, e);
                    }
                }
            });

            return {
                role: msg.role,
                content: contentParts,
            };
        });

        // Add system prompt
        const fullMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...processedMessages,
        ];

        // Select model based on content
        const model = hasImages
            ? 'llama-3.2-90b-vision-preview'
            : 'llama-3.3-70b-versatile';

        const completion = await groq.chat.completions.create({
            messages: fullMessages,
            model: model,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stop: null,
            stream: false,
        });

        const replyText = completion.choices[0]?.message?.content || "I'm listening. Please go on.";

        return NextResponse.json({ reply: replyText });
    } catch (err) {
        console.error('Error in /api/chat:', err);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
