# VERIA ASSISTANT - Mental Wellness Companion 💙

A supportive, empathetic AI-powered mental wellness chatbot built with Next.js and Bytez.js.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwind-css)

## ✨ Features

- 🤖 **AI-Powered Chat** - Powered by Google Gemini 1.5 Flash via Bytez.js SDK
- 🖼️ **Multimodal Support** - Upload and discuss images with the AI
- 🎨 **Beautiful UI** - Glassmorphism design with 3D mouse-tracking effects
- 🔒 **Secure** - API keys protected on server-side, never exposed to client
- ⚡ **Fast** - Built on Next.js 16 with Turbopack
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Bytez API key (get one at [bytez.com](https://bytez.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sufyancreatives/veria-assistant.git
cd veria-assistant/veria-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
BYTEZ_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_NAME=VERIA ASSISTANT
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
veria-nextjs/
├── app/
│   ├── api/              # API routes (server-side)
│   │   ├── chat/         # AI chat endpoint
│   │   ├── health/       # Health check
│   │   └── upload/       # File upload
│   ├── globals.css       # Custom design system
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── ChatInterface.tsx # Chat UI component
│   └── MouseTracker.tsx  # Interactive background
├── types/
│   └── chat.ts           # TypeScript types
└── public/
    └── uploads/          # User uploads directory
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **AI:** Bytez.js SDK with Google Gemini 1.5 Flash
- **Deployment Ready:** Vercel-optimized

## 🎯 Usage

### Starting a Conversation

1. Type your message in the input field
2. Press Enter or click "Send"
3. Wait for the AI's empathetic response

### Uploading Images

1. Click the attachment icon (📎)
2. Select an image file
3. Send your message with or without text
4. The AI will acknowledge and respond to the image

## 🔐 Security

- ✅ API keys stored in `.env.local` (server-only)
- ✅ Environment variables never exposed to client
- ✅ File uploads validated and sanitized
- ✅ 10MB upload size limit

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `BYTEZ_API_KEY` to environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sufyancreatives/veria-assistant)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

VERIA ASSISTANT is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact:

- **National Suicide Prevention Lifeline:** 988 (call or text)
- **Crisis Text Line:** Text HOME to 741741
- **Emergency Services:** 911 (US) or your local equivalent

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Sufyan Creatives**

- GitHub: [@sufyancreatives](https://github.com/sufyancreatives)

---

Made with 💙 for mental wellness
