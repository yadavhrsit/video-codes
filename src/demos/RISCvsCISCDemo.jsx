import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMPARISON = [
  { aspect: 'Instruction Set', risc: 'Small, fixed set (~100)', cisc: 'Large, complex set (~1000+)', riskWin: false },
  { aspect: 'Instruction Size', risc: 'Fixed-length (e.g. 32-bit)', cisc: 'Variable-length (1–15 bytes)', riskWin: true },
  { aspect: 'Cycles per Instruction', risc: '~1 cycle (pipelined)', cisc: 'Multiple cycles per instruction', riskWin: true },
  { aspect: 'Memory Access', risc: 'Load/Store only', cisc: 'Can access memory directly', riskWin: false },
  { aspect: 'Code Size', risc: 'More instructions needed', cisc: 'Fewer instructions for same task', riskWin: false },
  { aspect: 'Pipelining', risc: 'Excellent — uniform instructions', cisc: 'Harder to pipeline', riskWin: true },
  { aspect: 'Power Consumption', risc: 'Lower (simpler logic)', cisc: 'Higher (complex decode)', riskWin: true },
  { aspect: 'Real Architectures', risc: 'ARM, MIPS, RISC-V', cisc: 'x86, x86-64 (Intel/AMD)', riskWin: null },
];

// Example: compute A = B + C * D
const RISC_STEPS = [
  { code: 'LOAD R1, B',     desc: 'Load B into register R1' },
  { code: 'LOAD R2, C',     desc: 'Load C into register R2' },
  { code: 'LOAD R3, D',     desc: 'Load D into register R3' },
  { code: 'MUL R4, R2, R3', desc: 'R4 = C × D' },
  { code: 'ADD R5, R1, R4', desc: 'R5 = B + (C×D)' },
  { code: 'STORE A, R5',    desc: 'Store result in memory A' },
];

const CISC_STEPS = [
  { code: 'MOV AX, [B]',       desc: 'Load B directly from memory' },
  { code: 'IMUL BX, [C], [D]', desc: 'Multiply C×D (memory operands!)' },
  { code: 'ADD AX, BX',        desc: 'Add: AX = B + (C×D)' },
  { code: 'MOV [A], AX',       desc: 'Store result to memory A' },
];

