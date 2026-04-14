import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A simple decision tree: "Should I play outside?"
const TREE = {
  question: 'Is it raining?',
  yes: {
    question: 'Do I have an umbrella?',
    yes: { leaf: 'Go outside with umbrella', confidence: 0.7 },
    no:  { leaf: 'Stay inside', confidence: 0.9 },
  },
  no: {
    question: 'Is it too hot (>35°C)?',
    yes: {
      question: 'Is there shade available?',
      yes: { leaf: 'Go outside in shade', confidence: 0.6 },
      no:  { leaf: 'Stay inside', confidence: 0.85 },
    },
    no: { leaf: 'Go outside! Enjoy 🎉', confidence: 0.95 },
  },
};

function TreeNode({ node, path, currentPath, onChoice, depth = 0 }) {
  const isActive = currentPath.length === 0 ||
    currentPath.slice(0, depth + 1).every((v, i) => path[i] === v);
  const isCurrent = currentPath.length === depth && isActive;
  const isPast = currentPath.length > depth && isActive;
  const color = isCurrent ? '#ffd93d' : isPast ? '#43e97b' : '#4facfe';

  if (node.leaf) {
    const isReached = currentPath.length === depth && isActive;
    return (
      <div className={`text-center px-3 py-2 rounded-xl border transition-all duration-300
        ${isReached ? 'border-[#43e97b]/50 bg-[#43e97b]/10 scale-105' : 'border-white/[0.08] bg-white/[0.03]'}`}>
        <div className={`text-[0.68rem] font-bold ${isReached ? 'text-[#43e97b]' : 'text-white/40'}`}>
          {isReached ? '✓ ' : ''}{node.leaf}
        </div>
        <div className="text-[0.55rem] text-white/30 mt-0.5">Confidence: {(node.confidence * 100).toFixed(0)}%</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Question node */}
      <div className={`px-3 py-2 rounded-lg border text-center transition-all duration-300 max-w-[160px]
        ${isCurrent ? 'border-[#ffd93d]/50 bg-[#ffd93d]/10 shadow-[0_0_10px_#ffd93d20]' : isPast ? 'border-[#43e97b]/40 bg-[#43e97b]/8' : 'border-white/[0.1] bg-white/[0.04]'}`}>
        <div className={`text-[0.65rem] font-bold ${isCurrent ? 'text-[#ffd93d]' : isPast ? 'text-[#43e97b]' : 'text-white/50'}`}>
          {node.question}
        </div>
      </div>

      {/* Buttons for current node */}
      {isCurrent && (
        <div className="flex gap-2 mt-2">
          <button onClick={() => onChoice('yes')} className="px-3 py-1 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 text-[0.62rem] font-bold text-[#ef4444] hover:bg-[#ef4444]/25 transition-all">
            Yes
          </button>
          <button onClick={() => onChoice('no')} className="px-3 py-1 rounded-lg bg-[#43e97b]/15 border border-[#43e97b]/30 text-[0.62rem] font-bold text-[#43e97b] hover:bg-[#43e97b]/25 transition-all">
            No
          </button>
        </div>
      )}

      {/* Children */}
      <div className="flex gap-4 mt-2">
        <div className="flex flex-col items-center">
          <div className="w-px h-2 bg-white/[0.15]" />
          <span className="text-[0.5rem] text-[#ef4444]/60 mb-0.5">Yes</span>
          <TreeNode node={node.yes} path={[...path, 'yes']} currentPath={currentPath} onChoice={onChoice} depth={depth + 1} />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-px h-2 bg-white/[0.15]" />
          <span className="text-[0.5rem] text-[#43e97b]/60 mb-0.5">No</span>
          <TreeNode node={node.no} path={[...path, 'no']} currentPath={currentPath} onChoice={onChoice} depth={depth + 1} />
        </div>
      </div>
    </div>
  );
}

