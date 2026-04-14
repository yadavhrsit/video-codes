import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ML_TYPES = [
  {
    id: 'supervised',
    label: 'Supervised Learning',
    icon: '🎓',
    color: '#667eea',
    desc: 'Model learns from labeled training data. You provide input-output pairs.',
    examples: ['Email spam detection', 'Image classification', 'Price prediction', 'Sentiment analysis'],
    analogy: 'Like a student learning with an answer key — sees questions AND answers during training.',
  },
  {
    id: 'unsupervised',
    label: 'Unsupervised Learning',
    icon: '🔍',
    color: '#4facfe',
    desc: 'Model finds hidden patterns in unlabeled data. No predefined answers.',
    examples: ['Customer segmentation', 'Anomaly detection', 'Topic modeling', 'Data compression'],
    analogy: 'Like sorting a pile of foreign coins — no one tells you the categories; you figure them out.',
  },
  {
    id: 'reinforcement',
    label: 'Reinforcement Learning',
    icon: '🎮',
    color: '#43e97b',
    desc: 'Model learns by trial and error, receiving rewards or penalties.',
    examples: ['Game playing (AlphaGo)', 'Robot navigation', 'Trading strategies', 'ChatGPT fine-tuning'],
    analogy: 'Like training a dog — good behavior gets treats, bad behavior gets a correction.',
  },
];

// Simple interactive linear regression visualization
function LinearRegressionViz() {
  const [points, setPoints] = useState([
    { x: 1, y: 2.1 }, { x: 2, y: 3.9 }, { x: 3, y: 6.2 },
    { x: 4, y: 7.8 }, { x: 5, y: 10.1 }, { x: 6, y: 11.9 },
    { x: 7, y: 14.0 }, { x: 8, y: 15.8 },
  ]);
  const [predictX, setPredictX] = useState(9);

  // Simple linear regression: y = mx + b
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;
  const predictY = (m * predictX + b).toFixed(1);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 10);
    const y = Math.round((1 - (e.clientY - rect.top) / rect.height) * 18);
    if (x > 0 && x <= 10 && y > 0 && y <= 18) {
      setPoints(prev => [...prev, { x, y }]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[0.68rem] text-white/40">Click the chart to add data points</span>
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] text-white/40">Predict x=</span>
          <input type="number" value={predictX} onChange={e => setPredictX(Number(e.target.value))} min="1" max="15"
            className="w-12 bg-white/[0.06] border border-white/[0.12] rounded px-2 py-0.5 text-[0.7rem] text-white focus:outline-none focus:border-[#667eea]" />
          <span className="text-[0.65rem] text-[#43e97b] font-bold">→ y = {predictY}</span>
        </div>
      </div>
      <svg viewBox="0 0 300 180" className="w-full bg-[#0a0a14] rounded-xl border border-white/[0.06] cursor-crosshair" onClick={handleClick}>
        {/* Grid */}
        {[...Array(10)].map((_, i) => <line key={`gv${i}`} x1={i * 30} y1="0" x2={i * 30} y2="180" stroke="rgba(255,255,255,0.04)" />)}
        {[...Array(7)].map((_, i) => <line key={`gh${i}`} x1="0" y1={i * 30} x2="300" y2={i * 30} stroke="rgba(255,255,255,0.04)" />)}
        {/* Regression line */}
        <line x1="0" y1={180 - (b) * 10} x2="300" y2={180 - (m * 10 + b) * 10} stroke="#667eea" strokeWidth="2" strokeDasharray="4" opacity="0.7" />
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x * 30} cy={180 - p.y * 10} r="4" fill="#43e97b" stroke="#0a0a14" strokeWidth="1.5" />
        ))}
        {/* Prediction point */}
        <circle cx={predictX * 30} cy={180 - predictY * 10} r="5" fill="#f093fb" stroke="#0a0a14" strokeWidth="2" />
        <text x={predictX * 30 + 8} y={180 - predictY * 10 - 4} fill="#f093fb" fontSize="7" fontWeight="600">Predicted</text>
      </svg>
      <div className="text-[0.62rem] text-white/30">
        Equation: y = {m.toFixed(2)}x + {b.toFixed(2)} · {points.length} data points · R² ≈ {(1 - points.reduce((s, p) => s + Math.pow(p.y - (m * p.x + b), 2), 0) / points.reduce((s, p) => s + Math.pow(p.y - sumY / n, 2), 0)).toFixed(3)}
      </div>
    </div>
  );
}

