import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SQL_DATA = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@ex.com' },
    { id: 2, name: 'Bob',   email: 'bob@ex.com' },
  ],
  orders: [
    { id: 101, user_id: 1, product: 'Laptop',  amount: 999 },
    { id: 102, user_id: 1, product: 'Mouse',   amount: 25 },
    { id: 103, user_id: 2, product: 'Phone',   amount: 699 },
  ],
};

const NOSQL_DATA = [
  {
    _id: '1', name: 'Alice', email: 'alice@ex.com',
    orders: [
      { id: 101, product: 'Laptop', amount: 999 },
      { id: 102, product: 'Mouse',  amount: 25 },
    ],
  },
  {
    _id: '2', name: 'Bob', email: 'bob@ex.com',
    orders: [
      { id: 103, product: 'Phone', amount: 699 },
    ],
  },
];

const COMPARISONS = [
  { aspect: 'Schema',      sql: 'Fixed (predefined tables)',   nosql: 'Flexible (schema-less)',          winner: 'nosql' },
  { aspect: 'Data Model',  sql: 'Tables & Rows',              nosql: 'Documents / Key-Value / Graph',   winner: 'nosql' },
  { aspect: 'Scaling',     sql: 'Vertical (bigger server)',   nosql: 'Horizontal (more servers)',       winner: 'nosql' },
  { aspect: 'Consistency', sql: 'ACID guaranteed',            nosql: 'Eventual consistency (BASE)',     winner: 'sql' },
  { aspect: 'Queries',     sql: 'Powerful SQL language',      nosql: 'Limited query capabilities',      winner: 'sql' },
  { aspect: 'Relations',   sql: 'JOINs (complex relations)',  nosql: 'Embedded docs (denormalized)',    winner: 'sql' },
  { aspect: 'Speed',       sql: 'Slower for unstructured',    nosql: 'Faster for document access',      winner: 'nosql' },
];

const NOSQL_TYPES = [
  { type: 'Document', icon: '📄', example: 'MongoDB', color: '#43e97b', desc: 'Stores JSON-like documents. Great for flexible, nested data.' },
  { type: 'Key-Value', icon: '🔑', example: 'Redis', color: '#4facfe', desc: 'Simple key→value pairs. Blazing fast for caching & sessions.' },
  { type: 'Column',    icon: '📊', example: 'Cassandra', color: '#f093fb', desc: 'Columns stored together. Optimized for analytics & writes.' },
  { type: 'Graph',     icon: '🕸️', example: 'Neo4j', color: '#ffd93d', desc: 'Nodes & edges. Perfect for relationships (social, recommendations).' },
];

