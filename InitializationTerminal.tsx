import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function InitializationTerminal({ onEnter }: { onEnter: () => void }) {
  const [hex, setHex] = useState('');
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState('');
  const [bootDone, setBootDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Hex scroller
    const hexInterval = setInterval(() => {
      let h = "";
      for (let i = 0; i < 8; i++) {
        h += Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0') + " ";
      }
      setHex(h);
    }, 100);

    // Boot progress
    const progInterval = setInterval(() => {
      setProgress((prev) => {
        let newProg = prev + Math.random() * 2;
        if (newProg >= 100) {
          newProg = 100;
          setBootDone(true);
          clearInterval(progInterval);
        }
        return newProg;
      });
    }, 150);

    // Clock
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].split('.')[0] + " UTC");
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(hexInterval);
      clearInterval(progInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 500);
  };

  const biosBlocksCount = Math.floor(progress / 10);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative min-h-screen flex flex-col items-center justify-center p-gutter overflow-hidden"
        >
          {/* Cinematic Cyber Background Video */}
          <video 
            src="/intro-video.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="fixed top-0 left-0 w-full h-full object-cover z-[-12] opacity-50 mix-blend-screen"
          />

      {/* Glitching Background Data */}
      <div className="fixed inset-0 z-[-11] pointer-events-none overflow-hidden">
        <img 
          src="https://lh3.googleusercontent.com/aida/ADBb0uiCmOwsD3aQZBeW4SlmkcuO1fwho_dzjr4M5yXBdt2BDt1KVOeMxLzFbh7a7Sdfr-4UudQPcxB1qQo8VAugl1pU4zbupdVhfQHC82ugyXfngOa-ZiEPpHZ2NX8V6UwFDVXXg6Flt2XKFK9ebKXeC-ytCE2Lce3PIYDXlnPhuqHJ2YwCZHNnyeT0ovNC5c06nWnMtHyVB9X9xXRcrCewkxw05OGjQJTUk0oCFugWrq6bvDZKI8qB9vRSZw" 
          alt="Cybersecurity Background"
          className="w-full h-full object-cover opacity-15 select-none glitch-target"
        />
      </div>

      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 scan-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-80"></div>
        <div className="absolute inset-0 w-full h-[2px] bg-primary-container/10 blur-sm z-10" style={{ animation: 'scanline 8s linear infinite' }}></div>
      </div>

          {/* Overlays */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="fixed top-gutter left-gutter z-50 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1 border border-outline-variant bg-surface-container-low">
              <span className="w-2 h-2 bg-primary-container animate-pulse"></span>
              <span className="font-label-caps text-[12px] text-primary-container">SYS_READY</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 border border-outline-variant bg-surface-container-low">
              <span className="font-label-caps text-[12px] text-on-surface-variant">NODE_ID: 0x8F22-A</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="fixed top-gutter right-gutter z-50 flex flex-col items-end gap-2 text-right">
            <div className="flex items-center gap-2 px-3 py-1 border border-primary-container/30 bg-surface-container-low">
              <span className="font-label-caps text-[12px] text-primary-fixed-dim">ENCRYPTION_ACTIVE</span>
              <span className="material-symbols-outlined text-[14px] text-primary-fixed-dim" style={{ fontVariationSettings: '"FILL" 1' }}>lock</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 border border-outline-variant bg-surface-container-low">
              <span className="font-label-caps text-[12px] text-on-surface-variant">{time}</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="fixed bottom-gutter left-gutter z-50">
            <div className="font-label-caps text-[12px] text-on-surface-variant/40 flex flex-col">
              <span>VERSION_4.2.0_STABLE</span>
              <span>INTEL_DIRECT_ACCESS_ENABLED</span>
            </div>
          </motion.div>

          {/* Main Terminal UI */}
      <main className="relative z-20 w-full max-w-2xl border border-outline-variant bg-surface-container-lowest terminal-glow flex flex-col overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-surface-container-low border-b border-outline-variant px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-[18px]">terminal</span>
            <h1 className="font-label-caps text-[12px] text-on-surface tracking-widest">KRAX_V1</h1>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-outline-variant"></div>
            <div className="w-2 h-2 bg-outline-variant"></div>
            <div className="w-2 h-2 bg-primary-container/40"></div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-code-block text-[14px] space-y-6">
          <div className="text-on-surface-variant h-48 overflow-y-auto space-y-1 scrollbar-hide">
            <p className="text-primary-container">[AUTH] INITIATING SECURE HANDSHAKE...</p>
            {progress > 10 && <p>[AUTH] REQUESTING PKI CHALLENGE FROM 0x112.0.4.99</p>}
            {progress > 30 && <p>[AUTH] VALIDATING CRYPTOGRAPHIC CERTIFICATE...</p>}
            {progress > 50 && <p className="text-secondary-container">[SUCCESS] IDENTITY_PACKET_VERIFIED</p>}
            {progress > 70 && <p>[LOG] DECRYPTING USER_ENVIRONMENT_CONFIG...</p>}
            {progress > 80 && <p className="opacity-40 break-all">{hex}</p>}
            {bootDone && <p className="text-primary-container">[CORE] DATA_INTEGRITY_CHECK_PASS</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
              <span>DATA_STREAM_SYNC</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="h-1 bg-surface-container-highest w-full overflow-hidden flex">
              <div className="h-full bg-primary-container transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="grid grid-cols-10 gap-1 mt-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`h-2 ${i < biosBlocksCount ? 'bg-primary-container' : 'bg-surface-container-high'}`}></div>
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-4 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 border border-primary-container/20 rounded-lg flex items-center justify-center overflow-hidden bg-primary-container/5">
                <span className={`material-symbols-outlined text-[64px] text-primary-container ${bootDone ? 'fingerprint-active' : 'opacity-30'}`} style={{ fontVariationSettings: '"wght" 200' }}>fingerprint</span>
                {bootDone && <div className="scanner-line"></div>}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-container/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="mt-3 h-4 flex items-center justify-center">
                {bootDone && (
                  <span className="font-label-caps text-[10px] text-primary-container tracking-widest animate-[success-reveal_0.5s_ease-out_forwards] opacity-0">
                    BIOMETRIC_MATCH_CONFIRMED
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={handleEnter}
              disabled={!bootDone}
              className={`group relative px-10 py-4 overflow-hidden border border-primary-container bg-transparent transition-all mt-2 ${!bootDone ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-container/10 active:scale-[0.98]'}`}>
              <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-3">
                <span className="font-headline-md text-headline-md font-black tracking-widest text-primary-container">ENTER_WORKSPACE</span>
                <span className="material-symbols-outlined text-primary-container animate-pulse text-[24px]">login</span>
              </div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary-container"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-container"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary-container"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary-container"></div>
            </button>
            <p className="mt-4 font-label-caps text-[10px] text-on-surface-variant/60">ACCESS_RESTRICTED_BY_LEVEL_4_CLEARANCE</p>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="border-t border-outline-variant p-3 flex items-center justify-between bg-surface-container-low">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="font-label-caps text-[10px] text-on-surface-variant">LATENCY:</span>
              <span className="font-label-caps text-[10px] text-primary-container">14ms</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-label-caps text-[10px] text-on-surface-variant">BITRATE:</span>
              <span className="font-label-caps text-[10px] text-primary-container">1.2GB/S</span>
            </div>
          </div>
          <div className="font-label-caps text-[10px] text-on-surface-variant flex items-center">
            PROMPT: <span className="text-primary-container ml-1">ID_VERIFIED</span><span className="cursor-block ml-1"></span>
          </div>
        </div>
      </main>

          {/* Meta info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="relative z-20 mt-12 flex gap-12 max-w-4xl opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex flex-col">
              <span className="font-label-caps text-[12px] text-on-surface-variant">GPU_CLUSTER_STATUS</span>
              <span className="font-stat-value text-primary-container">OPTIMIZED</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[12px] text-on-surface-variant">PENDING_HASH_JOBS</span>
              <span className="font-stat-value text-data-blue">1,402</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[12px] text-on-surface-variant">UPTIME</span>
              <span className="font-stat-value text-on-surface">322:11:45</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
