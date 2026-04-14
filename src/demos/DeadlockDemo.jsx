import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const RESOURCES = ['Database', 'File', 'Printer', 'Network'];
const RESOURCE_COLORS = { Database: '#667eea', File: '#4facfe', Printer: '#43e97b', Network: '#f093fb' };

export default function DeadlockDemo({ onBack }) {
  const [scenario, setScenario] = useState('idle'); // idle | normal | deadlock
  const [step, setStep] = useState(-1);
  const [locks, setLocks] = useState({ P1: [], P2: [] }); // which resources each process holds

  const NORMAL_STEPS = [
    { action: 'P1 locks Database',     locks: { P1: ['Database'], P2: [] },                desc: 'Process 1 acquires the Database lock.' },
    { action: 'P2 locks File',         locks: { P1: ['Database'], P2: ['File'] },          desc: 'Process 2 acquires the File lock.' },
    { action: 'P1 locks File',         locks: { P1: ['Database', 'File'], P2: [] },        desc: 'P1 requests File — P2 already released it. Lock granted.' },
    { action: 'P1 releases all',       locks: { P1: [], P2: [] },                          desc: 'P1 finishes and releases both locks.' },
    { action: 'P2 locks Database',     locks: { P1: [], P2: ['Database'] },                desc: 'P2 now acquires Database. No conflict.' },
    { action: '✓ Both complete',       locks: { P1: [], P2: [] },                          desc: 'Both processes finished successfully. No deadlock!' },
  ];

  const DEADLOCK_STEPS = [
    { action: 'P1 locks Database',     locks: { P1: ['Database'], P2: [] },                desc: 'P1 acquires Database lock first.' },
    { action: 'P2 locks File',         locks: { P1: ['Database'], P2: ['File'] },          desc: 'P2 acquires File lock.' },
    { action: 'P1 waits for File',     locks: { P1: ['Database'], P2: ['File'] },          desc: 'P1 needs File → but P2 holds it. P1 WAITS.', wait: 'P1→File' },
    { action: 'P2 waits for Database', locks: { P1: ['Database'], P2: ['File'] },          desc: 'P2 needs Database → but P1 holds it. P2 WAITS.', wait: 'P2→DB' },
    { action: '💀 DEADLOCK!',          locks: { P1: ['Database'], P2: ['File'] },          desc: 'Circular wait! P1 waits for P2, P2 waits for P1. Neither can proceed.', deadlock: true },
  ];

  const steps = scenario === 'deadlock' ? DEADLOCK_STEPS : NORMAL_STEPS;

  const advance = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
      setLocks(steps[step + 1].locks);
    }
  };

  const startScenario = (type) => {
    setScenario(type);
    setStep(0);
    setLocks(type === 'deadlock' ? DEADLOCK_STEPS[0].locks : NORMAL_STEPS[0].locks);
  };

  const currentStep = step >= 0 ? steps[step] : null;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Deadlock</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            A <span className="text-[#ef4444] font-semibold">deadlock</span> occurs when two or more processes are permanently blocked, each waiting for a resource held by the other. It's a <span className="text-[#667eea] font-semibold">circular wait</span> that can only be resolved by killing a process.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Real-world example:</span> Imagine two cars meeting on a narrow bridge from opposite sides — neither can proceed, and neither wants to back up. In software, this happens when Thread A holds Lock 1 and needs Lock 2, while Thread B holds Lock 2 and needs Lock 1. Both wait forever.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Lock / Mutex', def: 'A synchronization primitive that ensures only one thread can access a resource at a time. Short for "mutual exclusion."' },
              { term: 'Semaphore', def: 'Like a mutex but allows a specified number of concurrent accesses. Useful for limiting connections to a pool.' },
              { term: 'Race Condition', def: 'A bug where the outcome depends on the timing of events. Often occurs when multiple threads access shared data.' },
              { term: 'Starvation', def: 'When a process never gets the resources it needs because others keep taking them. Not a deadlock, but still harmful.' },
              { term: 'Livelock', def: 'Processes keep changing state in response to each other but make no progress. Like two people sidestepping in a hallway.' },
              { term: 'Wait-For Graph', def: 'A directed graph showing which processes wait for which resources. A cycle in this graph = deadlock detected.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario selector */}
        <div className="flex gap-3">
          <button onClick={() => startScenario('normal')}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-[0.72rem] font-semibold transition-all duration-200
              ${scenario === 'normal' ? 'border-[#43e97b]/40 bg-[#43e97b]/10 text-[#43e97b]' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
            ✓ Normal Execution
          </button>
          <button onClick={() => startScenario('deadlock')}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-[0.72rem] font-semibold transition-all duration-200
              ${scenario === 'deadlock' ? 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
            💀 Deadlock Scenario
          </button>
        </div>

        {/* Visual state */}
        {scenario !== 'idle' && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Resource State</h2>
              <button onClick={advance} disabled={step >= steps.length - 1}
                className="px-3 py-1 rounded-lg bg-[#667eea] text-white text-[0.68rem] font-semibold disabled:opacity-40 hover:bg-[#764ba2] transition-all">
                Next Step →
              </button>
            </div>

            {/* Process boxes */}
            <div className="flex gap-4 mb-4">
              {['P1', 'P2'].map(p => (
                <div key={p} className={`flex-1 rounded-xl border p-3 transition-all duration-300
                  ${currentStep?.deadlock ? 'border-[#ef4444]/40 bg-[#ef4444]/[0.06]' : 'border-white/[0.08] bg-white/[0.03]'}`}>
                  <div className="text-[0.7rem] font-bold text-white mb-1.5">{p === 'P1' ? '🏢 Process 1' : '🏭 Process 2'}</div>
                  <div className="text-[0.6rem] text-white/40 mb-1">Holds:</div>
                  <div className="flex gap-1 flex-wrap min-h-[20px]">
                    {locks[p].map(r => (
                      <span key={r} className="text-[0.58rem] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${RESOURCE_COLORS[r]}20`, color: RESOURCE_COLORS[r], border: `1px solid ${RESOURCE_COLORS[r]}40` }}>
                        🔒 {r}
                      </span>
                    ))}
                    {locks[p].length === 0 && <span className="text-[0.58rem] text-white/25">— none —</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Wait arrows (deadlock state) */}
            {currentStep?.deadlock && (
              <div className="bg-[#ef4444]/[0.08] border border-[#ef4444]/25 rounded-lg px-3 py-2 mb-3 text-center">
                <div className="text-[0.72rem] font-bold text-[#ef4444]">💀 Circular Wait Detected!</div>
                <div className="text-[0.62rem] text-[#ef4444]/60 mt-0.5">P1 → waits for File (held by P2) → P2 waits for Database (held by P1) → P1</div>
              </div>
            )}

            {/* Step log */}
            <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3">
              <div className={`text-[0.72rem] font-bold mb-1 ${currentStep?.deadlock ? 'text-[#ef4444]' : 'text-[#667eea]'}`}>
                Step {step + 1}: {currentStep?.action}
              </div>
              <p className="text-[0.65rem] text-white/45">{currentStep?.desc}</p>
            </div>

            {/* Progress */}
            <div className="flex gap-1 mt-3">
              {steps.map((_, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300
                  ${i <= step ? (steps[step]?.deadlock ? 'bg-[#ef4444]' : 'bg-[#43e97b]') : 'bg-white/[0.08]'}`} />
              ))}
            </div>
          </div>
        )}

        {/* Prevention strategies */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Prevention Strategies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: '📋 Resource Ordering',   desc: 'Always acquire locks in a consistent global order. Breaks circular wait.' },
              { name: '⏱️ Timeout',              desc: 'If a process waits too long, abort and release its locks.' },
              { name: '📊 Detection & Recovery', desc: 'Detect deadlock using wait-for graph. Kill one process to break cycle.' },
              { name: '🔄 Lock-Free Algorithms', desc: 'Use atomic operations (CAS) instead of locks entirely.' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/[0.06]">
                <div className="text-[0.7rem] font-bold text-white mb-0.5">{s.name}</div>
                <p className="text-[0.63rem] text-white/45">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Conditions (Coffman) */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Coffman's 4 Conditions</h2>
          <p className="text-[0.68rem] text-white/40 mb-3">ALL four must be true for a deadlock to occur. Break any one → no deadlock.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ['Mutual Exclusion', 'Only one process can hold a resource'],
              ['Hold & Wait',      'Process holds one resource while waiting for another'],
              ['No Preemption',    'Resources cannot be forcibly taken away'],
              ['Circular Wait',    'A cycle of processes each waiting on the next'],
            ].map(([name, desc], i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg p-2.5 border border-[#ef4444]/15 text-center">
                <div className="text-[0.65rem] font-bold text-[#ef4444] mb-1">{i + 1}. {name}</div>
                <div className="text-[0.58rem] text-white/40">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
