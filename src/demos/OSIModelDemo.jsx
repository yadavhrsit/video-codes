import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LAYERS = [
  { id: 7, name: 'Application',  abbr: 'App',  color: '#667eea', icon: '🌐', protocols: ['HTTP', 'FTP', 'SMTP', 'DNS'], pdu: 'Data',     role: 'User-facing services. Where you interact with the network.',         example: 'Your browser sends an HTTP request to load a webpage.' },
  { id: 6, name: 'Presentation', abbr: 'Pres', color: '#a29bfe', icon: '🎨', protocols: ['SSL/TLS', 'JPEG', 'ASCII'],   pdu: 'Data',     role: 'Formats, encrypts, and compresses data for transmission.',          example: 'HTTPS encrypts your data before sending it over the network.' },
  { id: 5, name: 'Session',      abbr: 'Sess', color: '#74b9ff', icon: '🤝', protocols: ['NetBIOS', 'RPC', 'PPTP'],       pdu: 'Data',     role: 'Manages communication sessions between two devices.',              example: 'A video call maintains a session between your PC and the server.' },
  { id: 4, name: 'Transport',    abbr: 'Trans',color: '#4facfe', icon: '📦', protocols: ['TCP', 'UDP'],                    pdu: 'Segment',  role: 'Reliable end-to-end communication. Error checking & flow control.', example: 'TCP breaks your file into segments and ensures each arrives.' },
  { id: 3, name: 'Network',      abbr: 'Net',  color: '#43e97b', icon: '🗺️', protocols: ['IP', 'ICMP', 'ARP'],            pdu: 'Packet',   role: 'Routes packets across networks. Logical addressing (IP).',          example: 'IP adds source & destination addresses to each packet.' },
  { id: 2, name: 'Data Link',    abbr: 'DL',   color: '#ffd93d', icon: '🔗', protocols: ['Ethernet', 'Wi-Fi', 'PPP'],      pdu: 'Frame',    role: 'Handles node-to-node communication on a single network segment.',   example: 'Ethernet frames data for transmission on your local network.' },
  { id: 1, name: 'Physical',     abbr: 'Phys', color: '#ff6b6b', icon: '⚡', protocols: ['USB', 'Bluetooth', '5G'],         pdu: 'Bits',     role: 'Transmits raw bits over physical media (cables, radio waves).',    example: 'Light pulses travel through fiber optic cables as 1s and 0s.' },
];

