import { useState } from 'react';
import { motion } from 'motion/react';

export default function HardeningConfig({ onToast }: { onToast?: (msg: string, type: 'info'|'warning'|'success'|'error') => void }) {
  const [iterations, setIterations] = useState(3);
  const [memoryCost, setMemoryCost] = useState(65536);
  const [parallelism, setParallelism] = useState(4);
  const [isApplying, setIsApplying] = useState(false);
  const [applyStatus, setApplyStatus] = useState<string | null>(null);

  const delayValue = (iterations * (memoryCost / 65536) * (parallelism / 2) * 45).toFixed(1);
  const isTargetMet = parseFloat(delayValue) > 100;

  const changeParallel = (delta: number) => {
    setParallelism(p => Math.min(Math.max(p + delta, 1), 8));
  };

  const handleApply = () => {
    if (isApplying) return;
    setIsApplying(true);
    setApplyStatus('SYNCING...');
    
    setTimeout(() => {
      setApplyStatus('SUCCESS');
      if (onToast) onToast('Argon2id config synced to all validation nodes.', 'success');
      setTimeout(() => {
        setIsApplying(false);
        setApplyStatus(null);
      }, 2000);
    }, 1000);
  };


  // Generate dots for visual progress
  const dots = Array.from({ length: 120 }).map((_, i) => (
    <div key={i} className="w-3 h-3 bg-primary-container" style={{ opacity: Math.random() * 0.5 + 0.1 }}></div>
  ));

  return (
    <div className="relative pb-16 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: ARGON2ID CONFIGURATION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-7 space-y-6"
        >
          <div className="p-4 md:p-6 border border-outline-variant bg-surface-elevation-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline-md text-[20px] md:text-[24px] text-on-surface uppercase tracking-tight">Argon2id Parameters</h2>
              <span className="px-2 py-1 bg-primary-container text-[#003907] font-bold text-[12px] font-label-caps tracking-widest">MODE: SENSITIVE</span>
            </div>
            
            <div className="space-y-10">
              {/* Iterations Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="font-label-caps text-[12px] text-on-surface-variant font-bold tracking-widest">Iterations (t)</label>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-md text-[32px] md:text-[40px] font-bold text-primary-container leading-none">{iterations}</span>
                    <span className="font-code-block text-[14px] opacity-40 uppercase">PASSES</span>
                  </div>
                </div>
                <input 
                  className="w-full appearance-none bg-surface-container-high cursor-pointer h-1 outline-none" 
                  max="10" 
                  min="1" 
                  type="range" 
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                />
                <p className="font-code-block text-[12px] text-on-surface-variant italic">Increases CPU time to resist specialized hardware (ASICs/FPGAs).</p>
              </div>

              {/* Memory Cost Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="font-label-caps text-[12px] text-on-surface-variant font-bold tracking-widest">Memory Cost (m)</label>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-md text-[32px] md:text-[40px] font-bold text-primary-container leading-none">{memoryCost}</span>
                    <span className="font-code-block text-[14px] opacity-40 uppercase">KiB</span>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-code-block text-[14px] text-primary-container font-bold">&gt;</span>
                  <input 
                    className="w-full bg-terminal-black border border-outline-variant p-3 pl-8 font-code-block text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-colors" 
                    step="1024" 
                    type="number" 
                    value={memoryCost}
                    onChange={(e) => setMemoryCost(Number(e.target.value))}
                  />
                </div>
                <p className="font-code-block text-[12px] text-on-surface-variant italic">Higher values force the attacker to dedicate more RAM, raising the cost of parallel attacks.</p>
              </div>

              {/* Parallelism Stepper */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-[12px] text-on-surface-variant font-bold tracking-widest">Parallelism (p)</label>
                  <div className="flex items-center gap-4">
                    <button 
                      className="w-10 h-10 border border-outline-variant hover:bg-surface-container-highest transition-colors flex items-center justify-center font-bold text-xl active:scale-95" 
                      onClick={() => changeParallel(-1)}
                    >
                      -
                    </button>
                    <span className="font-headline-md text-[32px] md:text-[40px] font-bold text-primary-container w-12 text-center leading-none">{parallelism}</span>
                    <button 
                      className="w-10 h-10 border border-outline-variant hover:bg-surface-container-highest transition-colors flex items-center justify-center font-bold text-xl active:scale-95" 
                      onClick={() => changeParallel(1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="segmented-progress-bar">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`segment ${i < parallelism ? 'active' : ''}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container border-l-4 border-primary-container gap-6">
            <div>
              <h4 className="font-headline-md text-[20px] font-bold text-on-surface">Commit Hardening Policy</h4>
              <p className="font-code-block text-[14px] text-on-surface-variant mt-1">Update Argon2id parameters across all validation nodes.</p>
            </div>
            <button 
              className={`px-8 py-4 font-bold text-[12px] font-label-caps tracking-widest border border-transparent transition-all flex justify-center items-center gap-3 w-full md:w-auto
                ${applyStatus === 'SUCCESS' ? 'bg-[#00daf3] text-[#00363d] glow-secondary' : 
                  isApplying ? 'bg-primary-container/50 text-[#003907]' : 
                  'bg-primary-container text-[#003907] glow-primary hover:bg-[#72ff70] active:scale-95'}`}
              onClick={handleApply}
              disabled={isApplying}
            >
              {applyStatus || 'APPLY_CONFIG'}
              {!applyStatus && <span className="material-symbols-outlined">rocket_launch</span>}
            </button>
          </div>
        </motion.section>

        {/* RIGHT COLUMN: METRICS & VISUALIZATION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-5 space-y-6"
        >
          
          {/* Verification Delay Card */}
          <div className="p-4 md:p-6 border border-outline-variant bg-surface-elevation-1">
            <label className="font-label-caps text-[12px] text-on-surface-variant font-bold tracking-widest mb-4 block">Calculated Performance Overhead</label>
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-outline-variant relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none hash-compare-gradient"></div>
              <span className="font-code-block text-[14px] text-on-surface-variant mb-2">VERIFICATION DELAY</span>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="font-headline-md text-[40px] md:text-[60px] font-bold text-primary-container tracking-tighter leading-none">{delayValue}</span>
                <span className="font-headline-md text-[20px] md:text-[24px] font-bold text-primary-container opacity-60">MS</span>
              </div>
              
              {isTargetMet ? (
                <div className="mt-4 px-3 py-1 bg-[#007117] text-[#ebffe2] font-code-block text-[12px] uppercase tracking-widest flex items-center gap-2 relative z-10 font-bold border border-[#00e639]">
                  <span className="material-symbols-outlined text-[16px] text-primary-container">check_circle</span>
                  Target Met (&gt;100ms)
                </div>
              ) : (
                <div className="mt-4 px-3 py-1 bg-[#93000a] text-[#ffb4ab] font-code-block text-[12px] uppercase tracking-widest flex items-center gap-2 relative z-10 font-bold border border-[#ff1744]">
                  <span className="material-symbols-outlined text-[16px] text-[#ff1744]">warning</span>
                  Weak Resistance
                </div>
              )}
            </div>
          </div>

          {/* COMPARATIVE VISUALIZATION */}
          <div className="p-4 md:p-6 border border-outline-variant bg-terminal-black flex flex-col h-full min-h-[400px]">
             <h3 className="font-label-caps text-[12px] font-bold text-on-surface-variant mb-6 border-b border-outline-variant pb-2 flex items-center justify-between tracking-widest">
                Resistance Visualization
                <span className="text-[10px] opacity-40">REAL-TIME SEEDED MAP</span>
            </h3>
            
            <div className="flex-1 space-y-8">
              {/* Raw Hash */}
              <div className="space-y-2">
                <div className="flex justify-between font-code-block text-[12px] uppercase tracking-tight text-on-surface-variant">
                  <span>Raw Hash (MD5/SHA1)</span>
                  <span className="text-vulnerability-red font-bold">Insecure</span>
                </div>
                <div className="h-12 border border-outline-variant p-2 bg-surface-container-low overflow-hidden break-all font-code-block text-[12px] text-on-surface-variant opacity-50 flex items-center">
                  5d41402abc4b2a76b9719d911017c592... (instant)
                </div>
                <div className="h-1 bg-vulnerability-red w-[2%]"></div>
              </div>

              {/* Salted & Stretched */}
              <div className="space-y-2">
                <div className="flex justify-between font-code-block text-[12px] uppercase tracking-tight text-on-surface-variant">
                  <span>Salted & Stretched (Argon2id)</span>
                  <span className="text-primary-container font-bold">Hardened</span>
                </div>
                <div className="relative h-32 border border-primary-container/30 bg-surface-container-lowest p-2 overflow-hidden flex flex-wrap gap-[4px] content-start">
                  {dots}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                    <div className="text-center p-2 border border-primary-container/20 bg-background/80">
                      <p className="font-label-caps text-[12px] font-bold text-primary-container mb-1 tracking-widest">Pre-computation Resistant</p>
                      <p className="font-code-block text-[12px] text-on-surface opacity-60">Work Factor: 2^16 ops</p>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-primary-container w-full transition-all duration-700" style={{ width: isApplying ? '0%' : '100%' }}></div>
              </div>

              {/* Technical Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
                <div className="p-3 bg-surface-container-low">
                  <p className="text-[10px] font-label-caps font-bold text-on-surface-variant mb-1 tracking-widest">COMPUTE COST</p>
                  <p className="font-code-block text-[18px] text-on-surface font-bold">1.28 GigaOps</p>
                </div>
                <div className="p-3 bg-surface-container-low">
                  <p className="text-[10px] font-label-caps font-bold text-on-surface-variant mb-1 tracking-widest">ATTACK LATENCY</p>
                  <p className="font-code-block text-[18px] text-on-surface font-bold">~0.4s / try</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* UI Overlay for Command Prompt */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        className="fixed bottom-8 right-8 z-50 pointer-events-none hidden lg:block"
      >
        <div className="bg-[#050505]/90 backdrop-blur-md border border-outline-variant p-4 shadow-2xl pointer-events-auto w-80">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-code-block text-[12px] text-primary-container font-bold uppercase tracking-widest">CORE_LISTENER: 4433</span>
          </div>
          <div className="font-code-block text-[13px] text-on-surface-variant leading-relaxed">
            <span className="opacity-50">$</span> argon2-optimize --target-ms 150<br/>
            <span className="text-on-surface mt-1 block">Calculating optimal threads...</span>
            <span className="text-primary-container font-bold block mt-1">Recommended P=4, T=3</span>
            <span className="terminal-cursor"></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
