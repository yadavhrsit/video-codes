import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SCENARIOS = [
  { id: 'web',    label: 'Web Browsing',   icon: '🌐', best: 'tcp',  why: 'Every byte of HTML/CSS must arrive correctly and in order.' },
  { id: 'video',  label: 'Live Video',     icon: '📹', best: 'udp',  why: 'Dropping a frame is better than freezing. Speed > accuracy.' },
  { id: 'email',  label: 'Email',          icon: '📧', best: 'tcp',  why: 'Messages must be complete and reliably delivered.' },
  { id: 'game',   label: 'Online Gaming',  icon: '🎮', best: 'udp',  why: 'Latest position matters more than every old update.' },
  { id: 'dns',    label: 'DNS Lookup',     icon: '🔍', best: 'udp',  why: 'Small, fast queries. If lost, client retries itself.' },
  { id: 'file',   label: 'File Transfer',  icon: '📁', best: 'tcp',  why: 'File must arrive 100% intact — no missing bytes.' },
];

export default function TCPvsUDPDemo({ onBack }) {
  const [scenario, setScenario] = useState('web');
  const [simulating, setSimulating] = useState(false);
  const [packets, setPackets] = useState([]);
  const intervalRef = useRef(null);

  const current = SCENARIOS.find(s => s.id === scenario);

  const simulate = () => {
    setSimulating(true);
    setPackets([]);
    let id = 0;
    // Send 6 packets with some "lost" in the middle
    const sendPacket = (num, lost) => ({
      id: id++, num, protocol: current.best, status: lost ? 'lost' : 'sent', time: Date.now()
    });

    const seq = [
      { num: 1, lost: false },
      { num: 2, lost: false },
      { num: 3, lost: true },  // packet 3 is "lost"
      { num: 4, lost: false },
      { num: 5, lost: false },
      { num: 6, lost: false },
    ];

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= seq.length) {
        // If TCP, retransmit packet 3
        if (current.best === 'tcp') {
          setPackets(prev => [...prev, { id: id++, num: 3, protocol: 'tcp', status: 'retransmit', time: Date.now() }]);
          setTimeout(() => setSimulating(false), 600);
        } else {
          setSimulating(false);
        }
        clearInterval(intervalRef.current);
        return;
      }
      setPackets(prev => [...prev, sendPacket(seq[i].num, seq[i].lost)]);
      i++;
    }, 500);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">TCP vs UDP</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Both are <span className="text-[#667eea] font-semibold">Transport Layer</span> protocols. TCP prioritizes <span className="text-[#4facfe] font-semibold">reliability</span>; UDP prioritizes <span className="text-[#f093fb] font-semibold">speed</span>.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The trade-off:</span> TCP guarantees every byte arrives correctly and in order, but adds overhead (handshakes, acknowledgments). UDP sends data and hopes for the best — some packets may be lost or arrive out of order, but it's much faster. Your application chooses based on what matters more.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Segment (TCP)', def: 'A chunk of data with TCP header. Contains sequence numbers for ordering and checksums for integrity.' },
              { term: 'Datagram (UDP)', def: 'A self-contained packet with UDP header. No sequence numbers — order not guaranteed.' },
              { term: 'ACK', def: 'Acknowledgment — TCP receiver confirms it got the data. If sender doesn\'t get ACK, it retransmits.' },
              { term: 'Three-Way Handshake', def: 'SYN → SYN-ACK → ACK. How TCP establishes a connection before sending data.' },
              { term: 'Flow Control', def: 'TCP feature that prevents sender from overwhelming a slow receiver. Uses sliding window.' },
              { term: 'Congestion Control', def: 'TCP slows down when network is congested (packet loss detected). UDP doesn\'t care.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'TCP', color: '#4facfe', icon: '🛡️', props: [
              ['Connection', 'Connection-oriented (3-way handshake)'],
              ['Reliability', 'Guaranteed delivery + ordering'],
              ['Speed', 'Slower (overhead for acks)'],
              ['Error Check', 'Retransmits lost packets'],
              ['Use Cases', 'Web, Email, File Transfer, SSH'],
            ]},
            { name: 'UDP', color: '#f093fb', icon: '⚡', props: [
              ['Connection', 'Connectionless (fire & forget)'],
              ['Reliability', 'No guarantee — packets can be lost'],
              ['Speed', 'Faster (minimal overhead)'],
              ['Error Check', 'No retransmission'],
              ['Use Cases', 'Live Video, Gaming, DNS, VoIP'],
            ]},
          ].map(proto => (
            <div key={proto.name} className="bg-white/[0.04] border rounded-xl p-4" style={{ borderColor: `${proto.color}30` }}>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: proto.color }}>
                <span>{proto.icon}</span> {proto.name}
              </h3>
              <div className="flex flex-col gap-2">
                {proto.props.map(([key, val]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-[0.65rem] font-bold w-24 flex-shrink-0" style={{ color: proto.color }}>{key}</span>
                    <span className="text-[0.65rem] text-white/55">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scenario selector */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Which Protocol Wins?</h2>
          <div className="flex gap-2 flex-wrap mb-4">
            {SCENARIOS.map(s => (
              <button key={s.id} onClick={() => { setScenario(s.id); setPackets([]); setSimulating(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[0.7rem] font-medium transition-all duration-200
                  ${scenario === s.id ? 'border-white/[0.3] bg-white/[0.08] text-white' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[0.62rem] font-bold uppercase tracking-wider text-white/30">Best choice:</span>
              <span className="text-[0.72rem] font-bold" style={{ color: current.best === 'tcp' ? '#4facfe' : '#f093fb' }}>
                {current.best.toUpperCase()}
              </span>
            </div>
            <p className="text-[0.7rem] text-white/55">{current.why}</p>
          </div>

          {/* Packet simulation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.68rem] font-bold text-white/40">Packet Simulation</span>
              <button onClick={simulate} disabled={simulating}
                className="px-3 py-1 rounded-lg bg-[#667eea] text-white text-[0.68rem] font-semibold disabled:opacity-40 hover:bg-[#764ba2] transition-all">
                {simulating ? '⏳…' : '▶ Send Packets'}
              </button>
            </div>
            <div className="flex gap-1.5 flex-wrap min-h-[36px] items-center">
              {packets.map(p => (
                <motion.div key={p.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}
                  className={`w-10 h-8 rounded-lg flex flex-col items-center justify-center border text-[0.55rem] font-bold
                    ${p.status === 'lost'        ? 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]' :
                      p.status === 'retransmit'  ? 'border-[#ffd93d]/40 bg-[#ffd93d]/10 text-[#ffd93d]' :
                                                   'border-[#43e97b]/30 bg-[#43e97b]/[0.08] text-[#43e97b]'}`}>
                  <span>#{p.num}</span>
                  <span className="text-[0.45rem] opacity-60">{p.status === 'lost' ? '✗' : p.status === 'retransmit' ? '↻' : '✓'}</span>
                </motion.div>
              ))}
            </div>
            {packets.length > 0 && !simulating && (
              <p className="text-[0.65rem] mt-2" style={{ color: current.best === 'tcp' ? '#4facfe' : '#f093fb' }}>
                {current.best === 'tcp'
                  ? '✓ TCP detected lost packet #3 → retransmitted automatically.'
                  : '⚡ UDP: packet #3 lost — no retransmission. App handles it.'}
              </p>
            )}
          </div>
        </div>

        {/* TCP handshake */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">TCP Three-Way Handshake</h2>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-[#4facfe]/15 border border-[#4facfe]/30 flex items-center justify-center text-xl">💻</div>
              <span className="text-[0.6rem] text-white/40">Client</span>
            </div>
            <div className="flex-1 flex flex-col gap-2 justify-center">
              {[
                { dir: '→', label: 'SYN', color: '#4facfe', desc: 'I want to connect' },
                { dir: '←', label: 'SYN-ACK', color: '#43e97b', desc: 'OK, I acknowledge' },
                { dir: '→', label: 'ACK', color: '#ffd93d', desc: 'Connection established!' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[0.6rem] font-bold w-6 text-center" style={{ color: step.color }}>{step.dir}</span>
                  <div className="flex-1 h-0.5 rounded-full" style={{ background: step.color }} />
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full" style={{ color: step.color, background: `${step.color}15` }}>{step.label}</span>
                  <span className="text-[0.58rem] text-white/35 w-36">{step.desc}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-[#f093fb]/15 border border-[#f093fb]/30 flex items-center justify-center text-xl">🖥️</div>
              <span className="text-[0.6rem] text-white/40">Server</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
