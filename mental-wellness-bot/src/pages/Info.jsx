import { useNavigate } from 'react-router-dom'
import { useCursorTracking } from '../hooks/useCursorTracking'
import logo from '../assets/logo.png'
import './Info.css'

function Info() {
    const navigate = useNavigate()

    // Cursor tracking for info cards
    const aboutCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 })
    const whatCanDoCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 })
    const limitationsCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 })
    const privacyCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 })
    const crisisCard = useCursorTracking({ maxMovement: 3, maxRotation: 1.5 })

    return (
        <div className="info-page">
            <div className="info-container animate-fade-in-up">
                {/* Header */}
                <header className="info-header">
                    <button className="header-btn" onClick={() => navigate('/chat')} title="Back to chat">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1>About VERIA ASSISTANT</h1>
                </header>

                {/* About Section */}
                <section
                    ref={aboutCard.elementRef}
                    className="info-section glass card-3d cursor-track"
                    style={{
                        transform: `
                            translate3d(${aboutCard.transform.x}px, ${aboutCard.transform.y}px, 0)
                            rotateX(${aboutCard.transform.rotateX}deg)
                            rotateY(${aboutCard.transform.rotateY}deg)
                        `
                    }}
                >
                    <div className="section-icon">
                        <img src={logo} alt="" className="section-logo-img" />
                    </div>
                    <h2>What is VERIA ASSISTANT?</h2>
                    <p>
                        VERIA ASSISTANT is an AI-powered wellness companion designed to offer emotional support,
                        active listening, and gentle coping strategies. It uses advanced AI (GPT-4.1) to
                        provide empathetic, non-judgmental conversations.
                    </p>
                </section>

                {/* What Serenity Can Do */}
                <section
                    ref={whatCanDoCard.elementRef}
                    className="info-section glass card-3d cursor-track"
                    style={{
                        transform: `
                            translate3d(${whatCanDoCard.transform.x}px, ${whatCanDoCard.transform.y}px, 0)
                            rotateX(${whatCanDoCard.transform.rotateX}deg)
                            rotateY(${whatCanDoCard.transform.rotateY}deg)
                        `
                    }}
                >
                    <div className="section-icon">✨</div>
                    <h2>What I Can Help With</h2>
                    <ul className="info-list">
                        <li>💬 Providing a safe space to talk about your feelings</li>
                        <li>🧘 Suggesting general coping and relaxation techniques</li>
                        <li>🌱 Helping you reflect on your thoughts and emotions</li>
                        <li>📋 Encouraging healthy habits and self-care routines</li>
                        <li>🤝 Normalizing the process of seeking professional help</li>
                    </ul>
                </section>

                {/* What Serenity Cannot Do */}
                <section
                    ref={limitationsCard.elementRef}
                    className="info-section glass warning-section card-3d cursor-track"
                    style={{
                        transform: `
                            translate3d(${limitationsCard.transform.x}px, ${limitationsCard.transform.y}px, 0)
                            rotateX(${limitationsCard.transform.rotateX}deg)
                            rotateY(${limitationsCard.transform.rotateY}deg)
                        `
                    }}
                >
                    <div className="section-icon">⚠️</div>
                    <h2>Important Limitations</h2>
                    <ul className="info-list warning-list">
                        <li>❌ I am <strong>not a licensed therapist</strong> or counselor</li>
                        <li>❌ I <strong>cannot diagnose</strong> mental health conditions</li>
                        <li>❌ I <strong>cannot prescribe</strong> or recommend medications</li>
                        <li>❌ I am <strong>not a substitute</strong> for professional care</li>
                        <li>❌ I <strong>cannot provide</strong> emergency crisis intervention</li>
                    </ul>
                    <p className="warning-note">
                        If you are experiencing a mental health crisis, please contact a licensed
                        professional or use the crisis resources available in the chat.
                    </p>
                </section>

                {/* Privacy */}
                <section
                    ref={privacyCard.elementRef}
                    className="info-section glass card-3d cursor-track"
                    style={{
                        transform: `
                            translate3d(${privacyCard.transform.x}px, ${privacyCard.transform.y}px, 0)
                            rotateX(${privacyCard.transform.rotateX}deg)
                            rotateY(${privacyCard.transform.rotateY}deg)
                        `
                    }}
                >
                    <div className="section-icon">🔒</div>
                    <h2>Privacy & Data</h2>
                    <p>
                        Your conversations are processed in real-time and are <strong>not stored</strong> on
                        our servers after your session ends. Messages are sent to OpenAI's API for
                        processing. We recommend not sharing highly sensitive personal information
                        such as full names, addresses, or financial details.
                    </p>
                </section>

                {/* Crisis Resources */}
                <section
                    ref={crisisCard.elementRef}
                    className="info-section glass crisis-section card-3d cursor-track"
                    style={{
                        transform: `
                            translate3d(${crisisCard.transform.x}px, ${crisisCard.transform.y}px, 0)
                            rotateX(${crisisCard.transform.rotateX}deg)
                            rotateY(${crisisCard.transform.rotateY}deg)
                        `
                    }}
                >
                    <div className="section-icon">🆘</div>
                    <h2>Crisis Resources</h2>
                    <p>If you or someone you know is in crisis:</p>
                    <div className="info-crisis-list">
                        <div className="info-crisis-item">
                            <strong>988 Suicide & Crisis Lifeline</strong>
                            <span>Call or text 988</span>
                        </div>
                        <div className="info-crisis-item">
                            <strong>Crisis Text Line</strong>
                            <span>Text HOME to 741741</span>
                        </div>
                        <div className="info-crisis-item">
                            <strong>Emergency Services</strong>
                            <span>Call 911 (US)</span>
                        </div>
                    </div>
                </section>

                {/* Back to chat */}
                <button className="btn btn-primary btn-back-chat" onClick={() => navigate('/chat')}>
                    Back to Chat
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Info
