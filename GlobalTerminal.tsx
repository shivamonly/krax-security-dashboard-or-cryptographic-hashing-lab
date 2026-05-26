import React, { useState, useRef, useEffect } from 'react';

const COMMANDS = [
  { name: '/help', description: 'Show this message' },
  { name: '/status', description: 'Display system nodes' },
  { name: '/clear', description: 'Clear logs' },
  { name: '/reboot', description: 'Reboot the node' },
  { name: '/scan', description: 'Scan network for open ports' },
];

export default function GlobalTerminal({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<{type: 'in' | 'out' | 'sys', text: string}[]>([
    { type: 'sys', text: 'KRAX_V1 Terminal Session Initialized.' },
    { type: 'sys', text: 'Type "/help" or "help" for a list of available commands.' }
  ]);
  const [input, setInput] = useState('');
  const [selectedCmdIdx, setSelectedCmdIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    
    setHistory(h => [...h, { type: 'in', text: trimmed }]);
    setInput('');

    setTimeout(() => {
      let args = trimmed.toLowerCase().split(' ');
      // Handle both with and without forward slash
      let cmd = args[0].startsWith('/') ? args[0].substring(1) : args[0];

      let response = '';
      switch (cmd) {
        case 'help': response = 'Commands:\n - /help: Show this message\n - /status: Display system nodes\n - /clear: Clear logs\n - /reboot: Reboot the node\n - /scan: Scan network for open ports'; break;
        case 'status': response = 'SYSTEM: NOMINAL\nACTIVE_NODES: 4\nGPU_CLUSTER: 98.4% LOAD\nMEM_POOL: SECURE'; break;
        case 'clear': setHistory([]); return;
        case 'reboot': 
          response = 'System restart sequence initialized... (Simulated)'; 
          setTimeout(onClose, 1500);
          break;
        case 'scan': response = 'Scanning local subnet (10.0.0.0/24)...\n[22] SSH Open\n[80] HTTP Open\n[443] HTTPS Open\nScan complete. 3 vectors found.'; break;
        default: response = `bash: ${cmd}: command not found`; break;
      }
      if (response) {
        setHistory(h => [...h, { type: 'out', text: response }]);
      }
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (input.startsWith('/')) {
      const filteredCmds = COMMANDS.filter(c => c.name.startsWith(input));
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCmdIdx((prev) => (prev + 1) % filteredCmds.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCmdIdx((prev) => (prev - 1 + filteredCmds.length) % filteredCmds.length);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (filteredCmds.length > 0) {
          setInput(filteredCmds[selectedCmdIdx].name);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setSelectedCmdIdx(0);
  };

  const filteredCommands = COMMANDS.filter(c => c.name.startsWith(input));
  const showSuggestions = input.startsWith('/') && filteredCommands.length > 0;

  return (
    <div className="h-64 sm:h-80 w-full bg-[#050505]/95 backdrop-blur-md border-t-2 border-primary-container flex flex-col absolute bottom-0 left-0 z-50 shadow-[0_-10px_30px_rgba(0,255,65,0.1)]">
      <div className="flex justify-between items-center px-4 py-2 bg-surface-container-low border-b border-outline-variant">
        <span className="font-label-caps text-[12px] text-primary-container font-bold flex items-center gap-2 tracking-widest">
          <span className="material-symbols-outlined text-[16px]">terminal</span>
          GLOBAL_TERMINAL_INTERFACE
        </span>
        <button onClick={onClose} className="text-on-surface-variant hover:text-primary-container transition-colors">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto font-code-block text-[13px] terminal-scroll cursor-text relative" onClick={() => inputRef.current?.focus()}>
        {history.map((entry, idx) => (
          <div key={idx} className="mb-1">
            {entry.type === 'in' && <span className="text-secondary-fixed-dim mr-2">&gt;</span>}
            <span className={entry.type === 'sys' ? 'text-primary-container font-bold uppercase tracking-widest text-[11px]' : entry.type === 'in' ? 'text-on-surface' : 'text-on-surface-variant whitespace-pre-wrap leading-relaxed'}>
              {entry.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
        
        {/* Command Suggestions Popup */}
        {showSuggestions && (
          <div className="absolute bottom-10 left-4 z-50 min-w-[200px] bg-surface-container-high border border-outline-variant shadow-lg py-1">
            {filteredCommands.map((cmd, idx) => (
              <div 
                key={cmd.name}
                onClick={() => {
                  setInput(cmd.name);
                  inputRef.current?.focus();
                }}
                className={`px-3 py-1 cursor-pointer flex justify-between items-center font-code-block text-[12px] ${idx === selectedCmdIdx ? 'bg-primary-container text-[#002203]' : 'text-on-surface hover:bg-surface-variant'}`}
              >
                <span className="font-bold">{cmd.name}</span>
                <span className={`text-[10px] ${idx === selectedCmdIdx ? 'text-[#00530e]' : 'text-on-surface-variant'}`}>{cmd.description}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCommand} className="mt-2 flex items-center relative">
          <span className="text-secondary-fixed-dim mr-2">&gt;</span>
          <input 
            ref={inputRef}
            type="text" 
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-on-surface p-0 focus:ring-0 max-w-full font-code-block"
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
