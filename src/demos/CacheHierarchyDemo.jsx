import { useState } from 'react';
import { motion } from 'framer-motion';

const CACHE_LEVELS = [
  { id: 'l1', name: 'L1 Cache', size: '32-64 KB', latency: '~1 ns', speed: '4 cycles', color: '#43e97b', icon: '⚡', desc: 'Fastest, smallest. Per-core. Holds the most recently used data.', hitRate: '~95%' },
  { id: 'l2', name: 'L2 Cache', size: '256 KB - 1 MB', latency: '~3-5 ns', speed: '12 cycles', color: '#4facfe', icon: '💨', desc: 'Slightly larger, shared or per-core. Fallback when L1 misses.', hitRate: '~90%' },
  { id: 'l3', name: 'L3 Cache', size: '6-32 MB', latency: '~10-20 ns', speed: '40 cycles', color: '#ffd93d', icon: '📦', desc: 'Shared across all cores. Much larger. Last cache before RAM.', hitRate: '~75%' },
  { id: 'ram', name: 'RAM', size: '8-128 GB', latency: '~50-100 ns', speed: '200 cycles', color: '#f093fb', icon: '🏗️', desc: 'Main memory. Very large but much slower than caches.', hitRate: 'N/A' },
  { id: 'disk', name: 'SSD / HDD', size: '500 GB+', latency: '~100 µs+', speed: '100,000+ cycles', color: '#ef4444', icon: '💿', desc: 'Persistent storage. Hundreds of thousands of times slower than L1.', hitRate: 'N/A' },
];

// Simulate a memory access
function simulateAccess(level) {
  // Returns the path taken
  const path = [];
  for (let i = 0; i < CACHE_LEVELS.length; i++) {
    path.push(CACHE_LEVELS[i].id);
    if (CACHE_LEVELS[i].id === level) break;
  }
  return path;
}

