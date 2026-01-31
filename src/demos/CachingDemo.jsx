import { useState, useEffect } from 'react';
import './CachingDemo.css';

function CachingDemo({ onBack }) {
    const [cache, setCache] = useState({});
    const [requestLog, setRequestLog] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [stats, setStats] = useState({ hits: 0, misses: 0 });
    const [selectedData, setSelectedData] = useState(null);

    const dataItems = [
        { id: 'user_1', name: 'User Profile', icon: '👤', data: '{ name: "John", age: 28 }' },
        { id: 'product_5', name: 'Product Info', icon: '📦', data: '{ title: "Laptop", price: 999 }' },
        { id: 'settings', name: 'App Settings', icon: '⚙️', data: '{ theme: "dark", lang: "en" }' },
        { id: 'posts_list', name: 'Blog Posts', icon: '📝', data: '[{ id: 1, title: "Hello" }]' },
    ];

    const fetchData = async (item) => {
        setIsRequesting(true);
        setSelectedData(item.id);

        const startTime = Date.now();

        // Check cache first
        if (cache[item.id]) {
            // Cache HIT
            setTimeout(() => {
                const endTime = Date.now();
                setRequestLog(prev => [{
                    id: Date.now(),
                    item: item.name,
                    type: 'HIT',
                    time: endTime - startTime + 5, // Simulated cache read time
                    icon: item.icon
                }, ...prev].slice(0, 8));
                setStats(prev => ({ ...prev, hits: prev.hits + 1 }));
                setIsRequesting(false);
                setSelectedData(null);
            }, 100);
        } else {
            // Cache MISS - fetch from "database"
            setTimeout(() => {
                const endTime = Date.now();
                // Add to cache
                setCache(prev => ({ ...prev, [item.id]: item.data }));
                setRequestLog(prev => [{
                    id: Date.now(),
                    item: item.name,
                    type: 'MISS',
                    time: endTime - startTime + 800, // Simulated DB fetch time
                    icon: item.icon
                }, ...prev].slice(0, 8));
                setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
                setIsRequesting(false);
                setSelectedData(null);
            }, 1000);
        }
    };

    const clearCache = () => {
        setCache({});
        setRequestLog([]);
        setStats({ hits: 0, misses: 0 });
    };

    const hitRate = stats.hits + stats.misses > 0
        ? Math.round((stats.hits / (stats.hits + stats.misses)) * 100)
        : 0;

    const cachingStrategies = [
        {
            name: 'Cache-Aside',
            description: 'App checks cache first, fetches from DB on miss, then caches',
            icon: '🔍',
            color: '#667eea'
        },
        {
            name: 'Write-Through',
            description: 'Data written to cache and DB simultaneously',
            icon: '✍️',
            color: '#f093fb'
        },
        {
            name: 'Write-Behind',
            description: 'Data written to cache, DB updated asynchronously',
            icon: '⏱️',
            color: '#4facfe'
        },
        {
            name: 'Read-Through',
            description: 'Cache automatically fetches from DB on miss',
            icon: '📖',
            color: '#43e97b'
        },
    ];

    return (
        <div className="demo-page caching-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>
                    ← Back to Home
                </button>
                <h1 className="demo-title">Caching Explained</h1>
            </div>

            <div className="demo-content caching-content">
                <div className="intro-section">
                    <p className="intro-text">
                        <strong>Caching</strong> stores frequently accessed data in fast memory,
                        reducing database queries and dramatically improving response times.
                    </p>
                </div>

                {/* Interactive Cache Demo */}
                <div className="cache-demo-container">
                    <h2 className="section-title">🎮 Interactive Cache Simulator</h2>

                    <div className="cache-layout">
                        {/* Data Items */}
                        <div className="data-items-panel">
                            <h3>📊 Request Data</h3>
                            <div className="data-items-grid">
                                {dataItems.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`data-item-btn ${selectedData === item.id ? 'requesting' : ''} ${cache[item.id] ? 'cached' : ''}`}
                                        onClick={() => fetchData(item)}
                                        disabled={isRequesting}
                                    >
                                        <span className="item-icon">{item.icon}</span>
                                        <span className="item-name">{item.name}</span>
                                        {cache[item.id] && <span className="cached-badge">✓ Cached</span>}
                                    </button>
                                ))}
                            </div>
                            <button className="clear-cache-btn" onClick={clearCache}>
                                🗑️ Clear Cache
                            </button>
                        </div>

                        {/* Visual Flow */}
                        <div className="flow-visual">
                            <div className="flow-node app-node">
                                <span className="flow-icon">📱</span>
                                <span>Application</span>
                            </div>
                            <div className="flow-arrow">↓</div>
                            <div className={`flow-node cache-node ${isRequesting && cache[selectedData] ? 'active hit' : ''}`}>
                                <span className="flow-icon">⚡</span>
                                <span>Cache (Redis)</span>
                                <span className="speed-badge">~5ms</span>
                            </div>
                            <div className="flow-arrow">↓</div>
                            <div className={`flow-node db-node ${isRequesting && !cache[selectedData] ? 'active' : ''}`}>
                                <span className="flow-icon">🗄️</span>
                                <span>Database</span>
                                <span className="speed-badge slow">~800ms</span>
                            </div>
                        </div>

                        {/* Stats & Log */}
                        <div className="stats-panel">
                            <h3>📈 Statistics</h3>
                            <div className="stats-grid">
                                <div className="stat-item hit">
                                    <span className="stat-value">{stats.hits}</span>
                                    <span className="stat-label">Cache Hits</span>
                                </div>
                                <div className="stat-item miss">
                                    <span className="stat-value">{stats.misses}</span>
                                    <span className="stat-label">Cache Misses</span>
                                </div>
                                <div className="stat-item rate">
                                    <span className="stat-value">{hitRate}%</span>
                                    <span className="stat-label">Hit Rate</span>
                                </div>
                            </div>

                            <h4>📋 Request Log</h4>
                            <div className="request-log">
                                {requestLog.length === 0 ? (
                                    <p className="empty-log">Click a data item to start</p>
                                ) : (
                                    requestLog.map((log) => (
                                        <div key={log.id} className={`log-entry ${log.type.toLowerCase()}`}>
                                            <span className="log-icon">{log.icon}</span>
                                            <span className="log-item">{log.item}</span>
                                            <span className={`log-type ${log.type.toLowerCase()}`}>
                                                {log.type === 'HIT' ? '✅ HIT' : '❌ MISS'}
                                            </span>
                                            <span className="log-time">{log.time}ms</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Caching Strategies */}
                <div className="strategies-section">
                    <h2 className="section-title">📚 Caching Strategies</h2>
                    <div className="strategies-grid">
                        {cachingStrategies.map((strategy, index) => (
                            <div
                                key={index}
                                className="strategy-card"
                                style={{ '--card-color': strategy.color }}
                            >
                                <span className="strategy-icon">{strategy.icon}</span>
                                <h4>{strategy.name}</h4>
                                <p>{strategy.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cache Layers */}
                <div className="layers-section">
                    <h2 className="section-title">🎯 Cache Hierarchy</h2>
                    <div className="cache-pyramid">
                        <div className="pyramid-level l1">
                            <span className="level-name">L1 CPU Cache</span>
                            <span className="level-speed">~1ns</span>
                        </div>
                        <div className="pyramid-level l2">
                            <span className="level-name">L2/L3 CPU Cache</span>
                            <span className="level-speed">~10ns</span>
                        </div>
                        <div className="pyramid-level ram">
                            <span className="level-name">RAM / In-Memory (Redis)</span>
                            <span className="level-speed">~100ns</span>
                        </div>
                        <div className="pyramid-level ssd">
                            <span className="level-name">SSD Storage</span>
                            <span className="level-speed">~100μs</span>
                        </div>
                        <div className="pyramid-level hdd">
                            <span className="level-name">HDD / Network</span>
                            <span className="level-speed">~10ms</span>
                        </div>
                    </div>
                </div>

                {/* Code Example */}
                <div className="code-section">
                    <h2 className="section-title">💻 Redis Caching Example</h2>
                    <div className="code-snippet">
                        <pre>{`// Check cache first
const cached = await redis.get(\`user:\${userId}\`);

if (cached) {
    return JSON.parse(cached); // Cache HIT ⚡
}

// Cache MISS - fetch from database
const user = await db.users.findById(userId);

// Store in cache for 1 hour
await redis.setex(\`user:\${userId}\`, 3600, JSON.stringify(user));

return user;`}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CachingDemo;
