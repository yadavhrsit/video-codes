import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { domains, phases } from '../data/roadmapData';
import './LandingPage.css';

// ─── Animated Counter ─────────────────────────────────────
function AnimatedCounter({ target, label, icon }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          let start = 0;
          const duration = 1200;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      ref={ref}
      className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl
                 px-5 py-4 text-center hover:border-white/[0.18]
                 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-3xl font-extrabold text-white">
        {count}<span className="text-[#667eea]">+</span>
      </div>
      <div className="text-[0.68rem] text-white/40 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────
const STATUS_META = {
  done:          { label: 'Live',    bg: '#43e97b', glow: 'rgba(67,233,123,0.4)',  text: '#1a1a2e' },
  'coming-soon': { label: 'Soon',    bg: '#ffd93d', glow: 'rgba(255,217,61,0.4)', text: '#1a1a2e' },
  planned:       { label: 'Planned', bg: '#74b9ff', glow: 'rgba(116,185,255,0.4)', text: '#1a1a2e' },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.58rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: m.bg, color: m.text, boxShadow: `0 0 8px ${m.glow}` }}
    >
      {status === 'done' && <span className="status-dot-live" />}
      {m.label}
    </span>
  );
}

// ─── Difficulty Badge ──────────────────────────────────────
const DIFF_COLORS = { Beginner: '#43e97b', Intermediate: '#ffd93d', Advanced: '#ff6b6b' };

function DifficultyBadge({ difficulty }) {
  return (
    <span className="text-[0.58rem] font-semibold uppercase tracking-wider" style={{ color: DIFF_COLORS[difficulty] }}>
      {difficulty}
    </span>
  );
}

