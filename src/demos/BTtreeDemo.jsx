import { useState } from 'react';
import { motion } from 'framer-motion';

// Static B+ Tree visualization
const BTREE_LEVELS = [
  { nodes: [[30, 60]] },                                      // Root
  { nodes: [[10, 20], [40, 50], [70, 80]] },                  // Internal
  { nodes: [[5,10], [15,20], [25,30], [35,40], [45,50], [55,60], [65,70], [75,80], [85,90]] }, // Leaves
];

function BTreeNode({ values, color, isHighlighted, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex gap-0.5 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105
        ${isHighlighted ? 'border-white/[0.4] shadow-lg' : 'border-white/[0.1]'}`}
      style={{ background: isHighlighted ? `${color}25` : `${color}10` }}
    >
      {values.map((v, i) => (
        <div key={i} className="px-2.5 py-1.5 text-[0.68rem] font-bold text-center" style={{ color }}>
          {v}
        </div>
      ))}
    </div>
  );
}

export default function BTtreeDemo({ onBack }) {
  const [searchValue, setSearchValue] = useState('');
  const [searchPath, setSearchPath] = useState([]);
  const [foundLeaf, setFoundLeaf] = useState(null);

  const search = (val) => {
    const v = parseInt(val);
    if (isNaN(v)) { setSearchPath([]); setFoundLeaf(null); return; }
    const path = [];
    // Root
    path.push({ level: 0, nodeIdx: 0 });
    const root = BTREE_LEVELS[0].nodes[0];
    let childIdx;
    if (v < root[0]) childIdx = 0;
    else if (v < root[1]) childIdx = 1;
    else childIdx = 2;
    // Internal
    path.push({ level: 1, nodeIdx: childIdx });
    const internal = BTREE_LEVELS[1].nodes[childIdx];
    let leafIdx;
    if (v < internal[0]) leafIdx = childIdx * 3;
    else if (v < internal[1]) leafIdx = childIdx * 3 + 1;
    else leafIdx = childIdx * 3 + 2;
    // Leaf
    path.push({ level: 2, nodeIdx: leafIdx });
    setSearchPath(path);
    const leaf = BTREE_LEVELS[2].nodes[leafIdx];
    setFoundLeaf(leaf && leaf.includes(v) ? leafIdx : -1);
  };

  const isInPath = (level, nodeIdx) => searchPath.some(p => p.level === level && p.nodeIdx === nodeIdx);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">B-Tree & B+ Tree</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            B-Trees are <span className="text-[#667eea] font-semibold">self-balancing tree structures</span> used in databases for indexing. They keep data sorted and allow searches, insertions, and deletions in <span className="text-[#43e97b] font-semibold">O(log n)</span> time. B+ Trees extend this by storing all data in leaf nodes.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why they matter:</span> Unlike binary trees that have 2 children per node, B-Trees can have hundreds of children. This means fewer levels to traverse — critical when each "level" is a disk read. A B-Tree with 1 million records might only be 3-4 levels deep, meaning any record can be found in 3-4 disk reads.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Order (m)', def: 'Maximum number of children a node can have. A B-Tree of order 100 has nodes with up to 99 keys and 100 child pointers.' },
              { term: 'Internal Node', def: 'A node that has children. Contains keys that route searches down the tree — like signposts.' },
              { term: 'Leaf Node', def: 'A node at the bottom level with no children. In B+ Trees, leaves contain all actual data records.' },
              { term: 'Split', def: 'When a node gets too full, it splits into two nodes and pushes a key up to the parent. Keeps the tree balanced.' },
              { term: 'Clustered Index', def: 'The B+ Tree where leaf nodes contain the actual table data. A table can have only one clustered index.' },
              { term: 'Fanout', def: 'The number of children per node. Higher fanout = shorter tree = fewer disk reads.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive search */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">Search Visualization</h2>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Search…" value={searchValue}
                onChange={e => { setSearchValue(e.target.value); search(e.target.value); }}
                className="w-24 bg-white/[0.06] border border-white/[0.12] rounded-lg px-2.5 py-1 text-[0.72rem] text-white focus:outline-none focus:border-[#667eea] placeholder-white/30"
              />
              <button onClick={() => { setSearchValue(''); setSearchPath([]); setFoundLeaf(null); }}
                className="px-2.5 py-1 rounded-lg border border-white/[0.12] text-white/50 text-[0.65rem] hover:bg-white/[0.06] transition-all">Clear</button>
            </div>
          </div>

          {/* B+ Tree */}
          <div className="flex flex-col items-center gap-3">
            {/* Root */}
            <div className="text-[0.6rem] text-white/30 mb-1">Root Node</div>
            <BTreeNode values={BTREE_LEVELS[0].nodes[0]} color={isInPath(0, 0) ? '#667eea' : '#667eea'} isHighlighted={isInPath(0, 0)} />

            {/* Connectors */}
            <div className="flex gap-24">
              <div className="w-px h-3 bg-white/[0.15]" /><div className="w-px h-3 bg-white/[0.15]" /><div className="w-px h-3 bg-white/[0.15]" />
            </div>

            {/* Internal */}
            <div className="text-[0.6rem] text-white/30 mb-0.5">Internal Nodes</div>
            <div className="flex gap-4">
              {BTREE_LEVELS[1].nodes.map((node, i) => (
                <BTreeNode key={i} values={node} color={isInPath(1, i) ? '#4facfe' : '#4facfe'} isHighlighted={isInPath(1, i)} />
              ))}
            </div>

            {/* Leaf connector */}
            <div className="flex gap-6">
              {Array.from({ length: 9 }, (_, i) => <div key={i} className="w-px h-2 bg-white/[0.1]" />)}
            </div>

            {/* Leaf nodes */}
            <div className="text-[0.6rem] text-white/30 mb-0.5">Leaf Nodes (actual data)</div>
            <div className="flex gap-1.5 flex-wrap justify-center">
              {BTREE_LEVELS[2].nodes.map((node, i) => (
                <BTreeNode key={i} values={node}
                  color={isInPath(2, i) ? (foundLeaf === i ? '#43e97b' : '#ef4444') : '#43e97b'}
                  isHighlighted={isInPath(2, i)} />
              ))}
            </div>
          </div>

          {/* Search result */}
          {searchPath.length > 0 && (
            <div className={`mt-3 rounded-lg border px-3 py-2 text-[0.7rem] font-semibold
              ${foundLeaf >= 0 ? 'border-[#43e97b]/30 bg-[#43e97b]/[0.08] text-[#43e97b]' : 'border-[#ef4444]/30 bg-[#ef4444]/[0.08] text-[#ef4444]'}`}>
              {foundLeaf >= 0
                ? `✓ Found ${searchValue} in leaf node! Traversed ${searchPath.length} levels (O(log n))`
                : `✗ ${searchValue} not found. Traversed ${searchPath.length} levels — value would be inserted here.`
              }
            </div>
          )}
        </div>

        {/* B-Tree vs B+ Tree comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.75rem] font-bold text-[#667eea] mb-2">🌳 B-Tree</h3>
            <ul className="flex flex-col gap-1.5">
              {['Data stored in ALL nodes', 'Each node is self-contained', 'Fewer levels needed', 'Harder to do range queries'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#667eea] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.75rem] font-bold text-[#43e97b] mb-2">🌳+ B+ Tree</h3>
            <ul className="flex flex-col gap-1.5">
              {['Data ONLY in leaf nodes', 'Internal nodes = routing keys', 'Leaves linked (range scans)', 'Used by MySQL, PostgreSQL'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#43e97b] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Time Complexity</h2>
          <div className="grid grid-cols-3 gap-2">
            {[['Search', 'O(log n)', '#43e97b'], ['Insert', 'O(log n)', '#4facfe'], ['Delete', 'O(log n)', '#ffd93d']].map(([op, complexity, color], i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg p-3 text-center">
                <div className="text-[0.65rem] text-white/40 mb-1">{op}</div>
                <div className="text-[0.85rem] font-bold font-mono" style={{ color }}>{complexity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
