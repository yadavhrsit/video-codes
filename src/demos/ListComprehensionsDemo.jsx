import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXAMPLES = [
  {
    id: 'basic',
    title: 'Basic List Comprehension',
    input: [1, 2, 3, 4, 5],
    traditional: `result = []\nfor x in numbers:\n    result.append(x * 2)`,
    comprehension: `result = [x * 2 for x in numbers]`,
    transform: x => x * 2,
    desc: 'Square each number — one-liner vs traditional loop.',
  },
  {
    id: 'filter',
    title: 'With Condition (Filter)',
    input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    traditional: `result = []\nfor x in numbers:\n    if x % 2 == 0:\n        result.append(x)`,
    comprehension: `result = [x for x in numbers if x % 2 == 0]`,
    transform: x => x % 2 === 0 ? x : null,
    desc: 'Filter even numbers only using an if condition.',
  },
  {
    id: 'transform',
    title: 'Transform & Filter',
    input: [1, 2, 3, 4, 5, 6, 7, 8],
    traditional: `result = []\nfor x in numbers:\n    if x > 3:\n        result.append(x ** 2)`,
    comprehension: `result = [x**2 for x in numbers if x > 3]`,
    transform: x => x > 3 ? x * x : null,
    desc: 'Square numbers that are greater than 3.',
  },
  {
    id: 'nested',
    title: 'Nested (Flatten)',
    input: [[1, 2], [3, 4], [5, 6]],
    traditional: `result = []\nfor sublist in matrix:\n    for x in sublist:\n        result.append(x)`,
    comprehension: `result = [x for row in matrix for x in row]`,
    transform: null, // special case
    desc: 'Flatten a 2D list into a 1D list.',
  },
];

export default function ListComprehensionsDemo({ onBack }) {
  const [selected, setSelected] = useState(0);
  const example = EXAMPLES[selected];

  // Compute result
  let result;
  if (example.id === 'nested') {
    result = example.input.flat();
  } else {
    result = example.input.map(example.transform).filter(x => x !== null);
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffd93d] to-[#ff6b6b] bg-clip-text text-transparent">List Comprehensions</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            List comprehensions are Python's way to create lists in a <span className="text-[#ffd93d] font-semibold">concise, readable single line</span>. They replace traditional for-loops for building lists — more Pythonic and often faster.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why they exist:</span> Python values readability and expressiveness. List comprehensions let you express the intent ("give me doubled values") rather than the mechanics ("create empty list, loop, append"). They're also faster because Python optimizes them internally.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Iterable', def: 'Any object you can loop over: lists, tuples, strings, range(), generators. The "for x in iterable" part.' },
              { term: 'Generator Expression', def: 'Same syntax but with () instead of []. Produces values lazily — memory efficient for large data.' },
              { term: 'Dict Comprehension', def: 'Creates dictionaries: {k: v for k, v in items}. Same concept, different output type.' },
              { term: 'Set Comprehension', def: 'Creates sets: {x for x in items}. Automatically removes duplicates.' },
              { term: 'Nested Comprehension', def: 'Multiple "for" clauses in one comprehension. Reads left-to-right like nested loops.' },
              { term: 'Filter Clause', def: 'The optional "if condition" part. Only items where condition is True get included.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#ffd93d]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example selector */}
        <div className="flex gap-2 flex-wrap">
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`px-3 py-1.5 rounded-lg border text-[0.7rem] font-medium transition-all duration-200
                ${selected === i ? 'border-[#ffd93d]/40 bg-[#ffd93d]/10 text-[#ffd93d]' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
              {ex.title}
            </button>
          ))}
        </div>

        {/* Main example */}
        <AnimatePresence mode="wait">
          <motion.div key={selected} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-white">{example.title}</h2>
            </div>
            <p className="text-[0.68rem] text-white/45 mb-3">{example.desc}</p>

            {/* Input */}
            <div className="mb-3">
              <div className="text-[0.62rem] font-bold text-white/35 uppercase tracking-wider mb-1">Input</div>
              <div className="bg-[#0a0a14] border border-white/[0.06] rounded-lg px-3 py-1.5">
                <code className="text-[0.72rem] text-[#a5f3fc] font-mono">
                  {example.id === 'nested' ? JSON.stringify(example.input) : `[${example.input.join(', ')}]`}
                </code>
              </div>
            </div>

            {/* Traditional vs Comprehension */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-[0.62rem] font-bold text-[#ef4444] uppercase tracking-wider mb-1">❌ Traditional Loop</div>
                <div className="bg-[#0a0a14] border border-[#ef4444]/15 rounded-lg p-3">
                  <pre className="text-[0.7rem] text-white/55 font-mono leading-relaxed whitespace-pre-wrap">{example.traditional}</pre>
                </div>
              </div>
              <div>
                <div className="text-[0.62rem] font-bold text-[#43e97b] uppercase tracking-wider mb-1">✓ List Comprehension</div>
                <div className="bg-[#0a0a14] border border-[#43e97b]/25 rounded-lg p-3">
                  <pre className="text-[0.72rem] text-[#43e97b] font-mono font-semibold leading-relaxed whitespace-pre-wrap">{example.comprehension}</pre>
                </div>
              </div>
            </div>

            {/* Output */}
            <div>
              <div className="text-[0.62rem] font-bold text-white/35 uppercase tracking-wider mb-1">Output</div>
              <div className="bg-[#0a0a14] border border-[#43e97b]/20 rounded-lg px-3 py-1.5 flex gap-1.5 flex-wrap">
                {result.map((v, i) => (
                  <span key={i} className="text-[0.72rem] font-mono font-bold text-[#43e97b] bg-[#43e97b]/10 px-2 py-0.5 rounded">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Syntax breakdown */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Syntax Anatomy</h2>
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4 text-center mb-3">
            <code className="text-[0.82rem] font-mono">
              <span className="text-[#f093fb]">[</span>
              <span className="text-[#43e97b] font-bold">expression</span>
              <span className="text-white/50"> for </span>
              <span className="text-[#4facfe] font-bold">item</span>
              <span className="text-white/50"> in </span>
              <span className="text-[#ffd93d] font-bold">iterable</span>
              <span className="text-white/50"> if </span>
              <span className="text-[#667eea] font-bold">condition</span>
              <span className="text-[#f093fb]">]</span>
            </code>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ['expression', '#43e97b', 'What to put in the list (transformation)'],
              ['item',       '#4facfe', 'The loop variable'],
              ['iterable',   '#ffd93d', 'The collection to loop over'],
              ['condition',  '#667eea', 'Optional filter (if clause)'],
            ].map(([name, color, desc], i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg p-2 text-center border border-white/[0.04]">
                <div className="text-[0.65rem] font-bold mb-0.5" style={{ color }}>{name}</div>
                <div className="text-[0.58rem] text-white/40">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">✓ Use When</h3>
            <ul className="flex flex-col gap-1.5">
              {['Simple transformation of a list', 'Filtering elements', 'Creating new lists concisely', 'Result fits on one readable line'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#43e97b] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#ef4444] mb-2">✗ Avoid When</h3>
            <ul className="flex flex-col gap-1.5">
              {['Logic is complex (use regular loop)', 'Nested loops > 2 levels deep', 'Side effects needed', 'Readability would suffer'].map((item, i) => (
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
