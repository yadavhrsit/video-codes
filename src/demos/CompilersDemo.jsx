import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SOURCE_CODE = 'x = 5 + 3 * 2';

const PHASES = [
  {
    id: 'source',
    name: 'Source Code',
    icon: '📝',
    color: '#667eea',
    output: 'x = 5 + 3 * 2',
    desc: 'The original program written by the developer in a high-level language.',
  },
  {
    id: 'lexer',
    name: 'Lexical Analysis',
    icon: '🔤',
    color: '#4facfe',
    output: [
      { type: 'IDENTIFIER', value: 'x' },
      { type: 'OPERATOR',   value: '=' },
      { type: 'NUMBER',     value: '5' },
      { type: 'OPERATOR',   value: '+' },
      { type: 'NUMBER',     value: '3' },
      { type: 'OPERATOR',   value: '*' },
      { type: 'NUMBER',     value: '2' },
    ],
    desc: 'The lexer breaks source code into tokens (the smallest meaningful units).',
  },
  {
    id: 'parser',
    name: 'Parsing',
    icon: '🌳',
    color: '#43e97b',
    output: {
      type: 'Assignment', left: 'x', right: {
        type: 'BinaryOp', op: '+', left: '5', right: {
          type: 'BinaryOp', op: '*', left: '3', right: '2'
        }
      }
    },
    desc: 'The parser builds an Abstract Syntax Tree (AST) that respects operator precedence.',
  },
  {
    id: 'optimize',
    name: 'Optimization',
    icon: '⚡',
    color: '#ffd93d',
    output: 'x = 5 + 6  →  x = 11',
    desc: 'The optimizer performs constant folding: 3*2 = 6, then 5+6 = 11. Fewer operations at runtime.',
  },
  {
    id: 'codegen',
    name: 'Code Generation',
    icon: '⚙️',
    color: '#f093fb',
    output: ['LOAD 11', 'STORE x', '(machine code for x86/ARM)'],
    desc: 'Generates target machine instructions. The CPU can now execute this directly.',
  },
];

// Simple AST visual
function ASTNode({ node, depth = 0 }) {
  if (typeof node === 'string') {
    return <div className="text-[0.65rem] font-bold text-[#43e97b] text-center px-2 py-1 rounded bg-[#43e97b]/10 border border-[#43e97b]/20">{node}</div>;
  }
  return (
    <div className="flex flex-col items-center">
      <div className="text-[0.65rem] font-bold text-white px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/[0.15]">
        {node.type === 'Assignment' ? '=' : node.op}
      </div>
      <div className="flex gap-3 mt-1.5">
        <div className="flex flex-col items-center">
          <div className="w-px h-2 bg-white/[0.2]" />
          <ASTNode node={node.left} depth={depth + 1} />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-px h-2 bg-white/[0.2]" />
          <ASTNode node={node.right} depth={depth + 1} />
        </div>
      </div>
    </div>
  );
}

