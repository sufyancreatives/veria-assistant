'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setUploadedFile(data.fileUrl);
            } else {
                console.error('Upload failed:', data.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() && !uploadedFile) return;

        let messageContent = input;
        if (uploadedFile) {
            messageContent += ` [Image: ${uploadedFile}]`;
        }

        const userMessage: Message = {
            role: 'user',
            content: messageContent,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setUploadedFile(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.reply || "I'm here to listen.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto px-4 py-6">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
                        ✨
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white leading-none">Veria Companion</h2>
                        <p className="text-xs text-purple-400 font-medium mt-1">AI Wellness Support</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-green-400">Secure & Confidential</span>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-6 scrollbar-thin px-2">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-6 shadow-2xl">
                            👋
                        </div>
                        <h2 className="text-3xl font-light text-white mb-3 tracking-tight">Welcome to <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VERIA</span></h2>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            I'm your empathetic mental wellness companion. How are you feeling in this moment?
                        </p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                        <div
                            className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 shadow-xl ${message.role === 'user'
                                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none'
                                : 'glass-card text-white rounded-bl-none'
                                }`}
                        >
                            {/* Display image if present */}
                            {message.content.includes('[Image:') && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                    <img
                                        src={message.content.match(/\[Image: (.*?)\]/)?.[1] || ''}
                                        alt="Uploaded"
                                        className="max-w-xs transition-transform hover:scale-105 duration-500"
                                    />
                                </div>
                            )}
                            <p className="text-[15px] leading-relaxed font-medium">
                                {message.content.replace(/\[Image:.*?\]/g, '').trim()}
                            </p>
                            <div className={`text-[10px] mt-2 font-bold uppercase tracking-widest opacity-40 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                {message.role === 'user' ? 'You' : 'Veria'}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="glass-card rounded-2xl px-6 py-3">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* File Preview */}
            {uploadedFile && (
                <div className="mb-2 p-2 glass-card rounded-lg flex items-center justify-between">
                    <img src={uploadedFile} alt="Preview" className="h-16 rounded" />
                    <button
                        onClick={() => setUploadedFile(null)}
                        className="text-red-400 hover:text-red-300 ml-2"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Input Container */}
            <div className="glass-card rounded-3xl p-2.5 flex items-end gap-3 shadow-2xl relative mb-2">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-purple-400 hover:text-purple-300 transition-all active:scale-95"
                    title="Upload image"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                    </svg>
                </label>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message Veria Assistant..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none outline-none py-3 px-2 min-h-[50px] max-h-40 font-medium text-[15px]"
                    rows={1}
                />

                <button
                    onClick={sendMessage}
                    disabled={isLoading || (!input.trim() && !uploadedFile)}
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl px-8 py-3 font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed mb-0.5 mr-0.5"
                >
                    {isLoading ? (
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.1s]"></div>
                            <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        </div>
                    ) : 'Send'}
                </button>
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-2 font-medium opacity-50 uppercase tracking-widest">
                VERIA is here to listen, not to diagnose. If in crisis, call 988.
            </p>
        </div>
    );
}
