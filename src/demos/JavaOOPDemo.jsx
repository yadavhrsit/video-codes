import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PILLARS = [
  {
    id: 'inheritance',
    name: 'Inheritance',
    icon: '👨‍👧',
    color: '#667eea',
    desc: 'A child class extends a parent class, inheriting its properties and methods. Use "extends" in Java.',
    code: `class Animal {\n  String name;\n  void speak() { System.out.println("..."); }\n}\n\nclass Dog extends Animal {\n  void speak() {\n    System.out.println("Woof!");\n  }\n}`,
    visual: { parent: 'Animal', child: 'Dog', arrow: '← extends' },
  },
  {
    id: 'polymorphism',
    name: 'Polymorphism',
    icon: '🎭',
    color: '#4facfe',
    desc: 'Same method name, different behavior depending on the object type. "One interface, many forms."',
    code: `Animal a1 = new Dog();\nAnimal a2 = new Cat();\nAnimal a3 = new Bird();\n\na1.speak(); // "Woof!"\na2.speak(); // "Meow!"\na3.speak(); // "Tweet!"`,
    visual: { items: [{ type: 'Dog', output: 'Woof!' }, { type: 'Cat', output: 'Meow!' }, { type: 'Bird', output: 'Tweet!' }] },
  },
  {
    id: 'encapsulation',
    name: 'Encapsulation',
    icon: '🔒',
    color: '#43e97b',
    desc: 'Bundling data and methods together, hiding internal details. Use private fields + getters/setters.',
    code: `class BankAccount {\n  private double balance; // hidden!\n\n  public void deposit(double amt) {\n    if (amt > 0) balance += amt;\n  }\n\n  public double getBalance() {\n    return balance;\n  }\n}`,
    visual: { outer: 'BankAccount', inner: ['private balance', 'deposit()', 'getBalance()'] },
  },
  {
    id: 'abstraction',
    name: 'Abstraction',
    icon: '🎨',
    color: '#f093fb',
    desc: 'Hide complex implementation, show only what\'s needed. Use abstract classes or interfaces.',
    code: `abstract class Shape {\n  abstract double area(); // must implement\n  void display() {\n    System.out.println("Area: " + area());\n  }\n}\n\nclass Circle extends Shape {\n  double radius;\n  double area() { return Math.PI * radius * radius; }\n}`,
    visual: { abstract: 'Shape', concrete: ['Circle', 'Rectangle', 'Triangle'] },
  },
];

