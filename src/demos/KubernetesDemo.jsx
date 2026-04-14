import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONCEPTS = [
  {
    id: 'pod',
    name: 'Pod',
    icon: '📦',
    color: '#667eea',
    desc: 'The smallest deployable unit in K8s. A Pod wraps one or more containers that share the same network and storage.',
    analogy: 'Think of a Pod as a single "instance" of your app. If it crashes, K8s creates a new one.',
    visual: { type: 'pod', containers: ['nginx', 'sidecar'] },
  },
  {
    id: 'deployment',
    name: 'Deployment',
    icon: '🚀',
    color: '#4facfe',
    desc: 'Manages a group of identical Pods (replicas). Handles rolling updates and rollbacks automatically.',
    analogy: 'A Deployment says "I want 3 copies of this Pod running at all times." K8s keeps it true.',
    visual: { type: 'deployment', replicas: 3 },
  },
  {
    id: 'service',
    name: 'Service',
    icon: '🔀',
    color: '#43e97b',
    desc: 'A stable network endpoint that routes traffic to Pods. Pods come and go, but the Service IP stays the same.',
    analogy: 'Like a DNS name + load balancer. Clients talk to the Service, not individual Pods.',
    visual: { type: 'service', pods: 3 },
  },
  {
    id: 'node',
    name: 'Node',
    icon: '🖥️',
    color: '#f093fb',
    desc: 'A physical or virtual machine that runs Pods. The Scheduler decides which Node runs which Pod.',
    analogy: 'Nodes are the actual servers in your cluster. K8s distributes Pods across them.',
    visual: { type: 'node', nodes: 3, pods: [2, 1, 2] },
  },
  {
    id: 'namespace',
    name: 'Namespace',
    icon: '📁',
    color: '#ffd93d',
    desc: 'Virtual isolation within a cluster. Different teams can share the same cluster without conflicts.',
    analogy: 'Like folders in a file system. Each team gets their own Namespace with isolated resources.',
    visual: { type: 'namespace', ns: ['frontend', 'backend', 'monitoring'] },
  },
];

const ARCHITECTURE = [
  { name: 'Control Plane', icon: '🧠', items: ['API Server', 'Scheduler', 'Controller Manager', 'etcd'], color: '#667eea', desc: 'Manages cluster state' },
  { name: 'Worker Nodes', icon: '⚙️', items: ['kubelet', 'kube-proxy', 'Container Runtime'], color: '#43e97b', desc: 'Run the actual workloads' },
];

