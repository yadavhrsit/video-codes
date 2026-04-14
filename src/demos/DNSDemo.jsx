import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DNS_STEPS = [
  { id: 0, from: 'Browser',       to: 'Local Cache',    label: 'Check local cache',         color: '#667eea', detail: 'Browser first checks if it already knows the IP from a recent visit.' },
  { id: 1, from: 'Browser',       to: 'Recursive Resolver', label: 'Ask DNS resolver',     color: '#4facfe', detail: 'Your ISP\'s recursive resolver is the "phone book helper".' },
  { id: 2, from: 'Resolver',      to: 'Root Server',    label: 'Query Root (.)',            color: '#43e97b', detail: 'Root servers know where TLD servers (.com, .org) live. There are only 13 root server clusters worldwide.' },
  { id: 3, from: 'Root Server',   to: 'Resolver',       label: 'Refer to .com TLD',         color: '#43e97b', detail: 'Root says: "I don\'t know google.com, but ask the .com TLD server".' },
  { id: 4, from: 'Resolver',      to: 'TLD Server',     label: 'Query .com TLD',            color: '#ffd93d', detail: 'TLD server manages all .com domains. It knows which nameserver handles google.com.' },
  { id: 5, from: 'TLD Server',    to: 'Resolver',       label: 'Refer to Google NS',        color: '#ffd93d', detail: 'TLD says: "For google.com, ask ns1.google.com".' },
  { id: 6, from: 'Resolver',      to: 'Auth Nameserver',label: 'Query Google NS',          color: '#f093fb', detail: 'Authoritative nameserver is the "source of truth" for google.com.' },
  { id: 7, from: 'Auth NS',       to: 'Resolver',       label: 'Return IP: 142.250.80.46', color: '#f093fb', detail: 'The authoritative server knows the exact IP address for www.google.com.' },
  { id: 8, from: 'Resolver',      to: 'Browser',        label: 'Return IP to browser',     color: '#667eea', detail: 'Resolver caches the result (for TTL duration) and returns IP to your browser.' },
];

const RECORD_TYPES = [
  { type: 'A',     desc: 'Maps domain → IPv4 address',            example: 'google.com → 142.250.80.46' },
  { type: 'AAAA',  desc: 'Maps domain → IPv6 address',            example: 'google.com → 2607:f8b0:4004::' },
  { type: 'CNAME', desc: 'Maps alias → another domain',           example: 'www.google.com → google.com' },
  { type: 'MX',    desc: 'Maps domain → mail server',             example: 'gmail.com → gmail-smtp-in.l.google.com' },
  { type: 'NS',    desc: 'Maps domain → nameserver',              example: 'google.com → ns1.google.com' },
  { type: 'TXT',   desc: 'Stores arbitrary text (SPF, DKIM)',     example: 'google.com → "v=spf1 include:..."' },
];

