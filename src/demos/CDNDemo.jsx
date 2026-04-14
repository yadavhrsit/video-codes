import { useState, useEffect } from 'react';
import './CDNDemo.css';

function CDNDemo({ onBack }) {
    const [requestType, setRequestType] = useState(null); // 'without-cdn' or 'with-cdn'
    const [step, setStep] = useState(0);
    const [loadTime, setLoadTime] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const edgeServers = [
        { id: 'na', name: 'North America', icon: '🇺🇸', position: 'top-left' },
        { id: 'eu', name: 'Europe', icon: '🇪🇺', position: 'top-right' },
        { id: 'asia', name: 'Asia', icon: '🇯🇵', position: 'bottom-left' },
        { id: 'aus', name: 'Australia', icon: '🇦🇺', position: 'bottom-right' },
    ];

    const runWithoutCDN = () => {
        setRequestType('without-cdn');
        setIsAnimating(true);
        setStep(1);

        setTimeout(() => setStep(2), 1500);
        setTimeout(() => setStep(3), 4000);
        setTimeout(() => {
            setStep(4);
            setLoadTime(2500);
        }, 5500);
        setTimeout(() => {
            setIsAnimating(false);
        }, 6500);
    };

    const runWithCDN = () => {
        setRequestType('with-cdn');
        setIsAnimating(true);
        setStep(1);

        setTimeout(() => setStep(2), 800);
        setTimeout(() => setStep(3), 1500);
        setTimeout(() => {
            setStep(4);
            setLoadTime(150);
        }, 2000);
        setTimeout(() => {
            setIsAnimating(false);
        }, 3000);
    };

    const reset = () => {
        setRequestType(null);
        setStep(0);
        setLoadTime(null);
        setIsAnimating(false);
    };

    return (
        <div className="demo-page cdn-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>
                    ← Back to Home
                </button>
                <h1 className="demo-title">Content Delivery Network (CDN)</h1>
            </div>

            <div className="demo-content cdn-content">
                <div className="intro-section">
                    <p className="intro-text">
                        A <strong>CDN</strong> is a network of servers distributed globally that cache and deliver content
                        from locations closer to users, reducing latency and improving load times.
                    </p>
                    <p className="intro-text" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem' }}>
                        <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Why it matters:</strong> Without a CDN, every user request travels to your origin server — if it's in the US and your user is in India, that's 12,000+ km each way. CDNs put copies of your content on servers worldwide, so users get data from nearby. This can reduce page load times from 2+ seconds to under 100ms.
                    </p>
                </div>

                {/* Key Terminology */}
                <div className="terminology-section" style={{ marginBottom: '2rem' }}>
                    <h2 className="section-title">📖 Key Terminology</h2>
                    <div className="benefits-grid">
                        {[
                            { term: 'Origin Server', desc: 'Your main server where the original content lives. CDNs pull from here.' },
                            { term: 'Edge Server', desc: 'CDN servers located around the world, close to end users.' },
                            { term: 'PoP (Point of Presence)', desc: 'A physical location where CDN edge servers are deployed.' },
                            { term: 'Cache Hit/Miss', desc: 'Hit = content found on edge. Miss = must fetch from origin.' },
                            { term: 'TTL (Time To Live)', desc: 'How long content stays cached before refreshing from origin.' },
                            { term: 'Purge/Invalidation', desc: 'Forcing CDN to delete cached content and fetch fresh copies.' },
                        ].map((item, i) => (
                            <div key={i} className="benefit-card" style={{ background: 'rgba(36, 150, 237, 0.08)', border: '1px solid rgba(36, 150, 237, 0.2)' }}>
                                <h4 style={{ color: '#2496ED', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.term}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual Comparison */}
                <div className="cdn-comparison">
                    {/* Without CDN */}
                    <div className={`cdn-scenario ${requestType === 'without-cdn' ? 'active' : ''}`}>
                        <h3 className="scenario-title">❌ Without CDN</h3>
                        <div className="scenario-visual">
                            <div className={`user-node ${step >= 1 && requestType === 'without-cdn' ? 'active' : ''}`}>
                                <span className="node-icon">👤</span>
                                <span className="node-label">User (India)</span>
                            </div>

                            <div className={`connection-line long ${step >= 2 && requestType === 'without-cdn' ? 'animating' : ''}`}>
                                <div className="data-packet">📦</div>
                            </div>

                            <div className={`server-node origin ${step >= 3 && requestType === 'without-cdn' ? 'active' : ''}`}>
                                <span className="node-icon">🖥️</span>
                                <span className="node-label">Origin Server (USA)</span>
                                <span className="distance-badge">12,000 km away</span>
                            </div>
                        </div>
                        {requestType === 'without-cdn' && step === 4 && (
                            <div className="load-time slow">
                                ⏱️ Load Time: <strong>{loadTime}ms</strong>
                            </div>
                        )}
                    </div>

                    <div className="vs-divider">VS</div>

                    {/* With CDN */}
                    <div className={`cdn-scenario ${requestType === 'with-cdn' ? 'active' : ''}`}>
                        <h3 className="scenario-title">✅ With CDN</h3>
                        <div className="scenario-visual with-cdn">
                            <div className={`user-node ${step >= 1 && requestType === 'with-cdn' ? 'active' : ''}`}>
                                <span className="node-icon">👤</span>
                                <span className="node-label">User (India)</span>
                            </div>

                            <div className={`connection-line short ${step >= 2 && requestType === 'with-cdn' ? 'animating' : ''}`}>
                                <div className="data-packet fast">⚡</div>
                            </div>

                            <div className={`server-node edge ${step >= 3 && requestType === 'with-cdn' ? 'active' : ''}`}>
                                <span className="node-icon">🌐</span>
                                <span className="node-label">Edge Server (Mumbai)</span>
                                <span className="distance-badge nearby">50 km away</span>
                            </div>
                        </div>
                        {requestType === 'with-cdn' && step === 4 && (
                            <div className="load-time fast">
                                ⚡ Load Time: <strong>{loadTime}ms</strong>
                                <span className="improvement">94% faster!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="control-buttons">
                    <button
                        className="control-btn slow-btn"
                        onClick={runWithoutCDN}
                        disabled={isAnimating}
                    >
                        🐢 Request Without CDN
                    </button>
                    <button
                        className="control-btn fast-btn"
                        onClick={runWithCDN}
                        disabled={isAnimating}
                    >
                        🚀 Request With CDN
                    </button>
                    <button
                        className="control-btn reset-btn"
                        onClick={reset}
                        disabled={isAnimating}
                    >
                        🔄 Reset
                    </button>
                </div>

                {/* Global Edge Servers Map */}
                <div className="edge-servers-section">
                    <h2 className="section-title">🌍 CDN Edge Server Locations</h2>
                    <div className="world-map">
                        <div className="origin-server-central">
                            <span className="server-icon">🏢</span>
                            <span className="server-name">Origin Server</span>
                        </div>
                        {edgeServers.map((server) => (
                            <div key={server.id} className={`edge-server ${server.position}`}>
                                <span className="edge-icon">{server.icon}</span>
                                <span className="edge-name">{server.name}</span>
                                <div className="cache-indicator">📦 Cached</div>
                            </div>
                        ))}
                        <div className="connection-lines-map">
                            <div className="map-line line-1"></div>
                            <div className="map-line line-2"></div>
                            <div className="map-line line-3"></div>
                            <div className="map-line line-4"></div>
                        </div>
                    </div>
                </div>

                {/* How CDN Works */}
                <div className="how-it-works">
                    <h2 className="section-title">⚙️ How CDN Works</h2>
                    <div className="steps-flow">
                        <div className="flow-step">
                            <div className="step-number">1</div>
                            <div className="step-icon">👤</div>
                            <h4>User Request</h4>
                            <p>User requests content from website</p>
                        </div>
                        <div className="flow-step">
                            <div className="step-number">2</div>
                            <div className="step-icon">🔍</div>
                            <h4>DNS Lookup</h4>
                            <p>CDN finds the nearest edge server to the user</p>
                        </div>
                        <div className="flow-step">
                            <div className="step-number">3</div>
                            <div className="step-icon">💾</div>
                            <h4>Cache Check</h4>
                            <p>Edge server checks for cached content</p>
                        </div>
                        <div className="flow-step">
                            <div className="step-number">4</div>
                            <div className="step-icon">⚡</div>
                            <h4>Fast Delivery</h4>
                            <p>Content served from nearest location</p>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="benefits-section">
                    <h2 className="section-title">🎯 CDN Benefits</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <span className="benefit-icon">⚡</span>
                            <h4>Faster Load Times</h4>
                            <p>Content delivered from nearby servers</p>
                        </div>
                        <div className="benefit-card">
                            <span className="benefit-icon">📉</span>
                            <h4>Reduced Bandwidth</h4>
                            <p>Origin server handles fewer requests</p>
                        </div>
                        <div className="benefit-card">
                            <span className="benefit-icon">🛡️</span>
                            <h4>DDoS Protection</h4>
                            <p>Traffic distributed across servers</p>
                        </div>
                        <div className="benefit-card">
                            <span className="benefit-icon">🌐</span>
                            <h4>Global Availability</h4>
                            <p>99.99% uptime with redundancy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CDNDemo;
