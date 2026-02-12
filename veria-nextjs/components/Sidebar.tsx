'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SESSION_TYPES } from '@/utils/sessionTypes'
import { getSavedChats } from '@/utils/chatStorage'

interface SidebarProps {
    onNewChat?: () => void;
    onSelectSession?: (session: any) => void;
    className?: string;
}

export default function Sidebar({ onNewChat, onSelectSession, className = '' }: SidebarProps) {
    const [showHistory, setShowHistory] = useState(false);
    const [savedChats, setSavedChats] = useState<any[]>([]);
    const pathname = usePathname();

    // Load saved chats
    useEffect(() => {
        const loadChats = () => {
            const chats = getSavedChats();
            setSavedChats(chats);
        };
        loadChats();
        // Refresh interval
        const interval = setInterval(loadChats, 3000);
        return () => clearInterval(interval);
    }, []);

    const formatTimestamp = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDay < 7) return `${diffDay}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className={`flex flex-col h-full bg-white/5 dark:bg-black/20 backdrop-blur-xl border-r border-white/10 w-64 ${className}`}>

            {/* Logo / Brand Area */}
            <div className="p-6 border-b border-white/5">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    VERIA
                </h1>
                <p className="text-xs text-gray-400">Wellness Companion</p>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-2">
                <Link
                    href="/dashboard"
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <span className="mr-3">📊</span> Dashboard
                </Link>

                <Link
                    href="/"
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${pathname === '/'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <span className="mr-3">💬</span> Chat
                </Link>

                <Link
                    href="/info"
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${pathname === '/info'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <span className="mr-3">📚</span> Resources
                </Link>
            </nav>

            {/* History Section */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
                <div
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center justify-between px-2 py-2 text-gray-400 hover:text-white cursor-pointer group"
                >
                    <span className="text-sm font-medium uppercase tracking-wider">History</span>
                    <span className={`transform transition-transform ${showHistory ? 'rotate-180' : ''}`}>▼</span>
                </div>

                {showHistory && (
                    <div className="mt-2 space-y-2">
                        {savedChats.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm italic">
                                No saved chats
                            </div>
                        ) : (
                            savedChats.map((chat: any) => {
                                // @ts-ignore
                                const typeKey = (chat.sessionType || 'general').toUpperCase();
                                // @ts-ignore
                                const sessionType = SESSION_TYPES[typeKey] || SESSION_TYPES.GENERAL;

                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => onSelectSession && onSelectSession({
                                            id: chat.id,
                                            type: sessionType.id,
                                            title: chat.title || sessionType.name
                                        })}
                                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10"
                                    >
                                        <div className="flex items-center mb-1">
                                            <span className="mr-2 text-sm">{sessionType.icon || '💬'}</span>
                                            <span className="text-sm font-medium truncate text-gray-300">
                                                {chat.title || sessionType.name}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatTimestamp(chat.lastUpdated)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <Link href="/auth" className="flex items-center justify-center p-2 text-sm text-gray-500 hover:text-white transition-colors">
                    <span>👤 Sign Out</span>
                </Link>
            </div>
        </div>
    );
}
