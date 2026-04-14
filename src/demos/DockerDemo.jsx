import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LAYERS = [
  { id: 'host',      label: 'Host OS (Linux/Mac/Windows)', color: '#1a1a2e', text: 'white/40',  icon: '🖥️' },
  { id: 'docker',    label: 'Docker Engine',               color: '#2496ED', text: 'white',     icon: '🐳' },
  { id: 'container', label: 'Container Layer',             color: '#0f3460', text: 'white/70',  icon: '📦' },
];

const COMMANDS = [
  { cmd: 'docker pull nginx',           desc: 'Download the nginx image from Docker Hub', output: 'Pulling from library/nginx\nDownloading... 50.2 MB\n✓ Pull complete' },
  { cmd: 'docker run -d -p 80:80 nginx',desc: 'Start a container from the image',         output: 'a1b2c3d4e5f6\n✓ Container started on port 80' },
  { cmd: 'docker ps',                   desc: 'List running containers',                  output: 'CONTAINER ID  IMAGE   STATUS    PORTS\na1b2c3d4e5f6  nginx   Up 2min  0.0.0.0:80->80/tcp' },
  { cmd: 'docker stop a1b2c3d4e5f6',    desc: 'Stop the container',                       output: 'a1b2c3d4e5f6\n✓ Container stopped' },
  { cmd: 'docker rm a1b2c3d4e5f6',      desc: 'Remove the container',                     output: 'a1b2c3d4e5f6\n✓ Container removed' },
];

const DOCKER_VS_VM = [
  { aspect: 'Size',          docker: 'MBs (shared kernel)', vm: 'GBs (full OS copy)', winner: 'docker' },
  { aspect: 'Startup',       docker: 'Seconds',             vm: 'Minutes',            winner: 'docker' },
  { aspect: 'Isolation',     docker: 'Process-level',       vm: 'Full OS isolation',  winner: 'vm' },
  { aspect: 'Portability',   docker: 'Run anywhere',        vm: 'Platform dependent', winner: 'docker' },
  { aspect: 'Resource Use',  docker: 'Lightweight',         vm: 'Heavy',              winner: 'docker' },
  { aspect: 'Security',      docker: 'Shared kernel risk',  vm: 'Better isolation',   winner: 'vm' },
];

