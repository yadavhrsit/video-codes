import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DECORATORS = [
  {
    id: 'basic',
    title: 'Basic Decorator',
    icon: '🎀',
    color: '#ffd93d',
    desc: 'A decorator wraps a function to extend its behavior without modifying its source code.',
    original: `def greet(name):\n    return f"Hello, {name}!"`,
    decorated: `def log_calls(func):\n    def wrapper(*args):\n        print(f"Calling {func.__name__}")\n        result = func(*args)\n        print(f"Returned: {result}")\n        return result\n    return wrapper\n\n@log_calls\ndef greet(name):\n    return f"Hello, {name}!"`,
    output: ['Calling greet', 'Returned: Hello, Alice!', '→ "Hello, Alice!"'],
  },
  {
    id: 'timer',
    title: 'Timer Decorator',
    icon: '⏱️',
    color: '#4facfe',
    desc: 'Measures how long a function takes to execute. Common in performance profiling.',
    original: `def slow_function():\n    time.sleep(2)\n    return "done"`,
    decorated: `import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        elapsed = time.time() - start\n        print(f"{func.__name__} took {elapsed:.2f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    time.sleep(2)\n    return "done"`,
    output: ['slow_function took 2.00s', '→ "done"'],
  },
  {
    id: 'cache',
    title: 'Memoize / Cache',
    icon: '💾',
    color: '#43e97b',
    desc: 'Caches results of expensive computations. If called again with same args, returns cached result instantly.',
    original: `def fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)`,
    decorated: `def memoize(func):\n    cache = {}\n    def wrapper(n):\n        if n in cache:\n            print(f"Cache HIT for {n}")\n            return cache[n]\n        print(f"Computing {n}...")\n        cache[n] = func(n)\n        return cache[n]\n    return wrapper\n\n@memoize\ndef fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)`,
    output: ['Computing 5...', 'Computing 4...', 'Computing 3...', 'Cache HIT for 2', 'Cache HIT for 1', '→ 5'],
  },
  {
    id: 'auth',
    title: 'Auth Guard',
    icon: '🔐',
    color: '#f093fb',
    desc: 'Checks if a user is authenticated before allowing access to a function. Classic real-world pattern.',
    original: `def get_dashboard():\n    return "Dashboard Data"`,
    decorated: `def require_auth(func):\n    def wrapper(*args):\n        user = get_current_user()\n        if not user:\n            return "Error: Login required"\n        print(f"Access granted to {user.name}")\n        return func(*args)\n    return wrapper\n\n@require_auth\ndef get_dashboard():\n    return "Dashboard Data"`,
    output: ['Access granted to Alice', '→ "Dashboard Data"'],
  },
];

// Visual: how decoration works step by step
const WRAP_STEPS = [
  { label: 'Original Function', code: 'def greet(name): ...', color: '#a5f3fc', desc: 'The base function' },
  { label: 'Decorator Applied', code: '@log_calls', color: '#ffd93d', desc: 'Python sees the @ syntax' },
  { label: 'Wrapper Created', code: 'greet = log_calls(greet)', color: '#f093fb', desc: 'greet now points to wrapper' },
  { label: 'Wrapper Executes', code: 'wrapper() → greet()', color: '#43e97b', desc: 'Adds behavior, then calls original' },
];

