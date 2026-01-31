import { useState } from 'react';
import './HavingVsWhereDemo.css';

function HavingVsWhereDemo({ onBack }) {
    const [activeQuery, setActiveQuery] = useState('where');
    const [step, setStep] = useState(0);

    const sampleData = [
        { id: 1, name: 'Alice', dept: 'Sales', salary: 5000 },
        { id: 2, name: 'Bob', dept: 'Sales', salary: 6000 },
        { id: 3, name: 'Carol', dept: 'IT', salary: 7000 },
        { id: 4, name: 'David', dept: 'IT', salary: 8000 },
        { id: 5, name: 'Eve', dept: 'HR', salary: 4500 },
        { id: 6, name: 'Frank', dept: 'Sales', salary: 5500 },
    ];

    const runWhereDemo = () => {
        setActiveQuery('where');
        setStep(1);
        setTimeout(() => setStep(2), 1500);
        setTimeout(() => setStep(3), 3000);
    };

    const runHavingDemo = () => {
        setActiveQuery('having');
        setStep(1);
        setTimeout(() => setStep(2), 1500);
        setTimeout(() => setStep(3), 3000);
        setTimeout(() => setStep(4), 4500);
    };

    const whereFiltered = sampleData.filter(row => row.salary > 5000);
    const havingResult = [
        { dept: 'Sales', total: 16500 },
        { dept: 'IT', total: 15000 },
    ].filter(row => row.total > 10000);

    return (
        <div className="demo-page having-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>← Back to Home</button>
                <h1 className="demo-title">HAVING vs WHERE in SQL</h1>
            </div>

            <div className="demo-content having-content">
                <div className="intro-section">
                    <p className="intro-text">
                        <strong>WHERE</strong> filters individual rows BEFORE grouping,
                        while <strong>HAVING</strong> filters groups AFTER aggregation.
                    </p>
                </div>

                <div className="comparison-container">
                    <div className={`query-panel ${activeQuery === 'where' ? 'active' : ''}`}>
                        <h3 className="panel-title">🔍 WHERE Clause</h3>
                        <div className="code-block">
                            <pre>{`SELECT * FROM employees
WHERE salary > 5000;`}</pre>
                        </div>
                        <button className="run-btn" onClick={runWhereDemo}>▶ Run Query</button>

                        <div className="execution-flow">
                            <div className={`flow-step ${step >= 1 && activeQuery === 'where' ? 'done' : ''}`}>
                                <span className="step-num">1</span>
                                <span>Read all rows</span>
                            </div>
                            <div className={`flow-step ${step >= 2 && activeQuery === 'where' ? 'done' : ''}`}>
                                <span className="step-num">2</span>
                                <span>Filter: salary {'>'} 5000</span>
                            </div>
                            <div className={`flow-step ${step >= 3 && activeQuery === 'where' ? 'done' : ''}`}>
                                <span className="step-num">3</span>
                                <span>Return rows</span>
                            </div>
                        </div>

                        {step >= 3 && activeQuery === 'where' && (
                            <div className="result-table">
                                <table>
                                    <thead><tr><th>Name</th><th>Dept</th><th>Salary</th></tr></thead>
                                    <tbody>
                                        {whereFiltered.map(row => (
                                            <tr key={row.id}><td>{row.name}</td><td>{row.dept}</td><td>${row.salary}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="vs-divider">VS</div>

                    <div className={`query-panel ${activeQuery === 'having' ? 'active' : ''}`}>
                        <h3 className="panel-title">📊 HAVING Clause</h3>
                        <div className="code-block">
                            <pre>{`SELECT dept, SUM(salary)
FROM employees
GROUP BY dept
HAVING SUM(salary) > 10000;`}</pre>
                        </div>
                        <button className="run-btn having-btn" onClick={runHavingDemo}>▶ Run Query</button>

                        <div className="execution-flow">
                            <div className={`flow-step ${step >= 1 && activeQuery === 'having' ? 'done' : ''}`}>
                                <span className="step-num">1</span>
                                <span>Read all rows</span>
                            </div>
                            <div className={`flow-step ${step >= 2 && activeQuery === 'having' ? 'done' : ''}`}>
                                <span className="step-num">2</span>
                                <span>GROUP BY dept</span>
                            </div>
                            <div className={`flow-step ${step >= 3 && activeQuery === 'having' ? 'done' : ''}`}>
                                <span className="step-num">3</span>
                                <span>Calculate SUM(salary)</span>
                            </div>
                            <div className={`flow-step ${step >= 4 && activeQuery === 'having' ? 'done' : ''}`}>
                                <span className="step-num">4</span>
                                <span>Filter: SUM {'>'} 10000</span>
                            </div>
                        </div>

                        {step >= 4 && activeQuery === 'having' && (
                            <div className="result-table">
                                <table>
                                    <thead><tr><th>Dept</th><th>Total Salary</th></tr></thead>
                                    <tbody>
                                        {havingResult.map(row => (
                                            <tr key={row.dept}><td>{row.dept}</td><td>${row.total}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="key-differences">
                    <h2 className="section-title">⚡ Key Differences</h2>
                    <div className="diff-grid">
                        <div className="diff-card where-card">
                            <h4>WHERE</h4>
                            <ul>
                                <li>Filters <strong>individual rows</strong></li>
                                <li>Runs <strong>BEFORE</strong> GROUP BY</li>
                                <li>Cannot use aggregate functions</li>
                                <li>Works on raw data</li>
                            </ul>
                        </div>
                        <div className="diff-card having-card">
                            <h4>HAVING</h4>
                            <ul>
                                <li>Filters <strong>grouped results</strong></li>
                                <li>Runs <strong>AFTER</strong> GROUP BY</li>
                                <li>Can use SUM, COUNT, AVG, etc.</li>
                                <li>Works on aggregated data</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="order-section">
                    <h2 className="section-title">📋 SQL Execution Order</h2>
                    <div className="order-flow">
                        <div className="order-step">1. FROM</div>
                        <span className="order-arrow">→</span>
                        <div className="order-step highlight-where">2. WHERE</div>
                        <span className="order-arrow">→</span>
                        <div className="order-step">3. GROUP BY</div>
                        <span className="order-arrow">→</span>
                        <div className="order-step highlight-having">4. HAVING</div>
                        <span className="order-arrow">→</span>
                        <div className="order-step">5. SELECT</div>
                        <span className="order-arrow">→</span>
                        <div className="order-step">6. ORDER BY</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HavingVsWhereDemo;