export default function KubernetesDemo({ onBack }) {
  const [selected, setSelected] = useState(0);
  const concept = CONCEPTS[selected];
  const [podCount, setPodCount] = useState(3);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#a29bfe] to-[#6c5ce7] bg-clip-text text-transparent">Kubernetes</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Kubernetes (K8s) is an open-source <span className="text-[#a29bfe] font-semibold">container orchestration platform</span> that automates deployment, scaling, and management of containerized applications across clusters of hosts.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The problem it solves:</span> Running containers on one server is easy. Running hundreds of containers across dozens of servers — with auto-scaling, rolling updates, self-healing, and load balancing — is not. K8s handles all of this automatically. You declare "I want 3 replicas of my app" and K8s makes it happen.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'kubectl', def: 'The command-line tool for interacting with K8s. "kubectl get pods" lists all running pods.' },
              { term: 'ConfigMap', def: 'A K8s resource for storing non-secret configuration data. Separate config from code.' },
              { term: 'Secret', def: 'Like ConfigMap but encrypted. For passwords, API keys, certificates. Base64 encoded at rest.' },
              { term: 'Ingress', def: 'Routes external HTTP/HTTPS traffic to Services inside the cluster. Acts as an API gateway.' },
              { term: 'Helm', def: 'A package manager for K8s. Helm "charts" are reusable templates for deploying applications.' },
              { term: 'etcd', def: 'A distributed key-value store that holds all cluster state. The brain of K8s — if etcd is lost, your cluster is gone.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#a29bfe]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Concept selector */}
        <div className="flex gap-1.5 flex-wrap">
          {CONCEPTS.map((c, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`px-3 py-1.5 rounded-lg border text-[0.68rem] font-medium transition-all duration-200
                ${selected === i ? 'border-white/[0.25] bg-white/[0.07]' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
              <span className="mr-1">{c.icon}</span>
              <span style={{ color: selected === i ? c.color : 'rgba(255,255,255,0.5)' }}>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Concept detail */}
        <AnimatePresence mode="wait">
          <motion.div key={selected} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{concept.icon}</span>
              <h2 className="text-base font-bold" style={{ color: concept.color }}>{concept.name}</h2>
            </div>
            <p className="text-[0.68rem] text-white/45 mb-1">{concept.desc}</p>
            <div className="bg-white/[0.03] rounded-lg px-3 py-1.5 border border-white/[0.06] mb-4">
              <p className="text-[0.63rem] text-white/40 italic">💡 {concept.analogy}</p>
            </div>

            {/* Visual for each concept */}
            <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4">
              {concept.visual.type === 'pod' && (
                <div className="flex justify-center">
                  <div className="border border-[#667eea]/30 rounded-xl p-3 bg-[#667eea]/[0.05]">
                    <div className="text-[0.6rem] text-[#667eea]/60 text-center mb-2 font-bold">📦 Pod</div>
                    <div className="flex gap-2">
                      {concept.visual.containers.map((c, i) => (
                        <div key={i} className="px-3 py-2 rounded-lg border border-white/[0.1] bg-white/[0.04] text-center">
                          <div className="text-sm">📱</div>
                          <div className="text-[0.6rem] text-white/50">{c}</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-[0.55rem] text-white/25 text-center mt-2">Shared Network + Storage</div>
                  </div>
                </div>
              )}

              {concept.visual.type === 'deployment' && (
                <div className="flex flex-col items-center">
                  <div className="text-[0.6rem] text-[#4facfe]/60 mb-2 font-bold">🚀 Deployment (replicas: {concept.visual.replicas})</div>
                  <div className="flex gap-3">
                    {Array.from({ length: podCount }).map((_, i) => (
                      <div key={i} className="px-3 py-2 rounded-lg border border-[#667eea]/30 bg-[#667eea]/[0.06] text-center">
                        <div className="text-sm">📦</div>
                        <div className="text-[0.58rem] text-[#667eea]">Pod {i + 1}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setPodCount(p => Math.min(6, p + 1))}
                      className="px-2 py-0.5 rounded bg-[#4facfe]/15 border border-[#4facfe]/30 text-[0.62rem] text-[#4facfe] hover:bg-[#4facfe]/25 transition-all">
                      ⬆ Scale Up
                    </button>
                    <button onClick={() => setPodCount(p => Math.max(1, p - 1))}
                      className="px-2 py-0.5 rounded bg-[#ef4444]/15 border border-[#ef4444]/30 text-[0.62rem] text-[#ef4444] hover:bg-[#ef4444]/25 transition-all">
                      ⬇ Scale Down
                    </button>
                  </div>
                </div>
              )}

              {concept.visual.type === 'service' && (
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="text-sm">👤</div>
                    <div className="text-[0.58rem] text-white/35">Client</div>
                  </div>
                  <div className="text-white/20">→</div>
                  <div className="border border-[#43e97b]/30 rounded-lg px-3 py-2 bg-[#43e97b]/[0.06] text-center">
                    <div className="text-[0.6rem] text-[#43e97b] font-bold">🔀 Service</div>
                    <div className="text-[0.55rem] text-white/30">10.0.0.1 (stable IP)</div>
                  </div>
                  <div className="text-white/20">→</div>
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: concept.visual.pods }).map((_, i) => (
                      <div key={i} className="px-2 py-0.5 rounded border border-[#667eea]/20 bg-[#667eea]/[0.05] text-[0.58rem] text-[#667eea]">📦 Pod {i + 1}</div>
                    ))}
                  </div>
                </div>
              )}

              {concept.visual.type === 'node' && (
                <div className="flex gap-2 justify-center">
                  {concept.visual.nodes && Array.from({ length: concept.visual.nodes }).map((_, i) => (
                    <div key={i} className="flex-1 border border-[#f093fb]/20 rounded-lg p-2 bg-[#f093fb]/[0.04]">
                      <div className="text-[0.58rem] text-[#f093fb] text-center font-bold mb-1">🖥️ Node {i + 1}</div>
                      <div className="flex flex-col gap-1">
                        {Array.from({ length: concept.visual.pods[i] }).map((_, j) => (
                          <div key={j} className="px-1.5 py-0.5 rounded border border-[#667eea]/20 bg-[#667eea]/[0.06] text-[0.55rem] text-[#667eea] text-center">📦</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {concept.visual.type === 'namespace' && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {concept.visual.ns.map((ns, i) => {
                    const colors = ['#667eea', '#43e97b', '#ffd93d'];
                    return (
                      <div key={i} className="flex-1 min-w-[100px] border rounded-lg p-2.5" style={{ borderColor: `${colors[i]}30`, backgroundColor: `${colors[i]}08` }}>
                        <div className="text-[0.6rem] font-bold text-center mb-1.5" style={{ color: colors[i] }}>📁 {ns}</div>
                        <div className="flex flex-col gap-0.5">
                          {['Pod', 'Service', 'Config'].map((r, j) => (
                            <div key={j} className="text-[0.55rem] text-white/35 px-1.5 py-0.3 rounded bg-white/[0.03] text-center">{r}</div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Architecture overview */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">K8s Architecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ARCHITECTURE.map((section, i) => (
              <div key={i} className="border rounded-xl p-3" style={{ borderColor: `${section.color}25`, backgroundColor: `${section.color}06` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{section.icon}</span>
                  <h3 className="text-[0.7rem] font-bold" style={{ color: section.color }}>{section.name}</h3>
                  <span className="text-[0.55rem] text-white/30">{section.desc}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {section.items.map((item, j) => (
                    <span key={j} className="text-[0.6rem] px-2 py-0.5 rounded-full border text-white/50" style={{ borderColor: `${section.color}30`, backgroundColor: `${section.color}10` }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Docker vs K8s */}
        <div className="bg-[#a29bfe]/[0.06] border border-[#a29bfe]/20 rounded-xl px-4 py-3">
          <h3 className="text-[0.72rem] font-bold text-[#a29bfe] mb-1.5">🐳 Docker vs Kubernetes</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[0.65rem] font-bold text-white/50 mb-1">Docker</div>
              <ul className="flex flex-col gap-0.5">
                {['Builds & runs containers', 'Single machine focus', 'Simple deployment'].map((item, i) => (
                  <li key={i} className="text-[0.6rem] text-white/40 flex items-start gap-1"><span className="text-white/20">•</span>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[0.65rem] font-bold text-white/50 mb-1">Kubernetes</div>
              <ul className="flex flex-col gap-0.5">
                {['Orchestrates containers', 'Multi-machine clusters', 'Auto-scaling, self-healing'].map((item, i) => (
                  <li key={i} className="text-[0.6rem] text-white/40 flex items-start gap-1"><span className="text-white/20">•</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
