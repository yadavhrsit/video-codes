import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LAYERS_CONFIG = [
  { name: 'Input',  nodes: 3, color: '#667eea', label: 'Features' },
  { name: 'Hidden 1', nodes: 4, color: '#4facfe', label: 'Patterns' },
  { name: 'Hidden 2', nodes: 3, color: '#43e97b', label: 'Abstract' },
  { name: 'Output', nodes: 2, color: '#f093fb', label: 'Prediction' },
];

function NeuralNetDiagram({ activeNeuron }) {
  const layerX = [40, 130, 220, 290];
  const getNodeY = (layerIdx, nodeIdx) => {
    const count = LAYERS_CONFIG[layerIdx].nodes;
    const spacing = 160 / (count + 1);
    return spacing * (nodeIdx + 1);
  };

  // Draw connections
  const connections = [];
  LAYERS_CONFIG.forEach((layer, li) => {
    if (li === LAYERS_CONFIG.length - 1) return;
    const nextLayer = LAYERS_CONFIG[li + 1];
    for (let i = 0; i < layer.nodes; i++) {
      for (let j = 0; j < nextLayer.nodes; j++) {
        connections.push({
          x1: layerX[li], y1: getNodeY(li, i),
          x2: layerX[li + 1], y2: getNodeY(li + 1, j),
          fromLayer: li, toLayer: li + 1,
        });
      }
    }
  });

  return (
    <svg viewBox="0 0 340 160" className="w-full bg-[#0a0a14] rounded-xl border border-white/[0.06]">
      {/* Connections */}
      {connections.map((c, i) => (
        <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Highlighted path */}
      {activeNeuron && connections
        .filter(c => c.toLayer === activeNeuron.layer && c.fromLayer === activeNeuron.layer - 1)
        .map((c, i) => (
          <line key={`h${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke={LAYERS_CONFIG[activeNeuron.layer].color} strokeWidth="2" opacity="0.5" />
        ))
      }
      {/* Nodes */}
      {LAYERS_CONFIG.map((layer, li) => {
        const isActive = activeNeuron && activeNeuron.layer === li;
        return layer.nodes ? Array.from({ length: layer.nodes }, (_, ni) => (
          <g key={`${li}-${ni}`}>
            <circle cx={layerX[li]} cy={getNodeY(li, ni)} r="7"
              fill={isActive && activeNeuron.node === ni ? layer.color : `${layer.color}40`}
              stroke={layer.color} strokeWidth={isActive && activeNeuron.node === ni ? 2 : 1} />
          </g>
        )) : null;
      })}
      {/* Layer labels */}
      {LAYERS_CONFIG.map((layer, li) => (
        <g key={`label-${li}`}>
          <text x={layerX[li]} y={148} textAnchor="middle" fill={layer.color} fontSize="6.5" fontWeight="600">{layer.name}</text>
        </g>
      ))}
    </svg>
  );
}

export default function NeuralNetworksDemo({ onBack }) {
  const [activeNeuron, setActiveNeuron] = useState(null);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(2.5);
  const [training, setTraining] = useState(false);
  const intervalRef = useState(null);

  const startTraining = () => {
    setTraining(true);
    setEpoch(0);
    setLoss(2.5);
    let e = 0;
    let l = 2.5;
    const timer = setInterval(() => {
      e++;
      l = Math.max(0.05, l - (Math.random() * 0.3 + 0.05));
      setEpoch(e);
      setLoss(parseFloat(l.toFixed(3)));
      if (e >= 20 || l < 0.1) {
        clearInterval(timer);
        setTraining(false);
      }
    }, 300);
  };

  const CONCEPTS = [
    { title: 'Neuron', color: '#667eea', desc: 'A single unit that takes inputs, applies weights, sums them, and passes through an activation function.' },
    { title: 'Weight', color: '#4facfe', desc: 'The strength of a connection. Learned during training. Higher weight = stronger influence on output.' },
    { title: 'Bias', color: '#43e97b', desc: 'An offset added before activation. Lets the network shift its decision boundary.' },
    { title: 'Activation', color: '#f093fb', desc: 'A function (ReLU, Sigmoid, Tanh) that adds non-linearity. Without it, the network is just linear math.' },
    { title: 'Backpropagation', color: '#ffd93d', desc: 'How the network learns: calculates error, propagates it backward, and adjusts weights using gradient descent.' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Neural Networks</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Neural networks are <span className="text-[#667eea] font-semibold">layers of interconnected neurons</span> inspired by the brain. Data flows forward through layers, each transforming it until the output layer makes a prediction. Training adjusts the weights to minimize error.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed mb-3">
            <span className="text-white/60 font-semibold">How it works:</span> Each neuron receives inputs, multiplies them by weights, adds them up, applies an activation function, and outputs a value. During training, the network compares its prediction to the correct answer (loss), then works backward to adjust all the weights (backpropagation). After thousands of examples, the weights converge to values that produce accurate predictions.
          </p>
          <div className="bg-[#667eea]/[0.08] rounded-lg px-3 py-2 border border-[#667eea]/20">
            <span className="text-[0.65rem] font-bold text-[#667eea]">The math at each neuron:</span>
            <code className="text-[0.65rem] text-white/60 ml-2 font-mono">output = activation(Σ(weight × input) + bias)</code>
          </div>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Layer', def: 'A group of neurons at the same depth. Input layer receives data, hidden layers transform it, output layer gives predictions.' },
              { term: 'Epoch', def: 'One complete pass through the entire training dataset. Networks train for hundreds or thousands of epochs.' },
              { term: 'Batch Size', def: 'Number of samples processed before updating weights. Larger batches = more stable but slower training.' },
              { term: 'Learning Rate', def: 'How much weights change each update. Too high = unstable, too low = slow convergence.' },
              { term: 'Loss Function', def: 'Measures prediction error. MSE for regression, Cross-Entropy for classification. Training minimizes this.' },
              { term: 'Gradient', def: 'The direction and magnitude of change needed to reduce loss. Weights update in the opposite direction.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Network visualization */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">Network Architecture</h2>
            <div className="flex gap-2">
              <button onClick={() => setActiveNeuron(null)} className="px-2.5 py-1 rounded-lg border border-white/[0.12] text-white/50 text-[0.65rem] hover:bg-white/[0.06] transition-all">Clear</button>
            </div>
          </div>
          <NeuralNetDiagram activeNeuron={activeNeuron} />
          <div className="flex gap-2 mt-3 flex-wrap">
            {LAYERS_CONFIG.map((layer, li) => (
              <button key={li} onClick={() => setActiveNeuron({ layer: li, node: 0 })}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.08] text-[0.65rem] text-white/50 hover:bg-white/[0.06] transition-all">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: layer.color }} />
                {layer.name} ({layer.label})
              </button>
            ))}
          </div>
        </div>

        {/* Training simulation */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">Training Simulation</h2>
            <button onClick={startTraining} disabled={training}
              className="px-3 py-1 rounded-lg bg-[#667eea] text-white text-[0.68rem] font-semibold disabled:opacity-40 hover:bg-[#764ba2] transition-all">
              {training ? '⏳ Training…' : '▶ Train'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <div className="text-[0.6rem] text-white/35 uppercase tracking-wider">Epoch</div>
              <div className="text-xl font-bold text-[#667eea]">{epoch}</div>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <div className="text-[0.6rem] text-white/35 uppercase tracking-wider">Loss</div>
              <div className="text-xl font-bold text-[#ef4444]">{loss.toFixed(3)}</div>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <div className="text-[0.6rem] text-white/35 uppercase tracking-wider">Accuracy</div>
              <div className="text-xl font-bold text-[#43e97b]">{Math.min(99, Math.round((1 - loss / 2.5) * 100))}%</div>
            </div>
          </div>
          {/* Loss bar visualization */}
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(1 - loss / 2.5) * 100}%`, background: 'linear-gradient(90deg, #667eea, #43e97b)' }} />
          </div>
          <p className="text-[0.6rem] text-white/30 mt-1.5">Each epoch: forward pass → compute loss → backpropagate → update weights</p>
        </div>

        {/* Key Concepts */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Concepts</h2>
          <div className="flex flex-col gap-2">
            {CONCEPTS.map((c, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[0.55rem] font-bold text-white flex-shrink-0 mt-0.5" style={{ background: c.color }}>{i + 1}</div>
                <div>
                  <div className="text-[0.72rem] font-bold mb-0.5" style={{ color: c.color }}>{c.title}</div>
                  <p className="text-[0.67rem] text-white/50">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Types of NN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'CNN', full: 'Convolutional', color: '#667eea', use: 'Image recognition, object detection' },
            { name: 'RNN', full: 'Recurrent',     color: '#4facfe', use: 'Text, speech, time series' },
            { name: 'Transformer', full: 'Attention-based', color: '#f093fb', use: 'LLMs, translation, GPT' },
          ].map((nn, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <h3 className="text-[0.8rem] font-bold mb-0.5" style={{ color: nn.color }}>{nn.name}</h3>
              <div className="text-[0.6rem] text-white/35 mb-1.5">{nn.full} Neural Network</div>
              <p className="text-[0.67rem] text-white/50">{nn.use}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
