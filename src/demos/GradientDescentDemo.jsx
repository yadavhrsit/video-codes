import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Simple 1D quadratic: f(x) = (x-3)^2 + 1, minimum at x=3, y=1
const f = (x) => (x - 3) * (x - 3) + 1;
const df = (x) => 2 * (x - 3); // derivative

// Generate curve points for SVG
function getCurvePoints(minX, maxX, steps = 200) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const x = minX + (maxX - minX) * (i / steps);
    points.push({ x, y: f(x) });
  }
  return points;
}

const CURVE_POINTS = getCurvePoints(-2, 8, 200);
const SVG_W = 400, SVG_H = 220;
const PAD = { l: 40, r: 10, t: 10, b: 35 };
const X_RANGE = [-2, 8], Y_RANGE = [-0.5, 26];

function toSVG(x, y) {
  const sx = PAD.l + ((x - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0])) * (SVG_W - PAD.l - PAD.r);
  const sy = SVG_H - PAD.b - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * (SVG_H - PAD.t - PAD.b);
  return { sx, sy };
}

const pathD = CURVE_POINTS.map((p, i) => {
  const { sx, sy } = toSVG(p.x, p.y);
  return (i === 0 ? 'M' : 'L') + `${sx},${sy}`;
}).join(' ');

export default function GradientDescentDemo({ onBack }) {
  const [lr, setLr] = useState(0.1);
  const [startX, setStartX] = useState(-1);
  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const historyRef = useRef([]);

  const runStep = () => {
    historyRef.current = [...historyRef.current];
    const prev = historyRef.current.length > 0 ? historyRef.current[historyRef.current.length - 1] : startX;
    const grad = df(prev);
    const next = prev - lr * grad;
    historyRef.current.push(next);
    setHistory([...historyRef.current]);
  };

  const startSimulation = () => {
    historyRef.current = [];
    setHistory([]);
    setRunning(true);
    let count = 0;
    intervalRef.current = setInterval(() => {
      count++;
      historyRef.current = [...historyRef.current];
      const prev = historyRef.current.length > 0 ? historyRef.current[historyRef.current.length - 1] : startX;
      const grad = df(prev);
      const next = prev - lr * grad;
      if (Math.abs(next - prev) < 0.001 || count > 30) {
        historyRef.current.push(next);
        setHistory([...historyRef.current]);
        clearInterval(intervalRef.current);
        setRunning(false);
        return;
      }
      historyRef.current.push(next);
      setHistory([...historyRef.current]);
    }, 300);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    historyRef.current = [];
    setHistory([]);
  };

  const allX = [startX, ...history];
  const currentX = allX[allX.length - 1];
  const converged = history.length > 1 && Math.abs(currentX - (allX[allX.length - 2] || startX)) < 0.001;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#55efc4] to-[#00b894] bg-clip-text text-transparent">Gradient Descent</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Gradient descent is how neural networks <span className="text-[#55efc4] font-semibold">learn</span>. It iteratively moves toward the minimum of a loss function by taking steps in the direction of the steepest descent (negative gradient).
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The intuition:</span> Imagine standing on a mountain in dense fog. You can't see the valley, but you can feel the slope under your feet. Gradient descent is like taking steps downhill based on the steepness at your current position. Eventually, you'll reach the lowest point (minimum loss).
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Gradient (∇)', def: 'The vector of partial derivatives. Points in the direction of steepest increase — we go opposite to descend.' },
              { term: 'Learning Rate (α)', def: 'Step size. Too small = slow convergence. Too large = overshoot and diverge. A hyperparameter you tune.' },
              { term: 'Loss Function', def: 'Measures how wrong the model\'s predictions are. Training minimizes this. E.g., MSE, cross-entropy.' },
              { term: 'Convergence', def: 'When the loss stops decreasing significantly. The model has found a minimum (local or global).' },
              { term: 'Local Minimum', def: 'A low point that isn\'t the lowest overall. Deep learning often gets stuck here, but that\'s often fine.' },
              { term: 'SGD', def: 'Stochastic Gradient Descent — updates weights after each sample (or mini-batch) instead of the full dataset. Faster and adds noise that helps escape local minima.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#55efc4]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">Interactive Simulation</h2>
            <div className="flex gap-2">
              <button onClick={startSimulation} disabled={running}
                className="px-3 py-1 rounded-lg bg-[#55efc4] text-[#0f0f1a] text-[0.68rem] font-bold disabled:opacity-40 hover:bg-[#00b894] transition-all">
                {running ? '⏳…' : '▶ Run'}
              </button>
              <button onClick={runStep} disabled={running}
                className="px-3 py-1 rounded-lg bg-white/[0.08] border border-white/[0.15] text-[0.68rem] font-medium disabled:opacity-40 hover:bg-white/[0.12] transition-all">
                Step →
              </button>
              <button onClick={reset}
                className="px-3 py-1 rounded-lg bg-white/[0.08] border border-white/[0.15] text-[0.68rem] font-medium hover:bg-white/[0.12] transition-all">
                Reset
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[0.6rem] font-bold text-white/35 uppercase tracking-wider">Learning Rate: <span className="text-[#55efc4]">{lr}</span></label>
              <input type="range" min="0.01" max="0.45" step="0.01" value={lr} onChange={e => { setLr(parseFloat(e.target.value)); reset(); }}
                className="w-full mt-1 accent-[#55efc4]" />
              <div className="flex justify-between text-[0.55rem] text-white/25 mt-0.5">
                <span>Too small (slow)</span>
                <span>Too big (diverge)</span>
              </div>
            </div>
            <div>
              <label className="text-[0.6rem] font-bold text-white/35 uppercase tracking-wider">Start Position: <span className="text-[#ffd93d]">{startX}</span></label>
              <input type="range" min="-1.5" max="7.5" step="0.5" value={startX} onChange={e => { setStartX(parseFloat(e.target.value)); reset(); }}
                className="w-full mt-1 accent-[#ffd93d]" />
            </div>
          </div>

          {/* SVG Graph */}
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ maxHeight: '220px' }}>
              {/* Grid lines */}
              {[0, 5, 10, 15, 20, 25].map(y => {
                const { sy } = toSVG(0, y);
                return <line key={`gy${y}`} x1={PAD.l} y1={sy} x2={SVG_W - PAD.r} y2={sy} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
              })}
              {[-2, 0, 2, 4, 6, 8].map(x => {
                const { sx } = toSVG(x, 0);
                return <line key={`gx${x}`} x1={sx} y1={PAD.t} x2={sx} y2={SVG_H - PAD.b} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
              })}

              {/* Axes labels */}
              {[-2, 0, 2, 4, 6, 8].map(x => {
                const { sx } = toSVG(x, 0);
                return <text key={`lx${x}`} x={sx} y={SVG_H - PAD.b + 15} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9">{x}</text>;
              })}
              <text x={8} y={SVG_H - PAD.b + 15} fill="rgba(255,255,255,0.25)" fontSize="9">x</text>

              {/* Curve */}
              <path d={pathD} fill="none" stroke="#55efc4" strokeWidth="2" opacity="0.8" />

              {/* Minimum marker */}
              {(() => { const { sx, sy } = toSVG(3, 1); return <circle cx={sx} cy={sy} r="4" fill="#43e97b" opacity="0.6" />; })()}
              {(() => { const { sx } = toSVG(3, 1); return <text x={sx} y={SVG_H - PAD.b + 15} textAnchor="middle" fill="#43e97b" fontSize="8" fontWeight="bold">min</text>; })()}

              {/* History path */}
              {allX.length > 1 && allX.slice(0, -1).map((x, i) => {
                const from = toSVG(x, f(x));
                const to = toSVG(allX[i + 1], f(allX[i + 1]));
                return <line key={`p${i}`} x1={from.sx} y1={from.sy} x2={to.sx} y2={to.sy} stroke="#ffd93d" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.7" />;
              })}

              {/* History dots */}
              {allX.map((x, i) => {
                const { sx, sy } = toSVG(x, f(x));
                const isLast = i === allX.length - 1;
                return (
                  <g key={`d${i}`}>
                    <circle cx={sx} cy={sy} r={isLast ? 5 : 3} fill={isLast ? '#ffd93d' : 'rgba(253,201,78,0.4)'} />
                    {isLast && <circle cx={sx} cy={sy} r="7" fill="none" stroke="#ffd93d" strokeWidth="1.5" opacity="0.5" />}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-center">
              <div className="text-[0.58rem] text-white/30 uppercase">Iterations</div>
              <div className="text-[0.78rem] font-bold text-[#ffd93d]">{history.length}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-center">
              <div className="text-[0.58rem] text-white/30 uppercase">Current x</div>
              <div className="text-[0.78rem] font-bold text-[#a5f3fc]">{currentX.toFixed(3)}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-center">
              <div className="text-[0.58rem] text-white/30 uppercase">Loss f(x)</div>
              <div className="text-[0.78rem] font-bold text-[#55efc4]">{f(currentX).toFixed(3)}</div>
            </div>
          </div>

          {converged && (
            <div className="mt-3 bg-[#43e97b]/[0.08] border border-[#43e97b]/25 rounded-lg px-3 py-2 text-center">
              <span className="text-[0.68rem] font-bold text-[#43e97b]">✓ Converged! Reached minimum at x ≈ {currentX.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Learning rate effects */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Learning Rate Effects</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Too Small', lr: '0.01', color: '#4facfe', icon: '🐢', desc: 'Converges very slowly. Many iterations needed.' },
              { label: 'Just Right', lr: '0.1', color: '#43e97b', icon: '🎯', desc: 'Converges smoothly and quickly to minimum.' },
              { label: 'Too Large', lr: '0.6', color: '#ef4444', icon: '💥', desc: 'Overshoots! Oscillates or diverges to infinity.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-[0.68rem] font-bold mb-0.5" style={{ color: item.color }}>{item.label}</div>
                <code className="text-[0.6rem] text-white/40">α = {item.lr}</code>
                <p className="text-[0.58rem] text-white/35 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formula */}
        <div className="bg-[#55efc4]/[0.06] border border-[#55efc4]/20 rounded-xl px-4 py-3">
          <h3 className="text-[0.72rem] font-bold text-[#55efc4] mb-2">📐 The Update Rule</h3>
          <div className="bg-[#0a0a14] rounded-lg px-4 py-2 text-center mb-2">
            <span className="text-[0.82rem] font-mono">
              <span className="text-[#a5f3fc]">x_new</span>
              <span className="text-white/40"> = </span>
              <span className="text-[#a5f3fc]">x_old</span>
              <span className="text-white/40"> - </span>
              <span className="text-[#ffd93d]">α</span>
              <span className="text-white/40"> × </span>
              <span className="text-[#f093fb]">∇f(x)</span>
            </span>
          </div>
          <div className="flex gap-4 justify-center">
            <div className="text-[0.58rem] text-white/35"><span className="text-[#ffd93d]">α</span> = learning rate</div>
            <div className="text-[0.58rem] text-white/35"><span className="text-[#f093fb]">∇f(x)</span> = gradient (slope)</div>
            <div className="text-[0.58rem] text-white/35"><span className="text-white/50">−</span> = move opposite to gradient</div>
          </div>
        </div>
      </div>
    </div>
  );
}
