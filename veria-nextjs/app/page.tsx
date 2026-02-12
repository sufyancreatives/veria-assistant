import ChatInterface from '@/components/ChatInterface';
import MouseTracker from '@/components/MouseTracker';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <MouseTracker />
      <div className="relative z-10">
        <ChatInterface />
      </div>
    </main>
  );
}
