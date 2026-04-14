import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TASKS = [
  { id: 'A', name: 'Fetch Users API', duration: 3, icon: '👥' },
  { id: 'B', name: 'Fetch Products API', duration: 2, icon: '📦' },
  { id: 'C', name: 'Fetch Orders API', duration: 4, icon: '📋' },
];

// Sync simulation: tasks run one after another
// Async simulation: tasks run concurrently

export default function AsyncPythonDemo({ onBack }) {
  const [mode, setMode] = useState(null); // null | 'sync' | 'async'
  const [elapsed, setElapsed] = useState(0);
  const [taskProgress, setTaskProgress] = useState({ A: 0, B: 0, C: 0 });
  const [taskStatus, setTaskStatus] = useState({ A: 'pending', B: 'pending', C: 'pending' }); // pending | running | done
  const intervalRef = useRef(null);
  const startTime = useRef(null);
  const animFrame = useRef(null);

  const totalSync = TASKS.reduce((sum, t) => sum + t.duration, 0);
  const totalAsync = Math.max(...TASKS.map(t => t.duration));

  const runSimulation = (type) => {
    setMode(type);
    setElapsed(0);
    setTaskProgress({ A: 0, B: 0, C: 0 });
    setTaskStatus({ A: 'pending', B: 'pending', C: 'pending' });
    startTime.current = Date.now();

    let tick = 0;
    intervalRef.current = setInterval(() => {
      tick += 0.1;
      setElapsed(tick);

      const newProgress = {};
      const newStatus = {};

      if (type === 'sync') {
        // Sequential: A runs 0-3, B runs 3-5, C runs 5-9
        let cumulative = 0;
        TASKS.forEach(task => {
          const start = cumulative;
          const end = cumulative + task.duration;
          cumulative = end;

          if (tick < start) {
            newProgress[task.id] = 0;
            newStatus[task.id] = 'pending';
          } else if (tick < end) {
            newProgress[task.id] = ((tick - start) / task.duration) * 100;
            newStatus[task.id] = 'running';
          } else {
            newProgress[task.id] = 100;
            newStatus[task.id] = 'done';
          }
        });
      } else {
        // Concurrent: all start at 0
        TASKS.forEach(task => {
          if (tick < task.duration) {
            newProgress[task.id] = (tick / task.duration) * 100;
            newStatus[task.id] = 'running';
          } else {
            newProgress[task.id] = 100;
            newStatus[task.id] = 'done';
          }
        });
      }

      setTaskProgress(newProgress);
      setTaskStatus(newStatus);

      const totalTime = type === 'sync' ? totalSync : totalAsync;
      if (tick >= totalTime) {
        clearInterval(intervalRef.current);
      }
    }, 100);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const allDone = Object.values(taskStatus).every(s => s === 'done');
  const totalTime = mode === 'sync' ? totalSync : totalAsync;

  const TASK_COLORS = { A: '#667eea', B: '#43e97b', C: '#f093fb' };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffd93d] to-[#ff6b6b] bg-clip-text text-transparent">Async/Await Python</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Async/await lets Python handle <span className="text-[#ffd93d] font-semibold">multiple I/O-bound tasks concurrently</span> without threads. While one task waits for a network response, others continue executing — drastically cutting total time.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The key insight:</span> Most web applications spend 90% of their time waiting — for databases, APIs, file reads. Async lets a single thread handle thousands of concurrent connections by switching between tasks during these waits. It's how Node.js, Go, and modern Python handle massive scale.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Coroutine', def: 'A function defined with "async def" that can be paused and resumed. Not the same as a thread.' },
              { term: 'Event Loop', def: 'The scheduler that decides which coroutine runs next. Created automatically when you call asyncio.run().' },
              { term: 'Blocking', def: 'Code that waits and prevents other code from running. time.sleep() blocks; asyncio.sleep() does not.' },
              { term: 'aiohttp', def: 'An async HTTP client/server library. Use instead of requests for async code.' },
              { term: 'Task', def: 'A wrapped coroutine scheduled for execution. Created with asyncio.create_task() or gather().' },
              { term: 'GIL', def: 'Global Interpreter Lock — Python can only run one thread at a time. Async avoids this by using one thread efficiently.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#ffd93d]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex gap-3">
          <button onClick={() => runSimulation('sync')}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-left transition-all duration-200
              ${mode === 'sync' ? 'border-[#ef4444]/40 bg-[#ef4444]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
            <div className="text-[0.72rem] font-bold" style={{ color: mode === 'sync' ? '#ef4444' : 'rgba(255,255,255,0.6)' }}>🐢 Synchronous</div>
            <div className="text-[0.6rem] text-white/35 mt-0.5">Tasks run one after another</div>
            <div className="text-[0.6rem] text-white/25 mt-0.5">Total: {totalSync}s</div>
          </button>
          <button onClick={() => runSimulation('async')}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-left transition-all duration-200
              ${mode === 'async' ? 'border-[#43e97b]/40 bg-[#43e97b]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
            <div className="text-[0.72rem] font-bold" style={{ color: mode === 'async' ? '#43e97b' : 'rgba(255,255,255,0.6)' }}>⚡ Asynchronous</div>
            <div className="text-[0.6rem] text-white/35 mt-0.5">Tasks run concurrently</div>
            <div className="text-[0.6rem] text-white/25 mt-0.5">Total: {totalAsync}s</div>
          </button>
        </div>

        {/* Simulation */}
        {mode && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">
                {mode === 'sync' ? '🐢 Sequential' : '⚡ Concurrent'} Execution
              </h2>
              <div className="flex items-center gap-2">
                <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${allDone ? 'bg-[#43e97b]/15 text-[#43e97b]' : 'bg-white/[0.06] text-white/50'}`}>
                  {elapsed.toFixed(1)}s / {totalTime}s
                </span>
                <button onClick={() => runSimulation(mode)}
                  className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-[0.62rem] text-white/50 hover:text-white/70 transition-all">
                  ↺ Replay
                </button>
              </div>
            </div>

            {/* Task bars */}
            <div className="flex flex-col gap-3 mb-3">
              {TASKS.map(task => {
                const progress = taskProgress[task.id] || 0;
                const status = taskStatus[task.id];
                const color = TASK_COLORS[task.id];
                return (
                  <div key={task.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{task.icon}</span>
                        <span className="text-[0.68rem] font-bold text-white/70">{task.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.58rem] text-white/30">{task.duration}s</span>
                        <span className={`text-[0.58rem] font-bold capitalize px-1.5 py-0.3 rounded-full
                          ${status === 'done' ? 'bg-[#43e97b]/15 text-[#43e97b]' : status === 'running' ? 'bg-[#ffd93d]/15 text-[#ffd93d]' : 'bg-white/[0.06] text-white/30'}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                    <div className="h-4 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-100" style={{ width: `${progress}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {allDone && (
              <div className={`text-center py-2 rounded-lg border ${mode === 'sync' ? 'border-[#ef4444]/20 bg-[#ef4444]/[0.06]' : 'border-[#43e97b]/25 bg-[#43e97b]/[0.08]'}`}>
                <span className={`text-[0.7rem] font-bold ${mode === 'sync' ? 'text-[#ef4444]' : 'text-[#43e97b]'}`}>
                  {mode === 'sync' ? `Completed in ${totalSync}s (sequential)` : `Completed in ${totalAsync}s — ${((1 - totalAsync / totalSync) * 100).toFixed(0)}% faster than sync!`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Code comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#ef4444] mb-2">🐢 Synchronous Code</h3>
            <div className="bg-[#0a0a14] border border-white/[0.06] rounded-lg p-3">
              <pre className="text-[0.65rem] text-white/55 font-mono leading-relaxed whitespace-pre-wrap">{`def fetch_all():
    users = fetch_users()    # waits 3s
    products = fetch_products()  # waits 2s
    orders = fetch_orders()  # waits 4s
    return users, products, orders
# Total: 3 + 2 + 4 = 9 seconds`}</pre>
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">⚡ Async Code</h3>
            <div className="bg-[#0a0a14] border border-[#43e97b]/15 rounded-lg p-3">
              <pre className="text-[0.65rem] text-[#a5f3fc] font-mono leading-relaxed whitespace-pre-wrap">{`async def fetch_all():
    results = await asyncio.gather(
        fetch_users(),      # all 3 start
        fetch_products(),   # simultaneously!
        fetch_orders(),
    )
    return results
# Total: max(3,2,4) = 4 seconds`}</pre>
            </div>
          </div>
        </div>

        {/* Key concepts */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Key Concepts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'async def', color: '#ffd93d', desc: 'Declares a coroutine function' },
              { name: 'await', color: '#4facfe', desc: 'Suspends execution until result' },
              { name: 'asyncio.gather', color: '#43e97b', desc: 'Run multiple coroutines at once' },
              { name: 'Event Loop', color: '#f093fb', desc: 'Single thread managing all tasks' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.06] text-center">
                <code className="text-[0.68rem] font-mono font-bold" style={{ color: item.color }}>{item.name}</code>
                <p className="text-[0.58rem] text-white/40 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* When to use */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">✓ Use Async When</h3>
            <ul className="flex flex-col gap-1.5">
              {['Many network/API calls', 'I/O-bound workloads', 'Web servers (FastAPI, aiohttp)', 'Real-time data processing'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#43e97b] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#ef4444] mb-2">✗ Don't Use When</h3>
            <ul className="flex flex-col gap-1.5">
              {['CPU-bound tasks (use multiprocessing)', 'Simple sequential scripts', 'Libraries don\'t support async', 'Added complexity isn\'t worth it'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#ef4444] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
