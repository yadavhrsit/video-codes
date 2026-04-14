import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HEADERS = [
  { field: 'Method',  http: 'GET',                   https: 'GET',                   note: 'Same method' },
  { field: 'URL',     http: '/login',                https: '/login',               note: 'Same path' },
  { field: 'Host',    http: 'bank.com',              https: 'bank.com',             note: 'Same host' },
  { field: 'Body',    http: 'user=admin&pass=1234',  https: '🔒 [encrypted blob]',  note: 'HTTPS encrypts!' },
  { field: 'Cookie',  http: 'session=abc123',        https: '🔒 [encrypted blob]',  note: 'Protected in HTTPS' },
];

const ATTACK_TYPES = [
  { name: 'Man-in-the-Middle', icon: '🕵️', vulnerable: true, desc: 'Attacker intercepts and reads/modifies traffic between client and server.' },
  { name: 'Session Hijacking', icon: '🎭', vulnerable: true, desc: 'Attacker steals your session cookie from unencrypted traffic.' },
  { name: 'Credential Sniffing', icon: '👁️', vulnerable: true, desc: 'Passwords sent in plain text can be captured by network sniffers.' },
  { name: 'Certificate Pinning', icon: '📌', vulnerable: false, desc: 'HTTPS validates server identity — prevents impersonation.' },
];

