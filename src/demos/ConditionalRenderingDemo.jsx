import { useState } from 'react';
import './ConditionalRenderingDemo.css';

function ConditionalRenderingDemo({ onBack }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('user');
    const [showDetails, setShowDetails] = useState(false);
    const [items, setItems] = useState(['Apple', 'Banana', 'Cherry']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const simulateLoading = () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const simulateError = () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setLoading(false);
            setError('Failed to fetch data!');
        }, 1500);
    };

    const techniques = [
        { name: 'If/Else', code: `{isLoggedIn ? <Dashboard /> : <Login />}`, icon: '🔀' },
        { name: '&& Operator', code: `{showModal && <Modal />}`, icon: '➕' },
        { name: 'Ternary', code: `{count > 0 ? <List /> : <Empty />}`, icon: '❓' },
        { name: 'Switch/Case', code: `{renderByStatus(status)}`, icon: '🔄' },
    ];

    return (
        <div className="demo-page conditional-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>← Back to Home</button>
                <h1 className="demo-title">Conditional Rendering in React</h1>
            </div>

            <div className="demo-content conditional-content">
                <div className="intro-section">
                    <p className="intro-text">
                        <strong>Conditional rendering</strong> allows you to render different UI
                        elements based on state, props, or other conditions in your React components.
                    </p>
                    <p className="intro-text" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem' }}>
                        <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Why it matters:</strong> Real apps show different content to different users — logged in vs out, admin vs regular user, loading vs loaded. Conditional rendering is how you build dynamic UIs that respond to state. It's one of the most frequently used patterns in React development.
                    </p>
                </div>

                {/* Key Terminology */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 className="section-title">📖 Key Terminology</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                        {[
                            { term: 'Ternary Operator', desc: 'condition ? ifTrue : ifFalse. Most common way to conditionally render.' },
                            { term: '&& Operator', desc: 'condition && element. Renders element only if condition is truthy.' },
                            { term: 'Early Return', desc: 'Return early from component if condition met. Good for loading/error states.' },
                            { term: 'Falsy Values', desc: '0, "", null, undefined, false. Watch out: 0 and "" will render!' },
                            { term: 'null Rendering', desc: 'Returning null renders nothing. Useful to hide components.' },
                            { term: 'Short-Circuit', desc: 'Using && and || for conditional logic. && stops at first falsy.' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: 'rgba(102, 126, 234, 0.08)', border: '1px solid rgba(102, 126, 234, 0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                                <h4 style={{ color: '#667eea', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}>{item.term}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="demos-grid">
                    {/* Login State Demo */}
                    <div className="demo-card">
                        <h3>🔐 Authentication State</h3>
                        <div className="demo-preview">
                            {isLoggedIn ? (
                                <div className="state-box logged-in">
                                    <span className="state-icon">👋</span>
                                    <span>Welcome back, User!</span>
                                </div>
                            ) : (
                                <div className="state-box logged-out">
                                    <span className="state-icon">🔒</span>
                                    <span>Please log in</span>
                                </div>
                            )}
                        </div>
                        <button className="toggle-btn" onClick={() => setIsLoggedIn(!isLoggedIn)}>
                            {isLoggedIn ? 'Log Out' : 'Log In'}
                        </button>
                        <div className="code-mini">
                            <code>{`{isLoggedIn ? <Welcome /> : <Login />}`}</code>
                        </div>
                    </div>

                    {/* && Operator Demo */}
                    <div className="demo-card">
                        <h3>➕ && Operator</h3>
                        <div className="demo-preview">
                            <div className="state-box">
                                <span>Product Info</span>
                                {showDetails && (
                                    <div className="details-popup">
                                        <p>Price: $99.99</p>
                                        <p>In Stock: Yes</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className="toggle-btn" onClick={() => setShowDetails(!showDetails)}>
                            {showDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                        <div className="code-mini">
                            <code>{`{showDetails && <Details />}`}</code>
                        </div>
                    </div>

                    {/* Role-based Demo */}
                    <div className="demo-card">
                        <h3>👤 Role-Based UI</h3>
                        <div className="demo-preview">
                            <div className={`state-box role-${userRole}`}>
                                {userRole === 'admin' && <span className="badge admin">🛡️ Admin Panel</span>}
                                {userRole === 'editor' && <span className="badge editor">✏️ Edit Mode</span>}
                                {userRole === 'user' && <span className="badge user">👁️ View Only</span>}
                            </div>
                        </div>
                        <div className="role-buttons">
                            <button className={userRole === 'user' ? 'active' : ''} onClick={() => setUserRole('user')}>User</button>
                            <button className={userRole === 'editor' ? 'active' : ''} onClick={() => setUserRole('editor')}>Editor</button>
                            <button className={userRole === 'admin' ? 'active' : ''} onClick={() => setUserRole('admin')}>Admin</button>
                        </div>
                        <div className="code-mini">
                            <code>{`{role === 'admin' && <AdminTools />}`}</code>
                        </div>
                    </div>

                    {/* Loading State Demo */}
                    <div className="demo-card">
                        <h3>⏳ Loading States</h3>
                        <div className="demo-preview">
                            <div className="state-box">
                                {loading ? (
                                    <div className="loading-spinner">🔄 Loading...</div>
                                ) : error ? (
                                    <div className="error-state">❌ {error}</div>
                                ) : (
                                    <div className="success-state">✅ Data loaded!</div>
                                )}
                            </div>
                        </div>
                        <div className="action-buttons">
                            <button onClick={simulateLoading}>Load Data</button>
                            <button onClick={simulateError}>Simulate Error</button>
                        </div>
                        <div className="code-mini">
                            <code>{`{loading ? <Spinner /> : <Content />}`}</code>
                        </div>
                    </div>
                </div>

                <div className="techniques-section">
                    <h2 className="section-title">📚 Conditional Rendering Techniques</h2>
                    <div className="techniques-grid">
                        {techniques.map((tech, i) => (
                            <div key={i} className="technique-card">
                                <span className="tech-icon">{tech.icon}</span>
                                <h4>{tech.name}</h4>
                                <code>{tech.code}</code>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="code-section">
                    <h2 className="section-title">💻 Complete Example</h2>
                    <div className="code-snippet">
                        <pre>{`function UserDashboard({ user, isLoading, error }) {
    // Early return pattern
    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    if (!user) return <LoginPrompt />;

    return (
        <div>
            {/* Ternary operator */}
            {user.isAdmin ? <AdminPanel /> : <UserPanel />}
            
            {/* && operator for optional rendering */}
            {user.notifications.length > 0 && (
                <NotificationBadge count={user.notifications.length} />
            )}
            
            {/* Inline conditional styling */}
            <Status style={{ color: user.isOnline ? 'green' : 'gray' }}>
                {user.isOnline ? 'Online' : 'Offline'}
            </Status>
        </div>
    );
}`}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConditionalRenderingDemo;
