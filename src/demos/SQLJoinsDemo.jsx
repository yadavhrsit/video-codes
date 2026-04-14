import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const USERS = [
  { id: 1, name: 'Alice',   dept_id: 10 },
  { id: 2, name: 'Bob',     dept_id: 20 },
  { id: 3, name: 'Charlie', dept_id: 30 },
  { id: 4, name: 'Diana',   dept_id: null },
];
const DEPTS = [
  { dept_id: 10, dept_name: 'Engineering' },
  { dept_id: 20, dept_name: 'Marketing' },
  { dept_id: 40, dept_name: 'Sales' },
];

const JOIN_TYPES = [
  {
    id: 'inner',
    label: 'INNER JOIN',
    icon: '🔘',
    color: '#667eea',
    vennLeft: false, vennRight: false, vennCenter: true,
    description: 'Returns rows that have a match in BOTH tables. No match = no row.',
    sql: 'SELECT u.name, d.dept_name\nFROM users u\nINNER JOIN departments d\n  ON u.dept_id = d.dept_id;',
    result: [
      { name: 'Alice',  dept_name: 'Engineering' },
      { name: 'Bob',    dept_name: 'Marketing' },
    ],
  },
  {
    id: 'left',
    label: 'LEFT JOIN',
    icon: '◐',
    color: '#4facfe',
    vennLeft: true, vennRight: false, vennCenter: true,
    description: 'Returns ALL rows from the LEFT table. Matching rows from right, NULL if no match.',
    sql: 'SELECT u.name, d.dept_name\nFROM users u\nLEFT JOIN departments d\n  ON u.dept_id = d.dept_id;',
    result: [
      { name: 'Alice',   dept_name: 'Engineering' },
      { name: 'Bob',     dept_name: 'Marketing' },
      { name: 'Charlie', dept_name: 'NULL' },
      { name: 'Diana',   dept_name: 'NULL' },
    ],
  },
  {
    id: 'right',
    label: 'RIGHT JOIN',
    icon: '◑',
    color: '#f093fb',
    vennLeft: false, vennRight: true, vennCenter: true,
    description: 'Returns ALL rows from the RIGHT table. Matching rows from left, NULL if no match.',
    sql: 'SELECT u.name, d.dept_name\nFROM users u\nRIGHT JOIN departments d\n  ON u.dept_id = d.dept_id;',
    result: [
      { name: 'Alice', dept_name: 'Engineering' },
      { name: 'Bob',   dept_name: 'Marketing' },
      { name: 'NULL',  dept_name: 'Sales' },
    ],
  },
  {
    id: 'full',
    label: 'FULL OUTER JOIN',
    icon: '◎',
    color: '#43e97b',
    vennLeft: true, vennRight: true, vennCenter: true,
    description: 'Returns ALL rows from BOTH tables. NULLs where no match exists on either side.',
    sql: 'SELECT u.name, d.dept_name\nFROM users u\nFULL OUTER JOIN departments d\n  ON u.dept_id = d.dept_id;',
    result: [
      { name: 'Alice',   dept_name: 'Engineering' },
      { name: 'Bob',     dept_name: 'Marketing' },
      { name: 'Charlie', dept_name: 'NULL' },
      { name: 'Diana',   dept_name: 'NULL' },
      { name: 'NULL',    dept_name: 'Sales' },
    ],
  },
  {
    id: 'cross',
    label: 'CROSS JOIN',
    icon: '✕',
    color: '#ffd93d',
    vennLeft: true, vennRight: true, vennCenter: true,
    description: 'Cartesian product — every row in left paired with every row in right. n × m rows.',
    sql: 'SELECT u.name, d.dept_name\nFROM users u\nCROSS JOIN departments d;',
    result: [
      { name: 'Alice', dept_name: 'Engineering' }, { name: 'Alice', dept_name: 'Marketing' }, { name: 'Alice', dept_name: 'Sales' },
      { name: 'Bob',   dept_name: 'Engineering' }, { name: 'Bob',   dept_name: 'Marketing' }, { name: 'Bob',   dept_name: 'Sales' },
    ],
  },
];

