import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// DFA that accepts strings ending in "ab"
const DFA_STATES = ['q0', 'q1', 'q2'];
const DFA_ACCEPT = ['q2'];
const DFA_TRANSITIONS = {
  q0: { a: 'q1', b: 'q0' },
  q1: { a: 'q1', b: 'q2' },
  q2: { a: 'q1', b: 'q0' },
};

// NFA that accepts strings containing "ab" (has epsilon-like ambiguity)
const NFA_STATES = ['s0', 's1', 's2'];
const NFA_ACCEPT = ['s2'];
const NFA_TRANSITIONS = {
  s0: { a: ['s0', 's1'], b: ['s0'] },
  s1: { a: [],           b: ['s2'] },
  s2: { a: [],           b: [] },
};

function runDFA(input) {
  let state = 'q0';
  const trace = [{ state, symbol: null }];
  for (const ch of input) {
    const next = DFA_TRANSITIONS[state]?.[ch];
    if (!next) return { accepted: false, trace, stuck: true };
    state = next;
    trace.push({ state, symbol: ch });
  }
  return { accepted: DFA_ACCEPT.includes(state), trace, stuck: false };
}

function runNFA(input) {
  let states = new Set(['s0']);
  const trace = [{ states: [...states], symbol: null }];
  for (const ch of input) {
    const next = new Set();
    for (const s of states) {
      const targets = NFA_TRANSITIONS[s]?.[ch] || [];
      targets.forEach(t => next.add(t));
    }
    states = next;
    trace.push({ states: [...states], symbol: ch });
    if (states.size === 0) break;
  }
  const accepted = [...states].some(s => NFA_ACCEPT.includes(s));
  return { accepted, trace };
}

const EXAMPLES = [
  { label: 'ab', desc: 'Ends with "ab"' },
  { label: 'aab', desc: 'Ends with "ab"' },
  { label: 'abb', desc: 'Does NOT end with "ab"' },
  { label: 'bab', desc: 'Ends with "ab"' },
  { label: 'ba', desc: 'Does NOT end with "ab"' },
  { label: 'abab', desc: 'Ends with "ab"' },
];

