import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

        const promptParts: any[] = [];

        // Add system prompt as the first part of the conversation context if possible, 
        // or just prepend it to the first user message. 
        // Gemini 1.5 Flash supports system instructions in the model config, but for simplicity
        // in a single turn HTTP request or chat session, we can prepend it.
        // Actually, let's use the chat history format.

        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content.replace(/\[Image:.*?\]/g, '').trim() }],
        }));

        // Initial system instruction can be handled by starting the chat with it or using systemInstruction
        // config if available in the SDK version. For safety, we'll strip it into the model config.

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: `System Instruction: ${SYSTEM_PROMPT}\n\nPlease acknowledge and confirm you understand your role.` }],
                },
                {
                    role: 'model',
                    parts: [{ text: "I understand. I am VERIA ASSISTANT, a supportive and empathetic mental wellness companion. I will offer emotional support, help with reflection, and prioritize safety while maintaining professional boundaries. I am ready to listen." }],
                },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const lastMessage = messages[messages.length - 1];
        const currentParts: any[] = [];

        // Process [Image: ...] tags
        const imgRegex = /\[Image: \/uploads\/(.*?)\]/g;
        const matches = [...lastMessage.content.matchAll(imgRegex)];

        // Add text content
        const textContent = lastMessage.content.replace(imgRegex, '').trim();
        if (textContent) {
            currentParts.push({ text: textContent });
        }

        // Add images
        for (const match of matches) {
            const filename = match[1];
            const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

            if (fs.existsSync(filePath)) {
                try {
                    const fileBuffer = fs.readFileSync(filePath);
                    const base64Image = fileBuffer.toString('base64');
                    const mimeType = filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

                    currentParts.push({
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType
                        }
                    });
                } catch (e) {
                    console.error('Error reading file:', filename, e);
                }
            }
        }

        const result = await chat.sendMessage(currentParts);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (err) {
        console.error('Error in /api/chat:', err);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