// ─── Venn Diagram ──────────────────────────────────────────
function VennDiagram({ joinType }) {
  const j = JOIN_TYPES.find(j => j.id === joinType);
  return (
    <svg viewBox="0 0 200 140" className="w-full max-w-[220px] mx-auto">
      {/* Left circle */}
      <circle cx="72" cy="70" r="50" fill={j.vennLeft ? j.color : 'transparent'} fillOpacity={j.vennLeft ? 0.25 : 0} stroke="#667eea" strokeWidth="2" />
      {/* Right circle */}
      <circle cx="128" cy="70" r="50" fill={j.vennRight ? j.color : 'transparent'} fillOpacity={j.vennRight ? 0.25 : 0} stroke="#f093fb" strokeWidth="2" />
      {/* Center overlap — drawn on top */}
      <clipPath id="leftClip"><circle cx="72" cy="70" r="50" /></clipPath>
      <circle cx="128" cy="70" r="50" clipPath="url(#leftClip)" fill={j.vennCenter ? j.color : 'transparent'} fillOpacity={j.vennCenter ? 0.4 : 0} />
      {/* Labels */}
      <text x="52" y="68" textAnchor="middle" fill="#a5f3fc" fontSize="9" fontWeight="600">Users</text>
      <text x="148" y="68" textAnchor="middle" fill="#e9d5ff" fontSize="9" fontWeight="600">Depts</text>
      <text x="100" y="72" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" opacity="0.7">ON</text>
    </svg>
  );
}

