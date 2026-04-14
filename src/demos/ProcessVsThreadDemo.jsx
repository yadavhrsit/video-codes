import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TASKS = ['Compile', 'Link', 'Test', 'Deploy'];
const TASK_DURATION = 1200; // ms per task

export default function ProcessVsThreadDemo({ onBack }) {
  const [mode, setMode] = useState('idle'); // idle | process | thread
  const [processProgress, setProcessProgress] = useState({ current: -1, done: [] });
  const [threadProgress, setThreadProgress] = useState({ tasks: TASKS.map(() => ({ status: 'idle', progress: 0 })) });
  const intervalRef = useRef(null);
  const threadRefs = useRef([]);

  const reset = () => {
    clearInterval(intervalRef.current);
    threadRefs.current.forEach(t => clearInterval(t));
    setMode('idle');
    setProcessProgress({ current: -1, done: [] });
    setThreadProgress({ tasks: TASKS.map(() => ({ status: 'idle', progress: 0 })) });
  };

  const runSequential = () => {
    reset();
    setMode('process');
    let i = 0;
    setProcessProgress({ current: 0, done: [] });

    intervalRef.current = setInterval(() => {
      if (i >= TASKS.length) {
        clearInterval(intervalRef.current);
        setMode('idle');
        return;
      }
      setProcessProgress(prev => ({ current: i + 1 < TASKS.length ? i + 1 : -1, done: [...prev.done, i] }));
      i++;
    }, TASK_DURATION);
  };

  const runParallel = () => {
    reset();
    setMode('thread');

    TASKS.forEach((_, idx) => {
      let progress = 0;
      threadRefs.current[idx] = setInterval(() => {
        progress += 5;
        if (progress >= 100) {
          clearInterval(threadRefs.current[idx]);
          progress = 100;
        }
        setThreadProgress(prev => {
          const tasks = [...prev.tasks];
          tasks[idx] = { status: progress >= 100 ? 'done' : 'running', progress };
          return { tasks };
        });
      }, TASK_DURATION / 20);
    });

    // All threads finish around same time
    setTimeout(() => setMode('idle'), TASK_DURATION + 200);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      threadRefs.current.forEach(t => clearInterval(t));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Process vs Thread</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">What's the Difference?</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            A <span className="text-[#667eea] font-semibold">Process</span> is an independent program with its own memory. A <span className="text-[#f093fb] font-semibold">Thread</span> is a lightweight unit of execution within a process — threads share memory, making them faster but trickier to manage.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Real-world analogy:</span> A process is like a separate house — complete isolation, own resources, secure but expensive. A thread is like a roommate in the same house — shares kitchen/bathroom (memory), fast to communicate, but needs coordination to avoid conflicts.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Context Switch', def: 'Saving/restoring state when switching execution. Thread switches are faster than process switches.' },
              { term: 'IPC', def: 'Inter-Process Communication — how processes talk to each other. Pipes, sockets, shared memory, message queues.' },
              { term: 'Race Condition', def: 'Bug where outcome depends on thread timing. Two threads incrementing a counter can lose updates.' },
              { term: 'Mutex', def: 'Mutual exclusion lock. Only one thread can hold it at a time. Prevents race conditions on shared data.' },
              { term: 'Thread Pool', def: 'Pre-created threads waiting for work. Avoids the overhead of creating new threads for each task.' },
              { term: 'Fork', def: 'System call that creates a new process as a copy of the parent. Child gets own memory space.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-[#667eea]/20 rounded-xl p-4">
            <h3 className="text-[0.78rem] font-bold text-[#667eea] mb-3">🏢 Process</h3>
            <div className="flex flex-col gap-2">
              {[
                ['Memory', 'Own isolated memory space'],
                ['Overhead', 'High — full OS context switch'],
                ['Communication', 'IPC (pipes, sockets, shared mem)'],
                ['Crash', 'One crash doesn\'t affect others'],
                ['Example', 'Chrome: each tab is a process'],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <span className="text-[0.65rem] font-bold text-[#667eea] w-24 flex-shrink-0">{key}</span>
                  <span className="text-[0.65rem] text-white/55">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.04] border border-[#f093fb]/20 rounded-xl p-4">
            <h3 className="text-[0.78rem] font-bold text-[#f093fb] mb-3">🧵 Thread</h3>
            <div className="flex flex-col gap-2">
              {[
                ['Memory', 'Shares process memory'],
                ['Overhead', 'Low — lightweight context switch'],
                ['Communication', 'Shared variables (needs sync)'],
                ['Crash', 'One crash can kill the process'],
                ['Example', 'Web server: each request = thread'],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <span className="text-[0.65rem] font-bold text-[#f093fb] w-24 flex-shrink-0">{key}</span>
                  <span className="text-[0.65rem] text-white/55">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive simulation */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Execution Simulation</h2>
            <div className="flex gap-2">
              <button onClick={runSequential} disabled={mode !== 'idle'}
                className="px-3 py-1.5 rounded-lg bg-[#667eea] text-white text-[0.7rem] font-semibold
                           hover:bg-[#764ba2] disabled:opacity-40 transition-all duration-200">
                🏢 Sequential
              </button>
              <button onClick={runParallel} disabled={mode !== 'idle'}
                className="px-3 py-1.5 rounded-lg bg-[#f093fb] text-white text-[0.7rem] font-semibold
                           hover:bg-[#e84393] disabled:opacity-40 transition-all duration-200">
                🧵 Parallel
              </button>
              <button onClick={reset} className="px-3 py-1.5 rounded-lg border border-white/[0.15] text-white/60 text-[0.7rem] font-semibold hover:bg-white/[0.06] transition-all duration-200">
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sequential (Process) view */}
            <div>
              <div className="text-[0.65rem] font-bold text-[#667eea] mb-2 uppercase tracking-wider">🏢 Sequential (Single Process)</div>
              <div className="flex flex-col gap-1.5">
                {TASKS.map((task, i) => {
                  const isDone = processProgress.done.includes(i);
                  const isCurrent = processProgress.current === i;
                  return (
                    <div key={i} className={`rounded-lg border px-3 py-2 transition-all duration-300
                      ${isDone ? 'border-[#43e97b]/30 bg-[#43e97b]/[0.08]' : isCurrent ? 'border-[#667eea]/40 bg-[#667eea]/[0.1]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[0.7rem] font-medium text-white/70">{task}</span>
                        <span className="text-[0.58rem] text-white/30">
                          {isDone ? '✓ Done' : isCurrent ? '▶ Running' : '○ Waiting'}
                        </span>
                      </div>
                      <div className="h-1 bg-white/[0.06] rounded-full">
                        <div className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-[#43e97b]' : isCurrent ? 'bg-[#667eea]' : 'bg-transparent'}`}
                          style={{ width: isDone ? '100%' : isCurrent ? '60%' : '0%' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-[0.6rem] text-white/30">⏱️ Total: ~{TASKS.length * TASK_DURATION / 1000}s (sequential)</div>
            </div>

            {/* Parallel (Thread) view */}
            <div>
              <div className="text-[0.65rem] font-bold text-[#f093fb] mb-2 uppercase tracking-wider">🧵 Parallel (Multi-threaded)</div>
              <div className="flex flex-col gap-1.5">
                {TASKS.map((task, i) => {
                  const t = threadProgress.tasks[i];
                  return (
                    <div key={i} className={`rounded-lg border px-3 py-2 transition-all duration-200
                      ${t.status === 'done' ? 'border-[#43e97b]/30 bg-[#43e97b]/[0.08]' : t.status === 'running' ? 'border-[#f093fb]/40 bg-[#f093fb]/[0.08]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[0.7rem] font-medium text-white/70">Thread {i + 1}: {task}</span>
                        <span className="text-[0.58rem] text-white/30">{Math.round(t.progress)}%</span>
                      </div>
                      <div className="h-1 bg-white/[0.06] rounded-full">
                        <div className="h-full rounded-full transition-all duration-100"
                          style={{ width: `${t.progress}%`, background: t.status === 'done' ? '#43e97b' : '#f093fb' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-[0.6rem] text-white/30">⏱️ Total: ~{TASK_DURATION / 1000}s (all at once)</div>
            </div>
          </div>
        </div>

        {/* Memory model diagram */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Memory Model</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Process memory */}
            <div>
              <div className="text-[0.68rem] font-bold text-[#667eea] mb-2">🏢 Two Processes (Isolated)</div>
              <div className="flex gap-3">
                {['Process A', 'Process B'].map((name, i) => (
                  <div key={i} className="flex-1 border border-[#667eea]/25 rounded-lg p-2 bg-[#667eea]/[0.05]">
                    <div className="text-[0.6rem] font-bold text-[#667eea] text-center mb-1.5">{name}</div>
                    {['Stack', 'Heap', 'Code'].map(seg => (
                      <div key={seg} className="text-[0.55rem] text-center px-1 py-0.5 rounded mb-0.5 bg-white/[0.06] text-white/50">{seg}</div>
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-[0.58rem] text-white/30 mt-1.5">No shared memory → safe but slow IPC</p>
            </div>
            {/* Thread memory */}
            <div>
              <div className="text-[0.68rem] font-bold text-[#f093fb] mb-2">🧵 Two Threads (Shared)</div>
              <div className="border border-[#f093fb]/25 rounded-lg p-2 bg-[#f093fb]/[0.05]">
                <div className="text-[0.6rem] font-bold text-[#f093fb] text-center mb-1.5">One Process</div>
                <div className="flex gap-2 mb-1.5">
                  {['Thread 1', 'Thread 2'].map((name, i) => (
                    <div key={i} className="flex-1 border border-[#f093fb]/20 rounded px-1.5 py-0.5">
                      <div className="text-[0.52rem] text-center text-white/50 mb-0.5">{name}</div>
                      <div className="text-[0.48rem] text-center bg-white/[0.06] rounded px-1 py-0.3 text-white/40">Stack</div>
                    </div>
                  ))}
                </div>
                <div className="text-[0.55rem] text-center px-1 py-0.5 rounded bg-[#43e97b]/[0.12] text-[#43e97b] border border-[#43e97b]/20">Shared: Heap + Code + Data</div>
              </div>
              <p className="text-[0.58rem] text-white/30 mt-1.5">Shared memory → fast but needs synchronization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
