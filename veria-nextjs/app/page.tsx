'use client';

import ChatInterface from '@/components/ChatInterface';
import MouseTracker from '@/components/MouseTracker';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-black/90">
      <Sidebar className="hidden md:flex" />
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        <MouseTracker />
        <div className="flex-1 relative z-10 flex flex-col h-full">
          <div className="flex-1 h-full">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
