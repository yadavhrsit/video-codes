import { useState, useEffect } from 'react';
import './TransactionsDemo.css';

function TransactionsDemo({ onBack }) {
    const [step, setStep] = useState(0);
    const [accountA, setAccountA] = useState(1000);
    const [accountB, setAccountB] = useState(500);
    const [transactionStatus, setTransactionStatus] = useState('idle'); // idle, running, success, failed
    const [showACID, setShowACID] = useState(false);
    const [selectedACID, setSelectedACID] = useState(null);

    const transferAmount = 200;

    const acidProperties = [
        {
            id: 'atomicity',
            letter: 'A',
            title: 'Atomicity',
            description: 'All or Nothing - Either the entire transaction succeeds, or it all fails. No partial updates.',
            icon: '⚛️',
            color: '#667eea'
        },
        {
            id: 'consistency',
            letter: 'C',
            title: 'Consistency',
            description: 'Database remains in a valid state before and after the transaction. Rules are never violated.',
            icon: '⚖️',
            color: '#f093fb'
        },
        {
            id: 'isolation',
            letter: 'I',
            title: 'Isolation',
            description: 'Concurrent transactions don\'t interfere with each other. Each transaction is independent.',
            icon: '🔒',
            color: '#4facfe'
        },
        {
            id: 'durability',
            letter: 'D',
            title: 'Durability',
            description: 'Once committed, changes are permanent. Even if the system crashes, data persists.',
            icon: '💾',
            color: '#43e97b'
        }
    ];

    const runTransaction = () => {
        setTransactionStatus('running');
        setStep(1);

        // Step 1: Begin Transaction
        setTimeout(() => {
            setStep(2);
        }, 1500);

        // Step 2: Deduct from Account A
        setTimeout(() => {
            setAccountA(prev => prev - transferAmount);
            setStep(3);
        }, 3000);

        // Step 3: Add to Account B
        setTimeout(() => {
            setAccountB(prev => prev + transferAmount);
            setStep(4);
        }, 4500);

        // Step 4: Commit
        setTimeout(() => {
            setStep(5);
            setTransactionStatus('success');
        }, 6000);

        // Reset
        setTimeout(() => {
            setStep(0);
            setTransactionStatus('idle');
        }, 8000);
    };

    const runFailedTransaction = () => {
        setTransactionStatus('running');
        setStep(1);

        // Step 1: Begin Transaction
        setTimeout(() => {
            setStep(2);
        }, 1500);

        // Step 2: Deduct from Account A
        setTimeout(() => {
            setAccountA(prev => prev - transferAmount);
            setStep(3);
        }, 3000);

        // Step 3: Error occurs!
        setTimeout(() => {
            setStep(6); // Error step
            setTransactionStatus('failed');
        }, 4500);

        // Step 4: Rollback
        setTimeout(() => {
            setAccountA(prev => prev + transferAmount); // Restore
            setStep(7);
        }, 6000);

        // Reset
        setTimeout(() => {
            setStep(0);
            setTransactionStatus('idle');
        }, 8000);
    };

    const resetAccounts = () => {
        setAccountA(1000);
        setAccountB(500);
        setStep(0);
        setTransactionStatus('idle');
    };

    return (
        <div className="demo-page transactions-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>
                    ← Back to Home
                </button>
                <h1 className="demo-title">Database Transactions</h1>
            </div>

            <div className="demo-content transactions-content">
                {/* Introduction Section */}
                <div className="intro-section">
                    <p className="intro-text">
                        A <strong>transaction</strong> is a sequence of database operations that are treated as a single unit of work.
                        It ensures data integrity and follows the <strong>ACID</strong> properties.
                    </p>
                </div>

                {/* Interactive Transaction Simulator */}
                <div className="transaction-simulator">
                    <h2 className="section-title">💸 Money Transfer Simulation</h2>

                    <div className="accounts-container">
                        <div className={`account-card ${step >= 2 && step <= 3 ? 'active' : ''} ${step === 3 || step === 7 ? 'updated' : ''}`}>
                            <div className="account-icon">👤</div>
                            <div className="account-name">Account A</div>
                            <div className="account-balance">${accountA}</div>
                            {step >= 2 && step <= 3 && (
                                <div className="transaction-indicator deduct">-${transferAmount}</div>
                            )}
                        </div>

                        <div className="transfer-arrow-container">
                            <div className={`transfer-arrow ${transactionStatus === 'running' ? 'animating' : ''}`}>
                                <span className="arrow-icon">→</span>
                                <span className="transfer-amount">${transferAmount}</span>
                            </div>
                        </div>

                        <div className={`account-card ${step >= 4 && step <= 5 ? 'active' : ''} ${step === 4 ? 'updated' : ''}`}>
                            <div className="account-icon">👤</div>
                            <div className="account-name">Account B</div>
                            <div className="account-balance">${accountB}</div>
                            {step === 4 && (
                                <div className="transaction-indicator add">+${transferAmount}</div>
                            )}
                        </div>
                    </div>

                    {/* Transaction Steps */}
                    <div className="transaction-steps">
                        <div className={`step-item ${step >= 1 ? 'active' : ''} ${step === 1 ? 'current' : ''}`}>
                            <div className="step-number">1</div>
                            <div className="step-label">BEGIN TRANSACTION</div>
                        </div>
                        <div className={`step-item ${step >= 2 ? 'active' : ''} ${step === 2 || step === 3 ? 'current' : ''}`}>
                            <div className="step-number">2</div>
                            <div className="step-label">DEDUCT $200 FROM A</div>
                        </div>
                        <div className={`step-item ${step >= 4 ? 'active' : ''} ${step === 4 ? 'current' : ''} ${step === 6 ? 'error' : ''}`}>
                            <div className="step-number">{step === 6 ? '⚠️' : '3'}</div>
                            <div className="step-label">{step === 6 ? 'ERROR OCCURRED!' : 'ADD $200 TO B'}</div>
                        </div>
                        <div className={`step-item ${step === 5 ? 'active' : ''} ${step === 5 ? 'current' : ''} ${step === 7 ? 'rollback' : ''}`}>
                            <div className="step-number">{step === 7 ? '↩️' : '4'}</div>
                            <div className="step-label">{step === 7 ? 'ROLLBACK' : 'COMMIT'}</div>
                        </div>
                    </div>

                    {/* Status Message */}
                    {transactionStatus === 'success' && (
                        <div className="status-message success">
                            ✅ Transaction Committed Successfully!
                        </div>
                    )}
                    {transactionStatus === 'failed' && (
                        <div className="status-message failed">
                            ❌ Transaction Failed - All Changes Rolled Back!
                        </div>
                    )}

                    {/* Control Buttons */}
                    <div className="control-buttons">
                        <button
                            className="control-btn success-btn"
                            onClick={runTransaction}
                            disabled={transactionStatus !== 'idle'}
                        >
                            ✅ Run Successful Transaction
                        </button>
                        <button
                            className="control-btn error-btn"
                            onClick={runFailedTransaction}
                            disabled={transactionStatus !== 'idle'}
                        >
                            ❌ Simulate Failed Transaction
                        </button>
                        <button
                            className="control-btn reset-btn"
                            onClick={resetAccounts}
                            disabled={transactionStatus === 'running'}
                        >
                            🔄 Reset
                        </button>
                    </div>
                </div>

                {/* ACID Properties */}
                <div className="acid-section">
                    <h2 className="section-title">🎯 ACID Properties</h2>
                    <p className="acid-intro">Click on each property to learn more</p>

                    <div className="acid-grid">
                        {acidProperties.map((property) => (
                            <div
                                key={property.id}
                                className={`acid-card ${selectedACID === property.id ? 'selected' : ''}`}
                                onClick={() => setSelectedACID(selectedACID === property.id ? null : property.id)}
                                style={{ '--card-color': property.color }}
                            >
                                <div className="acid-letter">{property.letter}</div>
                                <div className="acid-icon">{property.icon}</div>
                                <h3 className="acid-title">{property.title}</h3>
                                <div className={`acid-description ${selectedACID === property.id ? 'show' : ''}`}>
                                    {property.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Code Example */}
                <div className="code-section">
                    <h2 className="section-title">💻 SQL Transaction Example</h2>
                    <div className="code-snippet">
                        <pre>{`-- Begin a transaction
BEGIN TRANSACTION;

-- Step 1: Deduct from Account A
UPDATE accounts 
SET balance = balance - 200 
WHERE account_id = 'A';

-- Step 2: Add to Account B
UPDATE accounts 
SET balance = balance + 200 
WHERE account_id = 'B';

-- If everything is successful
COMMIT;

-- If any error occurs
-- ROLLBACK;`}</pre>
                    </div>
                </div>

                {/* Key Concepts */}
                <div className="concepts-section">
                    <h2 className="section-title">🔑 Key Concepts</h2>
                    <div className="concepts-grid">
                        <div className="concept-card">
                            <div className="concept-icon">🎬</div>
                            <h3>BEGIN</h3>
                            <p>Starts a new transaction</p>
                        </div>
                        <div className="concept-card">
                            <div className="concept-icon">✅</div>
                            <h3>COMMIT</h3>
                            <p>Saves all changes permanently</p>
                        </div>
                        <div className="concept-card">
                            <div className="concept-icon">↩️</div>
                            <h3>ROLLBACK</h3>
                            <p>Undoes all changes if error occurs</p>
                        </div>
                        <div className="concept-card">
                            <div className="concept-icon">🔐</div>
                            <h3>SAVEPOINT</h3>
                            <p>Creates a checkpoint within transaction</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionsDemo;