export default function MLBasicsDemo({ onBack }) {
  const [selectedType, setSelectedType] = useState('supervised');
  const current = ML_TYPES.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Machine Learning Basics</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Machine Learning is a subset of AI where systems <span className="text-[#667eea] font-semibold">learn from data</span> instead of being explicitly programmed. Instead of writing rules like "if email contains 'free money' → spam", you give the model thousands of labeled emails and it learns the patterns itself.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why it matters:</span> Traditional programming requires humans to define every rule. ML can find patterns in data that humans would never notice — like detecting cancer from X-rays with higher accuracy than doctors, or predicting which users will churn before they leave.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Model', def: 'A mathematical function that maps inputs to outputs. It\'s what "learns" from data and makes predictions.' },
              { term: 'Training', def: 'The process of feeding data to a model so it can adjust its internal parameters to make better predictions.' },
              { term: 'Features', def: 'The input variables used to make predictions. For house prices: bedrooms, square footage, location.' },
              { term: 'Labels', def: 'The correct answers in training data. The model tries to predict these from features.' },
              { term: 'Overfitting', def: 'When a model memorizes training data but fails on new data. Like memorizing answers vs understanding concepts.' },
              { term: 'Inference', def: 'Using a trained model to make predictions on new, unseen data in production.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ML Types */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Three Types of ML</h2>
          <div className="flex gap-2 mb-4">
            {ML_TYPES.map(t => (
              <button key={t.id} onClick={() => setSelectedType(t.id)}
                className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[0.7rem] font-semibold transition-all duration-200
                  ${selectedType === t.id ? 'border-white/[0.3] bg-white/[0.07] text-white' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
                <span>{t.icon}</span> {t.label.split(' ')[0]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={selectedType} className="rounded-xl border p-4" style={{ borderColor: `${current.color}30`, background: `${current.color}08` }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <h3 className="text-[0.78rem] font-bold mb-2" style={{ color: current.color }}>{current.icon} {current.label}</h3>
              <p className="text-[0.7rem] text-white/55 mb-2">{current.desc}</p>
              <div className="bg-white/[0.04] rounded-lg px-3 py-2 mb-3">
                <p className="text-[0.65rem] text-[#4facfe] italic">💡 Analogy: {current.analogy}</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {current.examples.map((ex, i) => (
                  <div key={i} className="text-[0.65rem] text-white/55 flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03]">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: current.color }} />{ex}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive linear regression */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-1">Interactive: Linear Regression</h2>
          <p className="text-[0.68rem] text-white/40 mb-3">A supervised learning model that fits a line to predict continuous values.</p>
          <LinearRegressionViz />
        </div>

        {/* ML Pipeline */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">ML Pipeline</h2>
          <p className="text-[0.68rem] text-white/40 mb-3">Every ML project follows these steps. Data quality often matters more than algorithm choice.</p>
          <div className="flex flex-col gap-2">
            {[
              { step: '📊 Collect Data', desc: 'Gather raw data from databases, APIs, files, sensors. More quality data = better model.' },
              { step: '🧹 Clean & Prep', desc: 'Handle missing values, remove outliers, normalize scales, encode categories. 80% of ML work happens here.' },
              { step: '🔧 Train Model', desc: 'Feed data to algorithm. Model adjusts weights/parameters to minimize prediction error.' },
              { step: '📈 Evaluate', desc: 'Test on held-out data. Measure accuracy, precision, recall. Check for overfitting.' },
              { step: '🚀 Deploy', desc: 'Put model in production. Monitor performance, retrain as data distribution shifts.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[0.7rem] font-bold text-white/60 whitespace-nowrap">{item.step}</span>
                <p className="text-[0.62rem] text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Algorithms */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Common Algorithms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: 'Linear Regression', type: 'Supervised', use: 'Predict continuous values (prices, temperatures)', color: '#667eea' },
              { name: 'Logistic Regression', type: 'Supervised', use: 'Binary classification (spam/not spam, yes/no)', color: '#667eea' },
              { name: 'Decision Trees', type: 'Supervised', use: 'Classification with interpretable rules', color: '#667eea' },
              { name: 'Random Forest', type: 'Supervised', use: 'Ensemble of trees for robust predictions', color: '#667eea' },
              { name: 'K-Means', type: 'Unsupervised', use: 'Group similar data points into clusters', color: '#4facfe' },
              { name: 'Neural Networks', type: 'Deep Learning', use: 'Complex patterns in images, text, audio', color: '#43e97b' },
            ].map((alg, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.68rem] font-bold text-white/70">{alg.name}</span>
                  <span className="text-[0.55rem] px-1.5 py-0.3 rounded-full" style={{ background: `${alg.color}20`, color: alg.color }}>{alg.type}</span>
                </div>
                <p className="text-[0.6rem] text-white/40">{alg.use}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