export default function CacheHierarchyDemo({ onBack }) {
  const [selected, setSelected] = useState(null); // which level we're simulating a hit at
  const [accessPath, setAccessPath] = useState([]);

  const simulateHitAt = (levelId) => {
    setSelected(levelId);
    setAccessPath(simulateAccess(levelId));
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#fd79a8] to-[#e84393] bg-clip-text text-transparent">Cache Hierarchy</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            CPUs use a <span className="text-[#fd79a8] font-semibold">hierarchy of memory</span> to balance speed and size. The fastest memory (L1 cache) is tiny; the largest (SSD) is slow. The CPU checks each level in order until it finds the data.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why it matters:</span> RAM is 100x slower than the CPU. If every instruction fetched data from RAM, your computer would crawl. Caches exploit "locality" — programs tend to access the same data repeatedly (temporal) and nearby data (spatial). By keeping recently-used data in fast, small caches, we get most of the speed of SRAM at most of the capacity of DRAM.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Cache Hit', def: 'Data is found in the cache. Fast! No need to check slower memory levels.' },
              { term: 'Cache Miss', def: 'Data not in cache — must fetch from a slower level. Causes a stall while waiting.' },
              { term: 'Hit Rate', def: 'Percentage of accesses that hit. L1 typically has 95%+ hit rate. Higher is better.' },
              { term: 'Latency', def: 'Time to access data. L1: ~1ns, RAM: ~100ns, SSD: ~100,000ns. Exponential differences.' },
              { term: 'Cache Line', def: 'The unit of data transfer. Typically 64 bytes. Even if you need 1 byte, the whole line is fetched.' },
              { term: 'Locality', def: 'The principle caches exploit. Temporal: reuse same data. Spatial: access nearby data.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#fd79a8]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hierarchy visual */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">Memory Hierarchy</h2>
            <span className="text-[0.6rem] text-white/30">Click a level to simulate access</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {CACHE_LEVELS.map((level, i) => {
              const isHitTarget = selected === level.id;
              const isInPath = accessPath.includes(level.id);
              const isMiss = isInPath && !isHitTarget;
              const widthPercent = 100 - i * 15; // visual sizing

              return (
                <button key={level.id} onClick={() => simulateHitAt(level.id)}
                  className={`relative rounded-xl border px-4 py-3 text-left transition-all duration-300 hover:scale-[1.01]
                    ${isHitTarget ? `border-[${level.color}]/50 bg-[${level.color}]/10 shadow-[0_0_15px_${level.color}20]` : isMiss ? 'border-[#ef4444]/30 bg-[#ef4444]/[0.06]' : 'border-white/[0.08] bg-white/[0.03]'}`}
                  style={{
                    width: `${widthPercent}%`,
                    borderColor: isHitTarget ? `${level.color}60` : isMiss ? '#ef4444' + '40' : undefined,
                    backgroundColor: isHitTarget ? `${level.color}12` : isMiss ? '#ef4444' + '08' : undefined,
                  }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{level.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[0.72rem] font-bold" style={{ color: level.color }}>{level.name}</span>
                          {isMiss && <span className="text-[0.55rem] font-bold text-[#ef4444]">MISS ↓</span>}
                          {isHitTarget && <span className="text-[0.55rem] font-bold text-[#43e97b]">HIT ✓</span>}
                        </div>
                        <span className="text-[0.6rem] text-white/35">{level.desc}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[0.62rem] text-white/40">{level.size}</span>
                      <span className="text-[0.6rem] font-bold" style={{ color: level.color }}>{level.latency}</span>
                      <span className="text-[0.55rem] text-white/25">{level.speed}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Access result */}
          {selected && (
            <div className="mt-4 bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-[0.63rem] text-white/40 flex items-center gap-1 flex-wrap">
                <span className="text-white/50 font-bold">CPU requests data →</span>
                {accessPath.map((id, i) => {
                  const level = CACHE_LEVELS.find(l => l.id === id);
                  const isHit = id === selected;
                  return (
                    <span key={id} className="flex items-center gap-1">
                      <span className={`px-1.5 py-0.3 rounded text-[0.6rem] font-bold ${isHit ? 'bg-[#43e97b]/15 text-[#43e97b]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
                        {level.name} {isHit ? '✓' : '✗'}
                      </span>
                      {!isHit && <span className="text-white/20">→</span>}
                    </span>
                  );
                })}
              </div>
              <div className="mt-1.5">
                <span className="text-[0.62rem] font-bold" style={{ color: CACHE_LEVELS.find(l => l.id === selected)?.color }}>
                  Found at {CACHE_LEVELS.find(l => l.id === selected)?.name}
                  ({CACHE_LEVELS.find(l => l.id === selected)?.latency})
                  {accessPath.length > 1 && ` — checked ${accessPath.length - 1} level${accessPath.length > 2 ? 's' : ''} first`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Speed comparison */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Speed Comparison (relative)</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: 'L1 Cache', cycles: 4, color: '#43e97b' },
              { label: 'L2 Cache', cycles: 12, color: '#4facfe' },
              { label: 'L3 Cache', cycles: 40, color: '#ffd93d' },
              { label: 'RAM', cycles: 200, color: '#f093fb' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-20 text-[0.65rem] font-bold text-white/60 text-right">{item.label}</div>
                <div className="flex-1 h-4 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(item.cycles / 200) * 100}%`, background: item.color }} />
                </div>
                <span className="text-[0.6rem] text-white/35 w-20">{item.cycles} cycles</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key insight */}
        <div className="bg-[#43e97b]/[0.06] border border-[#43e97b]/20 rounded-xl px-4 py-3">
          <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-1">🔬 Why Caches Matter</h3>
          <p className="text-[0.65rem] text-white/50">
            If every memory access went straight to RAM, a modern CPU would be <span className="text-white/70 font-semibold">50x slower</span>. L1 cache hit rates of ~95% are what make modern processors fast. CPU designers spend enormous effort optimizing cache — it's one of the most important performance factors in hardware design.
          </p>
        </div>
      </div>
    </div>
  );
}
