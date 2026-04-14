import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMPARISONS = [
  { aspect: 'Performance', fastapi: 'Very fast (async by default)', flask: 'Slower (sync, WSGI)', winner: 'fastapi' },
  { aspect: 'Async Support', fastapi: 'Native async/await', flask: 'Limited (needs extensions)', winner: 'fastapi' },
  { aspect: 'Auto Docs', fastapi: 'Built-in Swagger + ReDoc', flask: 'Needs Flask-RESTX or manual', winner: 'fastapi' },
  { aspect: 'Type Validation', fastapi: 'Pydantic (automatic)', flask: 'Manual or marshmallow', winner: 'fastapi' },
  { aspect: 'Learning Curve', fastapi: 'Moderate (needs Pydantic knowledge)', flask: 'Gentle (simple decorator API)', winner: 'flask' },
  { aspect: 'Ecosystem', fastapi: 'Growing fast, newer', flask: 'Mature, huge ecosystem', winner: 'flask' },
  { aspect: 'Flexibility', fastapi: 'Opinionated (structured)', flask: 'Very flexible (minimalist)', winner: 'flask' },
  { aspect: 'Community', fastapi: 'Large, active', flask: 'Very large, well-established', winner: 'flask' },
];

const CODE_EXAMPLES = {
  fastapi: {
    hello: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/hello/{name}")\nasync def hello(name: str):\n    return {"message": f"Hello, {name}!"}`,
    typed: `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass User(BaseModel):\n    name: str\n    email: str\n    age: int\n\n@app.post("/users/")\nasync def create_user(user: User):\n    return {"id": 1, **user.dict()}`,
    async: `import asyncio\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/data/")\nasync def get_data():\n    # Runs concurrently!\n    users, products = await asyncio.gather(\n        fetch_users(),\n        fetch_products()\n    )\n    return {"users": users, "products": products}`,
  },
  flask: {
    hello: `from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/hello/<name>")\ndef hello(name):\n    return {"message": f"Hello, {name}!"}`,
    typed: `from flask import Flask, request, jsonify\n\napp = Flask(__name__)\n\n@app.route("/users/", methods=["POST"])\ndef create_user():\n    data = request.get_json()\n    # Manual validation needed\n    if not data.get("name"):\n        return {"error": "Name required"}, 400\n    return jsonify({"id": 1, **data})`,
    async: `from flask import Flask\nimport requests  # sync!\n\napp = Flask(__name__)\n\n@app.route("/data/")\ndef get_data():\n    # Runs sequentially\n    users = requests.get(users_url).json()\n    products = requests.get(products_url).json()\n    return {"users": users, "products": products}`,
  },
};

const EXAMPLE_LABELS = [
  { id: 'hello', label: 'Hello World', icon: '👋' },
  { id: 'typed', label: 'Request Body', icon: '📨' },
  { id: 'async', label: 'Async I/O', icon: '⚡' },
];

