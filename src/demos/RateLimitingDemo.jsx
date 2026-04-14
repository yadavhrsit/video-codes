import { useState, useEffect } from 'react';
import './RateLimitingDemo.css';

function RateLimitingDemo({ onBack }) {
    const [requests, setRequests] = useState([]);
    const [tokenBucket, setTokenBucket] = useState(10);
    const [isBlocked, setIsBlocked] = useState(false);
    const [stats, setStats] = useState({ allowed: 0, blocked: 0 });
    const [algorithm, setAlgorithm] = useState('token-bucket');

    useEffect(() => {
        const interval = setInterval(() => {
            setTokenBucket(prev => Math.min(prev + 1, 10));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const sendRequest = () => {
        const newRequest = { id: Date.now(), status: tokenBucket > 0 ? 'allowed' : 'blocked' };

        if (tokenBucket > 0) {
            setTokenBucket(prev => prev - 1);
            setStats(prev => ({ ...prev, allowed: prev.allowed + 1 }));
        } else {
            setIsBlocked(true);
            setStats(prev => ({ ...prev, blocked: prev.blocked + 1 }));
            setTimeout(() => setIsBlocked(false), 500);
        }

        setRequests(prev => [newRequest, ...prev].slice(0, 10));
    };

    const burstRequests = () => {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => sendRequest(), i * 100);
        }
    };

    const algorithms = [
        { id: 'token-bucket', name: 'Token Bucket', desc: 'Tokens refill at fixed rate, consumed per request', icon: '🪣' },
        { id: 'sliding-window', name: 'Sliding Window', desc: 'Counts requests in rolling time window', icon: '🪟' },
        { id: 'fixed-window', name: 'Fixed Window', desc: 'Resets counter at fixed intervals', icon: '⏱️' },
        { id: 'leaky-bucket', name: 'Leaky Bucket', desc: 'Requests processed at constant rate', icon: '💧' },
    ];

    return (
        <div className="demo-page ratelimit-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>← Back to Home</button>
                <h1 className="demo-title">Rate Limiting</h1>
            </div>

            <div className="demo-content ratelimit-content">
                <div className="intro-section">
                    <p className="intro-text">
                        <strong>Rate limiting</strong> controls the number of requests a client can make
                        in a given time period, protecting APIs from abuse and ensuring fair usage.
                    </p>
                    <p className="intro-text" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem' }}>
                        <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Why it matters:</strong> Without rate limiting, one bad actor could send millions of requests and crash your server, or a bug in a client app could accidentally DDoS you. Rate limiting ensures fair resource distribution and protects your infrastructure — it's why Twitter limits tweets and APIs limit calls per minute.
                    </p>
                </div>

                {/* Key Terminology */}
                <div className="terminology-section" style={{ marginBottom: '2rem' }}>
                    <h2 className="section-title">📖 Key Terminology</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                        {[
                            { term: 'Rate Limit', desc: 'Maximum requests allowed in a time window (e.g., 100 req/min).' },
                            { term: '429 Too Many Requests', desc: 'HTTP status code returned when rate limit is exceeded.' },
                            { term: 'Throttling', desc: 'Slowing down requests instead of blocking them entirely.' },
                            { term: 'Burst', desc: 'Allowing a spike of requests above the normal rate for short periods.' },
                            { term: 'X-RateLimit Headers', desc: 'HTTP headers that tell clients their remaining quota and reset time.' },
                            { term: 'API Key', desc: 'Unique identifier to track and limit requests per client/user.' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: 'rgba(102, 126, 234, 0.08)', border: '1px solid rgba(102, 126, 234, 0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                                <h4 style={{ color: '#667eea', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}>{item.term}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="simulator-container">
                    <h2 className="section-title">🎮 Token Bucket Simulator</h2>

                    <div className="simulator-layout">
                        <div className="bucket-visual">
                            <h3>🪣 Token Bucket</h3>
                            <div className="bucket">
                                <div className="water-level" style={{ height: `${tokenBucket * 10}%` }}>
                                    <span className="token-count">{tokenBucket}/10</span>
                                </div>
                            </div>
                            <p className="refill-rate">Refills: 1 token/second</p>
                        </div>

                        <div className="control-panel">
                            <div className={`request-indicator ${isBlocked ? 'blocked' : ''}`}>
                                {isBlocked ? '🚫 BLOCKED' : '✅ READY'}
                            </div>
                            <button className="request-btn" onClick={sendRequest}>
                                📤 Send Request
                            </button>
                            <button className="burst-btn" onClick={burstRequests}>
                                ⚡ Burst 15 Requests
                            </button>

                            <div className="stats-row">
                                <div className="stat allowed">
                                    <span className="val">{stats.allowed}</span>
                                    <span className="lbl">Allowed</span>
                                </div>
                                <div className="stat blocked">
                                    <span className="val">{stats.blocked}</span>
                                    <span className="lbl">Blocked</span>
                                </div>
                            </div>
                        </div>

                        <div className="request-log">
                            <h3>📋 Request Log</h3>
                            <div className="log-list">
                                {requests.map(req => (
                                    <div key={req.id} className={`log-item ${req.status}`}>
                                        {req.status === 'allowed' ? '✅' : '🚫'} Request {req.status}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="algorithms-section">
                    <h2 className="section-title">📚 Rate Limiting Algorithms</h2>
                    <div className="algo-grid">
                        {algorithms.map(algo => (
                            <div key={algo.id} className="algo-card">
                                <span className="algo-icon">{algo.icon}</span>
                                <h4>{algo.name}</h4>
                                <p>{algo.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="responses-section">
                    <h2 className="section-title">💬 HTTP Response Codes</h2>
                    <div className="response-cards">
                        <div className="response-card success">
                            <span className="code">200</span>
                            <span className="msg">OK - Request allowed</span>
                        </div>
                        <div className="response-card limited">
                            <span className="code">429</span>
                            <span className="msg">Too Many Requests</span>
                        </div>
                        <div className="response-card headers">
                            <span className="code">Headers</span>
                            <span className="msg">X-RateLimit-Remaining: 5</span>
                        </div>
                    </div>
                </div>

                <div className="code-section">
                    <h2 className="section-title">💻 Implementation Example</h2>
                    <div className="code-snippet">
                        <pre>{`// Express.js Rate Limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests, try again later'
});

app.use('/api/', limiter);`}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RateLimitingDemo;
