import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const STAGES = [
  { id: 'IF', name: 'Fetch', color: '#667eea', desc: 'Fetch instruction from memory' },
  { id: 'ID', name: 'Decode', color: '#4facfe', desc: 'Decode instruction & read registers' },
  { id: 'EX', name: 'Execute', color: '#ffd93d', desc: 'Perform ALU operation' },
  { id: 'MEM', name: 'Memory', color: '#f093fb', desc: 'Access data memory (if needed)' },
  { id: 'WB', name: 'Write Back', color: '#43e97b', desc: 'Write result to register' },
];

const INSTRUCTIONS = ['ADD R1, R2', 'SUB R3, R4', 'MUL R5, R6', 'AND R7, R8', 'OR R9, R10'];

export default function CPUPipeliningDemo({ onBack }) {
  const [mode, setMode] = useState(null); // null | 'sequential' | 'pipelined'
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // For sequential: each instruction takes 5 cycles, total = 5 * 5 = 25 cycles
  // For pipelined: first completes at cycle 5, then one per cycle, total = 5 + 4 = 9 cycles

  const maxCycles = mode === 'sequential' ? 25 : 9;

  const runSimulation = (type) => {
    setMode(type);
    setCycle(0);
    setRunning(true);

    let c = 0;
    intervalRef.current = setInterval(() => {
      c++;
      setCycle(c);
      const maxC = type === 'sequential' ? 25 : 9;
      if (c >= maxC) {
        clearInterval(intervalRef.current);
        setRunning(false);
      }
    }, 300);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  // Get current stage for each instruction at current cycle
  const getInstructionState = (instrIdx) => {
    if (mode === 'sequential') {
      // Each instruction occupies 5 cycles sequentially
      const startCycle = instrIdx * 5 + 1;
      const endCycle = startCycle + 4;
      if (cycle < startCycle) return { stage: null, status: 'waiting' };
      if (cycle > endCycle) return { stage: null, status: 'done' };
      const stageIdx = cycle - startCycle;
      return { stage: STAGES[stageIdx]?.id, status: 'active' };
    } else {
      // Pipelined: each instruction starts 1 cycle after previous
      const startCycle = instrIdx + 1;
      const endCycle = startCycle + 4;
      if (cycle < startCycle) return { stage: null, status: 'waiting' };
      if (cycle > endCycle) return { stage: null, status: 'done' };
      const stageIdx = cycle - startCycle;
      return { stage: STAGES[stageIdx]?.id, status: 'active' };
    }
  };

  const allDone = cycle >= maxCycles;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#fd79a8] to-[#e84393] bg-clip-text text-transparent">CPU Pipelining</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Pipelining lets the CPU work on <span className="text-[#fd79a8] font-semibold">multiple instructions simultaneously</span> — while one instruction is being executed, the next is being decoded, and the next is being fetched. Like an assembly line for instructions.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why it matters:</span> Without pipelining, each instruction would take 5 cycles, and we'd process 1 instruction every 5 cycles. With pipelining, after the initial fill-up, we complete 1 instruction per cycle — a 5x throughput improvement. Modern CPUs have 10-20+ pipeline stages, though deeper pipelines increase hazard complexity.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Pipeline Stage', def: 'One step in instruction processing. Classic RISC has 5: Fetch, Decode, Execute, Memory, Write Back.' },
              { term: 'Throughput', def: 'Instructions completed per cycle. Ideal pipelined throughput is 1 IPC (instruction per cycle).' },
              { term: 'Pipeline Stall', def: 'A bubble where no useful work happens. Caused by hazards. Wastes cycles and reduces throughput.' },
              { term: 'Forwarding', def: 'Bypass technique that sends results directly to the next instruction without waiting for write-back.' },
              { term: 'Branch Prediction', def: 'Hardware that guesses which way branches go. Modern predictors are 95%+ accurate.' },
              { term: 'Superscalar', def: 'CPUs that can execute multiple instructions per cycle using parallel pipelines. 2-wide, 4-wide, etc.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#fd79a8]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex gap-3">
          <button onClick={() => runSimulation('sequential')} disabled={running}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-left transition-all duration-200
              ${mode === 'sequential' ? 'border-[#ef4444]/40 bg-[#ef4444]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
            <div className="text-[0.72rem] font-bold" style={{ color: mode === 'sequential' ? '#ef4444' : 'rgba(255,255,255,0.6)' }}>🐢 Sequential (No Pipeline)</div>
            <div className="text-[0.6rem] text-white/35 mt-0.5">Each instruction completes before next starts</div>
            <div className="text-[0.58rem] text-white/25 mt-0.5">5 instructions × 5 stages = 25 cycles</div>
          </button>
          <button onClick={() => runSimulation('pipelined')} disabled={running}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-left transition-all duration-200
              ${mode === 'pipelined' ? 'border-[#43e97b]/40 bg-[#43e97b]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
            <div className="text-[0.72rem] font-bold" style={{ color: mode === 'pipelined' ? '#43e97b' : 'rgba(255,255,255,0.6)' }}>⚡ Pipelined</div>
            <div className="text-[0.6rem] text-white/35 mt-0.5">Instructions overlap — assembly line style</div>
            <div className="text-[0.58rem] text-white/25 mt-0.5">5 stages + 4 more = 9 cycles total</div>
          </button>
        </div>

        {/* Pipeline visualization */}
        {mode && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">
                {mode === 'sequential' ? '🐢 Sequential' : '⚡ Pipelined'} Execution
              </h2>
              <div className="flex items-center gap-2">
                <span className={`text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full ${allDone ? 'bg-[#43e97b]/15 text-[#43e97b]' : 'bg-white/[0.06] text-white/50'}`}>
                  Cycle {cycle} / {maxCycles}
                </span>
                <button onClick={() => runSimulation(mode)} disabled={running}
                  className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-[0.62rem] text-white/50 hover:text-white/70 transition-all disabled:opacity-40">
                  ↺ Restart
                </button>
              </div>
            </div>

            {/* Stage headers */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              <div className="text-[0.6rem] font-bold text-white/30">Instruction</div>
              {STAGES.map(stage => (
                <div key={stage.id} className="text-[0.58rem] font-bold text-center" style={{ color: stage.color }}>{stage.name}</div>
              ))}
            </div>

            {/* Pipeline grid */}
            <div className="flex flex-col gap-1">
              {INSTRUCTIONS.map((instr, i) => {
                const state = getInstructionState(i);
                return (
                  <div key={i} className="grid grid-cols-6 gap-1">
                    <div className={`text-[0.62rem] font-mono flex items-center ${state.status === 'done' ? 'text-[#43e97b]' : state.status === 'active' ? 'text-white/70' : 'text-white/30'}`}>
                      {state.status === 'done' && '✓ '}{instr}
                    </div>
                    {STAGES.map(stage => {
                      const isActive = state.stage === stage.id;
                      return (
                        <div key={stage.id}
                          className={`h-7 rounded border flex items-center justify-center text-[0.55rem] font-bold transition-all duration-200
                            ${isActive ? `border-white/[0.3] bg-[${stage.color}]/30 scale-105 shadow-[0_0_8px_${stage.color}30]` : 'border-white/[0.06] bg-white/[0.02]'}`}
                          style={{
                            backgroundColor: isActive ? `${stage.color}30` : undefined,
                            borderColor: isActive ? `${stage.color}60` : undefined,
                            color: isActive ? stage.color : 'rgba(255,255,255,0.15)',
                          }}>
                          {isActive ? stage.id : '·'}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Result */}
            {allDone && (
              <div className={`mt-3 text-center py-2 rounded-lg border ${mode === 'sequential' ? 'border-[#ef4444]/20 bg-[#ef4444]/[0.06]' : 'border-[#43e97b]/25 bg-[#43e97b]/[0.08]'}`}>
                <span className={`text-[0.72rem] font-bold ${mode === 'sequential' ? 'text-[#ef4444]' : 'text-[#43e97b]'}`}>
                  {mode === 'sequential'
                    ? `Completed in 25 cycles (sequential)`
                    : `Completed in 9 cycles — ${((1 - 9 / 25) * 100).toFixed(0)}% faster!`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Stages explained */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">The 5-Stage RISC Pipeline</h2>
          <div className="flex flex-col gap-1.5">
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${stage.color}20`, color: stage.color }}>{i + 1}</span>
                <div className="flex-1">
                  <span className="text-[0.68rem] font-bold" style={{ color: stage.color }}>{stage.id}</span>
                  <span className="text-[0.68rem] text-white/50"> — {stage.name}</span>
                  <p className="text-[0.6rem] text-white/35">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hazards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'Data Hazard', icon: '⚠️', color: '#ffd93d', desc: 'Instruction needs data from a previous one not yet finished. Fix: forwarding or stalls.' },
            { name: 'Control Hazard', icon: '🔀', color: '#f093fb', desc: 'Branch instructions change the program counter. Fix: branch prediction.' },
            { name: 'Structural Hazard', icon: '🏗️', color: '#4facfe', desc: 'Two instructions need the same hardware resource. Fix: resource duplication.' },
          ].map((hazard, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{hazard.icon}</span>
                <h3 className="text-[0.68rem] font-bold" style={{ color: hazard.color }}>{hazard.name}</h3>
              </div>
              <p className="text-[0.6rem] text-white/45">{hazard.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