export default function FastAPIvsFlaskDemo({ onBack }) {
  const [view, setView] = useState('compare'); // compare | code
  const [codeExample, setCodeExample] = useState('hello');

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffd93d] to-[#ff6b6b] bg-clip-text text-transparent">FastAPI vs Flask</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Both are Python web frameworks for building APIs. <span className="text-[#ffd93d] font-semibold">FastAPI</span> is modern, fast, and async-first. <span className="text-[#4facfe] font-semibold">Flask</span> is simple, flexible, and battle-tested. Both are excellent — the choice depends on your needs.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">The evolution:</span> Flask (2010) pioneered Python microframeworks with its minimalist approach. FastAPI (2018) built on lessons learned, adding async support, type hints, and automatic validation. Flask has a huge ecosystem; FastAPI has momentum and modern features.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'WSGI', def: 'Web Server Gateway Interface — the sync protocol Flask uses. Gunicorn, uWSGI are WSGI servers.' },
              { term: 'ASGI', def: 'Async Server Gateway Interface — the async protocol FastAPI uses. Uvicorn is the popular ASGI server.' },
              { term: 'Pydantic', def: 'A data validation library using Python type hints. FastAPI uses it for automatic request/response validation.' },
              { term: 'OpenAPI', def: 'A standard for describing APIs. FastAPI auto-generates OpenAPI specs → Swagger UI docs for free.' },
              { term: 'Dependency Injection', def: 'A pattern for providing components to functions. FastAPI has built-in DI; Flask uses extensions like Flask-Injector.' },
              { term: 'Blueprint', def: 'Flask\'s way of organizing routes into modules. FastAPI uses APIRouter for the same purpose.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#ffd93d]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          <button onClick={() => setView('compare')}
            className={`flex-1 px-3 py-2 rounded-xl border text-center transition-all duration-200
              ${view === 'compare' ? 'border-white/[0.25] bg-white/[0.07]' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
            <div className="text-[0.68rem] font-bold" style={{ color: view === 'compare' ? '#ffd93d' : 'rgba(255,255,255,0.5)' }}>⚖️ Compare</div>
          </button>
          <button onClick={() => setView('code')}
            className={`flex-1 px-3 py-2 rounded-xl border text-center transition-all duration-200
              ${view === 'code' ? 'border-white/[0.25] bg-white/[0.07]' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
            <div className="text-[0.68rem] font-bold" style={{ color: view === 'code' ? '#ffd93d' : 'rgba(255,255,255,0.5)' }}>💻 Side-by-Side Code</div>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* COMPARISON TABLE */}
          {view === 'compare' && (
            <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <div className="grid grid-cols-3 gap-0 mb-2">
                  <div className="text-[0.6rem] font-bold text-white/35 uppercase">Feature</div>
                  <div className="text-[0.6rem] font-bold text-[#ffd93d] uppercase text-center">FastAPI</div>
                  <div className="text-[0.6rem] font-bold text-[#4facfe] uppercase text-center">Flask</div>
                </div>
                {COMPARISONS.map((row, i) => (
                  <div key={i} className={`grid grid-cols-3 gap-0 py-2 border-t border-white/[0.06]`}>
                    <div className="text-[0.67rem] text-white/60 font-medium">{row.aspect}</div>
                    <div className={`text-[0.63rem] text-center px-1 ${row.winner === 'fastapi' ? 'text-[#ffd93d] font-bold' : 'text-white/45'}`}>
                      {row.fastapi}{row.winner === 'fastapi' && <span className="ml-1">★</span>}
                    </div>
                    <div className={`text-[0.63rem] text-center px-1 ${row.winner === 'flask' ? 'text-[#4facfe] font-bold' : 'text-white/45'}`}>
                      {row.flask}{row.winner === 'flask' && <span className="ml-1">★</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* When to use */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="bg-[#ffd93d]/[0.06] border border-[#ffd93d]/20 rounded-xl p-4">
                  <h3 className="text-[0.72rem] font-bold text-[#ffd93d] mb-2">🚀 Choose FastAPI When</h3>
                  <ul className="flex flex-col gap-1.5">
                    {['Building new APIs from scratch', 'Performance matters (async)', 'You want automatic validation', 'Auto-generated docs are important'].map((item, i) => (
                      <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#ffd93d] flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#4facfe]/[0.06] border border-[#4facfe]/20 rounded-xl p-4">
                  <h3 className="text-[0.72rem] font-bold text-[#4facfe] mb-2">🌊 Choose Flask When</h3>
                  <ul className="flex flex-col gap-1.5">
                    {['Simple prototyping / learning', 'Existing Flask ecosystem', 'Maximum flexibility needed', 'Small, simple applications'].map((item, i) => (
                      <li key={i} className="text-[0.67rem] text-white/55 flex items-start gap-1.5">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#4facfe] flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* CODE VIEW */}
          {view === 'code' && (
            <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              {/* Example selector */}
              <div className="flex gap-2 mb-3">
                {EXAMPLE_LABELS.map(ex => (
                  <button key={ex.id} onClick={() => setCodeExample(ex.id)}
                    className={`px-3 py-1.5 rounded-lg border text-[0.68rem] font-medium transition-all
                      ${codeExample === ex.id ? 'border-[#ffd93d]/40 bg-[#ffd93d]/10 text-[#ffd93d]' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
                    {ex.icon} {ex.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl">
                  <div className="px-4 py-2 border-b border-white/[0.06] bg-[#ffd93d]/[0.06] rounded-t-xl">
                    <h3 className="text-[0.7rem] font-bold text-[#ffd93d]">⚡ FastAPI</h3>
                  </div>
                  <div className="p-3">
                    <pre className="text-[0.66rem] text-[#a5f3fc] font-mono leading-relaxed whitespace-pre-wrap">{CODE_EXAMPLES.fastapi[codeExample]}</pre>
                  </div>
                </div>
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl">
                  <div className="px-4 py-2 border-b border-white/[0.06] bg-[#4facfe]/[0.06] rounded-t-xl">
                    <h3 className="text-[0.7rem] font-bold text-[#4facfe]">🌊 Flask</h3>
                  </div>
                  <div className="p-3">
                    <pre className="text-[0.66rem] text-[#a5f3fc] font-mono leading-relaxed whitespace-pre-wrap">{CODE_EXAMPLES.flask[codeExample]}</pre>
                  </div>
                </div>
              </div>

              {/* Key difference callout */}
              <div className="mt-3 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3">
                <div className="text-[0.67rem] text-white/50">
                  {codeExample === 'hello' && <><span className="text-[#ffd93d] font-bold">Key:</span> Both use decorators for routing. FastAPI adds type hints for auto-validation; Flask keeps it simple.</>}
                  {codeExample === 'typed' && <><span className="text-[#ffd93d] font-bold">Key:</span> FastAPI uses Pydantic models for automatic validation + error messages. Flask requires manual validation.</>}
                  {codeExample === 'async' && <><span className="text-[#ffd93d] font-bold">Key:</span> FastAPI natively supports <code className="text-[#ffd93d]">async/await</code>. Flask runs synchronously by default — I/O tasks block the server.</>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
