import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const STAGES = [
  { id: 'code',    name: 'Code',      icon: '💻', color: '#667eea', desc: 'Developer pushes code to Git' },
  { id: 'build',   name: 'Build',     icon: '🔨', color: '#4facfe', desc: 'Compile/bundle the application' },
  { id: 'test',    name: 'Test',      icon: '🧪', color: '#ffd93d', desc: 'Run unit & integration tests' },
  { id: 'staging', name: 'Staging',   icon: '🎭', color: '#f093fb', desc: 'Deploy to staging environment' },
  { id: 'approve', name: 'Approve',   icon: '👍', color: '#a29bfe', desc: 'Manual approval gate (CD)' },
  { id: 'prod',    name: 'Production',icon: '🚀', color: '#43e97b', desc: 'Deploy to production servers' },
];

// Simulate a pipeline run
function simulateRun(failAt) {
  // failAt: null = success, 'test' = test failure, 'build' = build failure
  const results = {};
  for (const stage of STAGES) {
    if (stage.id === failAt) {
      results[stage.id] = 'failed';
      break;
    }
    results[stage.id] = 'success';
  }
  return results;
}

export default function CICDDemo({ onBack }) {
  const [scenario, setScenario] = useState(null); // null | 'success' | 'test-fail' | 'build-fail'
  const [progress, setProgress] = useState({}); // stage -> 'pending' | 'running' | 'success' | 'failed'
  const [currentStage, setCurrentStage] = useState(-1);
  const intervalRef = useRef(null);

  const runPipeline = (type) => {
    setScenario(type);
    setProgress({});
    setCurrentStage(-1);

    const failAt = type === 'test-fail' ? 'test' : type === 'build-fail' ? 'build' : null;
    let idx = 0;

    // Initialize all as pending
    const init = {};
    STAGES.forEach(s => { init[s.id] = 'pending'; });
    setProgress(init);

    intervalRef.current = setInterval(() => {
      if (idx >= STAGES.length) {
        clearInterval(intervalRef.current);
        return;
      }

      const stage = STAGES[idx];
      setCurrentStage(idx);

      // Set running
      setProgress(prev => ({ ...prev, [stage.id]: 'running' }));

      setTimeout(() => {
        const status = stage.id === failAt ? 'failed' : 'success';
        setProgress(prev => ({ ...prev, [stage.id]: status }));

        if (status === 'failed') {
          clearInterval(intervalRef.current);
          // Mark remaining as pending (skipped)
          const remaining = {};
          STAGES.slice(idx + 1).forEach(s => { remaining[s.id] = 'skipped'; });
          setProgress(prev => ({ ...prev, ...remaining }));
        }
      }, 800);

      idx++;
    }, 1200);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return '#ffd93d';
      case 'success': return '#43e97b';
      case 'failed': return '#ef4444';
      default: return 'rgba(255,255,255,0.15)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return '⏳';
      case 'success': return '✓';
      case 'failed': return '✗';
      case 'skipped': return '⊘';
      default: return '○';
    }
  };

  const pipelineDone = STAGES.some(s => progress[s.id] === 'failed') ||
    (progress[STAGES[STAGES.length - 1]?.id] === 'success');

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#a29bfe] to-[#6c5ce7] bg-clip-text text-transparent">CI/CD Pipeline</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            <span className="text-[#a29bfe] font-semibold">CI (Continuous Integration)</span> automatically builds and tests code on every push.
            <span className="text-[#43e97b] font-semibold"> CD (Continuous Delivery/Deployment)</span> automatically deploys passing builds to production.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why it matters:</span> Without CI/CD, deployments are manual, error-prone, and stressful. Teams release once a month and dread it. With CI/CD, you can deploy hundreds of times per day with confidence — every change is automatically built, tested, and shipped. Bugs are caught in minutes, not weeks.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Pipeline', def: 'A series of automated steps: build → test → deploy. Defined in YAML (like .github/workflows/ci.yml).' },
              { term: 'Artifact', def: 'The output of a build step: a compiled binary, Docker image, or bundle. Passed between pipeline stages.' },
              { term: 'Runner', def: 'A server (or container) that executes pipeline jobs. Can be cloud-hosted or self-hosted.' },
              { term: 'Rolling Deployment', def: 'Gradually replacing old instances with new ones. If something fails, only a fraction of users are affected.' },
              { term: 'Blue-Green Deployment', def: 'Run two identical environments. Deploy to "green" while "blue" serves traffic, then switch.' },
              { term: 'Canary Release', def: 'Route a small % of traffic to the new version first. Monitor for errors before full rollout.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#a29bfe]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { id: 'success', label: '✓ Successful Deploy', color: '#43e97b', desc: 'All stages pass' },
            { id: 'test-fail', label: '✗ Test Failure', color: '#ef4444', desc: 'Tests catch a bug' },
            { id: 'build-fail', label: '✗ Build Failure', color: '#ef4444', desc: 'Code won\'t compile' },
          ].map(s => (
            <button key={s.id} onClick={() => runPipeline(s.id)}
              className={`px-3 py-2.5 rounded-xl border text-left transition-all duration-200
                ${scenario === s.id ? `border-[${s.color}]/30` : 'border-white/[0.08] hover:bg-white/[0.04]'}`}
              style={{ borderColor: scenario === s.id ? `${s.color}40` : undefined, backgroundColor: scenario === s.id ? `${s.color}08` : undefined }}>
              <div className="text-[0.7rem] font-bold" style={{ color: scenario === s.id ? s.color : 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              <div className="text-[0.58rem] text-white/35">{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Pipeline visualization */}
        {scenario && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Pipeline Execution</h2>
              {pipelineDone && (
                <span className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full ${STAGES.some(s => progress[s.id] === 'failed') ? 'bg-[#ef4444]/15 text-[#ef4444]' : 'bg-[#43e97b]/15 text-[#43e97b]'}`}>
                  {STAGES.some(s => progress[s.id] === 'failed') ? '💥 Pipeline Failed' : '✓ Deployed Successfully'}
                </span>
              )}
            </div>

            {/* Stage flow */}
            <div className="flex flex-col gap-1">
              {STAGES.map((stage, i) => {
                const status = progress[stage.id] || 'pending';
                const statusColor = getStatusColor(status);
                const isActive = status === 'running';
                return (
                  <div key={stage.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-300
                    ${isActive ? 'border-[#ffd93d]/30 bg-[#ffd93d]/[0.06]' : status === 'success' ? 'border-[#43e97b]/20 bg-[#43e97b]/[0.04]' : status === 'failed' ? 'border-[#ef4444]/30 bg-[#ef4444]/[0.06]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                    {/* Status icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-bold transition-all duration-300`}
                      style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}>
                      {getStatusIcon(status)}
                    </div>

                    {/* Stage icon + name */}
                    <span className="text-sm">{stage.icon}</span>
                    <div className="flex-1">
                      <div className="text-[0.68rem] font-bold" style={{ color: isActive ? '#ffd93d' : status === 'success' ? '#43e97b' : status === 'failed' ? '#ef4444' : 'rgba(255,255,255,0.5)' }}>
                        {stage.name}
                      </div>
                      <div className="text-[0.58rem] text-white/30">{stage.desc}</div>
                    </div>

                    {/* Status badge */}
                    <span className="text-[0.6rem] font-bold capitalize" style={{ color: statusColor }}>{status}</span>

                    {/* Arrow to next */}
                    {i < STAGES.length - 1 && status === 'success' && (
                      <span className="text-white/20 text-xs">↓</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Failure explanation */}
            {scenario === 'test-fail' && pipelineDone && (
              <div className="mt-3 bg-[#ef4444]/[0.08] border border-[#ef4444]/20 rounded-lg px-3 py-2.5">
                <div className="text-[0.68rem] font-bold text-[#ef4444] mb-1">Why it stopped at Tests?</div>
                <p className="text-[0.63rem] text-white/45">A unit test failed — likely a regression. The pipeline blocks deployment to protect production. The developer must fix the bug, push again, and the pipeline re-runs from the start.</p>
              </div>
            )}
            {scenario === 'build-fail' && pipelineDone && (
              <div className="mt-3 bg-[#ef4444]/[0.08] border border-[#ef4444]/20 rounded-lg px-3 py-2.5">
                <div className="text-[0.68rem] font-bold text-[#ef4444] mb-1">Why it stopped at Build?</div>
                <p className="text-[0.63rem] text-white/45">The code has a syntax or compilation error. Nothing downstream runs — no tests, no deployment. Fix the code, push, and CI rebuilds.</p>
              </div>
            )}
          </div>
        )}

        {/* CI vs CD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#4facfe] mb-2">🔁 Continuous Integration (CI)</h3>
            <ul className="flex flex-col gap-1.5">
              {['Auto-build on every push', 'Run test suites automatically', 'Catch bugs early (fail fast)', 'Tools: GitHub Actions, Jenkins, CircleCI'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#4facfe] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">🚀 Continuous Delivery/Deployment (CD)</h3>
            <ul className="flex flex-col gap-1.5">
              {['Auto-deploy passing builds', 'Staging → Approval → Production', 'Rollback in seconds on failure', 'Tools: ArgoCD, AWS CodeDeploy, Vercel'].map((item, i) => (
                <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#43e97b] flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
