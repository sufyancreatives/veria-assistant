'use client';

import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
    const router = useRouter();

    const stats = [
        { icon: '💬', label: 'Conversations', value: 'Available 24/7', color: 'bg-cyan-400' },
        { icon: '🛡️', label: 'Safety First', value: 'Crisis Support', color: 'bg-purple-400' },
        { icon: '🤖', label: 'AI Powered', value: 'Gemini 2.5', color: 'bg-pink-400' }
    ];

    const features = [
        {
            icon: '💙',
            title: 'Empathetic Support',
            description: 'Get compassionate, judgment-free emotional support anytime'
        },
        {
            icon: '🔒',
            title: 'Private & Secure',
            description: 'Your conversations are confidential and never stored'
        },
        {
            icon: '🆘',
            title: 'Crisis Resources',
            description: 'Instant access to professional help when you need it most'
        },
        {
            icon: '✨',
            title: 'Smart AI',
            description: 'Powered by Google Gemini 2.5 Flash for intelligent responses'
        }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Sidebar */}
            <Sidebar className="hidden md:flex" />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Background Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-float"></div>
                    <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-float-delayed"></div>
                </div>

                <div className="p-8 md:p-12 relative z-10 max-w-6xl mx-auto">

                    {/* Header */}
                    <header className="mb-12 text-center md:text-left">
                        <div className="inline-block p-3 rounded-2xl bg-white/5 mb-4 border border-white/10 md:hidden">
                            <span className="text-3xl">🧘</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VERIA ASSISTANT</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl">
                            Your 24/7 Mental Wellness Companion
                        </p>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {stats.map((stat, index) => (
                            <div key={index} className="glass-card p-6 rounded-2xl flex items-center space-x-4 hover:bg-white/5 transition-colors group">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/10 group-hover:bg-white/20 transition-colors`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stat.value}</div>
                                    <div className={`text-sm ${stat.color.replace('bg-', 'text-')} font-medium`}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold mb-8 flex items-center">
                            <span className="mr-3 text-purple-400">✨</span>
                            Why Choose VERIA ASSISTANT?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-200 group-hover:text-white transition-colors">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="glass-card p-10 rounded-3xl text-center relative overflow-hidden border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-pink-900/40 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your Wellness Journey?</h2>
                            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join thousands who trust VERIA ASSISTANT for daily emotional support, reflection, and peace of mind.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 transform hover:-translate-y-1 transition-all w-full sm:w-auto"
                                >
                                    Start Chatting Now
                                </button>
                                <button
                                    onClick={() => router.push('/info')}
                                    className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold border border-white/10 w-full sm:w-auto transition-colors"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-16 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
                        <p className="mb-4">VERIA ASSISTANT is not a substitute for professional mental health care</p>
                        <div className="flex items-center justify-center space-x-4">
                            <button onClick={() => router.push('/info')} className="hover:text-white transition-colors">About</button>
                            <span>•</span>
                            <button onClick={() => router.push('/')} className="hover:text-white transition-colors">Chat</button>
                            <span>•</span>
                            <a href="tel:988" className="hover:text-red-400 transition-colors">Crisis: 988</a>
                        </div>
                    </footer>

                </div>
            </main>
        </div>
    );
}
