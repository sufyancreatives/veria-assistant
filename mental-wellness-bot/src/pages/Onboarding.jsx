import logo from '../assets/logo.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCursorTracking, useCursorGlow } from '../hooks/useCursorTracking'
import './Onboarding.css'

function Onboarding() {
    const [agreed, setAgreed] = useState(false)
    const navigate = useNavigate()

    // 3D cursor tracking for cards
    const descriptionCard = useCursorTracking({ maxMovement: 4, maxRotation: 2 })
    const disclaimerCard = useCursorTracking({ maxMovement: 4, maxRotation: 2 })
    const continueButton = useCursorGlow()

    const handleContinue = () => {
        if (agreed) {
            navigate('/chat')
        }
    }

    return (
        <div className="onboarding">
            {/* Ambient background orbs */}
            <div className="onboarding-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="onboarding-content animate-fade-in-up">
                {/* Logo / Brand */}
                <div className="onboarding-brand">
                    <div className="brand-header-actions" style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn-text"
                            onClick={() => navigate('/info')}
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.2)'
                                e.target.style.color = 'white'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.1)'
                                e.target.style.color = 'rgba(255,255,255,0.7)'
                            }}
                        >
                            About
                        </button>
                        <button
                            className="btn-text"
                            onClick={() => navigate('/auth')}
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.2)'
                                e.target.style.color = 'white'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.1)'
                                e.target.style.color = 'rgba(255,255,255,0.7)'
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                    <div className="brand-icon">
                        <img src={logo} alt="Veria Logo" className="brand-logo-img" />
                    </div>
                    <h1 className="brand-name">VERIA ASSISTANT</h1>
                    <p className="brand-tagline">Your compassionate wellness companion</p>
                </div>

                {/* Description Card */}
                <div
                    ref={descriptionCard.elementRef}
                    className="onboarding-card glass card-3d cursor-track"
                    style={{
                        transform: `
                            translate3d(${descriptionCard.transform.x}px, ${descriptionCard.transform.y}px, 0)
                            rotateX(${descriptionCard.transform.rotateX}deg)
                            rotateY(${descriptionCard.transform.rotateY}deg)
                        `
                    }}
                >
                    <h2>Welcome</h2>
                    <p>
                        VERIA ASSISTANT is here to listen, support, and help you reflect on your thoughts and feelings.
                        Whether you're feeling stressed, anxious, or just need someone to talk to —
                        I'm here for you. 💙
                    </p>

                    <div className="feature-grid">
                        <div className="feature-item">
                            <span className="feature-icon">💬</span>
                            <span className="feature-text">Empathetic conversations</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🧘</span>
                            <span className="feature-text">Coping strategies</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🌱</span>
                            <span className="feature-text">Emotional reflection</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🔒</span>
                            <span className="feature-text">Safe & private space</span>
                        </div>
                    </div>
                </div>

                {/* Disclaimer Card */}
                <div
                    ref={disclaimerCard.elementRef}
                    className="onboarding-card disclaimer-card glass card-3d cursor-track"
                    style={{
                        transform: `
                            translate3d(${disclaimerCard.transform.x}px, ${disclaimerCard.transform.y}px, 0)
                            rotateX(${disclaimerCard.transform.rotateX}deg)
                            rotateY(${disclaimerCard.transform.rotateY}deg)
                        `
                    }}
                >
                    <div className="disclaimer-header">
                        <span className="disclaimer-icon">⚠️</span>
                        <h3>Important Disclaimer</h3>
                    </div>
                    <ul className="disclaimer-list">
                        <li>VERIA ASSISTANT is <strong>not a licensed therapist</strong> and does not replace professional mental health care.</li>
                        <li>It <strong>cannot diagnose, treat, or prescribe</strong> medication for any condition.</li>
                        <li>For serious mental health concerns, please <strong>consult a licensed professional</strong>.</li>
                        <li>
                            <strong>If you are in crisis or immediate danger</strong>, contact emergency services or a crisis hotline:
                            <div className="crisis-resources">
                                <span>📞 <strong>988</strong> – Suicide & Crisis Lifeline (US)</span>
                                <span>💬 Text <strong>HOME</strong> to <strong>741741</strong> – Crisis Text Line</span>
                                <span>🆘 <strong>911</strong> – Emergency Services</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Consent */}
                <div className="consent-section">
                    <label className="consent-label" htmlFor="consent-checkbox">
                        <input
                            type="checkbox"
                            id="consent-checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="consent-checkbox"
                        />
                        <span className="consent-checkmark"></span>
                        <span className="consent-text">
                            I understand that VERIA ASSISTANT is an AI companion, not a therapist, and is not a substitute for professional care.
                        </span>
                    </label>
                </div>

                {/* Continue Button */}
                <button
                    ref={continueButton.elementRef}
                    className="btn btn-primary btn-continue"
                    disabled={!agreed}
                    onClick={handleContinue}
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        Begin Your Journey
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </span>
                    <div
                        className="button-glow"
                        style={{
                            position: 'absolute',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                            left: `${continueButton.glowPosition.x}%`,
                            top: `${continueButton.glowPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            opacity: continueButton.glowPosition.opacity * 0.5,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none',
                        }}
                    />
                </button>
            </div>
        </div>
    )
}

export default Onboarding
