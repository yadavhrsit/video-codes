import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROUTES = [
  { path: '/',        component: 'Home',     icon: '🏠', desc: 'Landing page' },
  { path: '/about',   component: 'About',    icon: '📄', desc: 'Company info' },
  { path: '/users',   component: 'UserList', icon: '👥', desc: 'User listing' },
  { path: '/users/42',component: 'UserDetail',icon: '👤', desc: 'Dynamic param :id' },
  { path: '/blog/*',  component: 'Blog',     icon: '📝', desc: 'Nested routes (wildcard)' },
];

const PAGE_CONTENT = {
  '/':         { title: 'Welcome Home',  body: 'This is the root route. Always matches /', bg: '#667eea' },
  '/about':    { title: 'About Us',      body: 'Static route — exact path match required.', bg: '#f093fb' },
  '/users':    { title: 'User List',     body: 'Shows all users. Parent route for nested paths.', bg: '#4facfe' },
  '/users/42': { title: 'User #42',      body: 'Dynamic route — :id param extracted via useParams().', bg: '#43e97b' },
  '/blog/*':   { title: 'Blog Section',  body: 'Nested route — /* catches all sub-paths under /blog.', bg: '#ffd93d' },
};

export default function ReactRouterDemo({ onBack }) {
  const [currentPath, setCurrentPath] = useState('/');
  const [routingType, setRoutingType] = useState('client'); // client | server
  const page = PAGE_CONTENT[currentPath];

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">React Router</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-2">Client-Side Routing</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            React Router enables <span className="text-[#667eea] font-semibold">navigation without page reloads</span>. The URL changes, but only the relevant component re-renders — the browser never makes a new HTTP request.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why it matters:</span> Traditional websites make a full HTTP request for every page. With React Router, your app loads once, then navigation is instant — the JavaScript just swaps which component renders. This enables smooth transitions, preserved scroll position, and a native app feel. It's the foundation of Single Page Applications (SPAs).
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Route', def: 'A mapping between a URL pattern and a React component. When the URL matches, that component renders.' },
              { term: 'BrowserRouter', def: 'The top-level component that keeps the UI in sync with the URL using the HTML5 history API.' },
              { term: 'Link', def: 'A component that renders an anchor tag but navigates without reloading. Replaces <a href>.' },
              { term: 'useParams', def: 'A hook that returns URL parameters. For /users/:id, calling useParams() returns { id: "42" }.' },
              { term: 'useNavigate', def: 'A hook for programmatic navigation. Call navigate("/path") to change routes from code.' },
              { term: 'Outlet', def: 'A placeholder where nested child routes render. Essential for layout routes that wrap multiple pages.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#667eea]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Client vs Server toggle */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Client vs Server Routing</h2>
            <div className="flex bg-white/[0.06] rounded-lg p-0.5">
              {[['client', '⚡ Client'], ['server', '🌐 Server']].map(([key, label]) => (
                <button key={key} onClick={() => setRoutingType(key)}
                  className={`px-3 py-1 rounded-md text-[0.7rem] font-semibold transition-all duration-200
                    ${routingType === key ? 'bg-[#667eea]/20 text-[#667eea]' : 'text-white/40 hover:text-white/60'}`}
                >{label}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`rounded-xl border p-4 transition-all duration-300 ${routingType === 'client' ? 'border-[#43e97b]/40 bg-[#43e97b]/[0.06]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
              <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">⚡ Client-Side (React Router)</h3>
              <div className="flex flex-col gap-1.5 text-[0.68rem] text-white/60">
                <div className="flex items-center gap-2"><span className="text-[#43e97b]">✓</span> No full page reload</div>
                <div className="flex items-center gap-2"><span className="text-[#43e97b]">✓</span> Instant navigation</div>
                <div className="flex items-center gap-2"><span className="text-[#43e97b]">✓</span> Preserves component state</div>
                <div className="flex items-center gap-2"><span className="text-[#43e97b]">✓</span> SPA — single HTML file</div>
              </div>
            </div>
            <div className={`rounded-xl border p-4 transition-all duration-300 ${routingType === 'server' ? 'border-[#ef4444]/40 bg-[#ef4444]/[0.06]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
              <h3 className="text-[0.72rem] font-bold text-[#ef4444] mb-2">🌐 Server-Side (Traditional)</h3>
              <div className="flex flex-col gap-1.5 text-[0.68rem] text-white/60">
                <div className="flex items-center gap-2"><span className="text-[#ef4444]">✗</span> Full page reload per nav</div>
                <div className="flex items-center gap-2"><span className="text-[#ef4444]">✗</span> Network round-trip required</div>
                <div className="flex items-center gap-2"><span className="text-[#ef4444]">✗</span> Loses client state</div>
                <div className="flex items-center gap-2"><span className="text-[#ef4444]">✗</span> Slower perceived performance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Router Simulator */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Router Simulator</h2>

          {/* URL Bar */}
          <div className="bg-[#0a0a14] border border-white/[0.1] rounded-xl px-4 py-2.5 flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffd93d]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#43e97b]" />
            </div>
            <div className="text-[0.72rem] text-white/40 mr-2">🔒 localhost:3000</div>
            <div className="text-[0.78rem] text-[#667eea] font-mono font-semibold">{currentPath}</div>
          </div>

          {/* Nav links */}
          <div className="flex gap-2 flex-wrap mb-4">
            {ROUTES.map(r => (
              <button key={r.path} onClick={() => handleNavigate(r.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[0.7rem] font-medium transition-all duration-200
                  ${currentPath === r.path
                    ? 'border-[#667eea]/50 bg-[#667eea]/15 text-[#667eea]'
                    : 'border-white/[0.1] text-white/50 hover:border-white/[0.2] hover:text-white/70'
                  }`}
              >
                {r.icon} {r.component}
              </button>
            ))}
          </div>

          {/* Rendered page */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              className="rounded-xl border border-white/[0.08] p-5"
              style={{ background: `${page.bg}18` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: page.bg }} />
                <span className="text-[0.65rem] font-mono text-white/35">Route matched: <span style={{ color: page.bg }}>{currentPath}</span></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{page.title}</h3>
              <p className="text-[0.72rem] text-white/50">{page.body}</p>
            </motion.div>
          </AnimatePresence>

          {/* Route table */}
          <div className="mt-4 border-t border-white/[0.06] pt-3">
            <h3 className="text-[0.68rem] font-bold text-white/40 uppercase tracking-wider mb-2">Route Definition Table</h3>
            <div className="flex flex-col gap-1">
              {ROUTES.map(r => (
                <div key={r.path} className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-[0.68rem] transition-colors duration-200 ${currentPath === r.path ? 'bg-white/[0.06]' : ''}`}>
                  <span className="font-mono text-[#667eea] w-28 flex-shrink-0">{r.path}</span>
                  <span className="text-white/50 flex-1">{r.component}</span>
                  <span className="text-white/25">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Implementation</h2>
          <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4">
            <pre className="text-[0.75rem] text-[#a5f3fc] leading-relaxed font-mono whitespace-pre-wrap">{`import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
      </nav>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/about"      element={<About />} />
        <Route path="/users"      element={<UserList />} />
        <Route path="/users/:id"  element={<UserDetail />} />
        <Route path="/blog/*"     element={<Blog />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserDetail() {
  const { id } = useParams();  // extracts :id from URL
  return <div>User #{id}</div>;
}`}</pre>
          </div>
        </div>

        {/* Key concepts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: '🔗 Core Hooks', color: '#667eea', items: ['useNavigate() — programmatic nav', 'useParams() — URL params', 'useLocation() — current URL', 'useSearchParams() — query strings'] },
            { title: '📐 Route Types', color: '#4facfe', items: ['Static: /about (exact match)', 'Dynamic: /users/:id (param)', 'Nested: /blog/* (wildcard)', 'Layout: shared wrappers'] },
            { title: '⚡ Best Practices', color: '#43e97b', items: ['Lazy load heavy routes', 'Use Outlet for nested layouts', 'Guard routes with auth check', 'Use relative paths in nested'] },
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <h3 className="text-[0.75rem] font-bold mb-2" style={{ color: card.color }}>{card.title}</h3>
              <ul className="flex flex-col gap-1.5">
                {card.items.map((item, j) => (
                  <li key={j} className="text-[0.68rem] text-white/55 flex items-start gap-1.5">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: card.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
