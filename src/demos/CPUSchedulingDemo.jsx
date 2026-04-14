import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PROCESSES = [
  { id: 'P1', arrival: 0,  burst: 4, color: '#667eea', name: 'Browser' },
  { id: 'P2', arrival: 1,  burst: 3, color: '#4facfe', name: 'Email'   },
  { id: 'P3', arrival: 2,  burst: 5, color: '#43e97b', name: 'Game'    },
  { id: 'P4', arrival: 4,  burst: 2, color: '#f093fb', name: 'Music'   },
];

// Generate Gantt charts for each algorithm
function computeFCFS(procs) {
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival);
  let time = 0;
  return sorted.map(p => {
    const start = Math.max(time, p.arrival);
    time = start + p.burst;
    return { id: p.id, start, end: time, color: p.color, name: p.name };
  });
}

function computeSJF(procs) {
  const remaining = procs.map(p => ({ ...p, remaining: p.burst }));
  let time = 0;
  const result = [];
  while (remaining.some(p => p.remaining > 0)) {
    const available = remaining.filter(p => p.arrival <= time && p.remaining > 0);
    if (available.length === 0) { time++; continue; }
    available.sort((a, b) => a.remaining - b.remaining);
    const chosen = available[0];
    result.push({ id: chosen.id, start: time, end: time + chosen.remaining, color: chosen.color, name: chosen.name });
    time += chosen.remaining;
    chosen.remaining = 0;
  }
  return result;
}

function computeRoundRobin(procs, quantum = 2) {
  const queue = procs.map(p => ({ ...p, remaining: p.burst }));
  let time = 0;
  const result = [];
  const ready = [];
  let idx = 0;

  // Add initially arrived processes
  queue.forEach(p => { if (p.arrival <= 0) ready.push(p); });

  while (ready.length > 0 || queue.some(p => p.remaining > 0)) {
    if (ready.length === 0) { time++; queue.forEach(p => { if (p.arrival === time && p.remaining > 0 && !ready.includes(p)) ready.push(p); }); continue; }
    const current = ready.shift();
    const run = Math.min(quantum, current.remaining);
    result.push({ id: current.id, start: time, end: time + run, color: current.color, name: current.name });
    time += run;
    current.remaining -= run;
    // Add newly arrived processes
    queue.forEach(p => { if (p.arrival <= time && p.remaining > 0 && !ready.includes(p) && p !== current) ready.push(p); });
    if (current.remaining > 0) ready.push(current);
  }
  return result;
}

const ALGORITHMS = [
  { id: 'fcfs', label: 'FCFS',          desc: 'First Come First Served — processes run in arrival order. Simple but can cause long waits.' },
  { id: 'sjf',  label: 'SJF',           desc: 'Shortest Job First — picks the process with the shortest burst. Minimizes average wait time.' },
  { id: 'rr',   label: 'Round Robin',   desc: 'Each process gets a fixed time quantum (2 units). Prevents starvation, fair for all.' },
];

