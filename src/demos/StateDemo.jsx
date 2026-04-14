import { useState } from 'react';
import './StateDemo.css';

function StateDemo({ onBack }) {
    // Practical Examples
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');
    const [isOn, setIsOn] = useState(false);
    const [items, setItems] = useState(['Apple', 'Banana']);
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem]);
            setNewItem('');
        }
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="demo-page state-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>← Back to Home</button>
                <h1 className="demo-title">State in React</h1>
            </div>

            <div className="demo-content state-content">
                {/* Theory Section */}
                <div className="theory-section">
                    <h2 className="section-title">📚 What is State?</h2>
                    <div className="theory-card">
                        <p className="theory-text">
                            <strong>State</strong> is data that changes over time in your component.
                            When state changes, React automatically re-renders the component to reflect the new data.
                        </p>
                        <p className="theory-text" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem' }}>
                            <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Why it matters:</strong> Without state, your UI would be static. State is what makes React apps interactive — every button click, form input, and animation relies on state changes. When state updates, React efficiently re-renders only the parts that changed, keeping your app fast.
                        </p>
                    </div>

                    {/* Key Terminology */}
                    <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.75rem' }}>📖 Key Terminology</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                            {[
                                { term: 'useState', desc: 'React hook that declares a state variable. Returns [value, setter].' },
                                { term: 'Setter Function', desc: 'The function returned by useState that updates the state value.' },
                                { term: 'Initial Value', desc: 'The argument passed to useState. Sets the state\'s starting value.' },
                                { term: 'Re-render', desc: 'When state changes, React calls your component again with the new state.' },
                                { term: 'Immutability', desc: 'Never modify state directly. Always create new values (spread operator, map, filter).' },
                                { term: 'Batching', desc: 'React groups multiple state updates into one re-render for performance.' },
                            ].map((item, i) => (
                                <div key={i} style={{ background: 'rgba(102, 126, 234, 0.08)', border: '1px solid rgba(102, 126, 234, 0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                                    <h4 style={{ color: '#667eea', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}>{item.term}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="key-points">
                        <div className="point">
                            <span className="point-icon">🔄</span>
                            <div>
                                <h4>Reactive</h4>
                                <p>UI updates automatically when state changes</p>
                            </div>
                        </div>
                        <div className="point">
                            <span className="point-icon">📦</span>
                            <div>
                                <h4>Local</h4>
                                <p>Each component instance has its own state</p>
                            </div>
                        </div>
                        <div className="point">
                            <span className="point-icon">🔒</span>
                            <div>
                                <h4>Immutable</h4>
                                <p>Never modify state directly, use setter function</p>
                            </div>
                        </div>
                    </div>

                    <div className="syntax-box">
                        <h4>📝 Syntax</h4>
                        <div className="code-snippet">
                            <pre>{`const [value, setValue] = useState(initialValue);
//     ↑         ↑                    ↑
//  current   setter              starting
//   value   function               value`}</pre>
                        </div>
                    </div>
                </div>

                {/* Practical Section */}
                <h2 className="section-title">🎮 Interactive Examples</h2>

                <div className="examples-grid">
                    {/* Counter Example */}
                    <div className="example-card">
                        <h3>1️⃣ Number State</h3>
                        <div className="example-demo">
                            <div className="counter-display">{count}</div>
                            <div className="counter-buttons">
                                <button onClick={() => setCount(count - 1)}>−</button>
                                <button onClick={() => setCount(0)}>Reset</button>
                                <button onClick={() => setCount(count + 1)}>+</button>
                            </div>
                        </div>
                        <div className="example-code">
                            <code>{`const [count, setCount] = useState(0);`}</code>
                        </div>
                    </div>

                    {/* String Example */}
                    <div className="example-card">
                        <h3>2️⃣ String State</h3>
                        <div className="example-demo">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Type your name..."
                            />
                            <p className="greeting">Hello, {name || 'Stranger'}! 👋</p>
                        </div>
                        <div className="example-code">
                            <code>{`const [name, setName] = useState('');`}</code>
                        </div>
                    </div>

                    {/* Boolean Example */}
                    <div className="example-card">
                        <h3>3️⃣ Boolean State</h3>
                        <div className="example-demo">
                            <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={() => setIsOn(!isOn)}>
                                <div className="toggle-knob"></div>
                            </div>
                            <p className="toggle-status">{isOn ? '💡 Light ON' : '🌙 Light OFF'}</p>
                        </div>
                        <div className="example-code">
                            <code>{`const [isOn, setIsOn] = useState(false);`}</code>
                        </div>
                    </div>

                    {/* Array Example */}
                    <div className="example-card wide">
                        <h3>4️⃣ Array State</h3>
                        <div className="example-demo">
                            <div className="array-input">
                                <input
                                    type="text"
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    placeholder="Add item..."
                                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                                />
                                <button onClick={addItem}>Add</button>
                            </div>
                            <ul className="items-list">
                                {items.map((item, i) => (
                                    <li key={i}>
                                        {item}
                                        <button onClick={() => removeItem(i)}>×</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="example-code">
                            <code>{`setItems([...items, newItem]); // Add
setItems(items.filter((_, i) => i !== index)); // Remove`}</code>
                        </div>
                    </div>
                </div>

                {/* Rules Section */}
                <div className="rules-section">
                    <h2 className="section-title">⚠️ Important Rules</h2>
                    <div className="rules-grid">
                        <div className="rule-card do">
                            <h4>✅ DO</h4>
                            <code>setCount(count + 1)</code>
                            <p>Use setter function</p>
                        </div>
                        <div className="rule-card dont">
                            <h4>❌ DON'T</h4>
                            <code>count = count + 1</code>
                            <p>Direct mutation won't trigger re-render</p>
                        </div>
                        <div className="rule-card do">
                            <h4>✅ DO</h4>
                            <code>setItems([...items, new])</code>
                            <p>Create new array</p>
                        </div>
                        <div className="rule-card dont">
                            <h4>❌ DON'T</h4>
                            <code>items.push(new)</code>
                            <p>Mutating original array</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StateDemo;
