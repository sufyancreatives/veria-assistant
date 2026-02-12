import { useEffect, useRef } from 'react'
import { SESSION_TYPES } from '../utils/sessionTypes'
import './SessionMenu.css'

function SessionMenu({ isOpen, onClose, onSelectSession }) {
    const menuRef = useRef(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    // Filter out GENERAL if we only want specific wellness sessions, 
    // but user list included specific ones. Let's include all except maybe general?
    // User list: Reflection, Anxiety, Daily Check-in, Wellness Goals, Stress Management.
    // These align with SESSION_TYPES keys except GENERAL.

    const sessions = [
        SESSION_TYPES.REFLECTION,
        SESSION_TYPES.ANXIETY,
        SESSION_TYPES.DAILY_CHECKIN,
        SESSION_TYPES.WELLNESS_GOALS,
        SESSION_TYPES.STRESS_MANAGEMENT
    ]

    return (
        <div className="session-menu glass-elevated" ref={menuRef}>
            <div className="session-menu-header">Start a Session</div>
            {sessions.map((session) => (
                <button
                    key={session.id}
                    className="session-menu-item"
                    onClick={() => {
                        onSelectSession(session.id)
                        onClose()
                    }}
                    style={{ '--item-color': session.color }}
                >
                    <div className="session-icon" style={{ backgroundColor: session.color }}>
                        {session.icon || '✨'}
                    </div>
                    <div className="session-content">
                        <div className="session-title">{session.name}</div>
                        <div className="session-desc">{getHeaderDescription(session.id)}</div>
                    </div>
                </button>
            ))}
        </div>
    )
}

// Helper to get short descriptions for the menu
const getHeaderDescription = (id) => {
    switch (id) {
        case 'reflection': return 'Deep thoughts & insights'
        case 'anxiety': return 'Calm handling of anxiety'
        case 'daily-checkin': return 'Track mood & energy'
        case 'wellness-goals': return 'Plan & achieve goals'
        case 'stress-management': return 'Techniques for relief'
        default: return 'Wellness support'
    }
}

export default SessionMenu
