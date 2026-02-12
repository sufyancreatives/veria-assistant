'use client';

import { useRouter } from 'next/navigation';
import { useCursorTracking } from '@/hooks/useCursorTracking';

export default function InfoPage() {
    const router = useRouter();

    // Cursor tracking for info cards
    const aboutCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 });
    const whatCanDoCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 });
    const limitationsCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 });
    const privacyCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 });
    const crisisCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 });

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white p-6 relative overflow-x-hidden">
            {/* Navbar / Header */}
            <header className="max-w-6xl mx-auto flex items-center justify-between py-6 mb-12 animate-fade-in-up">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full hover:bg-white/10"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Chat</span>
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    About VERIA
                </h1>
            </header>

            <div className="max-w-6xl mx-auto space-y-8 pb-20">

                {/* About Section */}
                <section
                    // @ts-ignore
                    ref={aboutCard.elementRef}
                    className="glass-card p-8 rounded-3xl card-3d relative overflow-hidden group"
                    style={{
                        transform: `
                    perspective(1000px)
                    translate3d(${aboutCard.transform.x}px, ${aboutCard.transform.y}px, 0)
                    rotateX(${aboutCard.transform.rotateX}deg)
                    rotateY(${aboutCard.transform.rotateY}deg)
                `
                    }}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <div className="w-32 h-32 bg-purple-500/50 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6">
                            🧘
                        </div>
                        <h2 className="text-3xl font-bold mb-4">What is VERIA ASSISTANT?</h2>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                            VERIA ASSISTANT is an AI-powered wellness companion designed to offer emotional support,
                            active listening, and gentle coping strategies. It uses advanced AI to
                            provide empathetic, non-judgmental conversations whenever you need them.
                        </p>
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* What Can Do */}
                    <section
                        // @ts-ignore
                        ref={whatCanDoCard.elementRef}
                        className="glass-card p-8 rounded-3xl card-3d"
                        style={{
                            transform: `
                        perspective(1000px)
                        translate3d(${whatCanDoCard.transform.x}px, ${whatCanDoCard.transform.y}px, 0)
                        rotateX(${whatCanDoCard.transform.rotateX}deg)
                        rotateY(${whatCanDoCard.transform.rotateY}deg)
                    `
                        }}
                    >
                        <div className="text-4xl mb-4">✨</div>
                        <h2 className="text-2xl font-bold mb-6">What I Can Help With</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="mr-3 text-purple-400 mt-1">💬</span>
                                <span className="text-gray-300">Providing a safe space to talk about your feelings</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 text-purple-400 mt-1">🧘</span>
                                <span className="text-gray-300">Suggesting general coping and relaxation techniques</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 text-purple-400 mt-1">🌱</span>
                                <span className="text-gray-300">Helping you reflect on your thoughts and emotions</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 text-purple-400 mt-1">📋</span>
                                <span className="text-gray-300">Encouraging healthy habits and self-care routines</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 text-purple-400 mt-1">🤝</span>
                                <span className="text-gray-300">Normalizing the process of seeking professional help</span>
                            </li>
                        </ul>
                    </section>

                    {/* Limitations */}
                    <section
                        // @ts-ignore
                        ref={limitationsCard.elementRef}
                        className="glass-card p-8 rounded-3xl card-3d border-l-4 border-l-red-500/50 bg-red-900/5 relative overflow-hidden"
                        style={{
                            transform: `
                        perspective(1000px)
                        translate3d(${limitationsCard.transform.x}px, ${limitationsCard.transform.y}px, 0)
                        rotateX(${limitationsCard.transform.rotateX}deg)
                        rotateY(${limitationsCard.transform.rotateY}deg)
                    `
                        }}
                    >
                        <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-red-500/5 blur-3xl rounded-full"></div>
                        <div className="relative z-10">
                            <div className="text-4xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold mb-6 text-red-100">Important Limitations</h2>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start text-red-200/80">
                                    <span className="mr-3 text-red-400">❌</span>
                                    <span>I am <strong>not a licensed therapist</strong> or counselor</span>
                                </li>
                                <li className="flex items-start text-red-200/80">
                                    <span className="mr-3 text-red-400">❌</span>
                                    <span>I <strong>cannot diagnose</strong> mental health conditions</span>
                                </li>
                                <li className="flex items-start text-red-200/80">
                                    <span className="mr-3 text-red-400">❌</span>
                                    <span>I <strong>cannot prescribe</strong> or recommend medications</span>
                                </li>
                                <li className="flex items-start text-red-200/80">
                                    <span className="mr-3 text-red-400">❌</span>
                                    <span>I am <strong>not a substitute</strong> for professional care</span>
                                </li>
                            </ul>
                            <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/20">
                                <p className="text-sm text-red-200">
                                    If you are experiencing a mental health crisis, please contact a licensed
                                    professional or use the crisis resources available in the chat.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Privacy */}
                <section
                    // @ts-ignore
                    ref={privacyCard.elementRef}
                    className="glass-card p-8 rounded-3xl card-3d"
                    style={{
                        transform: `
                    perspective(1000px)
                    translate3d(${privacyCard.transform.x}px, ${privacyCard.transform.y}px, 0)
                    rotateX(${privacyCard.transform.rotateX}deg)
                    rotateY(${privacyCard.transform.rotateY}deg)
                `
                    }}
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <span className="text-3xl">🔒</span>
                        <h2 className="text-2xl font-bold">Privacy & Data</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        Your conversations are processed in real-time and are <strong>not stored</strong> on
                        our servers after your session ends. Messages are sent to our secure AI processing pipeline.
                        We recommend not sharing highly sensitive personal information
                        such as full names, precise addresses, or financial details during chats.
                    </p>
                </section>

                {/* Crisis Resources */}
                <section
                    // @ts-ignore
                    ref={crisisCard.elementRef}
                    className="glass-card p-8 rounded-3xl card-3d bg-gradient-to-br from-red-900/20 to-purple-900/20 border border-red-500/20"
                    style={{
                        transform: `
                    perspective(1000px)
                    translate3d(${crisisCard.transform.x}px, ${crisisCard.transform.y}px, 0)
                    rotateX(${crisisCard.transform.rotateX}deg)
                    rotateY(${crisisCard.transform.rotateY}deg)
                `
                    }}
                >
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="text-4xl">🆘</span>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Crisis Resources</h2>
                            <p className="text-gray-400">If you or someone you know is in crisis:</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-xl hover:bg-red-900/30 transition-colors">
                            <strong className="block text-red-300 mb-1">988 Suicide & Crisis Lifeline</strong>
                            <span className="text-gray-400 text-sm">Call or text 988</span>
                        </div>
                        <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl hover:bg-blue-900/30 transition-colors">
                            <strong className="block text-blue-300 mb-1">Crisis Text Line</strong>
                            <span className="text-gray-400 text-sm">Text HOME to 741741</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                            <strong className="block text-white mb-1">Emergency Services</strong>
                            <span className="text-white mb-1 font-bold">Call 911 (US)</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
