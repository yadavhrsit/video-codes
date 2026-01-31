import { motion } from 'framer-motion';
import { FileCode2 } from 'lucide-react';

const CodeBlock = ({ code, title = "Example Code" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden w-full max-w-md"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.2)]">
        <FileCode2 size={16} className="text-blue-400" />
        <span className="text-xs font-medium text-gray-400 font-mono tracking-wide uppercase">{title}</span>
        <div className="flex gap-1.5 ml-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-gray-300 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
