import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  {
    id: 'navigation',
    name: 'Navigation',
    icon: '📁',
    color: '#4facfe',
    commands: [
      { cmd: 'pwd', desc: 'Print working directory', example: '/home/user/projects', tip: 'Always know where you are.' },
      { cmd: 'cd <dir>', desc: 'Change directory', example: 'cd ~/Documents', tip: 'Use ~ for home, .. for parent.' },
      { cmd: 'ls -la', desc: 'List files (detailed)', example: '-rw-r--r-- 1 user user 1234 file.txt', tip: '-a shows hidden files, -l shows details.' },
      { cmd: 'find . -name "*.js"', desc: 'Find files by pattern', example: './src/app.js\n./src/index.js', tip: 'Incredibly powerful for searching.' },
    ],
  },
  {
    id: 'files',
    name: 'File Ops',
    icon: '📄',
    color: '#43e97b',
    commands: [
      { cmd: 'cp file1 file2', desc: 'Copy a file', example: 'cp app.js app.backup.js', tip: 'Use -r flag to copy directories.' },
      { cmd: 'mv file newname', desc: 'Move or rename file', example: 'mv old.txt new.txt', tip: 'Works for both rename and move.' },
      { cmd: 'rm -rf <dir>', desc: 'Remove file/directory', example: 'rm -rf node_modules', tip: '⚠️ -f forces, -r is recursive. Be careful!' },
      { cmd: 'cat file.txt', desc: 'Display file contents', example: 'Hello World\nLine 2', tip: 'For large files, use head or tail.' },
    ],
  },
  {
    id: 'text',
    name: 'Text Processing',
    icon: '📝',
    color: '#ffd93d',
    commands: [
      { cmd: 'grep "pattern" file', desc: 'Search for text in file', example: 'grep "error" app.log → Line 42: error occurred', tip: 'Use -r for recursive search in directories.' },
      { cmd: 'sed "s/old/new/g" file', desc: 'Find & replace text', example: 'sed "s/foo/bar/g" config.yml', tip: 'The g flag replaces ALL occurrences.' },
      { cmd: 'head -n 5 file', desc: 'Show first N lines', example: 'Line 1\nLine 2\n...', tip: 'Use tail for last N lines.' },
      { cmd: 'wc -l file', desc: 'Count lines', example: '1234 app.log', tip: '-w counts words, -c counts characters.' },
    ],
  },
  {
    id: 'system',
    name: 'System',
    icon: '⚙️',
    color: '#f093fb',
    commands: [
      { cmd: 'ps aux', desc: 'List all running processes', example: 'PID  CPU  MEM  CMD\n1234  2.1  0.5  node server.js', tip: 'Pipe to grep: ps aux | grep node' },
      { cmd: 'kill <PID>', desc: 'Terminate a process', example: 'kill 1234', tip: 'Use kill -9 for force kill.' },
      { cmd: 'top / htop', desc: 'Live system monitor', example: 'CPU: 45% | Mem: 2.1GB/8GB | Tasks: 142', tip: 'htop is colorful and interactive.' },
      { cmd: 'chmod 755 file', desc: 'Set file permissions', example: 'rwxr-xr-x file.sh', tip: '755 = owner rwx, others rx.' },
    ],
  },
  {
    id: 'network',
    name: 'Network',
    icon: '🌐',
    color: '#667eea',
    commands: [
      { cmd: 'curl <url>', desc: 'Make HTTP requests', example: 'curl https://api.example.com/data', tip: 'Add -X POST -d "data" for POST requests.' },
      { cmd: 'ssh user@host', desc: 'Remote login', example: 'ssh admin@192.168.1.100', tip: 'Use SSH keys instead of passwords.' },
      { cmd: 'ping host', desc: 'Test network connectivity', example: '64 bytes from google.com: time=12ms', tip: 'Ctrl+C to stop.' },
      { cmd: 'wget <url>', desc: 'Download files', example: 'wget https://example.com/file.zip', tip: 'Use -r for recursive download.' },
    ],
  },
];

