import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

function Auth() {
    const [activeTab, setActiveTab] = useState('signin')
    const navigate = useNavigate()

    const handleTabClick = (tab) => {
        setActiveTab(tab)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would handle the actual authentication
        // For now, we'll just navigate to the chat
        navigate('/chat')
    }

    return (
        <div className="auth-container fade">
            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
                    onClick={() => handleTabClick('signin')}
                >
                    Sign In
                </div>
                <div
                    className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => handleTabClick('signup')}
                >
                    Sign Up
                </div>
            </div>

            {/* Sign In Form */}
            <form
                className={`form-content ${activeTab === 'signin' ? 'active' : ''}`}
                id="signin"
                onSubmit={handleSubmit}
            >
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <div className="forgot">Forgot Password?</div>
                <button type="submit">Sign In</button>
            </form>

            {/* Sign Up Form */}
            <form
                className={`form-content ${activeTab === 'signup' ? 'active' : ''}`}
                id="signup"
                onSubmit={handleSubmit}
            >
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <input type="password" placeholder="Confirm Password" required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default Auth
