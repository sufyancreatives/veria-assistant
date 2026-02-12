'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCursorTracking, useCursorGlow } from '@/hooks/useCursorTracking';

export default function OnboardingPage() {
    const [agreed, setAgreed] = useState(false);
    const router = useRouter();

    // 3D cursor tracking for cards
    const descriptionCard = useCursorTracking({ maxMovement: 4, maxRotation: 2 });
    const disclaimerCard = useCursorTracking({ maxMovement: 4, maxRotation: 2 });
    const continueButton = useCursorGlow();

    const handleContinue = () => {
        if (agreed) {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Ambient background orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] animate-float-delayed"></div>
                <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="w-full max-w-4xl z-10 animate-fade-in-up space-y-8">

                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-xl shadow-2xl">
                        <span className="text-4xl">🧘</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                        VERIA ASSISTANT
                    </h1>
                    <p className="text-xl text-gray-400 font-light tracking-wide">
                        Your compassionate wellness companion
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Description Card */}
                    <div
                        ref={descriptionCard.elementRef}
                        className="glass-card p-8 rounded-3xl card-3d relative group"
                        style={{
                            transform: `
                        perspective(1000px)
                        translate3d(${descriptionCard.transform.x}px, ${descriptionCard.transform.y}px, 0)
                        rotateX(${descriptionCard.transform.rotateX}deg)
                        rotateY(${descriptionCard.transform.rotateY}deg)
                    `
                        }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Welcome</h2>
                        <p className="text-gray-300 leading-relaxed mb-8">
                            VERIA ASSISTANT is here to listen, support, and help you reflect on your thoughts and feelings.
                            Whether you're feeling stressed, anxious, or just need someone to talk to —
                            I'm here for you. 💙
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 text-gray-400 group-hover:text-purple-300 transition-colors">
                                <span>💬</span>
                                <span className="text-sm">Empathetic conversations</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400 group-hover:text-pink-300 transition-colors">
                                <span>🧘</span>
                                <span className="text-sm">Coping strategies</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400 group-hover:text-blue-300 transition-colors">
                                <span>🌱</span>
                                <span className="text-sm">Emotional reflection</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400 group-hover:text-teal-300 transition-colors">
                                <span>🔒</span>
                                <span className="text-sm">Safe & private space</span>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer Card */}
                    <div
                        ref={disclaimerCard.elementRef}
                        className="glass-card p-8 rounded-3xl card-3d border-l-4 border-l-red-500/50 bg-red-500/5"
                        style={{
                            transform: `
                        perspective(1000px)
                        translate3d(${disclaimerCard.transform.x}px, ${disclaimerCard.transform.y}px, 0)
                        rotateX(${disclaimerCard.transform.rotateX}deg)
                        rotateY(${disclaimerCard.transform.rotateY}deg)
                    `
                        }}
                    >
                        <div className="flex items-center space-x-3 mb-4 text-red-400">
                            <span className="text-2xl">⚠️</span>
                            <h3 className="text-xl font-bold">Important Disclaimer</h3>
                        </div>

                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="flex items-start">
                                <span className="mr-2 text-red-500">•</span>
                                <span>VERIA ASSISTANT is <strong>not a licensed therapist</strong> and does not replace professional mental health care.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-red-500">•</span>
                                <span>It <strong>cannot diagnose, treat, or prescribe</strong> medication for any condition.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-red-500">•</span>
                                <span>For serious mental health concerns, please <strong>consult a licensed professional</strong>.</span>
                            </li>
                        </ul>

                        <div className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-500/10">
                            <p className="text-xs text-red-300 font-bold mb-2 uppercase tracking-wide">Emergency Resources (US)</p>
                            <div className="space-y-1 text-xs text-gray-400">
                                <p>📞 <strong>988</strong> – Suicide & Crisis Lifeline</p>
                                <p>💬 Text <strong>HOME</strong> to <strong>741741</strong> – Crisis Text Line</p>
                                <p>🆘 <strong>911</strong> – Emergency Services</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="glass-card p-6 rounded-3xl mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-500 text-purple-600 focus:ring-purple-500 bg-black/20"
                        />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors max-w-lg">
                            I understand that VERIA ASSISTANT is an AI companion, not a therapist, and is not a substitute for professional care.
                        </span>
                    </label>

                    <button
                        // @ts-ignore
                        ref={continueButton.elementRef}
                        disabled={!agreed}
                        onClick={handleContinue}
                        className={`
                    relative overflow-hidden px-8 py-4 rounded-xl font-bold text-white transition-all transform
                    ${agreed
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 shadow-lg shadow-purple-500/30'
                                : 'bg-gray-700 cursor-not-allowed opacity-50'}
                `}
                    >
                        <div className="relative z-10 flex items-center space-x-2">
                            <span>Begin Your Journey</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>

                        {/* Glow Effect */}
                        <div
                            className="absolute rounded-full pointer-events-none transition-opacity duration-300"
                            style={{
                                width: '150px',
                                height: '150px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                                left: `${continueButton.glowPosition.x}%`,
                                top: `${continueButton.glowPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                opacity: continueButton.glowPosition.opacity * 0.5,
                            }}
                        />
                    </button>
                </div>

            </div>
        </div>
    );
}
