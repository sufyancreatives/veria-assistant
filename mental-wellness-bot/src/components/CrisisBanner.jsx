import './CrisisBanner.css'

function CrisisBanner({ onClose }) {
    return (
        <>
            <div className="overlay" onClick={onClose} />
            <div className="modal crisis-modal">
                <div className="crisis-modal-header">
                    <div className="crisis-icon-large">!</div>
                    <h2>You Are Not Alone</h2>
                    <p>If you are in immediate danger or having thoughts of harming yourself, please reach out now.</p>
                </div>

                <div className="crisis-resources-grid">
                    <a href="tel:988" className="crisis-resource-card resource-urgent">
                        <div className="resource-icon">📞</div>
                        <div className="resource-info">
                            <h3>988 Suicide & Crisis Lifeline</h3>
                            <p>Call or text <strong>988</strong></p>
                            <span className="resource-tag">24/7 • Free • Confidential</span>
                        </div>
                        <div className="resource-action">Call Now</div>
                    </a>

                    <a href="sms:741741?body=HOME" className="crisis-resource-card">
                        <div className="resource-icon">💬</div>
                        <div className="resource-info">
                            <h3>Crisis Text Line</h3>
                            <p>Text <strong>HOME</strong> to <strong>741741</strong></p>
                            <span className="resource-tag">24/7 • Free • Confidential</span>
                        </div>
                        <div className="resource-action">Text Now</div>
                    </a>

                    <a href="tel:911" className="crisis-resource-card resource-emergency">
                        <div className="resource-icon">🚨</div>
                        <div className="resource-info">
                            <h3>Emergency Services</h3>
                            <p>Call <strong>911</strong> (US) or your local number</p>
                            <span className="resource-tag">Immediate help</span>
                        </div>
                        <div className="resource-action resource-action-urgent">Call 911</div>
                    </a>

                    <a
                        href="https://www.iasp.info/resources/Crisis_Centres/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="crisis-resource-card"
                    >
                        <div className="resource-icon">🌍</div>
                        <div className="resource-info">
                            <h3>International Crisis Centers</h3>
                            <p>Find help in your country</p>
                            <span className="resource-tag">Global directory</span>
                        </div>
                        <div className="resource-action">Visit</div>
                    </a>
                </div>

                <div className="crisis-reminder">
                    <p>Your feelings are valid. Reaching out takes courage, and help is available.</p>
                </div>

                <button className="btn btn-outline crisis-close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </>
    )
}

export default CrisisBanner
