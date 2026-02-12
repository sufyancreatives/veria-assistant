import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Dashboard.css'

function Dashboard() {
    const navigate = useNavigate()

    const stats = [
        { icon: '💬', label: 'Conversations', value: 'Available 24/7', color: '#6ee7f9' },
        { icon: '🛡️', label: 'Safety First', value: 'Crisis Support', color: '#a78bfa' },
        { icon: '🤖', label: 'AI Powered', value: 'Gemini 2.5', color: '#f472b6' }
    ]

    const features = [
        {
            icon: '💙',
            title: 'Empathetic Support',
            description: 'Get compassionate, judgment-free emotional support anytime'
        },
        {
            icon: '🔒',
            title: 'Private & Secure',
            description: 'Your conversations are confidential and never stored'
        },
        {
            icon: '🆘',
            title: 'Crisis Resources',
            description: 'Instant access to professional help when you need it most'
        },
        {
            icon: '✨',
            title: 'Smart AI',
            description: 'Powered by Google Gemini 2.5 Flash for intelligent responses'
        }
    ]

    return (
        <div className="dashboard-page">
            <div className="dashboard-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="dashboard-content">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="dashboard-brand">
                        <div className="brand-icon-large">
                            <img src={logo} alt="Veria Logo" className="logo-img-dashboard" />
                        </div>
                        <h1 className="dashboard-title">VERIA ASSISTANT</h1>
                        <p className="dashboard-subtitle">Your 24/7 Mental Wellness Companion</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="stat-card"
                            style={{ '--stat-color': stat.color }}
                        >
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-info">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="features-section">
                    <h2 className="section-title">Why Choose VERIA ASSISTANT?</h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon-large">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="cta-section">
                    <div className="cta-card">
                        <h2>Ready to Start Your Wellness Journey?</h2>
                        <p>Join thousands who trust VERIA ASSISTANT for daily emotional support</p>
                        <div className="cta-buttons">
                            <button
                                className="btn btn-primary cta-btn"
                                onClick={() => navigate('/chat')}
                            >
                                Start Chatting Now
                            </button>
                            <button
                                className="btn btn-secondary cta-btn"
                                onClick={() => navigate('/')}
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <p>
                        <img src={logo} alt="" className="footer-mini-logo" />
                        VERIA ASSISTANT is not a substitute for professional mental health care
                    </p>
                    <div className="footer-links">
                        <button onClick={() => navigate('/info')}>About</button>
                        <span>•</span>
                        <button onClick={() => navigate('/chat')}>Chat</button>
                        <span>•</span>
                        <a href="tel:988">Crisis: 988</a>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Dashboard
