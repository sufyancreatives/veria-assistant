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
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <h2 className="text-2xl font-light mb-2">Welcome to VERIA ASSISTANT 💙</h2>
                        <p className="text-sm">How are you feeling today?</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-6 py-3 ${message.role === 'user'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'glass-card text-white'
                                }`}
                        >
                            {/* Display image if present */}
                            {message.content.includes('[Image:') && (
                                <img
                                    src={message.content.match(/\[Image: (.*?)\]/)?.[1] || ''}
                                    alt="Uploaded"
                                    className="rounded-lg mb-2 max-w-xs"
                                />
                            )}
                            <p className="whitespace-pre-wrap">
                                {message.content.replace(/\[Image:.*?\]/g, '').trim()}
                            </p>
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
            <div className="glass-card rounded-2xl p-4 flex items-end gap-3">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-purple-400 hover:text-purple-300 transition-colors"
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
                    placeholder="Share your thoughts..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-32"
                    rows={1}
                />

                <button
                    onClick={sendMessage}
                    disabled={isLoading || (!input.trim() && !uploadedFile)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-6 py-2 font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