// ─── Main Dashboard ───────────────────────────────────────
export default function LandingPage({ onNavigate }) {
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Computed stats
  const totalTopics = domains.reduce((s, d) => s + d.topics.length, 0);
  const doneTopics  = domains.reduce((s, d) => s + d.topics.filter(t => t.status === 'done').length, 0);
  const soonTopics  = domains.reduce((s, d) => s + d.topics.filter(t => t.status === 'coming-soon').length, 0);

  // Filter logic
  const visibleDomains = domains.filter(d => {
    if (selectedPhase && d.phase !== selectedPhase) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = d.name.toLowerCase().includes(q);
      const topicMatch = d.topics.some(t => t.title.toLowerCase().includes(q));
      if (!nameMatch && !topicMatch) return false;
    }
    return true;
  });

  const filterTopics = useCallback((topics) => {
    if (!searchQuery) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(t => t.title.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleTopicClick = (topic) => {
    if (topic.status === 'done' && topic.route) onNavigate(topic.route);
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f1a] text-white overflow-x-hidden">

      {/* ── Animated BG ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="relative z-10">

        {/* ── Header ──────────────────────────────── */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold gradient-text">TechVerse</span>
          </div>
          <input
            type="text"
            placeholder="Search topics…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 bg-white/[0.06] border border-white/[0.1] rounded-xl
                       px-4 py-2 text-sm text-white placeholder-white/40
                       focus:outline-none focus:border-[#667eea] focus:bg-[#667eea]/10
                       focus:shadow-[0_0_20px_rgba(102,126,234,0.15)]
                       transition-all duration-300"
          />
        </header>

        {/* ── Hero ────────────────────────────────── */}
        <section className="text-center px-4 pt-10 pb-8">
          <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3">
              Master <span className="gradient-text">Computer Science</span>
            </h1>
            <p className="text-white/45 text-sm sm:text-base max-w-xl mx-auto">
              156+ interactive visual demos across 12 domains. Built for engineers who learn by seeing.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex justify-center gap-3 flex-wrap mt-7 max-w-3xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AnimatedCounter target={totalTopics} label="Topics"      icon="📚" />
            <AnimatedCounter target={12}          label="Domains"     icon="🌐" />
            <AnimatedCounter target={doneTopics}  label="Live Demos"  icon="✅" />
            <AnimatedCounter target={soonTopics}  label="Coming Soon" icon="⏳" />
          </motion.div>
        </section>

        {/* ── Roadmap Phases ──────────────────────── */}
        <section className="px-4 py-5 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-4">
            Learning <span className="gradient-text">Roadmap</span>
          </h2>

          <div className="flex justify-center gap-3 flex-wrap">
            {phases.map((phase, idx) => (
              <motion.button
                key={phase.id}
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                className={`relative text-left pl-8 pr-5 py-3.5 rounded-2xl border transition-all duration-300 focus:outline-none
                  ${selectedPhase === phase.id
                    ? 'border-[#667eea]/50 bg-[#667eea]/10 shadow-[0_0_30px_rgba(102,126,234,0.15)]'
                    : 'border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] hover:-translate-y-1'
                  }`}
                style={{ minWidth: 200 }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.45 }}
              >
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full
                             flex items-center justify-center text-white text-[0.7rem] font-bold"
                  style={{ background: phase.color }}
                >
                  {phase.id}
                </span>
                <div className="text-sm font-bold" style={{ color: phase.color }}>{phase.title}</div>
                <div className="text-[0.68rem] text-white/35 mt-0.5">{phase.description}</div>
              </motion.button>
            ))}
          </div>

          {selectedPhase && (
            <div className="text-center mt-3">
              <button
                onClick={() => setSelectedPhase(null)}
                className="text-[0.72rem] text-white/40 hover:text-white/70 border border-white/[0.12]
                           hover:border-white/[0.25] rounded-lg px-3 py-1 bg-transparent
                           transition-all duration-200 focus:outline-none"
              >
                Clear filter ✕
              </button>
            </div>
          )}
        </section>

        {/* ── Domain Grid ───────────────────────── */}
        <section className="px-4 pb-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {selectedPhase
                ? <>{phases.find(p => p.id === selectedPhase)?.title} <span className="gradient-text">Domains</span></>
                : <>All <span className="gradient-text">Domains</span></>
              }
              <span className="text-white/30 text-base font-normal ml-2">({visibleDomains.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <AnimatePresence>
              {visibleDomains.map((domain, idx) => {
                const doneCount  = domain.topics.filter(t => t.status === 'done').length;
                const progress   = (doneCount / domain.topics.length) * 100;
                const isOpen     = expandedDomain === domain.id;
                const topicsShow = filterTopics(domain.topics);

                return (
                  <motion.div
                    key={domain.id}
                    className={`rounded-2xl border overflow-hidden transition-all duration-300
                      ${isOpen ? 'border-white/[0.2]' : 'border-white/[0.08]'}
                      bg-white/[0.04] hover:border-white/[0.16]`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: idx * 0.04, duration: 0.35 }}
                  >
                    {/* Card Header */}
                    <button
                      onClick={() => setExpandedDomain(isOpen ? null : domain.id)}
                      className="w-full text-left p-4 focus:outline-none"
                    >
                      {/* Top gradient bar */}
                      <div className="h-0.5 rounded-full mb-3" style={{ background: domain.gradientRaw }} />

                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center text-xl flex-shrink-0">
                          {domain.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white">{domain.name}</div>
                          <div className="text-[0.68rem] text-white/35 truncate">{domain.description}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xl font-extrabold" style={{ color: domain.color }}>{domain.topics.length}</div>
                          <div className="text-[0.6rem] text-white/30 uppercase tracking-wider">topics</div>
                        </div>
                        <div className={`text-[0.6rem] text-white/30 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%`, background: domain.gradientRaw }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[0.67rem] text-white/30">{doneCount} of {domain.topics.length} completed</span>
                        <span
                          className="text-[0.62rem] font-semibold border rounded-md px-1.5 py-0.5"
                          style={{ borderColor: domain.color, color: domain.color }}
                        >
                          Phase {domain.phase}
                        </span>
                      </div>
                    </button>

                    {/* ── Topics List ──────────────────────────── */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          className="border-t border-white/[0.06]"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="p-2.5 flex flex-col gap-1">
                            {topicsShow.map((topic, tidx) => (
                              <motion.div
                                key={topic.id}
                                onClick={() => handleTopicClick(topic)}
                                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg
                                  bg-white/[0.02] border border-transparent transition-all duration-200
                                  ${topic.status === 'done'
                                    ? 'cursor-pointer hover:bg-[#667eea]/10 hover:border-[#667eea]/20'
                                    : 'hover:bg-white/[0.05]'}`}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: tidx * 0.03, duration: 0.25 }}
                              >
                                {/* Left */}
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0
                                    ${topic.status === 'done'         ? 'bg-[#43e97b]/15 text-[#43e97b]' : ''}
                                    ${topic.status === 'coming-soon' ? 'bg-[#ffd93d]/15 text-[#ffd93d]' : ''}
                                    ${topic.status === 'planned'     ? 'bg-[#74b9ff]/15 text-[#74b9ff]' : ''}`}
                                  >
                                    {topic.status === 'done' ? '✓' : topic.status === 'coming-soon' ? '◎' : '○'}
                                  </div>
                                  <span className="text-[0.8rem] font-medium text-white/80 truncate">{topic.title}</span>
                                </div>

                                {/* Right */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <DifficultyBadge difficulty={topic.difficulty} />
                                  <StatusBadge status={topic.status} />
                                  {topic.status === 'done' && (
                                    <div className="play-btn w-5 h-5 rounded-full bg-[#667eea]/15 text-[#667eea]
                                                    flex items-center justify-center text-[0.55rem]
                                                    transition-all duration-200">
                                      ▶
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}

                            {topicsShow.length === 0 && (
                              <p className="text-center text-white/30 text-sm py-4">No matching topics</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {visibleDomains.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <p className="text-lg">No domains match your filters.</p>
              <button
                onClick={() => { setSelectedPhase(null); setSearchQuery(''); }}
                className="mt-3 text-sm text-[#667eea] hover:underline bg-transparent border-none cursor-pointer p-0 focus:outline-none"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* ── Footer ────────────────────────────── */}
        <footer className="border-t border-white/[0.05] max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-white/25 text-sm">156+ topics · 12 Computer Science domains</p>
          <p className="text-white/15 text-[0.7rem] mt-1">Content creation · YouTube · Social Media</p>
        </footer>
      </div>
    </div>
  );
}
