import { useCursorTracking } from '../hooks/useCursorTracking'
import logo from '../assets/logo.png'
import './MessageList.css'

function MessageList({ messages, isLoading }) {
    // Track cursor for the latest bot message only
    const latestBotTrack = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 })

    return (
        <div className="message-list">
            {messages.map((msg, index) => {
                const isLatestBotMsg = msg.sender === 'bot' && index === messages.length - 1 && messages[messages.length - 1].sender === 'bot'

                return (
                    <div
                        key={msg.id}
                        className={`message-row ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}
                        style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
                    >
                        {msg.sender === 'bot' && (
                            <div className="message-avatar bot-avatar">
                                <img src={logo} alt="Bot" className="bot-logo-avatar" />
                            </div>
                        )}
                        <div
                            ref={isLatestBotMsg ? latestBotTrack.elementRef : null}
                            className={`message-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'} ${isLatestBotMsg ? 'cursor-track' : ''}`}
                            style={isLatestBotMsg ? {
                                transform: `
                                    translate3d(${latestBotTrack.transform.x}px, ${latestBotTrack.transform.y}px, 0)
                                    rotateX(${latestBotTrack.transform.rotateX}deg)
                                    rotateY(${latestBotTrack.transform.rotateY}deg)
                                `
                            } : {}}
                        >
                            {msg.text.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i < msg.text.split('\n').length - 1 && <br />}
                                </span>
                            ))}
                        </div>
                    </div>
                )
            })}

            {/* Typing indicator */}
            {isLoading && (
                <div className="message-row message-bot animate-fade-in">
                    <div className="message-avatar bot-avatar">
                        <img src={logo} alt="Bot" className="bot-logo-avatar" />
                    </div>
                    <div className="message-bubble bubble-bot typing-bubble">
                        <div className="typing-indicator">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MessageList
