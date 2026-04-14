import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SERVERS = [
  { id: 'S1', name: 'Server 1', color: '#667eea', capacity: 100 },
  { id: 'S2', name: 'Server 2', color: '#4facfe', capacity: 100 },
  { id: 'S3', name: 'Server 3', color: '#43e97b', capacity: 100 },
  { id: 'S4', name: 'Server 4', color: '#f093fb', capacity: 100 },
];

const ALGORITHMS = [
  { id: 'roundrobin', label: 'Round Robin', icon: '🔄', desc: 'Requests cycle through servers in order. Simple and fair.' },
  { id: 'leastconn',  label: 'Least Connections', icon: '📊', desc: 'Sends request to the server with fewest active connections.' },
  { id: 'random',     label: 'Random', icon: '🎲', desc: 'Randomly picks a server. Simple but can be uneven.' },
  { id: 'weighted',   label: 'Weighted', icon: '⚖️', desc: 'Assigns more traffic to more powerful servers.' },
];

export default function LoadBalancingDemo({ onBack }) {
  const [algorithm, setAlgorithm] = useState('roundrobin');
  const [loads, setLoads] = useState([25, 20, 30, 25]);
  const [requests, setRequests] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const intervalRef = useRef(null);
  const rrIdx = useRef(0);

  const simulate = () => {
    setSimulating(true);
    setRequests([]);
    setLoads([0, 0, 0, 0]);
    rrIdx.current = 0;
    let reqId = 0;

    intervalRef.current = setInterval(() => {
      reqId++;
      let target;
      if (algorithm === 'roundrobin') {
        target = rrIdx.current % 4;
        rrIdx.current++;
      } else if (algorithm === 'leastconn') {
        target = setLoads(prev => {
          const min = Math.min(...prev);
          return prev; // just for reading
        }) || 0;
        // Read current loads synchronously
        target = 0; // fallback - will be set below
      } else if (algorithm === 'random') {
        target = Math.floor(Math.random() * 4);
      } else { // weighted
        const weights = [4, 3, 2, 1]; // S1 gets 4x traffic
        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;
        target = 0;
        for (let i = 0; i < weights.length; i++) {
          r -= weights[i];
          if (r <= 0) { target = i; break; }
        }
      }

      setRequests(prev => [...prev.slice(-8), { id: reqId, target }]);
      setLoads(prev => {
        let t = target;
        if (algorithm === 'leastconn') {
          t = prev.indexOf(Math.min(...prev));
        }
        const next = [...prev];
        next[t] = Math.min(100, next[t] + (algorithm === 'weighted' ? (target === 0 ? 8 : target === 1 ? 6 : target === 2 ? 4 : 2) : 5));
        // Drain a bit
        return next.map(l => Math.max(0, l - 2));
      });

      if (reqId >= 16) {
        clearInterval(intervalRef.current);
        setSimulating(false);
      }
    }, 400);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Load Balancing</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            A load balancer <span className="text-[#667eea] font-semibold">distributes incoming requests</span> across multiple servers to ensure no single server is overwhelmed. Critical for high-availability systems handling millions of users.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why it matters:</span> Without load balancing, a single server handles all traffic — and when it goes down, everything fails. Load balancers provide redundancy (if one server dies, others continue), scalability (add more servers as traffic grows), and optimal resource utilization.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Health Check', def: 'Periodic pings to servers to verify they\'re alive. Unhealthy servers are removed from the pool until they recover.' },
              { term: 'Session Persistence', def: 'Also called "sticky sessions." Ensures a user\'s requests always go to the same server (important for shopping carts, etc.).' },
              { term: 'Failover', def: 'Automatic switching to a backup server when the primary fails. Essential for high availability (99.99% uptime).' },
              { term: 'Throughput', def: 'The number of requests a system can handle per second. Load balancers help maximize throughput across the cluster.' },
              { term: 'Reverse Proxy', def: 'A server that sits in front of web servers and forwards requests. Load balancers are a type of reverse proxy.' },
              { term: 'SSL Termination', def: 'Decrypting HTTPS at the load balancer so backend servers don\'t have to. Reduces CPU load on application servers.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALGORITHMS.map(alg => (
            <button key={alg.id} onClick={() => { setAlgorithm(alg.id); setLoads([0,0,0,0]); setRequests([]); }}
              className={`px-2 py-2.5 rounded-xl border text-center transition-all duration-200
                ${algorithm === alg.id ? 'border-[#667eea]/40 bg-[#667eea]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
              <div className="text-lg mb-0.5">{alg.icon}</div>
              <div className="text-[0.65rem] font-bold" style={{ color: algorithm === alg.id ? '#667eea' : 'rgba(255,255,255,0.55)' }}>{alg.label}</div>
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="bg-[#667eea]/[0.06] border border-[#667eea]/20 rounded-xl px-4 py-2.5">
          <p className="text-[0.7rem] text-white/55">{ALGORITHMS.find(a => a.id === algorithm)?.desc}
            {algorithm === 'weighted' && ' (S1:4 S2:3 S3:2 S4:1)'}
          </p>
        </div>

        {/* Simulation */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Simulation</h2>
            <button onClick={simulate} disabled={simulating}
              className="px-3 py-1 rounded-lg bg-[#667eea] text-white text-[0.68rem] font-semibold disabled:opacity-40 hover:bg-[#764ba2] transition-all">
              {simulating ? '⏳…' : '▶ Send 16 Requests'}
            </button>
          </div>

          {/* Architecture diagram */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-[#667eea]/15 border border-[#667eea]/30 flex items-center justify-center text-xl mx-auto">👥</div>
              <span className="text-[0.6rem] text-white/40">Users</span>
            </div>
            <div className="text-white/20 text-sm">→</div>
            <div className="text-center">
              <div className="w-16 h-14 rounded-xl bg-[#ffd93d]/15 border border-[#ffd93d]/30 flex items-center justify-center text-xl mx-auto">⚖️</div>
              <span className="text-[0.6rem] text-white/40">Load Balancer</span>
            </div>
            <div className="text-white/20 text-sm">→</div>
            <div className="flex gap-1">
              {SERVERS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-lg border flex items-center justify-center text-sm"
                    style={{ background: `${s.color}15`, borderColor: `${s.color}40` }}>🖥️</div>
                  <span className="text-[0.5rem] text-white/30">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Server load bars */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {SERVERS.map((server, i) => (
              <div key={i} className="text-center">
                <div className="text-[0.65rem] font-bold mb-1" style={{ color: server.color }}>{server.name}</div>
                <div className="h-24 bg-white/[0.06] rounded-lg overflow-hidden flex flex-col justify-end">
                  <div className="transition-all duration-300 rounded-t" style={{ height: `${loads[i]}%`, background: server.color }} />
                </div>
                <div className="text-[0.6rem] text-white/40 mt-1">{loads[i]}%</div>
              </div>
            ))}
          </div>

          {/* Request log */}
          {requests.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {requests.map((req, i) => (
                <motion.div key={req.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}
                  className="w-8 h-6 rounded flex items-center justify-center text-[0.55rem] font-bold text-white"
                  style={{ background: SERVERS[req.target].color }}>
                  S{req.target + 1}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Layer 4 vs Layer 7 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#4facfe] mb-2">🔗 Layer 4 (Transport)</h3>
            <ul className="flex flex-col gap-1.5">
              {['Routes based on IP & port', 'Fast — minimal inspection', 'Cannot see HTTP content', 'Examples: AWS NLB, HAProxy'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#4facfe] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#f093fb] mb-2">🌐 Layer 7 (Application)</h3>
            <ul className="flex flex-col gap-1.5">
              {['Routes based on URL / headers', 'Can do SSL termination', 'Content-aware routing', 'Examples: AWS ALB, Nginx'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#f093fb] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
