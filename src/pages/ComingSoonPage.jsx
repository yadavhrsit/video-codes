import React from 'react';
import './ComingSoonPage.css';

function ComingSoonPage({ onBack, topicTitle = "Coming Soon" }) {
    return (
        <div className="demo-page coming-soon-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>← Back to Home</button>
                <h1 className="demo-title">{topicTitle}</h1>
            </div>

            <div className="demo-content coming-soon-content">
                <div className="construction-visual">
                    <span className="gear-icon spin-slow">⚙️</span>
                    <span className="hammer-icon swing">🔨</span>
                    <span className="cone-icon">🚧</span>
                </div>

                <h2>Work in Progress</h2>
                <p>
                    This interactive demonstration is currently under development.
                    Check back soon for a visual guide to <strong>{topicTitle}</strong>!
                </p>

                <div className="notify-box">
                    <span>🔔 Notify me when ready</span>
                </div>
            </div>
        </div>
    );
}

export default ComingSoonPage;