export default function HTTPvsHTTPSDemo({ onBack }) {
  const [protocol, setProtocol] = useState('http'); // http | https
  const [showAttack, setShowAttack] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState(0);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">HTTP vs HTTPS</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            HTTP transfers data in <span className="text-[#ef4444] font-semibold">plain text</span>. HTTPS wraps HTTP inside <span className="text-[#43e97b] font-semibold">TLS encryption</span> — the "S" stands for Secure. Same protocol, encrypted channel.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why it matters:</span> On public WiFi, anyone can see your HTTP traffic — passwords, messages, everything. HTTPS encrypts the content so even if intercepted, it's unreadable. Modern browsers now warn users when sites use HTTP. Google ranks HTTPS sites higher.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'TLS', def: 'Transport Layer Security — the encryption protocol. Successor to SSL. Current version is TLS 1.3.' },
              { term: 'Certificate', def: 'A file proving a server\'s identity, signed by a trusted Certificate Authority (CA). Contains public key.' },
              { term: 'CA', def: 'Certificate Authority — trusted organizations (DigiCert, Let\'s Encrypt) that verify and sign certificates.' },
              { term: 'Public/Private Key', def: 'Asymmetric encryption pair. Public key encrypts; only the matching private key can decrypt.' },
              { term: 'HSTS', def: 'HTTP Strict Transport Security — tells browsers to always use HTTPS for this site. Prevents downgrade attacks.' },
              { term: 'Mixed Content', def: 'When an HTTPS page loads HTTP resources. Browsers block this because it breaks security.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#43e97b]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol toggle + traffic visualization */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Traffic Comparison</h2>
            <div className="flex bg-white/[0.06] rounded-lg p-0.5">
              <button onClick={() => setProtocol('http')}
                className={`px-4 py-1 rounded-md text-[0.7rem] font-bold transition-all duration-200 ${protocol === 'http' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'text-white/40'}`}>
                HTTP
              </button>
              <button onClick={() => setProtocol('https')}
                className={`px-4 py-1 rounded-md text-[0.7rem] font-bold transition-all duration-200 ${protocol === 'https' ? 'bg-[#43e97b]/20 text-[#43e97b]' : 'text-white/40'}`}>
                HTTPS
              </button>
            </div>
          </div>

          {/* Connection flow */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-[#667eea]/15 border border-[#667eea]/30 flex items-center justify-center text-xl mx-auto">💻</div>
              <span className="text-[0.6rem] text-white/40">Browser</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 mx-3">
              <div className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${protocol === 'https' ? 'bg-[#43e97b]/15 text-[#43e97b]' : 'bg-[#ef4444]/15 text-[#ef4444]'}`}>
                {protocol === 'https' ? '🔒 TLS Encrypted Channel' : '🔓 Plain Text Channel'}
              </div>
              <div className="w-full h-0.5 rounded-full" style={{ background: protocol === 'https' ? '#43e97b' : '#ef4444' }} />
              {protocol === 'https' && (
                <div className="text-[0.55rem] text-[#43e97b]/60">Port 443 · TLS 1.3</div>
              )}
              {protocol === 'http' && (
                <div className="text-[0.55rem] text-[#ef4444]/60">Port 80 · Unencrypted</div>
              )}
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-[#f093fb]/15 border border-[#f093fb]/30 flex items-center justify-center text-xl mx-auto">🖥️</div>
              <span className="text-[0.6rem] text-white/40">Server</span>
            </div>
          </div>

          {/* Request/Response headers comparison */}
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full text-[0.68rem]">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-3 py-1.5 text-white/35 font-semibold">Field</th>
                  <th className="text-left px-3 py-1.5 text-[#ef4444] font-semibold">HTTP Value</th>
                  <th className="text-left px-3 py-1.5 text-[#43e97b] font-semibold">HTTPS Value</th>
                </tr>
              </thead>
              <tbody>
                {HEADERS.map((h, i) => (
                  <tr key={i} className={`border-b border-white/[0.04] ${h.field === 'Body' || h.field === 'Cookie' ? 'bg-white/[0.02]' : ''}`}>
                    <td className="px-3 py-1.5 text-white/60 font-semibold">{h.field}</td>
                    <td className={`px-3 py-1.5 font-mono ${(h.field === 'Body' || h.field === 'Cookie') && protocol === 'http' ? 'text-[#ef4444]' : 'text-white/50'}`}>{h.http}</td>
                    <td className={`px-3 py-1.5 font-mono ${h.https.includes('🔒') ? 'text-[#43e97b]' : 'text-white/50'}`}>{h.https}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attack scenarios */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Attack Scenarios</h2>
          <div className="flex gap-2 flex-wrap mb-4">
            {ATTACK_TYPES.map((a, i) => (
              <button key={i} onClick={() => setSelectedAttack(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[0.7rem] font-medium transition-all duration-200
                  ${selectedAttack === i ? 'border-white/[0.25] bg-white/[0.07] text-white' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
                {a.icon} {a.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={selectedAttack} className={`rounded-xl border p-4 ${ATTACK_TYPES[selectedAttack].vulnerable ? 'border-[#ef4444]/30 bg-[#ef4444]/[0.06]' : 'border-[#43e97b]/30 bg-[#43e97b]/[0.06]'}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{ATTACK_TYPES[selectedAttack].icon}</span>
                <span className="text-[0.75rem] font-bold text-white">{ATTACK_TYPES[selectedAttack].name}</span>
                <span className={`text-[0.58rem] font-bold px-2 py-0.3 rounded-full ${ATTACK_TYPES[selectedAttack].vulnerable ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#43e97b]/20 text-[#43e97b]'}`}>
                  {ATTACK_TYPES[selectedAttack].vulnerable ? 'HTTP Vulnerable' : 'HTTPS Protected'}
                </span>
              </div>
              <p className="text-[0.72rem] text-white/55">{ATTACK_TYPES[selectedAttack].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* TLS handshake */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">TLS Handshake (simplified)</h2>
          <div className="flex flex-col gap-2">
            {[
              { step: '1', label: 'ClientHello',  color: '#667eea', desc: 'Browser says hello, lists supported encryption methods' },
              { step: '2', label: 'ServerHello',  color: '#4facfe', desc: 'Server picks encryption method, sends its certificate' },
              { step: '3', label: 'Certificate',  color: '#43e97b', desc: 'Browser verifies server certificate (is it really bank.com?)' },
              { step: '4', label: 'Key Exchange', color: '#ffd93d', desc: 'Both sides derive a shared secret key' },
              { step: '5', label: 'Encrypted!',   color: '#f093fb', desc: 'All future communication is encrypted with the shared key' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03]">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-bold text-white flex-shrink-0" style={{ background: s.color }}>{s.step}</div>
                <span className="text-[0.72rem] font-bold w-24 flex-shrink-0" style={{ color: s.color }}>{s.label}</span>
                <span className="text-[0.65rem] text-white/50">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
