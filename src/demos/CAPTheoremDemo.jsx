import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PROPERTIES = [
  {
    id: 'consistency',
    name: 'Consistency',
    icon: '📋',
    color: '#667eea',
    desc: 'Every read receives the most recent write. All nodes see the same data at the same time.',
    example: 'You deposit $100. Any server you query immediately shows the updated balance.',
  },
  {
    id: 'availability',
    name: 'Availability',
    icon: '✅',
    color: '#43e97b',
    desc: 'Every request receives a response (not necessarily the most recent data). The system never goes down.',
    example: 'Even if one server is slow, you always get an answer — it might be slightly stale.',
  },
  {
    id: 'partition',
    name: 'Partition Tolerance',
    icon: '🔗',
    color: '#f093fb',
    desc: 'The system continues operating even if some nodes cannot communicate (network partition).',
    example: 'Two data centers lose their network link, but both keep serving requests independently.',
  },
];

const COMBINATIONS = [
  {
    id: 'cp',
    label: 'CP',
    colors: ['#667eea', '#f093fb'],
    title: 'Consistency + Partition Tolerance',
    sacrifice: 'Availability',
    desc: 'When a partition occurs, the system stops accepting writes to prevent inconsistency. Some requests will fail.',
    examples: ['Google Spanner', 'HBase', 'Zookeeper', 'MongoDB (strict mode)'],
    realWorld: 'Banking systems — you\'d rather the ATM be temporarily unavailable than show a wrong balance.',
  },
  {
    id: 'ap',
    label: 'AP',
    colors: ['#43e97b', '#f093fb'],
    title: 'Availability + Partition Tolerance',
    sacrifice: 'Consistency',
    desc: 'The system stays available during partitions, but different nodes might return stale/different data.',
    examples: ['Cassandra', 'DynamoDB', 'CouchDB', 'Redis Cluster'],
    realWorld: 'Social media feeds — it\'s OK if your friend\'s new post takes a few seconds to appear everywhere.',
  },
  {
    id: 'ca',
    label: 'CA',
    colors: ['#667eea', '#43e97b'],
    title: 'Consistency + Availability',
    sacrifice: 'Partition Tolerance',
    desc: 'Works perfectly when there are no network partitions. Single-node or LAN systems.',
    examples: ['Traditional SQL (single server)', 'PostgreSQL (single node)', 'MySQL (single node)'],
    realWorld: 'A local database on your laptop — no network = no partition possible.',
  },
];

