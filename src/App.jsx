import { useState } from 'react';
import LandingPage from './pages/LandingPage';

// ── Original demos ────────────────────────────────────────
import StateDemo from './demos/StateDemo';
import EffectDemo from './demos/EffectDemo';
import ConditionalRenderingDemo from './demos/ConditionalRenderingDemo';
import TransactionsDemo from './demos/TransactionsDemo';
import HavingVsWhereDemo from './demos/HavingVsWhereDemo';
import CDNDemo from './demos/CDNDemo';
import CachingDemo from './demos/CachingDemo';
import RateLimitingDemo from './demos/RateLimitingDemo';

// ── MERN Stack ────────────────────────────────────────────
import ContextAPIDemo from './demos/ContextAPIDemo';
import ReactRouterDemo from './demos/ReactRouterDemo';

// ── DBMS ──────────────────────────────────────────────────
import SQLJoinsDemo from './demos/SQLJoinsDemo';
import IndexingDemo from './demos/IndexingDemo';

// ── Networks ──────────────────────────────────────────────
import OSIModelDemo from './demos/OSIModelDemo';
import TCPvsUDPDemo from './demos/TCPvsUDPDemo';
import HTTPvsHTTPSDemo from './demos/HTTPvsHTTPSDemo';
import DNSDemo from './demos/DNSDemo';

// ── OS ────────────────────────────────────────────────────
import ProcessVsThreadDemo from './demos/ProcessVsThreadDemo';
import CPUSchedulingDemo from './demos/CPUSchedulingDemo';

// ── DevOps ────────────────────────────────────────────────
import DockerDemo from './demos/DockerDemo';

// ── AI ────────────────────────────────────────────────────
import MLBasicsDemo from './demos/MLBasicsDemo';
import NeuralNetworksDemo from './demos/NeuralNetworksDemo';

// ── Theory & Compilers ────────────────────────────────────
import CompilersDemo from './demos/CompilersDemo';

// ── Python ────────────────────────────────────────────────
import ListComprehensionsDemo from './demos/ListComprehensionsDemo';

// ── Java ──────────────────────────────────────────────────
import JavaOOPDemo from './demos/JavaOOPDemo';

// ── System Design ─────────────────────────────────────────
import LoadBalancingDemo from './demos/LoadBalancingDemo';

// ── OS (additional) ──────────────────────────────────────
import DeadlockDemo from './demos/DeadlockDemo';

// ── DBMS (additional) ────────────────────────────────────
import BTtreeDemo from './demos/BTtreeDemo';
import SQLvsNoSQLDemo from './demos/SQLvsNoSQLDemo';

// ── Theory (additional) ──────────────────────────────────
import FiniteAutomataDemo from './demos/FiniteAutomataDemo';

// ── Architecture ──────────────────────────────────────────
import RISCvsCISCDemo from './demos/RISCvsCISCDemo';

// ── AI (additional) ──────────────────────────────────────
import DecisionTreesDemo from './demos/DecisionTreesDemo';
import GradientDescentDemo from './demos/GradientDescentDemo';

// ── Python (additional) ──────────────────────────────────
import DecoratorsDemo from './demos/DecoratorsDemo';

// ── System Design (additional) ───────────────────────────
import CAPTheoremDemo from './demos/CAPTheoremDemo';
import DBShardingDemo from './demos/DBShardingDemo';

// ── DevOps (additional) ──────────────────────────────────
import KubernetesDemo from './demos/KubernetesDemo';
import CICDDemo from './demos/CICDDemo';
import LinuxCLIDemo from './demos/LinuxCLIDemo';

// ── Python (batch 5) ─────────────────────────────────────
import AsyncPythonDemo from './demos/AsyncPythonDemo';
import FastAPIvsFlaskDemo from './demos/FastAPIvsFlaskDemo';

// ── Architecture (batch 5) ───────────────────────────────
import CacheHierarchyDemo from './demos/CacheHierarchyDemo';
import CPUPipeliningDemo from './demos/CPUPipeliningDemo';

import './App.css';

const ROUTES = {
  // Original
  state:                StateDemo,
  effect:               EffectDemo,
  'conditional-rendering': ConditionalRenderingDemo,
  transactions:         TransactionsDemo,
  'having-vs-where':    HavingVsWhereDemo,
  cdn:                  CDNDemo,
  caching:              CachingDemo,
  'rate-limiting':      RateLimitingDemo,
  // MERN
  'context-api':        ContextAPIDemo,
  'react-router':       ReactRouterDemo,
  // DBMS
  'sql-joins':          SQLJoinsDemo,
  indexing:             IndexingDemo,
  // Networks
  'osi-model':          OSIModelDemo,
  'tcp-vs-udp':         TCPvsUDPDemo,
  'http-vs-https':      HTTPvsHTTPSDemo,
  dns:                  DNSDemo,
  // OS
  'process-vs-thread':  ProcessVsThreadDemo,
  'cpu-scheduling':     CPUSchedulingDemo,
  // DevOps
  docker:               DockerDemo,
  // AI
  'ml-basics':          MLBasicsDemo,
  'neural-networks':    NeuralNetworksDemo,
  // Theory & Compilers
  compilers:            CompilersDemo,
  // Python
  'list-comprehensions': ListComprehensionsDemo,
  // Java
  'java-oop':           JavaOOPDemo,
  // System Design
  'load-balancing':     LoadBalancingDemo,
  // OS
  deadlock:             DeadlockDemo,
  // DBMS
  btree:                BTtreeDemo,
  'sql-vs-nosql':       SQLvsNoSQLDemo,
  // Theory
  'finite-automata':    FiniteAutomataDemo,
  // Architecture
  'risc-vs-cisc':       RISCvsCISCDemo,
  // AI
  'decision-trees':     DecisionTreesDemo,
  'gradient-descent':   GradientDescentDemo,
  // Python
  decorators:           DecoratorsDemo,
  // System Design
  'cap-theorem':        CAPTheoremDemo,
  'db-sharding':        DBShardingDemo,
  // DevOps
  kubernetes:           KubernetesDemo,
  cicd:                 CICDDemo,
  'linux-cli':          LinuxCLIDemo,
  // Python (batch 5)
  'async-python':       AsyncPythonDemo,
  'fastapi-vs-flask':   FastAPIvsFlaskDemo,
  // Architecture (batch 5)
  'cache-hierarchy':    CacheHierarchyDemo,
  'cpu-pipelining':     CPUPipeliningDemo,
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page) => setCurrentPage(page);
  const goHome   = () => setCurrentPage('home');

  if (currentPage === 'home' || !ROUTES[currentPage]) {
    return (
      <div className="app-container">
        <LandingPage onNavigate={navigate} />
      </div>
    );
  }

  const Demo = ROUTES[currentPage];
  return (
    <div className="app-container">
      <Demo onBack={goHome} />
    </div>
  );
}

export default App;
