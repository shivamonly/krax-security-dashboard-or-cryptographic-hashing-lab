import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HashingLab from './HashingLab';
import WordlistManager from './WordlistManager';
import Benchmarks from './Benchmarks';
import HardeningConfig from './HardeningConfig';
import GlobalTerminal from './GlobalTerminal';
import HardwareStats from './HardwareStats';

type ToastMsg = { id: number; text: string; type: 'info' | 'success' | 'warning' | 'error' };

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<'hashing' | 'wordlist' | 'benchmarks' | 'hardening'>('hardening');
  const [showTerminal, setShowTerminal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [activeSubNavController, setActiveSubNavController] = useState<'live' | 'gpu' | 'cpu'>('live');
  const [timeStr, setTimeStr] = useState('');
  const [location, setLocation] = useState('');

  const addToast = (text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleNewSession = () => {
    setActiveTab('hashing');
    addToast('SESSION_RESET: Initialized new blank workspace session.', 'success');
  };

  // Initial mock logs effect
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UNKNOWN_REGION';
    const loc = tz.split('/')[0].toUpperCase();
    setLocation(loc);

    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' LOCAL');
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    const lines = [
      "Initializing decryption core...", 
      "Loading vulnerability profiles...", 
      "Kernel active: 0x8F22-A", 
      "Ready for plaintext input."
    ];
    let i = 0;
    const logInterval = setInterval(() => {
        if(i < lines.length) {
            console.log(`%c[CORE] ${lines[i]}`, "color: #00ff41; font-family: monospace;");
            i++;
        } else {
            clearInterval(logInterval);
        }
    }, 500);
    return () => {
      clearInterval(logInterval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-background text-on-surface font-body-md relative z-10 terminal-grid overflow-hidden">
      {/* SideNavBar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col py-4 z-50 shadow-2xl"
      >
        <div className="px-6 mb-12">
          <h1 className="font-headline-md text-[24px] font-bold text-primary-container tracking-tighter leading-none mt-2">KRAX_V1</h1>
          <p className="font-label-caps text-[10px] text-on-surface-variant opacity-60">ID: 0x8F22-A</p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          <button 
            onClick={() => { setActiveTab('hashing'); setActiveSubNavController('live'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all font-label-caps text-[12px] font-bold outline-none focus:outline-none ${activeTab === 'hashing' && activeSubNavController === 'live' ? 'text-primary-container border-l-4 border-primary-container bg-surface-container-high' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
          >
            <span className="material-symbols-outlined">security</span>
            <span>Hashing Lab</span>
          </button>
          <button 
            onClick={() => { setActiveTab('wordlist'); setActiveSubNavController('live'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors font-label-caps text-[12px] font-bold outline-none focus:outline-none ${activeTab === 'wordlist' && activeSubNavController === 'live' ? 'text-primary-container border-l-4 border-primary-container bg-surface-container-high' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span>Wordlist Manager</span>
          </button>
          <button 
            onClick={() => { setActiveTab('benchmarks'); setActiveSubNavController('live'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors font-label-caps text-[12px] font-bold outline-none focus:outline-none ${activeTab === 'benchmarks' && activeSubNavController === 'live' ? 'text-primary-container border-l-4 border-primary-container bg-surface-container-high' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
          >
            <span className="material-symbols-outlined">speed</span>
            <span>Benchmarks</span>
          </button>
          <button 
            onClick={() => { setActiveTab('hardening'); setActiveSubNavController('live'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors font-label-caps text-[12px] font-bold outline-none focus:outline-none ${activeTab === 'hardening' && activeSubNavController === 'live' ? 'text-primary-container border-l-4 border-primary-container bg-surface-container-high' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Hardening Config</span>
          </button>
        </nav>
        <div className="px-4 py-4 mb-8">
          <button onClick={handleNewSession} className="w-full py-2 bg-primary-container text-[#002203] font-bold rounded-sm font-label-caps text-[12px] hover:opacity-90 active:scale-95 transition-all outline-none focus:outline-none">
            NEW_SESSION
          </button>
        </div>
        <div className="mt-auto px-2 border-t border-outline-variant/30 pt-4 pb-4">
          <button onClick={() => setShowTerminal(!showTerminal)} className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-[12px] font-bold outline-none focus:outline-none">
            <span className="material-symbols-outlined">terminal</span>
            <span>Terminal</span>
          </button>
          <button onClick={() => addToast('Log exporter is currently offline.', 'warning')} className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-[12px] font-bold outline-none focus:outline-none">
            <span className="material-symbols-outlined">list_alt</span>
            <span>Logs</span>
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col ml-64 min-h-screen relative overflow-hidden">
        {/* TopAppBar */}
        <motion.header 
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="flex justify-between items-center w-full px-6 h-16 bg-surface-container-low border-b border-outline-variant sticky top-0 z-40 shadow-md shadow-border-glow shrink-0"
        >
          <div className="flex items-center gap-8">
            <span className="font-headline-md text-[24px] font-black text-primary-fixed-dim">KRAX</span>
            <div className="flex gap-6">
              <button 
                onClick={() => { setActiveSubNavController('live'); addToast('Live metrics restored.', 'info'); }} 
                className={`font-label-caps text-[12px] font-bold py-5 px-2 focus:outline-none transition-all ${activeSubNavController === 'live' ? 'text-primary border-b-2 border-primary-container' : 'text-on-surface-variant hover:bg-surface-bright border-b-2 border-transparent'}`}
              >LIVE_METRICS</button>
              <button 
                onClick={() => { setActiveSubNavController('gpu'); addToast('Switched to GPU_0 hardware node', 'info'); }} 
                className={`font-label-caps text-[12px] font-bold py-5 px-2 focus:outline-none transition-all ${activeSubNavController === 'gpu' ? 'text-primary border-b-2 border-primary-container' : 'text-on-surface-variant hover:bg-surface-bright border-b-2 border-transparent'}`}
              >GPU_0</button>
              <button 
                onClick={() => { setActiveSubNavController('cpu'); addToast('Gathering CPU pool data...', 'info'); }} 
                className={`font-label-caps text-[12px] font-bold py-5 px-2 focus:outline-none transition-all ${activeSubNavController === 'cpu' ? 'text-primary border-b-2 border-primary-container' : 'text-on-surface-variant hover:bg-surface-bright border-b-2 border-transparent'}`}
              >CPU_NODES</button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end hidden md:flex border-r border-outline-variant pr-6">
               <span className="font-code-block text-[10px] text-on-surface-variant tracking-widest uppercase">{location}_REGION</span>
               <span className="font-code-block text-[12px] text-primary-fixed-dim font-bold tracking-widest">{timeStr}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                <span className="font-code-block text-[14px] text-primary-container">SYS_READY</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => addToast('0 new notifications from CORE.', 'info')} className="p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"><span className="material-symbols-outlined text-[20px]">notifications</span></button>
                <button onClick={() => addToast('Network config is locked.', 'warning')} className="p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"><span className="material-symbols-outlined text-[20px]">settings_ethernet</span></button>
                <button onClick={() => setShowExitConfirm(true)} className="p-2 text-on-surface-variant hover:text-vulnerability-red transition-colors focus:outline-none cursor-pointer"><span className="material-symbols-outlined text-[20px]">power_settings_new</span></button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="p-4 md:p-6 overflow-y-auto flex-1 bg-transparent relative z-10 w-full min-h-[calc(100vh-64px)] pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSubNavController}-${activeTab}`}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.2 }}
            >
              {activeSubNavController === 'live' ? (
                <>
                  {activeTab === 'hashing' && <HashingLab onToast={addToast} />}
                  {activeTab === 'wordlist' && <WordlistManager onToast={addToast} />}
                  {activeTab === 'benchmarks' && <Benchmarks />}
                  {activeTab === 'hardening' && <HardeningConfig onToast={addToast} />}
                </>
              ) : (
                <HardwareStats type={activeSubNavController} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Terminal Overlay */}
        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full z-50"
            >
              <GlobalTerminal onClose={() => setShowTerminal(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exit Confirmation Modal */}
        <AnimatePresence>
          {showExitConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-surface-container-lowest border border-vulnerability-red max-w-md w-full p-6 shadow-[0_0_30px_rgba(255,23,68,0.2)]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-vulnerability-red text-[24px]">warning</span>
                  <h2 className="font-headline-md text-vulnerability-red text-[20px] font-bold tracking-widest">CRITICAL WARNING</h2>
                </div>
                <div className="font-code-block text-on-surface text-[14px] leading-relaxed mb-8 flex flex-col gap-2">
                  <p>WARNING: ROOT ACCESS SESSION WILL BE TERMINATED.</p>
                  <p className="text-on-surface-variant">Are you sure you want to disconnect from KRAX_V1?</p>
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setShowExitConfirm(false)} className="px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors font-label-caps text-[12px] font-bold tracking-widest cursor-pointer">
                    ABORT
                  </button>
                  <button onClick={() => { setShowExitConfirm(false); addToast('Shutdown process aborted due to insufficient privileges. Root lock active.', 'error'); }} className="px-6 py-2 bg-vulnerability-red/10 border border-vulnerability-red text-vulnerability-red hover:bg-vulnerability-red/20 transition-colors font-label-caps text-[12px] font-bold tracking-widest cursor-pointer">
                    TERMINATE
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pop-up Toasts */}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div 
              key={toast.id}
              initial={{ x: 50, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className={`pointer-events-auto p-4 border shadow-2xl max-w-sm flex items-start gap-4 backdrop-blur-md transition-all ${
                toast.type === 'error' ? 'bg-[#ff1744]/10 border-[#ff1744] text-[#ff1744]' :
                toast.type === 'warning' ? 'bg-[#ffb4a2]/10 border-[#ffb4a2] text-[#ffb4a2]' :
                toast.type === 'success' ? 'bg-[#00daf3]/10 border-[#00daf3] text-[#00daf3]' :
                'bg-primary-container/10 border-primary-container text-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {toast.type === 'error' ? 'cancel' : toast.type === 'warning' ? 'warning' : toast.type === 'success' ? 'check_circle' : 'info'}
              </span>
              <div className="font-code-block text-[13px] leading-relaxed pt-[2px]">{toast.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Visual Polish: Decorative Terminal Elements */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-4 pointer-events-none opacity-80 mix-blend-screen hidden sm:flex">
        <div className="bg-surface-container-high/80 backdrop-blur-sm border border-outline-variant px-3 py-1 flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,65,0.05)]">
          <span className="font-code-block text-[10px] text-on-surface-variant uppercase tracking-widest">L_BUFFER: 0x00FF4A2</span>
        </div>
        <div className="bg-surface-container-high/80 backdrop-blur-sm border border-outline-variant px-3 py-1 flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,65,0.05)]">
          <span className="font-code-block text-[10px] text-on-surface-variant uppercase tracking-widest">NODE_ID: 192.168.1.104</span>
        </div>
      </div>
    </div>
  );
}