export default function DockerDemo({ onBack }) {
  const [activeCmd, setActiveCmd] = useState(null);
  const [runningContainer, setRunningContainer] = useState(false);

  const executeCommand = (idx) => {
    setActiveCmd(idx);
    if (idx === 1) setRunningContainer(true);
    if (idx === 3 || idx === 4) setRunningContainer(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2496ED] to-[#0db7ed] bg-clip-text text-transparent">Docker Fundamentals</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Docker packages your application and all its dependencies into a <span className="text-[#2496ED] font-semibold">container</span> — a lightweight, portable box that runs identically on any machine. "It works on my machine" is no longer an excuse.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The Problem Docker Solves:</span> Your app needs Python 3.9, specific libraries, environment variables, and system configs. Without containers, setting up a new developer's machine or deploying to production means manually installing everything — and hoping versions match. Docker bundles it all together so the environment is guaranteed identical everywhere.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Image', def: 'A read-only template containing your app code, runtime, libraries, and configs. Think of it as a snapshot or blueprint.' },
              { term: 'Container', def: 'A running instance of an image. You can run multiple containers from one image, each isolated from others.' },
              { term: 'Dockerfile', def: 'A text file with instructions to build an image. Each line creates a "layer" that can be cached for faster rebuilds.' },
              { term: 'Docker Hub', def: 'A public registry where you can find and share container images. Like GitHub but for Docker images.' },
              { term: 'Volume', def: 'Persistent storage that survives container restarts. Containers are ephemeral; volumes keep your data safe.' },
              { term: 'Port Mapping', def: 'Exposing container ports to the host. "-p 8080:80" maps host port 8080 to container port 80.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#2496ED]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture diagram */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Architecture</h2>
          <div className="flex flex-col gap-1">
            {/* Containers */}
            <div className="flex gap-2 p-3 rounded-t-xl border border-[#2496ED]/20 bg-[#2496ED]/[0.05]">
              {['Web App', 'Database', 'Cache', 'Worker'].map((name, i) => (
                <div key={i} className={`flex-1 rounded-lg border p-2 text-center transition-all duration-300
                  ${i === 1 && runningContainer ? 'border-[#43e97b]/40 bg-[#43e97b]/[0.1]' : 'border-white/[0.1] bg-white/[0.04]'}`}>
                  <div className="text-sm">📦</div>
                  <div className="text-[0.6rem] text-white/60">{name}</div>
                  {i === 0 && runningContainer && <div className="text-[0.5rem] text-[#2496ED]">:80</div>}
                </div>
              ))}
            </div>
            <div className="text-[0.65rem] text-[#2496ED] text-center font-bold py-1.5 bg-[#2496ED]/[0.08] border-l border-r border-[#2496ED]/20">
              🐳 Docker Engine (manages containers)
            </div>
            <div className="text-[0.65rem] text-white/50 text-center py-2 bg-white/[0.03] border-l border-r border-white/[0.08]">
              🖥️ Host Operating System
            </div>
            <div className="text-[0.6rem] text-white/30 text-center py-1.5 bg-white/[0.02] rounded-b-xl border border-t-0 border-white/[0.06]">
              ⚙️ Hardware (CPU, RAM, Storage)
            </div>
          </div>
        </div>

        {/* Interactive command terminal */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Interactive Terminal</h2>

          {/* Commands to click */}
          <div className="flex flex-col gap-1.5 mb-4">
            {COMMANDS.map((c, i) => (
              <button key={i} onClick={() => executeCommand(i)}
                className={`text-left px-3 py-2 rounded-lg border transition-all duration-200
                  ${activeCmd === i ? 'border-[#2496ED]/40 bg-[#2496ED]/[0.08]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[#43e97b] text-[0.7rem]">$</span>
                  <span className="text-[0.72rem] font-mono text-white/80">{c.cmd}</span>
                </div>
                <span className="text-[0.6rem] text-white/35">{c.desc}</span>
              </button>
            ))}
          </div>

          {/* Output */}
          {activeCmd !== null && (
            <AnimatePresence>
              <motion.div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                <div className="text-[0.65rem] text-white/30 mb-1">$ {COMMANDS[activeCmd].cmd}</div>
                <pre className="text-[0.7rem] text-[#43e97b] font-mono whitespace-pre-wrap">{COMMANDS[activeCmd].output}</pre>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Docker vs VM */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Docker vs Virtual Machine</h2>
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full text-[0.7rem]">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-3 py-1.5 text-white/35">Aspect</th>
                  <th className="text-left px-3 py-1.5 text-[#2496ED]">🐳 Docker</th>
                  <th className="text-left px-3 py-1.5 text-[#f093fb]">🖥️ VM</th>
                </tr>
              </thead>
              <tbody>
                {DOCKER_VS_VM.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="px-3 py-1.5 text-white/60 font-semibold">{row.aspect}</td>
                    <td className={`px-3 py-1.5 ${row.winner === 'docker' ? 'text-[#43e97b] font-semibold' : 'text-white/50'}`}>{row.docker}</td>
                    <td className={`px-3 py-1.5 ${row.winner === 'vm' ? 'text-[#43e97b] font-semibold' : 'text-white/50'}`}>{row.vm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dockerfile Explained */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Sample Dockerfile Explained</h2>
          <p className="text-[0.68rem] text-white/40 mb-3">Each line is an instruction. Docker caches layers, so unchanged lines don't rebuild.</p>
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3">
            {[
              { code: 'FROM node:18-alpine', comment: 'Start from a base image (Node.js on Alpine Linux)' },
              { code: 'WORKDIR /app', comment: 'Set the working directory inside the container' },
              { code: 'COPY package*.json ./', comment: 'Copy dependency files first (for caching)' },
              { code: 'RUN npm install', comment: 'Install dependencies (cached if package.json unchanged)' },
              { code: 'COPY . .', comment: 'Copy all source code into the container' },
              { code: 'EXPOSE 3000', comment: 'Document which port the app listens on' },
              { code: 'CMD ["node", "server.js"]', comment: 'Command to run when container starts' },
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-3 mb-1">
                <code className="text-[0.68rem] text-[#2496ED] font-mono flex-shrink-0 w-48">{line.code}</code>
                <span className="text-[0.6rem] text-white/35"># {line.comment}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Docker Commands */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Essential Commands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { cmd: 'docker build -t myapp .', desc: 'Build image from Dockerfile in current directory' },
              { cmd: 'docker run -d -p 3000:3000 myapp', desc: 'Run container in background, map ports' },
              { cmd: 'docker ps -a', desc: 'List all containers (running and stopped)' },
              { cmd: 'docker logs <id>', desc: 'View container output/logs' },
              { cmd: 'docker exec -it <id> sh', desc: 'Open a shell inside running container' },
              { cmd: 'docker-compose up', desc: 'Start multi-container app from docker-compose.yml' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <code className="text-[0.65rem] text-[#43e97b] font-mono">{item.cmd}</code>
                <p className="text-[0.58rem] text-white/40 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