export default function SQLJoinsDemo({ onBack }) {
  const [selectedJoin, setSelectedJoin] = useState('inner');
  const current = JOIN_TYPES.find(j => j.id === selectedJoin);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">SQL Joins</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">What are JOINs?</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            JOINs combine rows from two or more tables based on a <span className="text-[#667eea] font-semibold">related column</span>. The type of JOIN determines which rows are included when there's no match.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why JOINs matter:</span> In relational databases, data is split across multiple tables to avoid duplication (normalization). JOINs let you reconstruct the complete picture — like connecting a user's profile to their orders. Without JOINs, you'd need multiple queries and manual data stitching in code.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Primary Key', def: 'A column (or set of columns) that uniquely identifies each row in a table. Every table should have one.' },
              { term: 'Foreign Key', def: 'A column that references the primary key of another table. Creates the relationship that JOINs use.' },
              { term: 'NULL', def: 'A special value meaning "no data" or "unknown." JOINs often produce NULLs when there\'s no matching row.' },
              { term: 'Cardinality', def: 'The relationship type: one-to-one, one-to-many, or many-to-many. Affects how JOINs multiply rows.' },
              { term: 'ON Clause', def: 'Specifies the condition for matching rows between tables. Usually compares a foreign key to a primary key.' },
              { term: 'Normalization', def: 'Organizing data to reduce redundancy. Creates multiple related tables that need JOINs to recombine.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Source tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'users', color: '#667eea', cols: ['id', 'name', 'dept_id'], rows: USERS.map(u => [u.id, u.name, u.dept_id ?? 'NULL']) },
            { title: 'departments', color: '#f093fb', cols: ['dept_id', 'dept_name'], rows: DEPTS.map(d => [d.dept_id, d.dept_name]) },
          ].map(table => (
            <div key={table.title} className="bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="px-4 py-2 text-[0.7rem] font-bold" style={{ color: table.color, borderBottom: `1px solid ${table.color}22` }}>
                📋 {table.title}
              </div>
              <table className="w-full text-[0.68rem]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {table.cols.map(c => <th key={c} className="text-left px-3 py-1.5 text-white/40 font-semibold">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      {row.map((cell, j) => (
                        <td key={j} className={`px-3 py-1.5 ${cell === 'NULL' ? 'text-[#ef4444]/60 italic' : 'text-white/70'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Join selector */}
        <div className="flex gap-2 flex-wrap">
          {JOIN_TYPES.map(j => (
            <button key={j.id} onClick={() => setSelectedJoin(j.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[0.72rem] font-semibold transition-all duration-200
                ${selectedJoin === j.id
                  ? 'border-white/[0.3] bg-white/[0.08] text-white'
                  : 'border-white/[0.08] text-white/40 hover:border-white/[0.18] hover:text-white/60'
                }`}
            >
              <span style={{ color: j.color }}>{j.icon}</span> {j.label}
            </button>
          ))}
        </div>

        {/* Main visualization */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedJoin} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Venn */}
              <div className="flex flex-col items-center">
                <h3 className="text-[0.72rem] font-bold text-white/60 mb-3">Venn Diagram</h3>
                <VennDiagram joinType={selectedJoin} />
              </div>
              {/* Description + SQL */}
              <div className="sm:col-span-2 flex flex-col gap-3">
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: current.color }}>{current.icon} {current.label}</h3>
                  <p className="text-[0.72rem] text-white/55">{current.description}</p>
                </div>
                <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3">
                  <pre className="text-[0.72rem] text-[#a5f3fc] font-mono leading-relaxed whitespace-pre-wrap">{current.sql}</pre>
                </div>
              </div>
            </div>

            {/* Result table */}
            <div className="mt-4">
              <h3 className="text-[0.68rem] font-bold text-white/40 uppercase tracking-wider mb-2">Query Result</h3>
              <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl overflow-hidden">
                <table className="w-full text-[0.7rem]">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left px-3 py-1.5 text-white/40 font-semibold">#</th>
                      <th className="text-left px-3 py-1.5 text-[#667eea] font-semibold">name</th>
                      <th className="text-left px-3 py-1.5 text-[#f093fb] font-semibold">dept_name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.result.map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.04]">
                        <td className="px-3 py-1.5 text-white/25">{i + 1}</td>
                        <td className={`px-3 py-1.5 ${row.name === 'NULL' ? 'text-[#ef4444]/50 italic' : 'text-white/75'}`}>{row.name}</td>
                        <td className={`px-3 py-1.5 ${row.dept_name === 'NULL' ? 'text-[#ef4444]/50 italic' : 'text-white/75'}`}>{row.dept_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[0.6rem] text-white/25 mt-1.5">{current.result.length} row{current.result.length !== 1 ? 's' : ''} returned</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick reference */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Quick Reference</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {JOIN_TYPES.map(j => (
              <div key={j.id} className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                <div className="text-lg mb-1" style={{ color: j.color }}>{j.icon}</div>
                <div className="text-[0.62rem] font-bold text-white/70">{j.label}</div>
                <div className="text-[0.55rem] text-white/35 mt-0.5">
                  {j.id === 'inner' && 'Match only'}
                  {j.id === 'left'  && 'All left + match'}
                  {j.id === 'right' && 'All right + match'}
                  {j.id === 'full'  && 'All from both'}
                  {j.id === 'cross' && 'Every combo'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance tips */}
        <div className="bg-[#667eea]/[0.06] border border-[#667eea]/20 rounded-xl px-4 py-3">
          <h3 className="text-[0.72rem] font-bold text-[#667eea] mb-1">Performance Tips</h3>
          <ul className="flex flex-col gap-1">
            {[
              'Always JOIN on indexed columns (especially foreign keys) — can be 100x faster.',
              'INNER JOIN is usually fastest; avoid CROSS JOIN on large tables (creates n×m rows).',
              'If you only need columns from one table, consider using EXISTS or IN instead of JOIN.',
              'Watch for NULL values — they never match in JOINs, which can cause unexpected empty results.',
            ].map((tip, i) => (
              <li key={i} className="text-[0.63rem] text-white/50 flex items-start gap-1.5">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#667eea] flex-shrink-0" />{tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
