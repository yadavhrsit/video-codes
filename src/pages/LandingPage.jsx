import { useState } from 'react';
import './LandingPage.css';

const LandingPage = ({ onNavigate }) => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const topics = [
        {
            id: 'state',
            title: 'State in React',
            description: 'Learn how to manage component state and handle user interactions',
            icon: '⚡',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            category: 'React Fundamentals'
        },
        {
            id: 'effect',
            title: 'useEffect Hook',
            description: 'Master side effects, data fetching, and lifecycle management',
            icon: '🔄',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            category: 'React Hooks'
        },
        {
            id: 'conditional-rendering',
            title: 'Conditional Rendering',
            description: 'Render different UI elements based on state and conditions',
            icon: '🔀',
            color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            category: 'React Patterns'
        },
        {
            id: 'transactions',
            title: 'Database Transactions',
            description: 'Understand ACID properties and transaction management',
            icon: '💳',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            category: 'Database'
        },
        {
            id: 'having-vs-where',
            title: 'HAVING vs WHERE',
            description: 'Learn when to use WHERE vs HAVING in SQL queries',
            icon: '📊',
            color: 'linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)',
            category: 'SQL'
        },
        {
            id: 'cdn',
            title: 'CDN Explained',
            description: 'Visualize how Content Delivery Networks speed up websites',
            icon: '🌐',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            category: 'Infrastructure'
        },
        {
            id: 'caching',
            title: 'Caching Explained',
            description: 'Interactive cache simulator with hit/miss tracking',
            icon: '⚡',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            category: 'Performance'
        },
        {
            id: 'rate-limiting',
            title: 'Rate Limiting',
            description: 'Token bucket visualization and API protection strategies',
            icon: '🚦',
            color: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
            category: 'API Security'
        },
    ];

    return (
        <div className="landing-page">
            <div className="landing-header">
                <div className="header-content">
                    <h1 className="main-title">
                        <span className="title-gradient">Tech Concepts</span>
                        <span className="title-subtitle">Interactive Learning Hub</span>
                    </h1>
                    <p className="main-description">
                        Explore interactive demonstrations and code examples for various tech topics.
                        Perfect for creating engaging content for YouTube Shorts and Instagram Reels.
                    </p>
                </div>
            </div>

            <div className="topics-grid">
                {topics.map((topic) => (
                    <div
                        key={topic.id}
                        className={`topic-card ${hoveredCard === topic.id ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredCard(topic.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => onNavigate(topic.id)}
                        style={{ '--card-gradient': topic.color }}
                    >
                        <div className="card-background"></div>
                        <div className="card-content">
                            <div className="card-header">
                                <span className="card-icon">{topic.icon}</span>
                                <span className="card-category">{topic.category}</span>
                            </div>
                            <h2 className="card-title">{topic.title}</h2>
                            <p className="card-description">{topic.description}</p>
                            <div className="card-footer">
                                <span className="explore-text">Explore →</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="landing-footer">
                <p>Add more topics by editing the topics array in LandingPage.jsx</p>
            </div>
        </div>
    );
};

export default LandingPage;
