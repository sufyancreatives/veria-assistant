import { Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Auth from './pages/Auth'
import Chat from './pages/Chat'
import Info from './pages/Info'
import Dashboard from './pages/Dashboard'
import MouseTracker from './components/MouseTracker'
import ThreeBackground from './components/ThreeBackground'
import './App.css'

function App() {
  return (
    <>
      <ThreeBackground />
      <MouseTracker />
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/info" element={<Info />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