export default function CompilersDemo({ onBack }) {
  const [activePhase, setActivePhase] = useState(0);
  const phase = PHASES[activePhase];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#fdcb6e] to-[#e17055] bg-clip-text text-transparent">How Compilers Work</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            A compiler <span className="text-[#fdcb6e] font-semibold">translates high-level source code into machine code</span> through multiple stages. Each phase transforms the code into a different representation, getting closer to what the CPU actually executes.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The big picture:</span> Writing assembly by hand is tedious and error-prone. Compilers let programmers write human-readable code (like C, Rust, or Go) while automatically producing optimized machine code. Modern compilers do incredible optimizations — sometimes producing faster code than hand-written assembly.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Token', def: 'The smallest meaningful unit of code: keywords, identifiers, literals, operators. The lexer produces tokens.' },
              { term: 'AST', def: 'Abstract Syntax Tree — a hierarchical representation of code structure. Captures what the code means, not how it looks.' },
              { term: 'IR (Intermediate Representation)', def: 'A platform-independent format between source and machine code. LLVM uses LLVM-IR; Java uses bytecode.' },
              { term: 'Optimization Pass', def: 'A transformation that improves code without changing behavior: constant folding, dead code elimination, inlining.' },
              { term: 'Symbol Table', def: 'A data structure tracking all identifiers (variables, functions) and their types, scopes, and memory locations.' },
              { term: 'Linker', def: 'Combines multiple compiled files into one executable. Resolves references between files (like function calls).' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#fdcb6e]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline stepper */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Compilation Pipeline</h2>
          <div className="flex gap-1 mb-4">
            {PHASES.map((p, i) => (
              <button key={i} onClick={() => setActivePhase(i)}
                className={`flex-1 flex flex-col items-center gap-1 px-1 py-2 rounded-lg border transition-all duration-200
                  ${activePhase === i ? 'border-white/[0.3] bg-white/[0.07] scale-[1.02]' : 'border-white/[0.06] hover:bg-white/[0.04]'}`}>
                <span className="text-sm">{p.icon}</span>
                <span className="text-[0.58rem] font-semibold text-center leading-tight" style={{ color: activePhase === i ? p.color : 'rgba(255,255,255,0.45)' }}>{p.name}</span>
              </button>
            ))}
          </div>

          {/* Arrow indicators */}
          <div className="flex justify-between px-2 mb-4">
            {PHASES.map((_, i) => i < PHASES.length - 1 ? <span key={i} className="text-white/15 text-xs">→</span> : null)}
          </div>

          {/* Phase detail */}
          <AnimatePresence mode="wait">
            <motion.div key={activePhase} className="rounded-xl border p-4" style={{ borderColor: `${phase.color}30`, background: `${phase.color}08` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{phase.icon}</span>
                <h3 className="text-[0.78rem] font-bold" style={{ color: phase.color }}>{phase.name}</h3>
              </div>
              <p className="text-[0.68rem] text-white/50 mb-3">{phase.desc}</p>

              {/* Output visualization */}
              <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3">
                {phase.id === 'source' && (
                  <code className="text-[0.82rem] text-[#a5f3fc] font-mono font-bold">{phase.output}</code>
                )}
                {phase.id === 'lexer' && (
                  <div className="flex gap-1.5 flex-wrap">
                    {phase.output.map((token, i) => (
                      <div key={i} className="flex flex-col items-center px-2 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03]">
                        <span className="text-[0.5rem] text-white/35 uppercase">{token.type}</span>
                        <span className="text-[0.7rem] font-bold text-[#a5f3fc] font-mono">{token.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {phase.id === 'parser' && (
                  <div className="flex justify-center">
                    <ASTNode node={phase.output} />
                  </div>
                )}
                {phase.id === 'optimize' && (
                  <div className="flex items-center gap-3 justify-center">
                    <code className="text-[0.72rem] text-[#ef4444] font-mono">x = 5 + 3 * 2</code>
                    <span className="text-white/30">→</span>
                    <code className="text-[0.72rem] text-[#ffd93d] font-mono">x = 5 + 6</code>
                    <span className="text-white/30">→</span>
                    <code className="text-[0.78rem] text-[#43e97b] font-mono font-bold">x = 11</code>
                  </div>
                )}
                {phase.id === 'codegen' && (
                  <div className="flex flex-col gap-1">
                    {phase.output.map((line, i) => (
                      <code key={i} className="text-[0.72rem] font-mono" style={{ color: i < 2 ? '#a5f3fc' : 'rgba(255,255,255,0.3)' }}>{line}</code>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Compiler vs Interpreter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#667eea] mb-2">⚙️ Compiler</h3>
            <ul className="flex flex-col gap-1.5">
              {['Translates entire code at once', 'Produces machine binary', 'Runs fast after compilation', 'Examples: C, C++, Rust, Go'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#667eea] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">🔄 Interpreter</h3>
            <ul className="flex flex-col gap-1.5">
              {['Executes line by line', 'No separate binary output', 'Slower runtime (translates on-the-fly)', 'Examples: Python, Ruby, JS'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#43e97b] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
