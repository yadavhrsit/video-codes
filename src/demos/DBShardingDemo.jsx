import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SHARDING_METHODS = [
  {
    id: 'hash',
    name: 'Hash Sharding',
    icon: '#️⃣',
    color: '#667eea',
    desc: 'Hash the key to determine which shard stores the data. Distributes data evenly.',
    example: 'User ID 12345 → hash(12345) % 3 = shard 2',
    pros: ['Even data distribution', 'Simple to implement', 'Predictable shard selection'],
    cons: ['Resharding is expensive (adding shard)', 'Range queries are slow', 'No natural ordering'],
  },
  {
    id: 'range',
    name: 'Range Sharding',
    icon: '📊',
    color: '#4facfe',
    desc: 'Divide data into ranges. Each shard handles a contiguous range of keys.',
    example: 'Users A-M → Shard 1, Users N-Z → Shard 2',
    pros: ['Efficient range queries', 'Easy to add new shards at end', 'Natural ordering'],
    cons: ['Uneven distribution (hot shards)', 'Some shards get much more traffic', 'Requires rebalancing'],
  },
  {
    id: 'directory',
    name: 'Directory Sharding',
    icon: '📂',
    color: '#43e97b',
    desc: 'A lookup table maps each key to its shard. Most flexible but adds a lookup hop.',
    example: 'Lookup table: user_123 → shard 3, user_456 → shard 1',
    pros: ['Most flexible', 'Can move data between shards', 'Handles irregular distribution'],
    cons: ['Lookup table is a single point of failure', 'Extra network hop', 'Lookup table itself needs scaling'],
  },
];

// Simulate data distribution
const USERS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Karl', 'Laura'][i],
  hash: (i * 7 + 3) % 3, // deterministic "hash"
}));