export default function DecoratorsDemo({ onBack }) {
  const [selected, setSelected] = useState(0);
  const dec = DECORATORS[selected];
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffd93d] to-[#ff6b6b] bg-clip-text text-transparent">Python Decorators</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Decorators are Python's way to <span className="text-[#ffd93d] font-semibold">modify or extend functions without changing their code</span>. They use the <code className="text-[#a5f3fc] text-[0.8rem]">@syntax</code> and are everywhere in frameworks like Flask, Django, and FastAPI.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The core idea:</span> In Python, functions are first-class objects — they can be passed as arguments and returned from other functions. A decorator is just a function that takes a function and returns a new function with added behavior. The @syntax is syntactic sugar for <code className="text-[#a5f3fc]">my_func = decorator(my_func)</code>.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'First-Class Function', def: 'Functions are objects that can be passed around, stored in variables, and returned from other functions.' },
              { term: 'Higher-Order Function', def: 'A function that takes a function as argument or returns a function. Decorators are higher-order functions.' },
              { term: 'Wrapper', def: 'The inner function inside a decorator that replaces the original. It calls the original function and adds behavior.' },
              { term: 'Closure', def: 'A function that remembers variables from its enclosing scope. Wrappers are closures that remember the original function.' },
              { term: '@functools.wraps', def: 'A decorator for your wrapper that preserves the original function\'s name, docstring, and metadata.' },
              { term: 'Decorator Factory', def: 'A function that returns a decorator. Used when you need to pass arguments to the decorator itself.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#ffd93d]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorator selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DECORATORS.map((d, i) => (
            <button key={i} onClick={() => { setSelected(i); setShowOriginal(false); }}
              className={`px-2 py-2.5 rounded-xl border text-center transition-all duration-200
                ${selected === i ? 'border-white/[0.3] bg-white/[0.07]' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
              <div className="text-lg mb-0.5">{d.icon}</div>
              <div className="text-[0.62rem] font-bold" style={{ color: selected === i ? d.color : 'rgba(255,255,255,0.5)' }}>{d.title}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          <motion.div key={selected} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{dec.icon}</span>
              <h2 className="text-base font-bold" style={{ color: dec.color }}>{dec.title}</h2>
            </div>
            <p className="text-[0.68rem] text-white/45 mb-3">{dec.desc}</p>

            {/* Code toggle */}
            <div className="flex gap-2 mb-3">
              <button onClick={() => setShowOriginal(false)}
                className={`px-3 py-1 rounded-lg border text-[0.65rem] font-bold transition-all
                  ${!showOriginal ? `border-[${dec.color}]/30 bg-[${dec.color}]/10` : 'border-white/[0.08]'}`}
                style={{ color: !showOriginal ? dec.color : 'rgba(255,255,255,0.4)', borderColor: !showOriginal ? `${dec.color}40` : undefined, backgroundColor: !showOriginal ? `${dec.color}10` : undefined }}>
                ✓ With Decorator
              </button>
              <button onClick={() => setShowOriginal(true)}
                className="px-3 py-1 rounded-lg border border-white/[0.08] text-[0.65rem] font-bold transition-all text-white/40 hover:text-white/60">
                Original Function
              </button>
            </div>

            {/* Code block */}
            <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4 mb-3">
              <pre className="text-[0.7rem] text-[#a5f3fc] font-mono leading-relaxed whitespace-pre-wrap">
                {showOriginal ? dec.original : dec.decorated}
              </pre>
            </div>

            {/* Output */}
            <div>
              <div className="text-[0.6rem] font-bold text-white/35 uppercase tracking-wider mb-1">Output</div>
              <div className="bg-[#0a0a14] border border-[#43e97b]/15 rounded-xl p-3">
                {dec.output.map((line, i) => (
                  <div key={i} className={`text-[0.7rem] font-mono ${line.startsWith('→') ? 'text-[#43e97b] font-bold mt-1' : 'text-white/50'}`}>{line}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* How decoration works */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">How It Works Under the Hood</h2>
          <div className="flex flex-col gap-1">
            {WRAP_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[0.62rem] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${step.color}20`, color: step.color }}>{i + 1}</span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <div className="text-[0.68rem] font-bold text-white/70">{step.label}</div>
                    <p className="text-[0.58rem] text-white/35">{step.desc}</p>
                  </div>
                  <code className="text-[0.65rem] font-mono text-white/45 bg-white/[0.04] px-2 py-0.5 rounded">{step.code}</code>
                </div>
                {i < WRAP_STEPS.length - 1 && <div className="w-px h-1.5 bg-white/[0.1] ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Real-world uses */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Real-World Usage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { name: '@app.route("/api")', framework: 'Flask / FastAPI', desc: 'Maps URL to handler' },
              { name: '@property', framework: 'Python Built-in', desc: 'Makes method act as attribute' },
              { name: '@staticmethod', framework: 'Python Built-in', desc: 'No-self class method' },
              { name: '@login_required', framework: 'Django', desc: 'Guards protected routes' },
              { name: '@functools.lru_cache', framework: 'Python Built-in', desc: 'Built-in memoization' },
              { name: '@pytest.fixture', framework: 'Pytest', desc: 'Test dependency injection' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5">
                <code className="text-[0.65rem] text-[#a5f3fc] font-mono font-bold">{item.name}</code>
                <div className="text-[0.55rem] text-white/30 mt-0.5">{item.framework} · {item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