export default function LinuxCLIDemo({ onBack }) {
  const [category, setCategory] = useState('navigation');
  const [selectedCmd, setSelectedCmd] = useState(0);
  const [showTip, setShowTip] = useState(true);

  const cat = CATEGORIES.find(c => c.id === category);
  const cmd = cat.commands[selectedCmd];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#a29bfe] to-[#6c5ce7] bg-clip-text text-transparent">Linux CLI</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            The command line is the most powerful interface on any system. Linux CLI commands let you <span className="text-[#a29bfe] font-semibold">navigate, manipulate files, manage processes, and control networks</span> with precision.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why learn CLI:</span> GUIs are limited by what buttons designers provide. The CLI gives you direct, unrestricted control. You can automate complex tasks with scripts, process thousands of files in seconds, and manage remote servers via SSH. Every serious developer needs to be comfortable on the command line.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Shell', def: 'The program that interprets your commands. Bash, Zsh, Fish are popular shells with different features.' },
              { term: 'Stdin/Stdout/Stderr', def: 'Standard input (keyboard), output (screen), and error streams. Piping redirects these between commands.' },
              { term: 'Environment Variable', def: 'A named value available to all processes. $PATH tells the shell where to find executables.' },
              { term: 'Exit Code', def: 'A number returned when a command finishes. 0 = success, non-zero = error. Used in scripting conditionals.' },
              { term: 'Glob Pattern', def: 'Wildcards like * (any chars) and ? (single char). "*.js" matches all JavaScript files.' },
              { term: 'Root/sudo', def: 'Root is the superuser with unlimited access. sudo runs a single command as root. Use with caution.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#a29bfe]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category selector */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => { setCategory(c.id); setSelectedCmd(0); }}
              className={`px-3 py-1.5 rounded-lg border text-[0.68rem] font-medium transition-all duration-200
                ${category === c.id ? 'border-white/[0.25] bg-white/[0.07]' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
              <span className="mr-1">{c.icon}</span>
              <span style={{ color: category === c.id ? c.color : 'rgba(255,255,255,0.5)' }}>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Command list + detail */}
        <div className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-3">
          {/* Command list */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3">
            <div className="text-[0.6rem] font-bold text-white/30 uppercase tracking-wider mb-2">{cat.icon} {cat.name}</div>
            <div className="flex flex-col gap-1">
              {cat.commands.map((c, i) => (
                <button key={i} onClick={() => setSelectedCmd(i)}
                  className={`text-left px-2.5 py-2 rounded-lg border transition-all duration-200
                    ${selectedCmd === i ? `border-white/[0.2] bg-white/[0.06]` : 'border-transparent hover:bg-white/[0.03]'}`}>
                  <code className={`text-[0.68rem] font-mono font-bold ${selectedCmd === i ? 'text-[#a5f3fc]' : 'text-white/55'}`}>{c.cmd.split(' ')[0]}</code>
                  <span className={`text-[0.6rem] font-mono ${selectedCmd === i ? 'text-white/40' : 'text-white/25'}`}> {c.cmd.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <AnimatePresence mode="wait">
            <motion.div key={`${category}-${selectedCmd}`} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-white">{cmd.desc}</h2>
                <button onClick={() => setShowTip(t => !t)} className="text-[0.6rem] text-white/35 hover:text-white/55 transition-colors">
                  {showTip ? 'Hide' : 'Show'} Tip
                </button>
              </div>

              {/* Command box */}
              <div className="bg-[#0a0a14] border border-white/[0.1] rounded-xl overflow-hidden mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border-b border-white/[0.08]">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffd93d]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#43e97b]/60" />
                  </div>
                  <span className="text-[0.58rem] text-white/25 ml-2">terminal</span>
                </div>
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[0.72rem] text-[#43e97b] font-mono">$</span>
                    <code className="text-[0.72rem] text-[#a5f3fc] font-mono font-bold">{cmd.cmd}</code>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/[0.06]">
                    <pre className="text-[0.67rem] text-white/45 font-mono whitespace-pre-wrap">{cmd.example}</pre>
                  </div>
                </div>
              </div>

              {/* Tip */}
              {showTip && (
                <div className="bg-[#ffd93d]/[0.08] border border-[#ffd93d]/20 rounded-lg px-3 py-2">
                  <span className="text-[0.65rem] text-[#ffd93d] font-bold">💡 Tip: </span>
                  <span className="text-[0.65rem] text-white/50">{cmd.tip}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chaining & pipes */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Power Moves — Pipes & Chaining</h2>
          <div className="flex flex-col gap-2">
            {[
              { code: 'cat server.log | grep "ERROR" | tail -5', desc: 'Show last 5 errors in log file' },
              { code: 'ps aux | grep node | awk \'{print $2}\'', desc: 'Get PID of all node processes' },
              { code: 'find . -name "*.js" | wc -l', desc: 'Count all JS files in current directory' },
              { code: 'curl api.example.com | jq \'.data[]\'', desc: 'Fetch JSON and extract data array' },
            ].map((item, i) => (
              <div key={i} className="bg-[#0a0a14] border border-white/[0.06] rounded-lg px-3 py-2">
                <code className="text-[0.68rem] text-[#a5f3fc] font-mono">{item.code}</code>
                <div className="text-[0.58rem] text-white/35 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4">
            <div className="flex items-center gap-1.5"><code className="text-[0.62rem] text-[#ffd93d]">|</code><span className="text-[0.58rem] text-white/35">Pipe: pass output to next command</span></div>
            <div className="flex items-center gap-1.5"><code className="text-[0.62rem] text-[#43e97b]">&&</code><span className="text-[0.58rem] text-white/35">Chain: run next only if previous succeeds</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