export default function DBShardingDemo({ onBack }) {
  const [method, setMethod] = useState('hash');
  const [shardCount, setShardCount] = useState(3);
  const [query, setQuery] = useState('');

  const current = SHARDING_METHODS.find(m => m.id === method);

  // Assign users to shards based on method
  const getShardAssignments = () => {
    if (method === 'hash') {
      return USERS.map(u => ({ ...u, shard: u.hash % shardCount }));
    } else if (method === 'range') {
      // A-D = 0, E-H = 1, I-L = 2
      return USERS.map((u, i) => ({ ...u, shard: Math.floor(i / Math.ceil(USERS.length / shardCount)) % shardCount }));
    } else {
      // Directory: somewhat random but deterministic
      const dirs = [2, 0, 1, 2, 0, 1, 0, 2, 1, 0, 2, 1];
      return USERS.map((u, i) => ({ ...u, shard: dirs[i] % shardCount }));
    }
  };

  const assignments = getShardAssignments();
  const shards = Array.from({ length: shardCount }, (_, i) => assignments.filter(u => u.shard === i));

  const SHARD_COLORS = ['#667eea', '#43e97b', '#f093fb', '#4facfe', '#ffd93d'];
  const filteredUsers = query ? assignments.filter(u => u.name.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent">Database Sharding</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Sharding splits a database into smaller, independent pieces called <span className="text-[#f093fb] font-semibold">shards</span>, each stored on a separate server. It's the primary technique for horizontal scaling when a single DB can't handle the load.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">When you need it:</span> A single database server has limits — disk space, memory, CPU, network bandwidth. At scale (millions of users, terabytes of data), you hit those limits. Sharding lets you add servers to increase capacity linearly. Companies like Uber, Shopify, and Discord all use sharding.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Shard Key', def: 'The column used to determine which shard a row belongs to (e.g., user_id). Choosing the right key is critical.' },
              { term: 'Hot Shard', def: 'A shard that receives disproportionately more traffic. Happens with poor key choice (e.g., timestamps).' },
              { term: 'Resharding', def: 'Moving data between shards when adding/removing servers. Extremely expensive — often requires downtime.' },
              { term: 'Cross-Shard Query', def: 'A query that needs data from multiple shards. Must scatter-gather across all shards — slow and complex.' },
              { term: 'Shard Proxy', def: 'A middleware layer (like Vitess, ProxySQL) that routes queries to the correct shard. Simplifies app logic.' },
              { term: 'Consistent Hashing', def: 'A hashing technique that minimizes data movement when shards are added/removed. Used in modern systems.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#f093fb]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Method selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SHARDING_METHODS.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`px-3 py-2.5 rounded-xl border text-left transition-all duration-200
                ${method === m.id ? 'border-white/[0.25] bg-white/[0.07]' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm">{m.icon}</span>
                <span className="text-[0.68rem] font-bold" style={{ color: method === m.id ? m.color : 'rgba(255,255,255,0.5)' }}>{m.name}</span>
              </div>
              <p className="text-[0.58rem] text-white/30 ml-6">{m.desc.slice(0, 55)}…</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          <motion.div key={method} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{current.icon}</span>
              <h2 className="text-base font-bold" style={{ color: current.color }}>{current.name}</h2>
            </div>
            <p className="text-[0.67rem] text-white/45 mb-1">{current.desc}</p>
            <div className="bg-white/[0.03] rounded-lg px-3 py-1.5 border border-white/[0.06] mb-3">
              <code className="text-[0.67rem] text-[#a5f3fc] font-mono">💡 {current.example}</code>
            </div>

            {/* Pros / Cons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-[0.6rem] font-bold text-[#43e97b] uppercase tracking-wider mb-1">✓ Pros</div>
                {current.pros.map((p, i) => (
                  <div key={i} className="text-[0.63rem] text-white/50 flex items-start gap-1.5 mb-1">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#43e97b] flex-shrink-0" />{p}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[0.6rem] font-bold text-[#ef4444] uppercase tracking-wider mb-1">✗ Cons</div>
                {current.cons.map((c, i) => (
                  <div key={i} className="text-[0.63rem] text-white/50 flex items-start gap-1.5 mb-1">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#ef4444] flex-shrink-0" />{c}
                  </div>
                ))}
              </div>
            </div>

            {/* Shard count control */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[0.7rem] font-bold text-white">Data Distribution ({shardCount} shards)</h3>
              <div className="flex gap-1">
                <button onClick={() => setShardCount(s => Math.max(2, s - 1))} className="w-6 h-6 rounded bg-white/[0.06] border border-white/[0.1] text-[0.7rem] text-white/50 hover:bg-white/[0.1] transition-all">−</button>
                <button onClick={() => setShardCount(s => Math.min(5, s + 1))} className="w-6 h-6 rounded bg-white/[0.06] border border-white/[0.1] text-[0.7rem] text-white/50 hover:bg-white/[0.1] transition-all">+</button>
              </div>
            </div>

            {/* Shard visualization */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(shardCount, 3)}, 1fr)` }}>
              {shards.map((users, i) => (
                <div key={i} className="border rounded-xl p-2.5" style={{ borderColor: `${SHARD_COLORS[i]}30`, backgroundColor: `${SHARD_COLORS[i]}06` }}>
                  <div className="text-[0.62rem] font-bold mb-1.5 text-center" style={{ color: SHARD_COLORS[i] }}>
                    🗄️ Shard {i} ({users.length} records)
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {users.map(u => {
                      const isHighlighted = filteredUsers.some(fu => fu.id === u.id);
                      return (
                        <div key={u.id} className={`text-[0.6rem] px-2 py-0.5 rounded text-center transition-all ${isHighlighted ? 'bg-white/[0.15] text-white font-bold' : 'bg-white/[0.04] text-white/45'}`}>
                          #{u.id} {u.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Search query simulation */}
            <div className="mt-4">
              <label className="text-[0.6rem] font-bold text-white/35 uppercase tracking-wider mb-1 block">Search User (simulates query routing)</label>
              <div className="flex gap-2">
                <input value={query} onChange={e => setQuery(e.target.value)}
                  className="flex-1 bg-[#0a0a14] border border-white/[0.1] rounded-lg px-3 py-1.5 text-[0.72rem] text-[#a5f3fc] focus:border-[#f093fb]/50 focus:outline-none transition-colors"
                  placeholder="Type a name (e.g. Alice)..." />
              </div>
              {query && filteredUsers.length > 0 && (
                <div className="mt-2 bg-[#0a0a14] border border-white/[0.06] rounded-lg px-3 py-2">
                  {filteredUsers.map(u => (
                    <div key={u.id} className="text-[0.65rem] text-white/55">
                      Found <span className="text-[#a5f3fc] font-bold">{u.name}</span> → routed to <span className="font-bold" style={{ color: SHARD_COLORS[u.shard] }}>Shard {u.shard}</span>
                      {method === 'hash' && <span className="text-white/30"> (hash({u.id}) % {shardCount} = {u.shard})</span>}
                    </div>
                  ))}
                </div>
              )}
              {query && filteredUsers.length === 0 && (
                <div className="mt-2 text-[0.63rem] text-[#ef4444]/60">No user found matching "{query}"</div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Sharding vs Replication */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#f093fb] mb-2">🔀 Sharding (Horizontal Partitioning)</h3>
            <ul className="flex flex-col gap-1.5">
              {['Each shard has DIFFERENT data', 'Scales storage & write capacity', 'Complex cross-shard queries', 'Used when data is too large for one DB'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#f093fb] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#4facfe] mb-2">📋 Replication</h3>
            <ul className="flex flex-col gap-1.5">
              {['Each replica has SAME data', 'Scales read capacity', 'Simple consistency model', 'Used for high availability & read throughput'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#4facfe] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
