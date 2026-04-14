import { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

// ─── Theme Context ─────────────────────────────────────────
const ThemeContext = createContext('dark');

const THEMES = {
  dark:  { bg: '#1e293b', text: '#f1f5f9', border: '#475569', label: 'Dark',  emoji: '🌙' },
  light: { bg: '#f8fafc', text: '#334155', border: '#94a3b8', label: 'Light', emoji: '☀️' },
  ocean: { bg: '#0f3460', text: '#e2e8f0', border: '#2e6da4', label: 'Ocean', emoji: '🌊' },
  forest:{ bg: '#14532d', text: '#bbf7d0', border: '#166534', label: 'Forest',emoji: '🌳' },
};

// ─── Reusable Tree Nodes ───────────────────────────────────
function LeafNode({ name, icon }) {
  const theme = useContext(ThemeContext);
  const t = THEMES[theme];

  return (
    <motion.div
      className="rounded-lg px-3 py-2 flex items-center gap-2 border"
      animate={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ border: `1px solid ${t.border}` }}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[0.72rem] font-medium">{name}</span>
      <span className="ml-auto text-[0.58rem] opacity-50 uppercase tracking-wider">{theme}</span>
    </motion.div>
  );
}

function BranchNode({ name, icon, children }) {
  const theme = useContext(ThemeContext);
  const t = THEMES[theme];

  return (
    <motion.div
      className="rounded-xl border p-3 flex flex-col gap-2"
      animate={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ border: `1px solid ${t.border}` }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-[0.75rem] font-bold">{name}</span>
      </div>
      <div className="flex flex-col gap-1.5 pl-3 border-l border-current/20">
        {children}
      </div>
    </motion.div>
  );
}

