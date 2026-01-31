import { useState, useEffect } from 'react';
import './EffectDemo.css';

function EffectDemo({ onBack }) {
    // Example 1: Window resize
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Example 2: Timer
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Example 3: Data fetching simulation
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(1);

    // Effect 1: Window resize listener
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect 2: Timer
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    // Effect 3: Fetch data when userId changes
    useEffect(() => {
        setLoading(true);
        setData(null);

        const timer = setTimeout(() => {
            setData({ id: userId, name: `User ${userId}`, email: `user${userId}@example.com` });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [userId]);

    return (
        <div className="demo-page effect-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>← Back to Home</button>
                <h1 className="demo-title">useEffect Hook</h1>
            </div>

            <div className="demo-content effect-content">
                {/* Theory Section */}
                <div className="theory-section">
                    <h2 className="section-title">📚 What is useEffect?</h2>
                    <div className="theory-card">
                        <p className="theory-text">
                            <strong>useEffect</strong> lets you perform side effects in function components.
                            Side effects are operations that interact with the outside world: API calls, subscriptions, DOM manipulation, timers, etc.
                        </p>
                    </div>

                    <div className="lifecycle-visual">
                        <div className="lifecycle-step mount">
                            <span className="step-icon">🚀</span>
                            <h4>Mount</h4>
                            <p>Component appears</p>
                            <code>useEffect runs</code>
                        </div>
                        <div className="lifecycle-arrow">→</div>
                        <div className="lifecycle-step update">
                            <span className="step-icon">🔄</span>
                            <h4>Update</h4>
                            <p>Deps change</p>
                            <code>Effect re-runs</code>
                        </div>
                        <div className="lifecycle-arrow">→</div>
                        <div className="lifecycle-step unmount">
                            <span className="step-icon">👋</span>
                            <h4>Unmount</h4>
                            <p>Component leaves</p>
                            <code>Cleanup runs</code>
                        </div>
                    </div>

                    <div className="syntax-box">
                        <h4>📝 Syntax</h4>
                        <div className="code-snippet">
                            <pre>{`useEffect(() => {
    // Side effect code runs here
    
    return () => {
        // Cleanup code (optional)
    };
}, [dependencies]); // When to re-run`}</pre>
                        </div>
                    </div>

                    <div className="deps-explanation">
                        <h4>🎯 Dependency Array Explained</h4>
                        <div className="deps-grid">
                            <div className="dep-card">
                                <code>[]</code>
                                <p>Run <strong>once</strong> on mount</p>
                            </div>
                            <div className="dep-card">
                                <code>[a, b]</code>
                                <p>Run when <strong>a or b</strong> change</p>
                            </div>
                            <div className="dep-card">
                                <code>no array</code>
                                <p>Run on <strong>every</strong> render</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Practical Examples */}
                <h2 className="section-title">🎮 Interactive Examples</h2>

                <div className="examples-grid">
                    {/* Window Width Example */}
                    <div className="example-card">
                        <h3>1️⃣ Event Listeners</h3>
                        <div className="example-demo">
                            <div className="width-display">
                                <span className="width-value">{windowWidth}</span>
                                <span className="width-unit">px</span>
                            </div>
                            <p>Resize your window!</p>
                        </div>
                        <div className="example-code">
                            <pre>{`useEffect(() => {
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);`}</pre>
                        </div>
                    </div>

                    {/* Timer Example */}
                    <div className="example-card">
                        <h3>2️⃣ Timers & Intervals</h3>
                        <div className="example-demo">
                            <div className="timer-display">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</div>
                            <div className="timer-buttons">
                                <button onClick={() => setIsRunning(!isRunning)}>
                                    {isRunning ? '⏸️ Pause' : '▶️ Start'}
                                </button>
                                <button onClick={() => { setSeconds(0); setIsRunning(false); }}>🔄 Reset</button>
                            </div>
                        </div>
                        <div className="example-code">
                            <pre>{`useEffect(() => {
  const id = setInterval(() => setSeconds(s => s+1), 1000);
  return () => clearInterval(id);
}, [isRunning]);`}</pre>
                        </div>
                    </div>

                    {/* Data Fetching Example */}
                    <div className="example-card wide">
                        <h3>3️⃣ Data Fetching (with dependency)</h3>
                        <div className="example-demo fetch-demo">
                            <div className="user-selector">
                                <span>Select User ID:</span>
                                <div className="user-buttons">
                                    {[1, 2, 3, 4, 5].map(id => (
                                        <button
                                            key={id}
                                            className={userId === id ? 'active' : ''}
                                            onClick={() => setUserId(id)}
                                        >{id}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="user-result">
                                {loading ? (
                                    <div className="loading-state">⏳ Loading...</div>
                                ) : data ? (
                                    <div className="user-card">
                                        <span className="user-avatar">👤</span>
                                        <div className="user-info">
                                            <strong>{data.name}</strong>
                                            <span>{data.email}</span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="example-code">
                            <pre>{`useEffect(() => {
  fetchUser(userId).then(setData);
}, [userId]); // Re-fetches when userId changes`}</pre>
                        </div>
                    </div>
                </div>

                {/* Common Use Cases */}
                <div className="usecases-section">
                    <h2 className="section-title">💡 Common Use Cases</h2>
                    <div className="usecases-grid">
                        <div className="usecase">
                            <span>🌐</span>
                            <p>API Calls</p>
                        </div>
                        <div className="usecase">
                            <span>📡</span>
                            <p>Subscriptions</p>
                        </div>
                        <div className="usecase">
                            <span>⏰</span>
                            <p>Timers</p>
                        </div>
                        <div className="usecase">
                            <span>🖱️</span>
                            <p>Event Listeners</p>
                        </div>
                        <div className="usecase">
                            <span>📄</span>
                            <p>Document Title</p>
                        </div>
                        <div className="usecase">
                            <span>💾</span>
                            <p>LocalStorage</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EffectDemo;