export default function OSIModelDemo({ onBack }) {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [packetFlow, setPacketFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(-1);

  const startPacketFlow = () => {
    setPacketFlow(true);
    setFlowStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step > 13) { clearInterval(interval); setPacketFlow(false); setFlowStep(-1); return; }
      setFlowStep(step);
    }, 600);
  };

  // Flow: 0-6 = sender going down, 7 = network, 8-14 = receiver going up
  const getSenderHighlight = () => {
    if (flowStep >= 0 && flowStep <= 6) return 6 - flowStep; // index 0=layer7, going down
    return -1;
  };
  const getReceiverHighlight = () => {
    if (flowStep >= 8 && flowStep <= 13) return flowStep - 8; // going up: physical first
    return -1;
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">OSI Model</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Open Systems Interconnection</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            The OSI model is a <span className="text-[#667eea] font-semibold">7-layer conceptual framework</span> that describes how data travels from one computer to another. Each layer has a specific responsibility — data gets wrapped (encapsulated) as it goes down, and unwrapped as it goes up.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed mb-3">
            <span className="text-white/60 font-semibold">Why it matters:</span> When debugging network issues, understanding OSI helps you pinpoint which layer is failing. Can't reach a server? Is it a DNS issue (Layer 7), a routing problem (Layer 3), or a cable unplugged (Layer 1)?
          </p>
          <div className="bg-[#667eea]/[0.08] rounded-lg px-3 py-2 border border-[#667eea]/20">
            <span className="text-[0.65rem] font-bold text-[#667eea]">Mnemonic to remember (top to bottom):</span>
            <span className="text-[0.65rem] text-white/50 ml-2">"<strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing"</span>
          </div>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Encapsulation', def: 'Each layer adds its own header to the data as it travels down. Like putting a letter in an envelope, then in a package, then in a shipping container.' },
              { term: 'PDU (Protocol Data Unit)', def: 'The name for data at each layer: Bits → Frames → Packets → Segments → Data. Each layer wraps the previous layer\'s PDU.' },
              { term: 'Protocol', def: 'A set of rules for communication. HTTP, TCP, IP are protocols that define how data should be formatted and transmitted.' },
              { term: 'Socket', def: 'An endpoint for communication: IP address + port number. Like a phone number + extension.' },
              { term: 'Latency', def: 'The time delay for data to travel from source to destination. Measured in milliseconds (ms).' },
              { term: 'Bandwidth', def: 'The maximum data transfer rate of a network. Like the width of a pipe — how much can flow through at once.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Packet Flow Animation */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">Packet Flow Simulation</h2>
            <button onClick={startPacketFlow} disabled={packetFlow}
              className="px-3 py-1 rounded-lg bg-[#667eea] text-white text-[0.7rem] font-semibold disabled:opacity-40 hover:bg-[#764ba2] transition-all duration-200">
              {packetFlow ? '⏳ Flowing…' : '▶ Simulate'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Sender */}
            <div>
              <div className="text-[0.65rem] font-bold text-white/40 text-center mb-2 uppercase tracking-wider">📤 Sender (Encapsulate)</div>
              <div className="flex flex-col gap-0.5">
                {LAYERS.map((layer, idx) => (
                  <div key={layer.id}
                    className={`rounded-md px-2.5 py-1.5 flex items-center gap-2 transition-all duration-300 border
                      ${getSenderHighlight() === idx
                        ? 'border-white/[0.4] scale-105 shadow-lg'
                        : 'border-transparent'
                      }`}
                    style={{
                      background: getSenderHighlight() === idx ? `${layer.color}30` : `${layer.color}08`,
                    }}
                  >
                    <span className="text-sm">{layer.icon}</span>
                    <span className="text-[0.65rem] font-semibold" style={{ color: layer.color }}>{layer.abbr}</span>
                    <span className="text-[0.58rem] text-white/40">{layer.pdu}</span>
                    {getSenderHighlight() === idx && <span className="ml-auto text-[0.55rem] text-[#667eea]">↓ wrap</span>}
                  </div>
                ))}
              </div>
            </div>
            {/* Network in between */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className={`text-2xl transition-all duration-300 ${flowStep === 7 ? 'scale-125' : ''}`}>🌐</div>
              <div className="text-[0.6rem] text-white/30 text-center">Physical<br/>Network</div>
              {flowStep === 7 && <div className="text-[0.55rem] text-[#43e97b] animate-pulse">transmitting…</div>}
            </div>
            {/* Receiver */}
            <div>
              <div className="text-[0.65rem] font-bold text-white/40 text-center mb-2 uppercase tracking-wider">📥 Receiver (Decapsulate)</div>
              <div className="flex flex-col gap-0.5" style={{ flexDirection: 'column-reverse' }}>
                {LAYERS.map((layer, idx) => (
                  <div key={layer.id}
                    className={`rounded-md px-2.5 py-1.5 flex items-center gap-2 transition-all duration-300 border
                      ${getReceiverHighlight() === idx
                        ? 'border-white/[0.4] scale-105 shadow-lg'
                        : 'border-transparent'
                      }`}
                    style={{
                      background: getReceiverHighlight() === idx ? `${layer.color}30` : `${layer.color}08`,
                    }}
                  >
                    <span className="text-sm">{layer.icon}</span>
                    <span className="text-[0.65rem] font-semibold" style={{ color: layer.color }}>{layer.abbr}</span>
                    <span className="text-[0.58rem] text-white/40">{layer.pdu}</span>
                    {getReceiverHighlight() === idx && <span className="ml-auto text-[0.55rem] text-[#667eea]">↑ unwrap</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Layer details — click to expand */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Layer Details — Click to Explore</h2>
          <div className="flex flex-col gap-1.5">
            {LAYERS.map((layer, idx) => (
              <div key={layer.id}>
                <button onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200
                    ${selectedLayer === layer.id
                      ? 'border-white/[0.2] bg-white/[0.06]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.65rem] font-bold text-white flex-shrink-0"
                    style={{ background: layer.color }}>{layer.id}</div>
                  <span className="text-sm">{layer.icon}</span>
                  <span className="text-[0.78rem] font-semibold text-white flex-1">{layer.name}</span>
                  <span className="text-[0.6rem] text-white/30">{layer.protocols.join(' · ')}</span>
                  <span className={`text-[0.55rem] text-white/30 transition-transform duration-200 ${selectedLayer === layer.id ? 'rotate-180' : ''}`}>▼</span>
                </button>

                <AnimatePresence>
                  {selectedLayer === layer.id && (
                    <motion.div className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                      <div className="ml-10 mt-1.5 mb-1 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-[0.72rem] text-white/60 mb-2">{layer.role}</p>
                        <p className="text-[0.68rem] text-[#4facfe] italic">💡 {layer.example}</p>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {layer.protocols.map(p => (
                            <span key={p} className="text-[0.58rem] font-semibold px-2 py-0.5 rounded-full border"
                              style={{ borderColor: `${layer.color}40`, color: layer.color, background: `${layer.color}10`}}>{p}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* TCP/IP comparison */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">OSI vs TCP/IP Model</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[0.68rem] font-bold text-white/40 text-center mb-2">OSI (7 layers)</div>
              {['Application','Presentation','Session','Transport','Network','Data Link','Physical'].map((l, i) => (
                <div key={i} className="text-center text-[0.6rem] text-white/50 border border-white/[0.06] rounded px-1.5 py-0.5 mb-0.5">{l}</div>
              ))}
            </div>
            <div>
              <div className="text-[0.68rem] font-bold text-white/40 text-center mb-2">TCP/IP (4 layers)</div>
              <div className="text-center text-[0.6rem] text-[#667eea] border border-[#667eea]/20 rounded px-1.5 py-1.5 mb-0.5">Application</div>
              <div className="text-center text-[0.6rem] text-[#4facfe] border border-[#4facfe]/20 rounded px-1.5 py-0.5 mb-0.5">Transport</div>
              <div className="text-center text-[0.6rem] text-[#43e97b] border border-[#43e97b]/20 rounded px-1.5 py-1 mb-0.5">Internet</div>
              <div className="text-center text-[0.6rem] text-[#ffd93d] border border-[#ffd93d]/20 rounded px-1.5 py-1.5">Network Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
