import { useState, useEffect } from 'react'
import { SESSION_TYPES } from '../utils/sessionTypes'
import { getChatHistory as getSavedChats } from '../utils/chatStorage'
import './Sidebar.css'

function Sidebar({ onNewChat, currentChatId, onSelectSession }) {
    const [showHistory, setShowHistory] = useState(false)
    const [savedChats, setSavedChats] = useState([])


    // Load saved chats from localStorage
    useEffect(() => {
        const loadChats = () => {
            const chats = getSavedChats()
            setSavedChats(chats)
        }
        loadChats()
        // Refresh every 3 seconds to pick up new saves
        const interval = setInterval(loadChats, 3000)
        return () => clearInterval(interval)
    }, [])

    const formatTimestamp = (isoString) => {
        if (!isoString) return ''
        const date = new Date(isoString)
        const now = new Date()
        const diffMs = now - date
        const diffMin = Math.floor(diffMs / 60000)
        const diffHr = Math.floor(diffMs / 3600000)
        const diffDay = Math.floor(diffMs / 86400000)

        if (diffMin < 1) return 'Just now'
        if (diffMin < 60) return `${diffMin}m ago`
        if (diffHr < 24) return `${diffHr}h ago`
        if (diffDay < 7) return `${diffDay}d ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="chat-sidebar">
            <button className="new-chat-btn" onClick={onNewChat}>
                <span>+</span> New Chat
            </button>

            {/* History Nav Item */}
            <div className="sidebar-nav">
                <div
                    className={`sidebar-nav-item ${showHistory ? 'active' : ''}`}
                    onClick={() => setShowHistory(!showHistory)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>History</span>
                    <svg className={`nav-chevron ${showHistory ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            {/* Saved Chat History Panel */}
            {showHistory && (
                <div className="chat-history">
                    <div className="history-label">Saved Chats</div>
                    {savedChats.length === 0 ? (
                        <div className="history-empty">
                            <span className="history-empty-icon">💬</span>
                            <span>No saved conversations yet</span>
                        </div>
                    ) : (
                        savedChats.map(chat => {
                            const typeKey = (chat.sessionType || 'general').toUpperCase()
                            const sessionType = SESSION_TYPES[typeKey] || SESSION_TYPES.GENERAL
                            const preview = chat.messages && chat.messages.length > 1
                                ? chat.messages[chat.messages.length - 1].text?.substring(0, 40) + '...'
                                : 'New conversation'
                            return (
                                <div
                                    key={chat.id}
                                    className={`history-item ${chat.id === currentChatId ? 'active' : ''}`}
                                    onClick={() => onSelectSession && onSelectSession({
                                        id: chat.id,
                                        type: sessionType.id,
                                        title: chat.title || sessionType.name
                                    })}
                                >
                                    <div className="history-icon">{sessionType.icon || '💬'}</div>
                                    <div className="history-content">
                                        <div className="history-title">{chat.title || sessionType.name}</div>
                                        <div className="history-preview">{preview}</div>
                                        <div className="history-timestamp">{formatTimestamp(chat.lastUpdated)}</div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            <div className="sidebar-footer">
                <div className="footer-item">Private & Secure</div>
                <div className="footer-item">Always Here</div>
            </div>
        </div>
    )
}

export default Sidebar

