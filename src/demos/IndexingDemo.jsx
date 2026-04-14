import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DATA_ROWS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: ['Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Hank','Ivy','Jack',
         'Kate','Leo','Mia','Ned','Olivia','Pat','Quinn','Rose','Sam','Tina'][i],
  age: [28,34,41,25,38,29,45,32,27,36,31,42,28,35,40,26,33,29,44,30][i],
  salary: [55000,72000,88000,48000,91000,62000,105000,78000,52000,83000,67000,95000,56000,79000,101000,51000,74000,60000,98000,65000][i],
}));

// Simulated B-tree index on 'age'
const INDEX_ON_AGE = [25,26,27,28,29,30,31,32,33,34,35,36,38,40,41,42,44,45];

export default function IndexingDemo({ onBack }) {
  const [searchAge, setSearchAge] = useState(34);
  const [useIndex, setUseIndex] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [stepsChecked, setStepsChecked] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);
  const timeoutRef = useRef(null);

  const runQuery = () => {
    setScanning(true);
    setHighlightedRows([]);
    setStepsChecked([]);
    setExecutionTime(null);

    const matches = DATA_ROWS.filter(r => r.age === searchAge).map(r => r.id);
    const totalRows = DATA_ROWS.length;

    if (useIndex) {
      // Index lookup: show index steps, then jump to result
      const steps = [
        { delay: 200, step: 'Lookup age=' + searchAge + ' in B-tree index', key: 'index-lookup' },
        { delay: 500, step: 'Found pointer → row offset', key: 'pointer' },
        { delay: 800, step: 'Fetch matching row(s)', key: 'fetch', rows: matches },
      ];
      steps.forEach(s => {
        timeoutRef.current = setTimeout(() => {
          setStepsChecked(prev => [...prev, s.key]);
          if (s.rows) {
            setHighlightedRows(s.rows);
            setExecutionTime('~0.2ms (1 lookup)');
            setScanning(false);
          }
        }, s.delay);
      });
    } else {
      // Full table scan — highlight rows one by one
      let i = 0;
      const scan = () => {
        if (i < totalRows) {
          const row = DATA_ROWS[i];
          setStepsChecked([`Scanning row #${i + 1}: age=${row.age} ${row.age === searchAge ? '✓ MATCH' : '✗'}`]);
          if (row.age === searchAge) {
            setHighlightedRows(prev => [...prev, row.id]);
          }
          i++;
          timeoutRef.current = setTimeout(scan, 80);
        } else {
          setExecutionTime(`~${totalRows * 0.3}ms (${totalRows} scans)`);
          setScanning(false);
        }
      };
      scan();
    }
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Database Indexing</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">What is an Index?</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            An index is a <span className="text-[#667eea] font-semibold">data structure that speeds up queries</span> on a column — like a book's table of contents. Without one, the DB must scan every row (O(n)). With one, it jumps directly to matching rows (O(log n)).
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The impact:</span> A query on 1 million rows without an index might take 10 seconds. With an index, it might take 0.001 seconds. That's a 10,000x speedup. But indexes aren't free — they use disk space and slow down writes. The art is knowing which columns to index.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'B-Tree Index', def: 'The default index type. A self-balancing tree that keeps data sorted for O(log n) lookups. Great for range queries.' },
              { term: 'Hash Index', def: 'Uses a hash function for O(1) exact-match lookups. Faster than B-Tree for equality, but can\'t do ranges.' },
              { term: 'Composite Index', def: 'An index on multiple columns (e.g., (country, city)). Order matters — queries must match left-to-right.' },
              { term: 'Covering Index', def: 'An index that contains all columns a query needs. The DB never touches the table — huge performance win.' },
              { term: 'Full Table Scan', def: 'Reading every row in a table. Happens when no index exists or when the query can\'t use the index.' },
              { term: 'EXPLAIN', def: 'A SQL command that shows how the database will execute a query. Use it to verify indexes are being used.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive: Full Scan vs Index Lookup */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Interactive: Full Scan vs Index Lookup</h2>

          <div className="flex flex-wrap gap-3 items-end mb-4">
            <div>
              <label className="text-[0.68rem] text-white/40 block mb-1">Search age =</label>
              <select value={searchAge} onChange={e => setSearchAge(Number(e.target.value))}
                className="bg-white/[0.06] border border-white/[0.12] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#667eea]">
                {[...new Set(DATA_ROWS.map(r => r.age))].sort((a,b) => a-b).map(age => (
                  <option key={age} value={age} style={{ background: '#1a1a2e' }}>{age}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setUseIndex(false)}
                className={`px-3 py-1.5 rounded-lg border text-[0.7rem] font-semibold transition-all duration-200
                  ${!useIndex ? 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]' : 'border-white/[0.1] text-white/50 hover:text-white/70'}`}>
                🔍 Full Scan
              </button>
              <button onClick={() => setUseIndex(true)}
                className={`px-3 py-1.5 rounded-lg border text-[0.7rem] font-semibold transition-all duration-200
                  ${useIndex ? 'border-[#43e97b]/40 bg-[#43e97b]/10 text-[#43e97b]' : 'border-white/[0.1] text-white/50 hover:text-white/70'}`}>
                ⚡ Use Index
              </button>
            </div>
            <button onClick={runQuery} disabled={scanning}
              className="px-4 py-1.5 rounded-lg bg-[#667eea] text-white text-[0.72rem] font-semibold
                         hover:bg-[#764ba2] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
              {scanning ? '⏳ Running…' : '▶ Execute'}
            </button>
          </div>

          {/* Execution result */}
          {executionTime && (
            <div className={`rounded-lg border px-3 py-2 mb-3 text-[0.7rem] font-semibold flex items-center gap-2
              ${useIndex ? 'border-[#43e97b]/30 bg-[#43e97b]/[0.08] text-[#43e97b]' : 'border-[#ef4444]/30 bg-[#ef4444]/[0.08] text-[#ef4444]'}`}>
              <span>⏱️ Execution: {executionTime}</span>
              <span className="text-white/30">|</span>
              <span>{highlightedRows.length} row{highlightedRows.length !== 1 ? 's' : ''} found</span>
            </div>
          )}

          {/* Live step log (index mode) */}
          {useIndex && stepsChecked.length > 0 && (
            <div className="bg-[#0a0a14] border border-white/[0.06] rounded-lg p-2.5 mb-3 flex flex-col gap-1">
              {stepsChecked.map((s, i) => (
                <div key={i} className="text-[0.65rem] text-[#43e97b] flex items-center gap-1.5">
                  <span>✓</span> {s}
                </div>
              ))}
            </div>
          )}
          {/* Full scan step log */}
          {!useIndex && stepsChecked.length > 0 && (
            <div className="bg-[#0a0a14] border border-white/[0.06] rounded-lg p-2 mb-3 max-h-16 overflow-y-auto">
              <div className="text-[0.62rem] text-white/50">{stepsChecked[0]}</div>
            </div>
          )}

          {/* Table */}
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl overflow-hidden max-h-56 overflow-y-auto">
            <table className="w-full text-[0.7rem]">
              <thead className="sticky top-0 bg-[#0a0a14]">
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-3 py-1.5 text-white/35 font-semibold">id</th>
                  <th className="text-left px-3 py-1.5 text-white/35 font-semibold">name</th>
                  <th className="text-left px-3 py-1.5 text-[#4facfe] font-semibold">age ← indexed</th>
                  <th className="text-left px-3 py-1.5 text-white/35 font-semibold">salary</th>
                </tr>
              </thead>
              <tbody>
                {DATA_ROWS.map(row => {
                  const isMatch = highlightedRows.includes(row.id);
                  return (
                    <tr key={row.id} className={`border-b border-white/[0.03] transition-colors duration-200 ${isMatch ? 'bg-[#43e97b]/[0.12]' : ''}`}>
                      <td className="px-3 py-1 text-white/40">{row.id}</td>
                      <td className="px-3 py-1 text-white/70">{row.name}</td>
                      <td className={`px-3 py-1 font-semibold ${isMatch ? 'text-[#43e97b]' : row.age === searchAge ? 'text-[#ffd93d]' : 'text-white/60'}`}>{row.age}</td>
                      <td className="px-3 py-1 text-white/40">{row.salary.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Index structure */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">B-Tree Index Structure</h2>
          <div className="flex flex-col items-center gap-2">
            {/* Root */}
            <div className="bg-[#667eea]/15 border border-[#667eea]/30 rounded-lg px-4 py-2 flex gap-3">
              {[30, 38].map(v => <span key={v} className="text-[0.75rem] font-bold text-[#667eea]">{v}</span>)}
            </div>
            <div className="flex gap-12">
              <div className="w-px h-3 bg-[#667eea]/30" /><div className="w-px h-3 bg-[#667eea]/30" /><div className="w-px h-3 bg-[#667eea]/30" />
            </div>
            {/* Level 2 */}
            <div className="flex gap-3">
              {[[25,28],[30,34],[38,42]].map((vals, i) => (
                <div key={i} className="bg-[#4facfe]/10 border border-[#4facfe]/25 rounded-lg px-3 py-1.5 flex gap-2">
                  {vals.map(v => <span key={v} className="text-[0.7rem] font-semibold text-[#4facfe]">{v}</span>)}
                </div>
              ))}
            </div>
            <div className="text-[0.6rem] text-white/30 mt-1">↓ Leaf nodes point to actual table rows</div>
          </div>
        </div>

        {/* Trade-offs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.75rem] font-bold text-[#43e97b] mb-2">✓ Benefits</h3>
            <ul className="flex flex-col gap-1.5">
              {['Faster SELECT queries', 'O(log n) lookup vs O(n)', 'Speeds up WHERE clauses', 'Speeds up ORDER BY / GROUP BY'].map((item, i) => (
                <li key={i} className="text-[0.68rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#43e97b] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.75rem] font-bold text-[#ef4444] mb-2">✗ Trade-offs</h3>
            <ul className="flex flex-col gap-1.5">
              {['Uses extra disk space', 'Slows down INSERT/UPDATE/DELETE', 'Too many indexes = overhead', 'Maintenance cost on writes'].map((item, i) => (
                <li key={i} className="text-[0.68rem] text-white/55 flex items-start gap-1.5">
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