export default function CPUSchedulingDemo({ onBack }) {
  const [algorithm, setAlgorithm] = useState('fcfs');

  const ganttData = {
    fcfs: computeFCFS(PROCESSES),
    sjf:  computeSJF(PROCESSES),
    rr:   computeRoundRobin(PROCESSES, 2),
  };

  const gantt = ganttData[algorithm];
  const totalTime = Math.max(...gantt.map(g => g.end));

  // Compute stats
  const stats = PROCESSES.map(p => {
    const segments = gantt.filter(g => g.id === p.id);
    const completion = Math.max(...segments.map(s => s.end));
    const turnaround = completion - p.arrival;
    const waiting = turnaround - p.burst;
    return { ...p, completion, turnaround, waiting };
  });

  const avgWait = (stats.reduce((s, p) => s + p.waiting, 0) / stats.length).toFixed(1);
  const avgTurnaround = (stats.reduce((s, p) => s + p.turnaround, 0) / stats.length).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">CPU Scheduling</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            The CPU can only run <span className="text-[#667eea] font-semibold">one process at a time</span>. The scheduler decides which process runs next. Different algorithms optimize for different goals — speed, fairness, or throughput.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The fundamental problem:</span> With 100 processes wanting to run and only one CPU, who goes first? A bad scheduler can make your computer feel slow even with a fast CPU. A good scheduler keeps the system responsive while maximizing throughput.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Burst Time', def: 'How long a process needs the CPU before it blocks (for I/O) or finishes. Short bursts = I/O-bound; long bursts = CPU-bound.' },
              { term: 'Turnaround Time', def: 'Total time from arrival to completion. Includes waiting + executing. Lower is better.' },
              { term: 'Waiting Time', def: 'Time spent in the ready queue, not running. The time a process "wastes" waiting for its turn.' },
              { term: 'Preemption', def: 'Forcibly taking the CPU from a running process. Required for Round Robin; optional for others.' },
              { term: 'Context Switch', def: 'Saving one process\'s state and loading another\'s. Has overhead — too many switches slow things down.' },
              { term: 'Starvation', def: 'When a process never gets CPU time because others keep jumping ahead. SJF can cause this.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process table */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Process Queue</h2>
          <div className="flex gap-2 flex-wrap">
            {PROCESSES.map(p => (
              <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white/[0.03]" style={{ borderColor: `${p.color}30` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                <span className="text-[0.72rem] font-bold" style={{ color: p.color }}>{p.id}</span>
                <span className="text-[0.62rem] text-white/40">{p.name}</span>
                <span className="text-[0.58rem] text-white/30">arr:{p.arrival} burst:{p.burst}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm selector */}
        <div className="flex gap-2">
          {ALGORITHMS.map(alg => (
            <button key={alg.id} onClick={() => setAlgorithm(alg.id)}
              className={`flex-1 px-3 py-2 rounded-xl border text-[0.72rem] font-semibold text-left transition-all duration-200
                ${algorithm === alg.id ? 'border-[#667eea]/40 bg-[#667eea]/10 text-[#667eea]' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
              {alg.label}
            </button>
          ))}
        </div>

        {/* Algorithm description */}
        <div className="bg-[#667eea]/[0.06] border border-[#667eea]/20 rounded-xl px-4 py-3">
          <p className="text-[0.72rem] text-white/60">{ALGORITHMS.find(a => a.id === algorithm)?.desc}</p>
        </div>

        {/* Gantt chart */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Gantt Chart</h2>
          <div className="flex rounded-lg overflow-hidden border border-white/[0.06] mb-2">
            {gantt.map((seg, i) => {
              const width = ((seg.end - seg.start) / totalTime) * 100;
              return (
                <div key={i} className="relative flex items-center justify-center text-[0.6rem] font-bold text-white transition-all duration-500"
                  style={{ width: `${width}%`, background: seg.color, minHeight: 36 }}>
                  {width > 6 && <span>{seg.id}</span>}
                </div>
              );
            })}
          </div>
          {/* Time labels */}
          <div className="flex justify-between text-[0.58rem] text-white/30">
            <span>0</span>
            {gantt.map((seg, i) => (
              <span key={i}>{seg.end}</span>
            ))}
          </div>
        </div>

        {/* Stats table */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Performance Metrics</h2>
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full text-[0.7rem]">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-3 py-1.5 text-white/35">Process</th>
                  <th className="text-left px-3 py-1.5 text-white/35">Arrival</th>
                  <th className="text-left px-3 py-1.5 text-white/35">Burst</th>
                  <th className="text-left px-3 py-1.5 text-[#43e97b]">Completion</th>
                  <th className="text-left px-3 py-1.5 text-[#ffd93d]">Turnaround</th>
                  <th className="text-left px-3 py-1.5 text-[#ef4444]">Wait</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((p, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="px-3 py-1.5 flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                      <span className="text-white/70">{p.id} ({p.name})</span>
                    </td>
                    <td className="px-3 py-1.5 text-white/50">{p.arrival}</td>
                    <td className="px-3 py-1.5 text-white/50">{p.burst}</td>
                    <td className="px-3 py-1.5 text-[#43e97b]">{p.completion}</td>
                    <td className="px-3 py-1.5 text-[#ffd93d]">{p.turnaround}</td>
                    <td className="px-3 py-1.5 text-[#ef4444]">{p.waiting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-3">
            <div className="bg-white/[0.03] rounded-lg px-3 py-2 flex-1 text-center">
              <div className="text-[0.6rem] text-white/35 uppercase tracking-wider">Avg Wait</div>
              <div className="text-lg font-bold text-[#ef4444]">{avgWait}</div>
            </div>
            <div className="bg-white/[0.03] rounded-lg px-3 py-2 flex-1 text-center">
              <div className="text-[0.6rem] text-white/35 uppercase tracking-wider">Avg Turnaround</div>
              <div className="text-lg font-bold text-[#ffd93d]">{avgTurnaround}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