export default function JavaOOPDemo({ onBack }) {
  const [selected, setSelected] = useState(0);
  const pillar = PILLARS[selected];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] border border-white/[0.15] rounded-xl text-sm font-medium hover:bg-white/[0.12] hover:-translate-x-1 transition-all duration-300">← Back</button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] bg-clip-text text-transparent">Java OOP</h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-white/55 text-sm leading-relaxed mb-3">
            Object-Oriented Programming organizes code around <span className="text-[#ff6b6b] font-semibold">objects</span> — instances of classes that bundle data (fields) and behavior (methods). Java is built on 4 OOP pillars.
          </p>
          <p className="text-white/45 text-[0.72rem] leading-relaxed">
            <span className="text-white/60 font-semibold">Why OOP:</span> Before OOP, code was organized as procedures that operated on data — easy to break when data structures changed. OOP bundles data with the code that operates on it, making large programs easier to maintain, extend, and reason about. It maps naturally to how we think about real-world entities.
          </p>
        </div>

        {/* Key Terminology */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">Key Terminology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { term: 'Class', def: 'A blueprint or template that defines the structure and behavior of objects. Like a cookie cutter — defines shape but isn\'t a cookie itself.' },
              { term: 'Object', def: 'An instance of a class with actual data. Created with "new". Multiple objects can be created from one class.' },
              { term: 'Constructor', def: 'A special method called when creating an object. Same name as the class. Initializes fields.' },
              { term: 'Interface', def: 'A contract defining methods a class must implement. No implementation, just signatures. A class can implement multiple interfaces.' },
              { term: 'Access Modifiers', def: 'public (anyone), private (same class only), protected (same package + subclasses), default (same package).' },
              { term: 'Static', def: 'Belongs to the class itself, not instances. Shared across all objects. Called on the class: Math.sqrt(), not myMath.sqrt().' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.06]">
                <span className="text-[0.68rem] font-bold text-[#ff6b6b]">{item.term}</span>
                <p className="text-[0.62rem] text-white/45 mt-0.5">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PILLARS.map((p, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`px-3 py-2.5 rounded-xl border text-center transition-all duration-200
                ${selected === i ? 'border-white/[0.3] bg-white/[0.07]' : 'border-white/[0.08] hover:bg-white/[0.04]'}`}>
              <div className="text-lg mb-0.5">{p.icon}</div>
              <div className="text-[0.68rem] font-bold" style={{ color: selected === i ? p.color : 'rgba(255,255,255,0.6)' }}>{p.name}</div>
            </button>
          ))}
        </div>

        {/* Detail view */}
        <AnimatePresence mode="wait">
          <motion.div key={selected} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{pillar.icon}</span>
              <h2 className="text-base font-bold" style={{ color: pillar.color }}>{pillar.name}</h2>
            </div>
            <p className="text-[0.72rem] text-white/55 mb-4">{pillar.desc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Visual */}
              <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px]">
                {pillar.id === 'inheritance' && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="px-4 py-2 rounded-lg border border-[#667eea]/30 bg-[#667eea]/10 text-[0.72rem] font-bold text-[#667eea]">🐾 {pillar.visual.parent}</div>
                    <div className="text-[0.6rem] text-[#667eea]/50">{pillar.visual.arrow}</div>
                    <div className="px-4 py-2 rounded-lg border border-[#667eea]/50 bg-[#667eea]/20 text-[0.72rem] font-bold text-[#667eea]">🐕 {pillar.visual.child}</div>
                  </div>
                )}
                {pillar.id === 'polymorphism' && (
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[0.6rem] text-white/40 text-center mb-1">Animal ref → different types</div>
                    {pillar.visual.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                        <span className="text-[0.65rem] text-[#4facfe] font-bold w-10">{item.type}</span>
                        <span className="text-white/20">→</span>
                        <span className="text-[0.65rem] text-[#43e97b] font-semibold">"{item.output}"</span>
                      </div>
                    ))}
                  </div>
                )}
                {pillar.id === 'encapsulation' && (
                  <div className="border border-[#43e97b]/30 rounded-xl p-3 w-full">
                    <div className="text-[0.65rem] font-bold text-[#43e97b] text-center mb-2">{pillar.visual.outer}</div>
                    {pillar.visual.inner.map((item, i) => (
                      <div key={i} className={`text-[0.6rem] px-2 py-0.5 rounded text-center mb-0.5
                        ${item.startsWith('private') ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#43e97b]/10 text-[#43e97b]'}`}>
                        {item.startsWith('private') ? '🔒 ' : '📤 '}{item}
                      </div>
                    ))}
                  </div>
                )}
                {pillar.id === 'abstraction' && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="px-4 py-1.5 rounded-lg border border-dashed border-[#f093fb]/40 bg-[#f093fb]/[0.06] text-[0.68rem] font-bold text-[#f093fb] italic">
                      abstract {pillar.visual.abstract}
                    </div>
                    <div className="text-[0.55rem] text-white/25">implements ↓</div>
                    <div className="flex gap-1.5">
                      {pillar.visual.concrete.map((c, i) => (
                        <div key={i} className="px-2 py-1 rounded-lg border border-[#f093fb]/25 bg-[#f093fb]/10 text-[0.62rem] font-bold text-[#f093fb]">{c}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Code */}
              <div className="bg-[#0a0a14] border border-white/[0.06] rounded-xl p-3">
                <pre className="text-[0.68rem] text-[#a5f3fc] font-mono leading-relaxed whitespace-pre-wrap">{pillar.code}</pre>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Class vs Object */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#667eea] mb-2">📄 Class (Blueprint)</h3>
            <div className="bg-[#0a0a14] rounded-lg p-2.5 border border-white/[0.06]">
              <pre className="text-[0.62rem] text-[#a5f3fc] font-mono leading-relaxed">{`class Car {\n  String brand;\n  int speed;\n  void accelerate() { ... }\n}`}</pre>
            </div>
            <p className="text-[0.6rem] text-white/40 mt-1.5">Defines structure — no data yet</p>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-[0.72rem] font-bold text-[#43e97b] mb-2">📦 Object (Instance)</h3>
            <div className="bg-[#0a0a14] rounded-lg p-2.5 border border-white/[0.06]">
              <pre className="text-[0.62rem] text-[#a5f3fc] font-mono leading-relaxed">{`Car myCar = new Car();\nmyCar.brand = "Tesla";\nmyCar.speed = 0;\nmyCar.accelerate();`}</pre>
            </div>
            <p className="text-[0.6rem] text-white/40 mt-1.5">An actual instance with real data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