export default function SQLvsNoSQLDemo({ onBack }) {
  const [view, setView] = useState('compare');   // compare | data | types
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">SQL vs NoSQL</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            <span className="text-[#667eea] font-semibold">SQL</span> databases store data in structured tables with fixed schemas. <span className="text-[#43e97b] font-semibold">NoSQL</span> databases use flexible data models — documents, key-value pairs, or graphs. Neither is universally better — it depends on your use case.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The core trade-off:</span> SQL databases guarantee data consistency (ACID) and handle complex relationships well, but are harder to scale horizontally. NoSQL databases sacrifice some consistency guarantees for flexibility and massive scalability — perfect for handling millions of users across distributed servers.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'ACID', def: 'Atomicity, Consistency, Isolation, Durability — guarantees for reliable transactions. SQL databases enforce this.' },
              { term: 'BASE', def: 'Basically Available, Soft state, Eventual consistency — NoSQL trade-off for higher availability and partition tolerance.' },
              { term: 'Schema', def: 'The structure defining what data a table/collection can hold. SQL has rigid schemas; NoSQL is often schema-less.' },
              { term: 'Normalization', def: 'Splitting data into related tables to eliminate redundancy. Common in SQL; avoided in NoSQL (denormalized).' },
              { term: 'Sharding', def: 'Splitting data across multiple servers by a key (e.g., user ID). NoSQL databases are designed for this.' },
              { term: 'CAP Theorem', def: 'You can only have 2 of 3: Consistency, Availability, Partition tolerance. Different databases make different choices.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nav tabs */}
        <div className="flex gap-2">
          {[['compare', '⚖️ Comparison'], ['data', '📊 Data Models'], ['types', '🗂️ NoSQL Types']].map(([key, label]) => (
            <button key={key} onClick={() => setView(key)}
              className={`flex-1 px-3 py-2 rounded-xl border text-[0.72rem] font-semibold transition-all duration-200
                ${view === key ? 'border-[#667eea]/40 bg-[#667eea]/10 text-[#667eea]' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Comparison table */}
        {view === 'compare' && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl overflow-hidden">
              <table className="w-full text-[0.7rem]">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left px-3 py-2 text-white/35">Aspect</th>
                    <th className="text-left px-3 py-2 text-[#667eea]">🗄️ SQL</th>
                    <th className="text-left px-3 py-2 text-[#43e97b]">📄 NoSQL</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISONS.map((row, i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="px-3 py-1.5 text-white/60 font-semibold">{row.aspect}</td>
                      <td className={`px-3 py-1.5 ${row.winner === 'sql' ? 'text-[#43e97b] font-semibold' : 'text-white/50'}`}>{row.sql}</td>
                      <td className={`px-3 py-1.5 ${row.winner === 'nosql' ? 'text-[#43e97b] font-semibold' : 'text-white/50'}`}>{row.nosql}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-[0.62rem] text-white/30 text-center">Green = advantage for that database type</div>
          </div>
        )}

        {/* Data model comparison */}
        {view === 'data' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/[0.04] border border-[#667eea]/20 rounded-xl p-4">
              <h3 className="text-[0.72rem] font-bold text-[#667eea] mb-2">🗄️ SQL — Normalized Tables</h3>
              {Object.entries(SQL_DATA).map(([table, rows]) => (
                <div key={table} className="mb-2.5">
                  <div className="text-[0.6rem] font-bold text-[#667eea] mb-1">📋 {table}</div>
                  <div className="bg-[#0a0a14] rounded-lg overflow-hidden border border-white/[0.06]">
                    <table className="w-full text-[0.62rem]">
                      <thead><tr className="border-b border-white/[0.06]">
                        {Object.keys(rows[0]).map(k => <th key={k} className="text-left px-2 py-0.5 text-white/35">{k}</th>)}
                      </tr></thead>
                      <tbody>{rows.map((row, i) => (
                        <tr key={i} className="border-b border-white/[0.03]">
                          {Object.values(row).map((v, j) => <td key={j} className="px-2 py-0.5 text-white/55">{v}</td>)}
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              ))}
              <p className="text-[0.6rem] text-[#667eea]/60 mt-1">Data split across tables. Use JOINs to combine.</p>
            </div>
            <div className="bg-white/[0.04] border border-[#43e97b]/20 rounded-xl p-4">
              <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">📄 NoSQL — Embedded Documents</h3>
              {NOSQL_DATA.map((doc, i) => (
                <div key={i} className="bg-[#0a0a14] rounded-lg p-2 border border-white/[0.06] mb-2">
                  <pre className="text-[0.6rem] text-[#a5f3fc] font-mono leading-relaxed whitespace-pre-wrap">{JSON.stringify(doc, null, 2)}</pre>
                </div>
              ))}
              <p className="text-[0.6rem] text-[#43e97b]/60 mt-1">All data in one document. No JOINs needed.</p>
            </div>
          </div>
        )}

        {/* NoSQL Types */}
        {view === 'types' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NOSQL_TYPES.map((t, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{t.icon}</span>
                  <h3 className="text-[0.78rem] font-bold" style={{ color: t.color }}>{t.type} Store</h3>
                  <span className="ml-auto text-[0.6rem] border rounded px-1.5 py-0.3" style={{ borderColor: `${t.color}40`, color: t.color }}>{t.example}</span>
                </div>
                <p className="text-[0.67rem] text-white/50">{t.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* When to use */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#667eea] mb-2">🗄️ Choose SQL When…</h3>
            <ul className="flex flex-col gap-1.5">
              {['Complex relationships & JOINs', 'ACID compliance is critical', 'Data is highly structured', 'Financial / transactional data'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#667eea] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">📄 Choose NoSQL When…</h3>
            <ul className="flex flex-col gap-1.5">
              {['Schema changes frequently', 'Horizontal scaling needed', 'Unstructured / varied data', 'High-speed reads (caching)'].map((item, i) => (
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