export default function RISCvsCISCDemo({ onBack }) {
  const [view, setView] = useState('compare'); // compare | example | history
  const [exStep, setExStep] = useState(-1);
  const [exMode, setExMode] = useState('risc');

  const steps = exMode === 'risc' ? RISC_STEPS : CISC_STEPS;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#fd79a8] to-[#e84393] bg-clip-text text-transparent">RISC vs CISC</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Two philosophies for CPU design: <span className="text-[#fd79a8] font-semibold">RISC</span> (simple, fast instructions) vs <span className="text-[#4facfe] font-semibold">CISC</span> (complex, powerful instructions). This debate has shaped every processor since the 1980s.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The trade-off:</span> RISC requires more instructions to do the same work, but each instruction runs in one clock cycle. CISC needs fewer instructions, but each takes multiple cycles. Modern CPUs blur the line — x86 looks like CISC but translates to RISC-like micro-ops internally.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'ISA', def: 'Instruction Set Architecture — the "language" a CPU speaks. x86-64, ARM, and RISC-V are different ISAs.' },
              { term: 'Micro-ops', def: 'Tiny RISC-like operations that complex instructions get decoded into. Modern x86 CPUs work this way internally.' },
              { term: 'Pipeline', def: 'Breaking instruction execution into stages (fetch, decode, execute). RISC pipelines are simpler because instructions are uniform.' },
              { term: 'Register', def: 'A tiny, ultra-fast storage location in the CPU. RISC typically has more registers; CISC can access memory directly.' },
              { term: 'Load/Store', def: 'RISC philosophy: only load/store instructions touch memory. All computation happens on registers.' },
              { term: 'Decode Unit', def: 'Hardware that interprets instructions. CISC decoders are complex because instructions vary in length and format.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#fd79a8]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* View tabs */}
        <div className="flex gap-2">
          {[
            { id: 'compare', label: 'Comparison', icon: '⚖️' },
            { id: 'example', label: 'Code Example', icon: '💻' },
            { id: 'history', label: 'Modern Reality', icon: '🏗️' },
          ].map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              className={`flex-1 px-3 py-2 rounded-xl border text-center transition-all duration-200
                ${view === v.id ? 'border-[#fd79a8]/40 bg-[#fd79a8]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
              <div className="text-sm mb-0.5">{v.icon}</div>
              <div className="text-[0.65rem] font-bold" style={{ color: view === v.id ? '#fd79a8' : 'rgba(255,255,255,0.5)' }}>{v.label}</div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* COMPARISON VIEW */}
          {view === 'compare' && (
            <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <div className="grid grid-cols-3 gap-0 mb-2">
                  <div className="text-[0.6rem] font-bold text-white/35 uppercase">Aspect</div>
                  <div className="text-[0.6rem] font-bold text-[#fd79a8] uppercase text-center">RISC</div>
                  <div className="text-[0.6rem] font-bold text-[#4facfe] uppercase text-center">CISC</div>
                </div>
                <div className="flex flex-col gap-0">
                  {COMPARISON.map((row, i) => (
                    <div key={i} className={`grid grid-cols-3 gap-0 py-2 border-t border-white/[0.06] ${i === COMPARISON.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                      <div className="text-[0.67rem] text-white/60 font-medium">{row.aspect}</div>
                      <div className={`text-[0.65rem] text-center px-1 ${row.riskWin === true ? 'text-[#fd79a8] font-bold' : 'text-white/45'}`}>
                        {row.risc}
                        {row.riskWin === true && <span className="ml-1 text-[0.5rem]">★</span>}
                      </div>
                      <div className={`text-[0.65rem] text-center px-1 ${row.riskWin === false ? 'text-[#4facfe] font-bold' : 'text-white/45'}`}>
                        {row.cisc}
                        {row.riskWin === false && <span className="ml-1 text-[0.5rem]">★</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5"><span className="text-[0.6rem] text-[#fd79a8]">★</span><span className="text-[0.58rem] text-white/35">Advantage</span></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CODE EXAMPLE VIEW */}
          {view === 'example' && (
            <motion.div key="example" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-bold text-white">Computing A = B + C × D</h2>
                </div>
                <p className="text-[0.67rem] text-white/40 mb-3">Same math, very different instruction sequences</p>

                {/* Toggle */}
                <div className="flex gap-2 mb-4">
                  <button onClick={() => { setExMode('risc'); setExStep(-1); }}
                    className={`flex-1 px-3 py-1.5 rounded-lg border text-[0.68rem] font-bold transition-all
                      ${exMode === 'risc' ? 'border-[#fd79a8]/40 bg-[#fd79a8]/10 text-[#fd79a8]' : 'border-white/[0.08] text-white/40'}`}>
                    RISC ({RISC_STEPS.length} instructions)
                  </button>
                  <button onClick={() => { setExMode('cisc'); setExStep(-1); }}
                    className={`flex-1 px-3 py-1.5 rounded-lg border text-[0.68rem] font-bold transition-all
                      ${exMode === 'cisc' ? 'border-[#4facfe]/40 bg-[#4facfe]/10 text-[#4facfe]' : 'border-white/[0.08] text-white/40'}`}>
                    CISC ({CISC_STEPS.length} instructions)
                  </button>
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-1 mb-3">
                  {steps.map((step, i) => (
                    <button key={i} onClick={() => setExStep(i)}
                      className={`flex items-start gap-3 px-3 py-2 rounded-lg border text-left transition-all duration-200
                        ${exStep === i ? (exMode === 'risc' ? 'border-[#fd79a8]/40 bg-[#fd79a8]/10' : 'border-[#4facfe]/40 bg-[#4facfe]/10') : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                      <span className={`text-[0.6rem] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                        ${exStep >= i ? (exMode === 'risc' ? 'bg-[#fd79a8]/20 text-[#fd79a8]' : 'bg-[#4facfe]/20 text-[#4facfe]') : 'bg-white/[0.06] text-white/30'}`}>
                        {i + 1}
                      </span>
                      <div>
                        <code className={`text-[0.72rem] font-mono font-bold ${exStep === i ? (exMode === 'risc' ? 'text-[#fd79a8]' : 'text-[#4facfe]') : 'text-[#a5f3fc]'}`}>{step.code}</code>
                        <p className="text-[0.6rem] text-white/35 mt-0.5">{step.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Insight */}
                <div className="bg-[#0a0a14] border border-white/[0.06] rounded-lg p-3">
                  <p className="text-[0.67rem] text-white/50">
                    RISC uses <span className="text-[#fd79a8] font-bold">{RISC_STEPS.length} simple instructions</span> — each does one thing.
                    CISC uses <span className="text-[#4facfe] font-bold">{CISC_STEPS.length} complex instructions</span> — fewer lines, but each takes multiple clock cycles internally.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* MODERN REALITY VIEW */}
          {view === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <h2 className="text-base font-bold text-white mb-3">The Modern Twist</h2>
                <div className="bg-[#fd79a8]/[0.08] border border-[#fd79a8]/25 rounded-xl p-4 mb-4">
                  <h3 className="text-[0.72rem] font-bold text-[#fd79a8] mb-1.5">🤯 Modern x86 is Actually RISC Underneath</h3>
                  <p className="text-[0.65rem] text-white/50 leading-relaxed">
                    Intel and AMD CPUs present a CISC instruction set (x86-64) to software, but internally <span className="text-white/70 font-semibold">translate ("decode") complex instructions into micro-ops</span> — tiny RISC-like operations — that execute on a RISC-style pipeline. Best of both worlds.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <h4 className="text-[0.7rem] font-bold text-[#fd79a8] mb-2">📱 ARM (RISC)</h4>
                    <ul className="flex flex-col gap-1">
                      {['Powers iPhones, Android phones', 'Apple M1/M2 Mac chips', 'Dominates mobile & IoT', 'Exceptional power efficiency'].map((item, i) => (
                        <li key={i} className="text-[0.63rem] text-white/50 flex items-start gap-1.5">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#fd79a8] flex-shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <h4 className="text-[0.7rem] font-bold text-[#4facfe] mb-2">🖥️ x86-64 (CISC)</h4>
                    <ul className="flex flex-col gap-1">
                      {['Dominates desktops & servers', 'Massive software compatibility', 'Intel Core & AMD Ryzen', 'Backward compatible since 1980'].map((item, i) => (
                        <li key={i} className="text-[0.63rem] text-white/50 flex items-start gap-1.5">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#4facfe] flex-shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                  <h4 className="text-[0.7rem] font-bold text-[#43e97b] mb-1">🔄 RISC-V — The Future?</h4>
                  <p className="text-[0.63rem] text-white/50">An open-source RISC ISA gaining momentum. Google, NVIDIA, and many startups are building RISC-V chips. It could challenge both ARM and x86 in the coming decade.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