// ─── Prop Drilling visual (no context) ─────────────────────
function PropDrillingTree({ theme }) {
  const t = THEMES[theme];
  return (
    <div className="flex flex-col gap-2 text-white">
      {/* Root */}
      <div className="rounded-xl border bg-[#1a1a2e] border-[#ef4444]/50 p-3 text-center">
        <div className="text-[0.7rem] font-bold text-[#ef4444]">🏠 App</div>
        <div className="text-[0.58rem] text-[#ef4444]/70 mt-0.5">theme="{theme}" ↓ ↓ ↓</div>
      </div>
      {/* Mid layer — forced to accept & pass */}
      <div className="flex gap-2">
        {['Header', 'Main'].map(name => (
          <div key={name} className="flex-1 rounded-lg border border-[#ef4444]/30 bg-[#1a1a2e] p-2.5">
            <div className="text-[0.68rem] font-semibold text-[#ffd93d]">🗂️ {name}</div>
            <div className="text-[0.55rem] text-[#ef4444]/60 mt-0.5">props.theme ↓</div>
            <div className="flex flex-col gap-1 mt-1.5">
              {name === 'Header'
                ? ['Logo', 'Nav'].map(n => (
                    <div key={n} className="rounded px-2 py-1 border border-[#ef4444]/20 bg-[#1a1a2e]">
                      <span className="text-[0.65rem] text-white/60">📦 {n}</span>
                      <span className="ml-2 text-[0.52rem] text-[#43e97b]">✓ uses theme</span>
                    </div>
                  ))
                : ['Sidebar', 'Content'].map(n => (
                    <div key={n} className="rounded px-2 py-1 border border-[#ef4444]/20 bg-[#1a1a2e]">
                      <span className="text-[0.65rem] text-white/60">📦 {n}</span>
                      <span className="ml-2 text-[0.52rem] text-[#43e97b]">✓ uses theme</span>
                    </div>
                  ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Demo ─────────────────────────────────────────────
export default function ContextAPIDemo({ onBack }) {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('context'); // 'context' | 'drilling'
  const [step, setStep] = useState(0);

  const steps = [
    { title: '1. Create Context',   code: 'const ThemeContext = createContext("dark");' },
    { title: '2. Wrap Provider',    code: '<ThemeContext.Provider value={theme}>\n  <App />\n</ThemeContext.Provider>' },
    { title: '3. Consume (any level)', code: 'function NavBar() {\n  const theme = useContext(ThemeContext);\n  return <nav className={theme}>...</nav>;\n}' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15]
                     rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1
                     transition-all duration-300"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          React Context API
        </h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* ── What is Context ─── */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">What is Context API?</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Context provides a way to pass data through the component tree
            <span className="text-[#667eea] font-semibold"> without prop drilling</span> — no need to manually pass props through every intermediate component.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The problem it solves:</span> Imagine passing a theme prop from App → Layout → Sidebar → Button. Without Context, every intermediate component must accept and forward the prop, even if they don't use it. Context lets Button read the theme directly, skipping the middle layers.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'createContext', def: 'Creates a Context object. Takes a default value used when a component has no Provider above it.' },
              { term: 'Provider', def: 'A component that wraps part of your tree. Passes the value to all descendants. Updates trigger re-renders.' },
              { term: 'useContext', def: 'A hook that reads the current context value. Subscribes to updates from the nearest Provider above.' },
              { term: 'Prop Drilling', def: 'The anti-pattern of passing props through many levels just to reach a deeply nested component. Context solves this.' },
              { term: 'Consumer', def: 'The older way to read context (before hooks). Uses render props pattern. useContext is preferred now.' },
              { term: 'Context Selector', def: 'A pattern to prevent unnecessary re-renders by selecting only the part of context you need. Often done with useMemo.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Interactive Demo ─── */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-white">Interactive Demo</h2>
            {/* View toggle */}
            <div className="flex bg-white/[0.06] rounded-lg p-0.5">
              {[['context', '✓ With Context'], ['drilling', '✗ Prop Drilling']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`px-3 py-1 rounded-md text-[0.7rem] font-semibold transition-all duration-200
                    ${view === key
                      ? (key === 'context' ? 'bg-[#43e97b]/20 text-[#43e97b]' : 'bg-[#ef4444]/20 text-[#ef4444]')
                      : 'text-white/40 hover:text-white/60'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme selector */}
          <div className="flex gap-2 flex-wrap mb-4">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`px-3 py-1 rounded-lg text-[0.7rem] font-semibold border transition-all duration-200
                  ${theme === key
                    ? 'border-[#667eea] bg-[#667eea]/15 text-[#667eea]'
                    : 'border-white/[0.12] text-white/50 hover:border-white/[0.25] hover:text-white/70'
                  }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* Tree visualization */}
          <div className="bg-[#0f0f1a] rounded-xl border border-white/[0.06] p-4">
            {view === 'context' ? (
              <ThemeContext.Provider value={theme}>
                <div className="flex flex-col gap-2">
                  {/* Root */}
                  <div className="text-center">
                    <div className="inline-block bg-[#667eea]/15 border border-[#667eea]/30 rounded-xl px-4 py-2">
                      <div className="text-[0.72rem] font-bold text-[#667eea]">🏠 App — Provider</div>
                      <div className="text-[0.55rem] text-[#667eea]/60 mt-0.5">value={`{theme}`} → broadcasts to tree</div>
                    </div>
                  </div>
                  {/* Connector */}
                  <div className="flex justify-center">
                    <div className="w-px h-3 bg-[#667eea]/30" />
                  </div>
                  {/* Branch row */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <BranchNode name="Header" icon="🗂️">
                        <LeafNode name="Logo" icon="📦" />
                        <LeafNode name="NavBar" icon="📦" />
                      </BranchNode>
                    </div>
                    <div className="flex-1">
                      <BranchNode name="Main" icon="🗂️">
                        <LeafNode name="Sidebar" icon="📦" />
                        <LeafNode name="Content" icon="📦" />
                      </BranchNode>
                    </div>
                  </div>
                  {/* Note */}
                  <div className="mt-2 bg-[#43e97b]/[0.08] border border-[#43e97b]/20 rounded-lg px-3 py-2">
                    <p className="text-[0.7rem] text-[#43e97b]">
                      ✓ Every leaf reads theme via <code className="bg-[#43e97b]/15 px-1 rounded">useContext</code> — no props passed through branches.
                    </p>
                  </div>
                </div>
              </ThemeContext.Provider>
            ) : (
              <div>
                <PropDrillingTree theme={theme} />
                <div className="mt-3 bg-[#ef4444]/[0.08] border border-[#ef4444]/20 rounded-lg px-3 py-2">
                  <p className="text-[0.7rem] text-[#ef4444]">
                    ✗ Header & Main must accept <code className="bg-[#ef4444]/15 px-1 rounded">theme</code> prop even though they don't use it — only to pass it down.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── 3-Step Code Walkthrough ─── */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">How to Implement</h2>
          <div className="flex gap-2 mb-4">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-[0.68rem] font-semibold border transition-all duration-200 text-left
                  ${step === i
                    ? 'border-[#667eea]/40 bg-[#667eea]/10 text-[#667eea]'
                    : 'border-white/[0.1] text-white/40 hover:text-white/60'
                  }`}
              >
                {s.title}
              </button>
            ))}
          </div>
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4">
            <pre className="text-[0.78rem] text-[#a5f3fc] leading-relaxed whitespace-pre-wrap font-mono">{steps[step].code}</pre>
          </div>
        </div>

        {/* ── Key Points Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: '✓ When to Use', color: '#43e97b', items: ['Theme / Dark Mode', 'Auth state (logged in)', 'Language / i18n', 'Global UI state'] },
            { title: '✗ Limitations', color: '#ef4444', items: ['Re-renders all consumers', 'Not for frequent updates', 'Messy with many contexts', 'No built-in optimization'] },
            { title: '📊 vs Redux', color: '#4facfe', items: ['Context = simple global state', 'Redux = complex logic', 'Redux has devtools', 'Context needs no deps'] },
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <h3 className="text-[0.75rem] font-bold mb-2" style={{ color: card.color }}>{card.title}</h3>
              <ul className="flex flex-col gap-1.5">
                {card.items.map((item, j) => (
                  <li key={j} className="text-[0.7rem] text-white/55 flex items-start gap-1.5">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: card.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
