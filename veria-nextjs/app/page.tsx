'use client';

import ChatInterface from '@/components/ChatInterface';
import MouseTracker from '@/components/MouseTracker';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-black/90">
      <Sidebar className="hidden md:flex" />
      <main className="flex-1 relative flex flex-col h-full">
        <MouseTracker />
        <div className="flex-1 relative z-10 flex flex-col">
          <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VERIA</span>
            {/* Mobile menu trigger could go here */}
          </header>
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