export default function DNSDemo({ onBack }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);
  const [domain, setDomain] = useState('www.google.com');

  const play = () => {
    setPlaying(true);
    setCurrentStep(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= DNS_STEPS.length) {
        clearInterval(intervalRef.current);
        setPlaying(false);
        return;
      }
      setCurrentStep(step);
    }, 1000);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setPlaying(false);
    setCurrentStep(-1);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">DNS Resolution</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            DNS is the <span className="text-[#667eea] font-semibold">internet's phone book</span>. When you type <code className="text-[#4facfe] text-[0.85rem]">google.com</code>, DNS translates it to an IP address like <code className="text-[#43e97b] text-[0.85rem]">142.250.80.46</code> so your browser knows where to connect.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why it matters:</span> Humans remember names, computers need numbers. Without DNS, you'd have to memorize IP addresses for every website. DNS also enables load balancing (one name → multiple IPs), geographic routing, and failover. It's one of the most critical pieces of internet infrastructure.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Recursive Resolver', def: 'The "middleman" (usually your ISP\'s) that does the full lookup for you, querying multiple servers until it gets an answer.' },
              { term: 'Authoritative Server', def: 'The server that has the definitive answer for a domain. It\'s the source of truth — no further lookups needed.' },
              { term: 'TLD', def: 'Top-Level Domain — the last part of a domain name (.com, .org, .io). Each TLD has its own servers.' },
              { term: 'TTL', def: 'Time To Live — how long (in seconds) a DNS record can be cached. Short TTL = faster updates, more queries.' },
              { term: 'DNS Propagation', def: 'The time for DNS changes to spread globally. Can take up to 48 hours because of caching at every level.' },
              { term: 'DNSSEC', def: 'DNS Security Extensions — cryptographically signs DNS records to prevent spoofing/poisoning attacks.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution flow animation */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">Resolution Flow</h2>
            <div className="flex gap-2">
              <button onClick={play} disabled={playing}
                className="px-3 py-1 rounded-lg bg-[#667eea] text-white text-[0.68rem] font-semibold disabled:opacity-40 hover:bg-[#764ba2] transition-all">
                {playing ? '⏳…' : '▶ Animate'}
              </button>
              <button onClick={reset} className="px-3 py-1 rounded-lg border border-white/[0.15] text-white/50 text-[0.68rem] hover:bg-white/[0.06] transition-all">Reset</button>
            </div>
          </div>

          <div className="text-center mb-3">
            <span className="text-[0.68rem] text-white/40">Resolving: </span>
            <span className="text-[0.78rem] font-mono text-[#667eea] font-bold">{domain}</span>
          </div>

          {/* Step timeline */}
          <div className="flex flex-col gap-1.5">
            {DNS_STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isDone = i < currentStep || (currentStep === DNS_STEPS.length - 1 && i <= currentStep);
              return (
                <div key={step.id}
                  className={`flex items-start gap-3 px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer
                    ${isActive ? 'border-white/[0.3] bg-white/[0.06] scale-[1.01]' : isDone ? 'border-white/[0.06] bg-white/[0.02]' : 'border-transparent'}`}
                  onClick={() => setCurrentStep(i)}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.55rem] font-bold flex-shrink-0 mt-0.5
                    ${isDone || isActive ? 'text-white' : 'text-white/30 bg-white/[0.06]'}`}
                    style={isDone || isActive ? { background: step.color } : {}}>
                    {isDone && !isActive ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[0.65rem] text-white/35">{step.from}</span>
                      <span className="text-[0.5rem] text-white/20">→</span>
                      <span className="text-[0.65rem] text-white/35">{step.to}</span>
                      <span className="text-[0.65rem] font-semibold" style={{ color: step.color }}>{step.label}</span>
                    </div>
                    {(isActive || i === currentStep) && (
                      <motion.p className="text-[0.62rem] text-white/45 mt-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {step.detail}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {currentStep === DNS_STEPS.length - 1 && (
            <div className="mt-3 bg-[#43e97b]/[0.08] border border-[#43e97b]/25 rounded-lg px-3 py-2">
              <p className="text-[0.7rem] text-[#43e97b] font-semibold">✓ Resolution complete! Browser connects to 142.250.80.46. Total time: ~50–100ms</p>
            </div>
          )}
        </div>

        {/* DNS Record Types */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">DNS Record Types</h2>
          <div className="flex flex-col gap-1.5">
            {RECORD_TYPES.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                <span className="text-[0.7rem] font-bold text-[#667eea] w-10 flex-shrink-0">{r.type}</span>
                <span className="text-[0.68rem] text-white/55 flex-1">{r.desc}</span>
                <span className="text-[0.6rem] font-mono text-white/30 hidden sm:block">{r.example}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Caching & TTL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.75rem] font-bold text-[#ffd93d] mb-2">⏱️ TTL (Time To Live)</h3>
            <ul className="flex flex-col gap-1.5">
              {['DNS responses are cached for TTL seconds', 'TTL set by domain owner', 'Short TTL = faster updates, more queries', 'Long TTL = fewer queries, slower updates'].map((item, i) => (
                <li key={i} className="text-[0.68rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#ffd93d] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.75rem] font-bold text-[#f093fb] mb-2">🏗️ Key Components</h3>
            <ul className="flex flex-col gap-1.5">
              {['Root Servers: 13 clusters, managed by IANA', 'TLD Servers: handle .com, .org, .net', 'Authoritative NS: source of truth per domain', 'Recursive Resolver: does the full lookup for you'].map((item, i) => (
                <li key={i} className="text-[0.68rem] text-white/55 flex items-start gap-1.5">
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