export default function FiniteAutomataDemo({ onBack }) {
  const [mode, setMode] = useState('dfa'); // dfa | nfa
  const [input, setInput] = useState('ab');
  const [showTrace, setShowTrace] = useState(true);

  const sanitized = input.replace(/[^ab]/g, '').slice(0, 12);
  const dfaResult = runDFA(sanitized);
  const nfaResult = runNFA(sanitized);
  const result = mode === 'dfa' ? dfaResult : nfaResult;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#74b9ff] to-[#0984e3] bg-clip-text text-transparent">Finite Automata</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Finite automata are abstract machines that process input symbols one at a time and decide to <span className="text-[#74b9ff] font-semibold">accept or reject</span> the input. They power regex engines, compilers, and text editors.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Where you've seen them:</span> Every time you use regex (like <code className="text-[#a5f3fc]">/[a-z]+@[a-z]+\.com/</code>), the regex engine converts it to a finite automaton internally. They're also used in network protocols, lexers (compiler front-ends), and even in video game AI state machines.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'State', def: 'A configuration the machine can be in. Represented as circles in diagrams. The machine is always in exactly one state (DFA) or a set of states (NFA).' },
              { term: 'Alphabet (Σ)', def: 'The set of allowed input symbols. For this demo: {a, b}. For ASCII text: all characters.' },
              { term: 'Transition', def: 'A rule that says "if in state X and see symbol Y, go to state Z." Arrows in state diagrams.' },
              { term: 'Accept State', def: 'Also called "final state." If the machine ends in an accept state after reading all input, the string is accepted.' },
              { term: 'Regular Language', def: 'The set of all strings a finite automaton can recognize. Exactly what regex can match — no more, no less.' },
              { term: 'Epsilon (ε) Transition', def: 'A transition that happens without consuming any input symbol. Only in NFAs. Adds non-determinism.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#74b9ff]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          {[
            { id: 'dfa', label: 'DFA', icon: '⚙️', desc: 'Deterministic — one path per input' },
            { id: 'nfa', label: 'NFA', icon: '🔀', desc: 'Non-deterministic — multiple paths' },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`flex-1 px-3 py-2.5 rounded-xl border text-left transition-all duration-200
                ${mode === m.id ? 'border-[#74b9ff]/40 bg-[#74b9ff]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm">{m.icon}</span>
                <span className="text-[0.72rem] font-bold" style={{ color: mode === m.id ? '#74b9ff' : 'rgba(255,255,255,0.55)' }}>{m.label}</span>
              </div>
              <p className="text-[0.6rem] text-white/35">{m.desc}</p>
            </button>
          ))}
        </div>

        {/* Input section */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">State Machine — accepts strings ending in "ab"</h2>
            <button onClick={() => setShowTrace(t => !t)} className="text-[0.65rem] text-white/40 hover:text-white/60 transition-colors">
              {showTrace ? 'Hide' : 'Show'} Trace
            </button>
          </div>

          {/* State diagram */}
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {(mode === 'dfa' ? DFA_STATES : NFA_STATES).map((s, i) => {
                const isAccept = (mode === 'dfa' ? DFA_ACCEPT : NFA_ACCEPT).includes(s);
                const isActive = mode === 'dfa'
                  ? dfaResult.trace[dfaResult.trace.length - 1]?.state === s
                  : nfaResult.trace[nfaResult.trace.length - 1]?.states.includes(s);
                const isStart = i === 0;
                return (
                  <div key={s} className="flex items-center gap-1">
                    {isStart && <span className="text-[0.6rem] text-white/30">→</span>}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[0.7rem] font-bold transition-all duration-300 border
                      ${isActive ? 'border-[#74b9ff] bg-[#74b9ff]/20 scale-110 shadow-[0_0_12px_#74b9ff40]' : 'border-white/[0.15] bg-white/[0.04]'}
                      ${isAccept ? 'ring-2 ring-[#43e97b]/50' : ''}`}
                      style={{ color: isActive ? '#74b9ff' : 'rgba(255,255,255,0.6)' }}>
                      {s}
                      {isAccept && <span className="absolute text-[0.45rem] text-[#43e97b] -bottom-3">accept</span>}
                    </div>
                    {i < (mode === 'dfa' ? DFA_STATES : NFA_STATES).length - 1 && (
                      <span className="text-white/20 text-sm">→</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex gap-4 justify-center mt-3">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border-2 border-[#74b9ff] bg-[#74b9ff]/30" /><span className="text-[0.58rem] text-white/40">Current</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full ring-2 ring-[#43e97b]/60 border border-white/20" /><span className="text-[0.58rem] text-white/40">Accept</span></div>
              <div className="flex items-center gap-1.5"><span className="text-[0.6rem] text-white/30">→</span><span className="text-[0.58rem] text-white/40">Start</span></div>
            </div>
          </div>

          {/* Input & result */}
          <div className="flex gap-3 items-end mb-3">
            <div className="flex-1">
              <label className="text-[0.62rem] font-bold text-white/35 uppercase tracking-wider mb-1 block">Input (a & b only)</label>
              <input value={input} onChange={e => setInput(e.target.value)}
                className="w-full bg-[#0a0a14] border border-white/[0.1] rounded-lg px-3 py-2 text-[0.78rem] font-mono text-[#a5f3fc] focus:border-[#74b9ff]/50 focus:outline-none transition-colors"
                placeholder="Type a or b..." />
            </div>
            <div className={`px-4 py-2 rounded-lg border text-[0.7rem] font-bold transition-all duration-300 ${result.accepted ? 'border-[#43e97b]/40 bg-[#43e97b]/10 text-[#43e97b]' : 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]'}`}>
              {result.accepted ? '✓ Accepted' : '✗ Rejected'}
            </div>
          </div>

          {/* Trace */}
          {showTrace && sanitized.length > 0 && (
            <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-[0.6rem] font-bold text-white/35 uppercase tracking-wider mb-2">Execution Trace</div>
              <div className="flex gap-1 flex-wrap items-center">
                {(mode === 'dfa' ? dfaResult.trace : nfaResult.trace).map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-white/20 text-[0.6rem]">→ <span className="text-[#ffd93d]">{step.symbol}</span> →</span>}
                    <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full border
                      ${i === (mode === 'dfa' ? dfaResult.trace : nfaResult.trace).length - 1 ? 'border-[#74b9ff]/40 bg-[#74b9ff]/15 text-[#74b9ff]' : 'border-white/[0.1] bg-white/[0.04] text-white/55'}`}>
                      {mode === 'dfa' ? step.state : `{${step.states.join(',')}}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick examples */}
          <div className="flex gap-1.5 flex-wrap mt-3">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setInput(ex.label)}
                className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <span className="text-[0.65rem] font-mono text-[#a5f3fc] font-bold">{ex.label}</span>
                <span className="text-[0.55rem] text-white/30 ml-1.5">{ex.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DFA vs NFA comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#74b9ff] mb-2">⚙️ DFA (Deterministic)</h3>
            <ul className="flex flex-col gap-1.5">
              {['Exactly one transition per symbol', 'Predictable — single execution path', 'Faster to simulate (linear time)', 'Can be larger state-wise'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#74b9ff] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#f093fb] mb-2">🔀 NFA (Non-Deterministic)</h3>
            <ul className="flex flex-col gap-1.5">
              {['Multiple transitions per symbol', 'Explores all paths simultaneously', 'More compact state diagrams', 'Harder to simulate (exponential worst-case)'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#f093fb] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key theorem */}
        <div className="bg-[#74b9ff]/[0.06] border border-[#74b9ff]/20 rounded-xl px-4 py-3">
          <h3 className="text-[0.72rem] font-bold text-[#74b9ff] mb-1">🔬 Key Theorem</h3>
          <p className="text-[0.67rem] text-white/50">Every NFA can be converted to an equivalent DFA (via subset construction). They recognize the same class of languages — <span className="text-white/70 font-semibold">Regular Languages</span>. This is why regex engines work: they're compiled into finite automata internally.</p>
        </div>
      </div>
    </div>
  );
}