// Simplified visual of how a tree learns
const TRAINING_DATA = [
  { outlook: 'Sunny', humid: 'High', play: false, emoji: '☀️💧' },
  { outlook: 'Sunny', humid: 'Low',  play: true,  emoji: '☀️' },
  { outlook: 'Rain',  humid: 'High', play: false, emoji: '🌧️💧' },
  { outlook: 'Rain',  humid: 'Low',  play: false, emoji: '🌧️' },
  { outlook: 'Cloud', humid: 'High', play: true,  emoji: '☁️💧' },
  { outlook: 'Cloud', humid: 'Low',  play: true,  emoji: '☁️' },
];

export default function DecisionTreesDemo({ onBack }) {
  const [path, setPath] = useState([]);
  const [view, setView] = useState('interactive'); // interactive | how-it-works

  const handleChoice = (choice) => setPath(prev => [...prev, choice]);

  // Navigate tree to get current node
  let currentNode = TREE;
  for (const choice of path) {
    currentNode = currentNode[choice];
    if (!currentNode || currentNode.leaf) break;
  }
  const isLeaf = currentNode?.leaf;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#55efc4] to-[#00b894] bg-clip-text text-transparent">Decision Trees</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Decision trees are ML models that make predictions by learning a series of <span className="text-[#55efc4] font-semibold">if-then-else rules</span> from training data. They're interpretable, fast, and used everywhere from medical diagnosis to spam filters.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why they're special:</span> Unlike neural networks (black boxes), decision trees are fully interpretable — you can see exactly why a prediction was made. This makes them popular in regulated industries like healthcare and finance where explainability is required.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Root Node', def: 'The topmost node that splits the entire dataset. Chosen because it best separates the classes.' },
              { term: 'Leaf Node', def: 'A terminal node that makes a prediction. Contains the majority class (classification) or average value (regression).' },
              { term: 'Gini Impurity', def: 'Measures how "mixed" a node is. 0 = pure (all one class). Used to find the best split.' },
              { term: 'Entropy', def: 'Alternative to Gini. Measures disorder/uncertainty. Information Gain = reduction in entropy after split.' },
              { term: 'Pruning', def: 'Removing branches that don\'t improve performance on validation data. Prevents overfitting.' },
              { term: 'Random Forest', def: 'Ensemble of many decision trees, each trained on random subsets. Much more robust than a single tree.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#55efc4]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          <button onClick={() => setView('interactive')}
            className={`flex-1 px-3 py-2 rounded-xl border text-center transition-all duration-200
              ${view === 'interactive' ? 'border-[#55efc4]/40 bg-[#55efc4]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
            <div className="text-[0.68rem] font-bold" style={{ color: view === 'interactive' ? '#55efc4' : 'rgba(255,255,255,0.5)' }}>🎮 Interactive Tree</div>
          </button>
          <button onClick={() => setView('how-it-works')}
            className={`flex-1 px-3 py-2 rounded-xl border text-center transition-all duration-200
              ${view === 'how-it-works' ? 'border-[#55efc4]/40 bg-[#55efc4]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
            <div className="text-[0.68rem] font-bold" style={{ color: view === 'how-it-works' ? '#55efc4' : 'rgba(255,255,255,0.5)' }}>🧠 How It Learns</div>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === 'interactive' && (
            <motion.div key="interactive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-white">Should I play outside?</h2>
                  <button onClick={() => setPath([])} className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.1] text-[0.65rem] text-white/50 hover:text-white/70 transition-all">
                    ↺ Reset
                  </button>
                </div>

                {/* Step-by-step path */}
                {path.length > 0 && (
                  <div className="flex gap-1 flex-wrap items-center mb-3">
                    <span className="text-[0.6rem] text-white/30">Path:</span>
                    {path.map((choice, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-full ${choice === 'yes' ? 'bg-[#ef4444]/15 text-[#ef4444]' : 'bg-[#43e97b]/15 text-[#43e97b]'}`}>
                          {choice === 'yes' ? 'Yes' : 'No'}
                        </span>
                        {i < path.length - 1 && <span className="text-white/20">→</span>}
                      </span>
                    ))}
                  </div>
                )}

                {/* Current question or result */}
                {!isLeaf ? (
                  <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-5 text-center">
                    <div className="text-[0.6rem] font-bold text-white/30 uppercase tracking-wider mb-2">Question {path.length + 1}</div>
                    <div className="text-[0.82rem] font-bold text-[#ffd93d] mb-4">{currentNode?.question}</div>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => handleChoice('yes')}
                        className="px-6 py-2 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 text-[0.72rem] font-bold text-[#ef4444] hover:bg-[#ef4444]/25 hover:scale-105 transition-all">
                        ✓ Yes
                      </button>
                      <button onClick={() => handleChoice('no')}
                        className="px-6 py-2 rounded-lg bg-[#43e97b]/15 border border-[#43e97b]/30 text-[0.72rem] font-bold text-[#43e97b] hover:bg-[#43e97b]/25 hover:scale-105 transition-all">
                        ✗ No
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#43e97b]/[0.08] border border-[#43e97b]/25 rounded-xl p-5 text-center">
                    <div className="text-[0.6rem] font-bold text-[#43e97b]/60 uppercase tracking-wider mb-2">Decision</div>
                    <div className="text-[0.88rem] font-bold text-[#43e97b] mb-2">{currentNode.leaf}</div>
                    <div className="text-[0.6rem] text-white/35">Confidence: {(currentNode.confidence * 100).toFixed(0)}%</div>
                    <button onClick={() => setPath([])}
                      className="mt-3 px-4 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-[0.65rem] text-white/50 hover:text-white/70 transition-all">
                      Try Again →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'how-it-works' && (
            <motion.div key="how-it-works" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <h2 className="text-base font-bold text-white mb-1">How the Tree Learns</h2>
                <p className="text-[0.67rem] text-white/40 mb-3">The algorithm picks the feature that best splits the data (using Gini impurity or entropy).</p>

                {/* Training data table */}
                <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3 mb-4">
                  <div className="text-[0.6rem] font-bold text-white/35 uppercase tracking-wider mb-2">Training Data</div>
                  <div className="grid grid-cols-4 gap-0 mb-1">
                    {['Data', 'Outlook', 'Humidity', 'Play?'].map((h, i) => (
                      <div key={i} className="text-[0.58rem] text-white/30 font-bold">{h}</div>
                    ))}
                  </div>
                  {TRAINING_DATA.map((row, i) => (
                    <div key={i} className={`grid grid-cols-4 gap-0 py-0.5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''} rounded`}>
                      <div className="text-[0.6rem] text-white/35">#{i + 1} {row.emoji}</div>
                      <div className="text-[0.6rem] text-[#a5f3fc]">{row.outlook}</div>
                      <div className="text-[0.6rem] text-[#ffd93d]">{row.humid}</div>
                      <div className={`text-[0.6rem] font-bold ${row.play ? 'text-[#43e97b]' : 'text-[#ef4444]'}`}>{row.play ? '✓ Yes' : '✗ No'}</div>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-2">
                  {[
                    { step: '1', title: 'Pick Best Feature', desc: 'Calculate Gini impurity for each feature. "Outlook" splits data most cleanly.', color: '#55efc4' },
                    { step: '2', title: 'Split Data', desc: 'Partition into Yes/No groups based on the chosen feature\'s values.', color: '#ffd93d' },
                    { step: '3', title: 'Recurse', desc: 'For each group, repeat: pick the next best feature to split on.', color: '#4facfe' },
                    { step: '4', title: 'Stop (Leaf)', desc: 'Stop when all items in a group have the same label, or max depth reached.', color: '#f093fb' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[0.65rem] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}20`, color: s.color }}>{s.step}</span>
                      <div>
                        <div className="text-[0.68rem] font-bold text-white/70">{s.title}</div>
                        <p className="text-[0.6rem] text-white/40">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pros/Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#55efc4] mb-2">✓ Strengths</h3>
            <ul className="flex flex-col gap-1.5">
              {['Easy to visualize & interpret', 'Handles mixed data types', 'No feature scaling needed', 'Fast training & prediction'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#55efc4] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#ef4444] mb-2">✗ Weaknesses</h3>
            <ul className="flex flex-col gap-1.5">
              {['Prone to overfitting', 'Unstable — small data changes matter', 'Not great for continuous values', 'Fixed: use Random Forests (ensemble)'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#ef4444] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