export default function CAPTheoremDemo({ onBack }) {
  const [view, setView] = useState('theorem'); // theorem | scenarios
  const [selected, setSelected] = useState('cp');
  const [activePartition, setActivePartition] = useState(false);

  const combo = COMBINATIONS.find(c => c.id === selected);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent">CAP Theorem</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            The CAP Theorem states that a distributed system can guarantee at most <span className="text-[#f093fb] font-semibold">two of three properties</span> simultaneously: Consistency, Availability, and Partition Tolerance. This is the fundamental trade-off in system design.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The reality:</span> Network partitions WILL happen — switches fail, cables get cut, cloud regions go down. Since you can't prevent P, you're really choosing between CP (block writes during partition) or AP (allow stale reads). There's no perfect answer — it depends on your application's needs.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Strong Consistency', def: 'Every read sees the most recent write. Linearizability. CP systems sacrifice availability for this.' },
              { term: 'Eventual Consistency', def: 'Reads may return stale data, but all nodes will eventually converge to the same state. AP systems use this.' },
              { term: 'Quorum', def: 'A majority of nodes must agree on a write. If you have 5 nodes, a quorum is 3. Helps balance C vs A.' },
              { term: 'Split Brain', def: 'When a partition causes two groups of nodes to both think they are the leader. Very dangerous — can corrupt data.' },
              { term: 'Replication', def: 'Copying data across multiple nodes for fault tolerance. Synchronous (CP) vs asynchronous (AP) replication.' },
              { term: 'Consensus', def: 'Protocols (Paxos, Raft) that help nodes agree on a value despite failures. Foundation of CP systems.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#f093fb]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Three properties */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROPERTIES.map((p, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{p.icon}</span>
                <h3 className="text-[0.72rem] font-bold" style={{ color: p.color }}>{p.name}</h3>
              </div>
              <p className="text-[0.64rem] text-white/50 mb-2">{p.desc}</p>
              <div className="bg-white/[0.03] rounded-lg px-2.5 py-1.5 border border-white/[0.06]">
                <p className="text-[0.6rem] text-white/40 italic">"{p.example}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Triangle visual */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3 text-center">Pick Two — The Trade-off Triangle</h2>
          <div className="flex justify-center">
            <svg viewBox="0 0 300 220" className="w-full" style={{ maxWidth: '300px' }}>
              {/* Triangle */}
              <polygon points="150,20 40,190 260,190" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Edges (selectable combinations) */}
              {[
                { id: 'cp', x1: 150, y1: 20, x2: 40, y2: 190, label: 'CP', lx: 75, ly: 95 },
                { id: 'ap', x1: 150, y1: 20, x2: 260, y2: 190, label: 'AP', lx: 225, ly: 95 },
                { id: 'ca', x1: 40, y1: 190, x2: 260, y2: 190, label: 'CA', lx: 150, ly: 195 },
              ].map(edge => (
                <g key={edge.id} onClick={() => setSelected(edge.id)} className="cursor-pointer">
                  <line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                    stroke={selected === edge.id ? '#fff' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selected === edge.id ? 3 : 2} />
                  <text x={edge.lx} y={edge.ly} textAnchor="middle" fill={selected === edge.id ? '#fff' : 'rgba(255,255,255,0.4)'}
                    fontSize="11" fontWeight="bold">{edge.label}</text>
                </g>
              ))}

              {/* Vertices */}
              <circle cx={150} cy={20} r="6" fill="#667eea" />
              <text x={150} y={10} textAnchor="middle" fill="#667eea" fontSize="10" fontWeight="bold">C</text>

              <circle cx={40} cy={190} r="6" fill="#43e97b" />
              <text x={40} y={208} textAnchor="middle" fill="#43e97b" fontSize="10" fontWeight="bold">A</text>

              <circle cx={260} cy={190} r="6" fill="#f093fb" />
              <text x={260} y={208} textAnchor="middle" fill="#f093fb" fontSize="10" fontWeight="bold">P</text>

              {/* Center — "pick 2" */}
              <text x={150} y={115} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">pick 2</text>
            </svg>
          </div>

          {/* Selected combination detail */}
          <AnimatePresence mode="wait">
            <motion.div key={selected} className="mt-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[0.78rem] font-bold text-white">{combo.title}</h3>
                <span className="text-[0.62rem] px-2 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] font-bold">Sacrifices: {combo.sacrifice}</span>
              </div>
              <p className="text-[0.65rem] text-white/45 mb-2">{combo.desc}</p>
              <p className="text-[0.63rem] text-white/35 italic mb-2">"{combo.realWorld}"</p>
              <div className="flex gap-1.5 flex-wrap">
                {combo.examples.map((ex, i) => (
                  <span key={i} className="text-[0.6rem] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50 border border-white/[0.08]">{ex}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Network partition visual */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">What is a Network Partition?</h2>
            <button onClick={() => setActivePartition(p => !p)}
              className={`px-3 py-1 rounded-lg border text-[0.65rem] font-bold transition-all
                ${activePartition ? 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]' : 'border-white/[0.1] bg-white/[0.06] text-white/50 hover:text-white/70'}`}>
              {activePartition ? '💥 Partition Active' : '✓ Network OK'}
            </button>
          </div>

          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center justify-center gap-6">
              {/* Node A */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-[#667eea]/15 border border-[#667eea]/30 flex items-center justify-center text-lg">🖥️</div>
                <span className="text-[0.6rem] text-[#667eea] mt-1 font-bold">Node A</span>
                <span className="text-[0.55rem] text-white/30">New York</span>
              </div>

              {/* Connection / Partition */}
              <div className="flex flex-col items-center">
                {activePartition ? (
                  <>
                    <div className="text-[0.6rem] text-[#ef4444] font-bold">🚫</div>
                    <div className="w-20 h-px border-t-2 border-dashed border-[#ef4444]/50" />
                    <div className="text-[0.55rem] text-[#ef4444]/60 mt-1">Network Split!</div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-0.5 bg-[#43e97b]/40 rounded" />
                    <div className="text-[0.55rem] text-[#43e97b]/60 mt-1">Connected ✓</div>
                  </>
                )}
              </div>

              {/* Node B */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-[#4facfe]/15 border border-[#4facfe]/30 flex items-center justify-center text-lg">🖥️</div>
                <span className="text-[0.6rem] text-[#4facfe] mt-1 font-bold">Node B</span>
                <span className="text-[0.55rem] text-white/30">London</span>
              </div>
            </div>

            {activePartition && (
              <div className="mt-3 text-center">
                <p className="text-[0.64rem] text-white/40">
                  Both nodes keep serving users, but they can't sync. This is when CAP forces a choice:
                  <span className="text-[#667eea] font-semibold"> reject writes (CP)</span> or
                  <span className="text-[#43e97b] font-semibold"> allow stale reads (AP)</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
