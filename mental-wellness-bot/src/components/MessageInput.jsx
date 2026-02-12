import { useState, useRef, useEffect } from 'react'
import './MessageInput.css'

function MessageInput({ onSend, disabled }) {
    const [text, setText] = useState('')
    const textareaRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (text.trim() && !disabled) {
            onSend(text)
            setText('')
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
        }
    }, [text])

    return (
        <form className="message-input-container glass" onSubmit={handleSubmit}>
            <div className="input-wrapper">
                <textarea
                    ref={textareaRef}
                    className="message-textarea"
                    placeholder={disabled ? 'VERIA ASSISTANT is thinking...' : 'Share what\'s on your mind...'}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                    autoFocus
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={disabled || !text.trim()}
                    title="Send message"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                </button>
            </div>
        </form>
    )
}

export default MessageInput
