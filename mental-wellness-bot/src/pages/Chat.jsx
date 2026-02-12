import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import CrisisBanner from '../components/CrisisBanner'
import Sidebar from '../components/Sidebar'
import SessionMenu from '../components/SessionMenu'
import MouseTracker from '../components/MouseTracker'
import { SESSION_TYPES, getWelcomeMessage } from '../utils/sessionTypes'
import { saveChat, getChatHistory, exportChat, loadChat } from '../utils/chatStorage'
import logo from '../assets/logo.png'
import './Chat.css'

const API_URL = 'http://localhost:4000/api/chat'

const WELCOME_MESSAGE = {
    id: 'welcome',
    sender: 'bot',
    text: getWelcomeMessage('general'),
}

function Chat() {
    const [messages, setMessages] = useState([WELCOME_MESSAGE])
    const [isLoading, setIsLoading] = useState(false)
    const [showCrisisModal, setShowCrisisModal] = useState(false)
    const [currentChatId, setCurrentChatId] = useState('current')
    const [currentSessionType, setCurrentSessionType] = useState('general')
    const [showSessionMenu, setShowSessionMenu] = useState(false)
    // Unused but keeping ref for message scrolling
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Auto-save chat whenever messages change
    useEffect(() => {
        if (messages.length > 1) {
            saveChat(currentChatId, {
                messages,
                sessionType: currentSessionType,
                title: `${SESSION_TYPES[currentSessionType.toUpperCase()]?.name || 'Chat'} - ${new Date().toLocaleDateString()}`
            })
        }
    }, [messages, currentChatId, currentSessionType])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleNewChat = () => {
        if (messages.length > 1) {
            saveChat(currentChatId, {
                messages,
                sessionType: currentSessionType,
                title: `${SESSION_TYPES[currentSessionType.toUpperCase()]?.name || 'Chat'} - ${new Date().toLocaleDateString()}`
            })
        }

        setMessages([WELCOME_MESSAGE])
        setCurrentChatId(Date.now().toString())
        setCurrentSessionType('general')
    }

    const handleSelectSession = (arg) => {
        // Check if arg is a string (session type ID) or object (chat history item)
        if (typeof arg === 'object' && arg.id) {
            // Load existing chat
            const savedChat = loadChat(arg.id)
            if (savedChat && savedChat.messages) {
                setMessages(savedChat.messages)
                setCurrentSessionType(savedChat.sessionType || arg.type || 'general')
                setCurrentChatId(arg.id)
            }
        } else {
            // Start new session with specific type
            const typeId = typeof arg === 'string' ? arg : (arg.type || 'general')

            // Save current if needed
            if (messages.length > 1) {
                saveChat(currentChatId, {
                    messages,
                    sessionType: currentSessionType,
                    title: `${SESSION_TYPES[currentSessionType.toUpperCase()]?.name || 'Chat'} - ${new Date().toLocaleDateString()}`
                })
            }

            const welcomeMsg = {
                id: 'welcome',
                sender: 'bot',
                text: getWelcomeMessage(typeId)
            }
            setMessages([welcomeMsg])
            setCurrentSessionType(typeId)
            setCurrentChatId(Date.now().toString())
        }
    }

    const handleSendMessage = async (text) => {
        if (!text.trim()) return

        const userMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: text.trim()
        }

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        // Build conversation history for the API (excluding welcome message)
        const conversationHistory = [...messages, userMessage]
            .filter(m => m.id !== 'welcome')
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
            }))

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response')
            }

            const data = await response.json()

            const botMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: data.reply,
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please use the crisis button above for immediate resources. 💙",
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="chat-page-container">
            {/* Sidebar */}
            <Sidebar
                onNewChat={handleNewChat}
                currentChatId={currentChatId}
                onSelectSession={handleSelectSession}
            />

            <div className="chat-page">
                {/* Header */}
                <header className="chat-header glass">
                    <div className="chat-header-left">
                        <button className="header-btn" onClick={() => navigate('/')} title="Back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    <div className="chat-header-info">
                        <div className="header-avatar">
                            <img src={logo} alt="Veria" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                            <h1 className="header-title">VERIA ASSISTANT</h1>
                            <span className="header-status">
                                <span className={`status-dot ${isLoading ? 'status-thinking' : 'status-online'}`}></span>
                                {isLoading ? 'Thinking...' : 'Online'}
                            </span>
                        </div>
                    </div>

                    <div className="chat-header-right">
                        <button
                            className="header-btn header-btn-labeled"
                            onClick={() => {
                                saveChat(currentChatId, {
                                    messages,
                                    sessionType: currentSessionType,
                                    title: `${SESSION_TYPES[currentSessionType.toUpperCase()]?.name || 'Chat'} - ${new Date().toLocaleDateString()}`
                                })
                            }}
                            title="Save Chat"
                        >
                            💾 Save
                        </button>
                        <button
                            className="header-btn header-btn-labeled"
                            onClick={() => {
                                exportChat(messages, `${SESSION_TYPES[currentSessionType.toUpperCase()]?.name || 'Chat'}`)
                            }}
                            title="Export Chat"
                        >
                            📥 Export
                        </button>
                        <button
                            className="btn btn-crisis"
                            onClick={() => setShowCrisisModal(true)}
                        >
                            🆘 I'm in crisis
                        </button>
                        <button
                            className="header-btn header-btn-labeled"
                            onClick={() => navigate('/info')}
                            title="About"
                        >
                            ℹ️ About
                        </button>
                    </div>
                </header>

                {/* Disclaimer banner */}
                <div className="chat-disclaimer">
                    <span></span>
                    <span>This is an AI companion, not a therapist. For professional help, consult a licensed provider.</span>
                </div>

                {/* Messages */}
                <main className="chat-messages">
                    <MessageList messages={messages} isLoading={isLoading} />
                    <div ref={messagesEndRef} />
                </main>

                {/* Input */}
                <div className="message-input-wrapper">
                    <button
                        className="attach-btn-plus"
                        onClick={() => setShowSessionMenu(!showSessionMenu)}
                        title="Start a Session"
                    >
                        +
                    </button>
                    <MessageInput onSend={handleSendMessage} disabled={isLoading} />
                </div>

                {/* Session Menu */}
                <SessionMenu
                    isOpen={showSessionMenu}
                    onClose={() => setShowSessionMenu(false)}
                    onSelectSession={handleSelectSession}
                />



                {/* Mouse Tracker */}
                <MouseTracker />
            </div>

            {/* Crisis Modal - rendered outside chat-page to avoid overflow:hidden clipping */}
            {showCrisisModal && (
                <CrisisBanner onClose={() => setShowCrisisModal(false)} />
            )}
        </div>
    )
}

export default Chat
